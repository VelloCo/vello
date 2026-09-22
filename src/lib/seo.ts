/* Metadados por página (o Google executa JavaScript e lê estes valores). */
export function setPageMeta({ title, description, image, robots }: { title?: string; description?: string; image?: string; robots?: string }) {
  if (title) {
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
  }
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  }
  if (image) {
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", image);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", image);
  }
  if (robots) document.querySelector('meta[name="robots"]')?.setAttribute("content", robots);
}

/* Dados estruturados (schema.org) de uma página; devolve a limpeza. */
export function setJsonLd(id: string, data: unknown) {
  document.getElementById(id)?.remove();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
  return () => script.remove();
}
