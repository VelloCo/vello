import { appPath } from "./paths";

/*
 * Cores de destaque da página pública. São combinações prontas e testadas
 * (texto sempre legível sobre o fundo); a profissional escolhe uma em
 * Personalizar catálogo e ela vale para o cabeçalho e os botões de agendar.
 */
export type AccentKey = "sky" | "rose" | "sage" | "lilac" | "sand" | "graphite";

export type Accent = {
  label: string;
  header: string;
  border: string;
  glow: string;
  tag: string;
  muted: string;
  button: string;
  buttonText: string;
};

export const accents: Record<AccentKey, Accent> = {
  sky: { label: "Azul Vello", header: "#E8F1F8", border: "#CFE0EB", glow: "#BFD9EB", tag: "#356D95", muted: "#46677E", button: "#7EAFD0", buttonText: "#12283A" },
  rose: { label: "Rosa", header: "#FBEDF2", border: "#F1D5DF", glow: "#F2C9D7", tag: "#A1405F", muted: "#7A4D5C", button: "#E7A9BF", buttonText: "#3B1322" },
  sage: { label: "Sálvia", header: "#EAF3EC", border: "#D2E4D7", glow: "#C3DCCB", tag: "#3F6E51", muted: "#52695A", button: "#9CC8AA", buttonText: "#15301F" },
  lilac: { label: "Lilás", header: "#F0ECFA", border: "#DDD5F2", glow: "#D2C6F0", tag: "#5A45A0", muted: "#625A7F", button: "#B8A8E6", buttonText: "#1F1545" },
  sand: { label: "Areia", header: "#F6EFE5", border: "#E9DDCB", glow: "#E6D3B8", tag: "#85602F", muted: "#6E5E48", button: "#DCC39C", buttonText: "#2E2112" },
  graphite: { label: "Grafite", header: "#ECEEF1", border: "#D6DBE0", glow: "#CDD3DA", tag: "#3F4A55", muted: "#55606B", button: "#12283A", buttonText: "#FFFFFF" },
};

export const accentKeys = Object.keys(accents) as AccentKey[];

export function accentFor(theme?: { accent?: string } | null): Accent {
  return accents[(theme?.accent as AccentKey) || "sky"] || accents.sky;
}

export const serviceCategoryNames: Record<string, string> = {
  facial: "Facial",
  corporal: "Corporal",
  depilacao: "Depilação",
  sobrancelhas_cilios: "Sobrancelhas e cílios",
  unhas: "Unhas",
  cabelo: "Cabelo",
  massagem: "Massagem",
  harmonizacao: "Harmonização",
  outros: "Outros",
};

const coverAsset: Record<string, string> = {
  facial: "/service-covers/facial-cutout-v3.png",
  corporal: "/service-covers/corporal-cutout-v3.png",
  depilacao: "/service-covers/depilacao-cutout-v3.png",
  sobrancelhas_cilios: "/service-covers/sobrancelhas-cilios-cutout-v3.png",
  unhas: "/service-covers/unhas-cutout-v3.png",
  cabelo: "/service-covers/cabelo-cutout-v3.png",
  massagem: "/service-covers/massagem-cutout-v3.png",
  harmonizacao: "/service-covers/harmonizacao-cutout-v3.png",
  outros: "/service-covers/outros-cutout-v3.png",
};

const effectsAsset: Record<string, string> = {
  facial: "/service-covers/facial-effects-v4.png",
  corporal: "/service-covers/corporal-effects-v4.png",
  depilacao: "/service-covers/depilacao-effects-v4.png",
  sobrancelhas_cilios: "/service-covers/sobrancelhas-cilios-effects-v4.png",
  unhas: "/service-covers/unhas-effects-v4.png",
  cabelo: "/service-covers/cabelo-effects-v4.png",
  massagem: "/service-covers/massagem-effects-v4.png",
  harmonizacao: "/service-covers/harmonizacao-effects-v4.png",
  outros: "/service-covers/outros-effects-v4.png",
};

export const categoryCoverStyle = (category: string) => ({
  backgroundImage: "url(" + appPath(coverAsset[category] || coverAsset.outros) + ")",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
});

export const categoryEffectsStyle = (category: string, accent: Accent) => {
  const mask = "url(" + appPath(effectsAsset[category] || effectsAsset.outros) + ")";
  return {
    background: `linear-gradient(135deg, ${accent.tag}, ${accent.button} 62%, ${accent.glow})`,
    WebkitMaskImage: mask,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskImage: mask,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
  };
};

export function priceLabel(service: { price_type: "fixed" | "from" | "on_request"; price: number | string | null }) {
  if (service.price_type === "on_request") return "Sob consulta";
  const value = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(service.price || 0));
  return service.price_type === "from" ? "A partir de " + value : value;
}
