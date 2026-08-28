import { Move, X, ZoomIn } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Point = { x: number; y: number };

export function AvatarCropper({
  file,
  onCancel,
  onConfirm,
}: {
  file: File;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void> | void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointer: Point; offset: Point } | null>(null);
  const [source] = useState(() => URL.createObjectURL(file));
  const [size, setSize] = useState(0);
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => URL.revokeObjectURL(source);
  }, [source]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !processing) onCancel();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onCancel, processing]);

  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const measure = () => setSize(preview.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  const baseScale =
    natural.width && natural.height && size
      ? Math.max(size / natural.width, size / natural.height)
      : 1;
  const renderedWidth = natural.width * baseScale * zoom;
  const renderedHeight = natural.height * baseScale * zoom;
  const limits = {
    x: Math.max(0, (renderedWidth - size) / 2),
    y: Math.max(0, (renderedHeight - size) / 2),
  };
  const clamp = (point: Point): Point => ({
    x: Math.max(-limits.x, Math.min(limits.x, point.x)),
    y: Math.max(-limits.y, Math.min(limits.y, point.y)),
  });

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointer: { x: event.clientX, y: event.clientY },
      offset,
    };
  }

  function moveImage(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setOffset(
      clamp({
        x: dragRef.current.offset.x + event.clientX - dragRef.current.pointer.x,
        y: dragRef.current.offset.y + event.clientY - dragRef.current.pointer.y,
      }),
    );
  }

  function stopDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  async function confirmCrop() {
    if (!source || !natural.width || !size) return;
    setProcessing(true);
    try {
      const image = new Image();
      image.src = source;
      await image.decode();
      const scale = baseScale * zoom;
      const sourceSize = size / scale;
      const sourceX = (natural.width - sourceSize) / 2 - offset.x / scale;
      const sourceY = (natural.height - sourceSize) / 2 - offset.y / scale;
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 640;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas indisponível");
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) =>
            result ? resolve(result) : reject(new Error("Falha no recorte")),
          "image/jpeg",
          0.9,
        ),
      );
      await onConfirm(
        new File([blob], `foto-perfil-${Date.now()}.jpg`, {
          type: "image/jpeg",
        }),
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-end bg-black/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-crop-title"
    >
      <div className="w-full rounded-t-[28px] bg-paper p-5 shadow-2xl sm:max-w-[520px] sm:rounded-[28px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
              Foto de perfil
            </p>
            <h2
              id="avatar-crop-title"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
            >
              Ajuste sua foto
            </h2>
            <p className="mt-1 font-body text-sm text-ash">
              Arraste para posicionar e use o controle para aproximar.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink disabled:opacity-50"
            aria-label="Fechar ajuste de foto"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={previewRef}
          onPointerDown={startDrag}
          onPointerMove={moveImage}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          className="relative mx-auto mt-6 aspect-square w-full max-w-[380px] touch-none cursor-grab overflow-hidden rounded-full bg-cream active:cursor-grabbing"
          aria-label="Área de recorte da foto. Arraste para reposicionar."
        >
          {source && (
            <img
              src={source}
              alt="Pré-visualização da foto de perfil"
              draggable={false}
              onLoad={(event) =>
                setNatural({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: natural.width ? natural.width * baseScale : "auto",
                height: natural.height ? natural.height * baseScale : "auto",
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/50" />
          <div className="pointer-events-none absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 font-body text-xs text-white backdrop-blur">
            <Move size={13} /> Arraste a foto
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
          <ZoomIn size={17} className="shrink-0 text-ash" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => {
              const nextZoom = Number(event.target.value);
              setZoom(nextZoom);
              const nextWidth = natural.width * baseScale * nextZoom;
              const nextHeight = natural.height * baseScale * nextZoom;
              setOffset((current) => ({
                x: Math.max(-(nextWidth - size) / 2, Math.min((nextWidth - size) / 2, current.x)),
                y: Math.max(-(nextHeight - size) / 2, Math.min((nextHeight - size) / 2, current.y)),
              }));
            }}
            className="h-1.5 w-full cursor-pointer accent-black"
            aria-label="Zoom da foto"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="h-12 rounded-full border border-line bg-white font-body text-sm font-semibold text-ink transition hover:border-ink disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmCrop}
            disabled={processing || !natural.width}
            className="h-12 rounded-full bg-ink font-body text-sm font-semibold text-paper transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-60"
          >
            {processing ? "Salvando..." : "Usar esta foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
