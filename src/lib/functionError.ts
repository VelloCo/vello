/*
 * Mensagem de erro que a função de borda devolveu. O supabase-js entrega a
 * resposta crua em `context`, então sem isto a tela só mostra "Failed to send
 * a request" e o motivo real se perde.
 */
export async function mensagemDaFuncao(causa: unknown, padrao: string) {
  const contexto = (causa as { context?: Response })?.context;
  if (contexto && typeof contexto.json === "function") {
    try {
      const corpo = await contexto.clone().json();
      if (corpo?.error) return String(corpo.error);
    } catch {
      // resposta sem JSON: fica o texto padrão
    }
  }
  return padrao;
}
