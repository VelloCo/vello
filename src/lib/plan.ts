/*
 * Plano da Vello em um lugar só: a landing e a página de cobrança do painel
 * leem daqui, para o preço nunca ficar diferente entre as duas.
 */
export const PLAN = {
  name: "Vello",
  price: 65.9,
  trialDays: 7,
  /** Durante o beta fechado ninguém é cobrado. */
  betaFree: true,
  features: [
    "Página de serviços com link próprio",
    "Agendamento online sem app e sem cadastro para a cliente",
    "Agenda com confirmação automática ou manual",
    "Horários de atendimento e regras de reserva",
    "Estilo e cor da página personalizáveis",
    "Suporte por e-mail",
  ],
} as const;

export const money = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const priceLabel = `R$ ${money(PLAN.price)}`;
