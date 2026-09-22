import { ArrowRight, Check, CreditCard, FileText, Receipt, ShieldCheck } from "lucide-react";
import { appPath } from "../../lib/paths";
import { PLAN, money } from "../../lib/plan";

function Card({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7">
      <h2 className="font-display text-xl font-semibold tracking-[-.03em]">{title}</h2>
      {text && <p className="mt-1 font-body text-sm text-ash">{text}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BillingPage({ profile }: { profile: { professional_name?: string | null; created_at?: string } }) {
  const since = profile.created_at
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
        new Date(profile.created_at),
      )
    : null;
  return (
    <>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Sua conta</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">Plano e cobrança</h1>
        <p className="mt-2 max-w-xl font-body text-ash">
          Enquanto a Vello está em beta fechado, você usa tudo sem pagar nada.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-[24px] border border-[#CFE0EB] bg-[#E8F1F8] p-5 sm:p-7">
            <div aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/50 blur-2xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-sky-deep">
                  <ShieldCheck size={13} /> Beta fechado
                </span>
                <p className="mt-4 font-display text-[32px] font-semibold tracking-[-.04em] text-ink">
                  Sem cobrança por enquanto
                </p>
                <p className="mt-2 max-w-[440px] font-body text-sm leading-relaxed text-[#46677E]">
                  Você entrou por convite e faz parte do primeiro grupo da Vello. Nada é cobrado agora. Antes de
                  qualquer cobrança começar, avisaremos pelo seu e-mail e você decide se continua.
                </p>
                {since && (
                  <p className="mt-3 font-body text-xs text-[#46677E]">Sua conta foi criada em {since}.</p>
                )}
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sky-deep shadow-[0_14px_30px_-20px_rgba(18,40,58,.5)]">
                <CreditCard size={20} />
              </span>
            </div>
          </section>

          <Card
            title="Seu plano quando a cobrança começar"
            text="É o mesmo preço divulgado no site, sem taxa por agendamento."
          >
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2 border-b border-line pb-6">
              <p className="font-display text-[44px] font-semibold leading-none tracking-[-.05em]">
                <span className="mr-1 align-top text-[20px] font-medium">R$</span>
                {money(PLAN.price)}
              </p>
              <span className="pb-1 font-body text-sm text-ash">por mês</span>
              <span className="ml-auto rounded-full bg-paper px-3 py-1.5 font-body text-xs font-medium text-ink">
                {PLAN.trialDays} dias grátis
              </span>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {PLAN.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 font-body text-sm text-ash">
                  <Check size={16} className="mt-0.5 shrink-0 text-sky-deep" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 font-body text-xs leading-relaxed text-stone">
              Sem fidelidade: quando a assinatura existir, dá para cancelar a qualquer momento e o acesso continua
              até o fim do período já pago.
            </p>
          </Card>

          <Card title="Forma de pagamento" text="Você só precisa cadastrar quando a cobrança começar.">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line bg-paper p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-stone">
                  <CreditCard size={18} />
                </span>
                <div>
                  <p className="font-body text-sm font-semibold">Nenhuma forma de pagamento</p>
                  <p className="mt-0.5 font-body text-xs text-ash">Nada é cobrado durante o beta.</p>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="h-11 cursor-not-allowed rounded-full border border-line px-5 font-body text-sm font-medium text-stone"
              >
                Disponível em breve
              </button>
            </div>
          </Card>

          <Card title="Histórico de cobranças" text="Suas notas e recibos aparecem aqui.">
            <div className="rounded-2xl border border-line">
              <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-stone sm:grid">
                <span>Descrição</span>
                <span>Data</span>
                <span>Valor</span>
              </div>
              <div className="grid place-items-center px-5 py-10 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper text-stone">
                  <Receipt size={18} />
                </span>
                <p className="mt-4 font-body text-sm font-semibold">Nenhuma cobrança até agora.</p>
                <p className="mt-1 max-w-[320px] font-body text-xs leading-relaxed text-ash">
                  Enquanto a Vello estiver em beta, não há valores a pagar.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-10">
          <div className="rounded-[24px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold">Dúvidas sobre o plano</h2>
            <dl className="mt-4 space-y-4">
              {[
                ["Vou ser cobrada sem avisar?", "Não. Avisamos por e-mail antes de qualquer cobrança começar."],
                ["Tem taxa por agendamento?", "Não. O plano é único, quantos agendamentos você receber."],
                ["E se eu não quiser continuar?", "É só não seguir com a assinatura ou excluir sua conta em Configurações."],
              ].map(([question, answer]) => (
                <div key={question}>
                  <dt className="font-body text-sm font-semibold text-ink">{question}</dt>
                  <dd className="mt-1 font-body text-xs leading-relaxed text-ash">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
          <a
            href={appPath("/suporte")}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-white p-5 transition hover:border-ink"
          >
            <span>
              <b className="block font-body text-sm">Falar com o suporte</b>
              <span className="mt-1 block font-body text-xs text-ash">Qualquer dúvida sobre valores.</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-ash" />
          </a>
          <a
            href={appPath("/termos")}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-white p-5 transition hover:border-ink"
          >
            <span>
              <b className="block font-body text-sm">Termos de Uso</b>
              <span className="mt-1 block font-body text-xs text-ash">Regras do plano e do cancelamento.</span>
            </span>
            <FileText size={18} className="shrink-0 text-ash" />
          </a>
        </aside>
      </div>
    </>
  );
}
