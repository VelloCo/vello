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
  /** Tom usado para recolorir as capas ilustradas (que são azuis). Vazio no azul. */
  coverTint?: string;
};

export const accents: Record<AccentKey, Accent> = {
  sky: { label: "Azul Vello", header: "#E8F1F8", border: "#CFE0EB", glow: "#BFD9EB", tag: "#356D95", muted: "#46677E", button: "#7EAFD0", buttonText: "#12283A" },
  rose: { label: "Rosa", header: "#FBEDF2", border: "#F1D5DF", glow: "#F2C9D7", tag: "#A1405F", muted: "#7A4D5C", button: "#E7A9BF", buttonText: "#3B1322", coverTint: "#E7A9BF" },
  sage: { label: "Sálvia", header: "#EAF3EC", border: "#D2E4D7", glow: "#C3DCCB", tag: "#3F6E51", muted: "#52695A", button: "#9CC8AA", buttonText: "#15301F", coverTint: "#9CC8AA" },
  lilac: { label: "Lilás", header: "#F0ECFA", border: "#DDD5F2", glow: "#D2C6F0", tag: "#5A45A0", muted: "#625A7F", button: "#B8A8E6", buttonText: "#1F1545", coverTint: "#B8A8E6" },
  sand: { label: "Areia", header: "#F6EFE5", border: "#E9DDCB", glow: "#E6D3B8", tag: "#85602F", muted: "#6E5E48", button: "#DCC39C", buttonText: "#2E2112", coverTint: "#DCC39C" },
  graphite: { label: "Grafite", header: "#ECEEF1", border: "#D6DBE0", glow: "#CDD3DA", tag: "#3F4A55", muted: "#55606B", button: "#12283A", buttonText: "#FFFFFF", coverTint: "#9AA5B1" },
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
  facial: "/service-covers/facial-v2.jpg",
  corporal: "/service-covers/corporal-v2.jpg",
  depilacao: "/service-covers/depilacao-v2.jpg",
  sobrancelhas_cilios: "/service-covers/sobrancelhas-cilios-v2.jpg",
  unhas: "/service-covers/unhas-v2.jpg",
  cabelo: "/service-covers/cabelo-v2.jpg",
  massagem: "/service-covers/massagem-v2.jpg",
  harmonizacao: "/service-covers/harmonizacao-v2.jpg",
  outros: "/service-covers/outros-v2.jpg",
};

export const categoryCoverStyle = (category: string, accent?: Accent) => ({
  backgroundColor: accent?.coverTint || "#E8F1F8",
  // Nas cores que não são azuis, a ilustração vira duas cores no tom escolhido.
  backgroundBlendMode: accent?.coverTint ? "luminosity" : undefined,
  backgroundImage: "url(" + appPath(coverAsset[category] || coverAsset.outros) + ")",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
});

export function priceLabel(service: { price_type: "fixed" | "from" | "on_request"; price: number | string | null }) {
  if (service.price_type === "on_request") return "Sob consulta";
  const value = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(service.price || 0));
  return service.price_type === "from" ? "A partir de " + value : value;
}
