/*
 * Reduz e converte fotos no navegador antes do envio ao Supabase.
 * Fotos de celular (3–10 MB) viram WebP de ~150–300 KB. Se o navegador não
 * souber gerar WebP (Safari antigo), usa JPEG. Se algo falhar, envia a
 * original, que ainda passa pelos limites do bucket.
 */
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export type CompressOptions = { maxSide: number; quality?: number };

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export function isAcceptedImage(file: File) {
  return ACCEPTED.includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
}

export async function compressImage(file: File, { maxSide, quality = 0.82 }: CompressOptions): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let blob = await toBlob(canvas, "image/webp", quality);
    let type = "image/webp";
    if (!blob || blob.type !== "image/webp") {
      blob = await toBlob(canvas, "image/jpeg", quality);
      type = "image/jpeg";
    }
    if (!blob) throw new Error("encode");
    // Nunca troca por um arquivo maior do que o original já otimizado.
    if (blob.size >= file.size && ["image/jpeg", "image/webp"].includes(file.type) && scale === 1) return file;
    const base = file.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${base}.${type === "image/webp" ? "webp" : "jpg"}`, { type });
  } catch {
    return file;
  }
}
