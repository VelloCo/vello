import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Link2, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { properties } from '../data/properties';
import { Container, Eyebrow, Reveal } from './Primitives';

const selectedProperties = properties.slice(0, 3);

export function SelectionsShowcase() {
  return (
    <section className="overflow-hidden bg-cream py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow>Seleções para cada cliente</Eyebrow>
            <h2 className="balance mt-4 max-w-[520px] font-display text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink md:text-[56px]">
              Pare de mandar imóveis soltos pelo WhatsApp.
            </h2>
            <p className="mt-5 max-w-[450px] font-body text-[16px] leading-relaxed text-ash md:text-[17px]">
              Separe as opções certas, organize a ordem e envie uma página pensada para aquela conversa.
            </p>
            <div className="mt-8 space-y-4 border-t border-line pt-5">
              <Detail icon={<Check size={13} />} text="Escolha os imóveis que fazem sentido" />
              <Detail icon={<Link2 size={13} />} text="Gere um link único e compartilhável" />
              <Detail icon={<MessageCircle size={13} />} text="Continue a conversa de onde ela importa" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <motion.article initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -5 }} className="relative overflow-hidden rounded-[24px] border border-line bg-paper p-4 shadow-[0_32px_90px_-48px_rgba(11,11,10,0.35)] sm:p-6">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ink/[0.04] blur-2xl" />
              <div className="relative flex items-start justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-stone">Seleção para</p>
                  <h3 className="mt-2 font-display text-[29px] font-semibold tracking-[-0.035em] text-ink">Mariana Souza</h3>
                  <p className="mt-1 font-body text-[13px] text-ash">3 imóveis selecionados</p>
                </div>
                <motion.span animate={{ rotate: [0, 8, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper"><ArrowUpRight size={17} /></motion.span>
              </div>
              <p className="relative mt-5 max-w-[390px] font-body text-[14px] leading-relaxed text-ash">“Separei algumas opções que combinam com o que você procura.”</p>
              <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
                {selectedProperties.map((property, index) => (
                  <motion.div key={property.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden rounded-[14px] border border-line bg-white">
                    <img src={property.image} alt="" className="h-24 w-full object-cover" />
                    <div className="p-3"><p className="truncate font-body text-[11px] font-semibold text-ink">{property.title}</p><p className="mt-1.5 font-mono text-[10px] text-ash">{property.price}</p></div>
                  </motion.div>
                ))}
              </div>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative mt-5 flex items-center justify-between rounded-full bg-ink px-4 py-3 text-paper"><span className="flex items-center gap-2 font-body text-[12px] font-medium"><MessageCircle size={14} /> Enviar para Mariana</span><span className="font-mono text-[10px] text-paper/55">WhatsApp</span></motion.div>
            </motion.article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Detail({ icon, text }: { icon: ReactNode; text: string }) {
  return <p className="flex items-center gap-3 font-body text-[14px] text-ink"><span className="grid h-7 w-7 place-items-center rounded-full bg-paper text-ink shadow-[0_4px_12px_rgba(11,11,10,0.08)]">{icon}</span>{text}</p>;
}
