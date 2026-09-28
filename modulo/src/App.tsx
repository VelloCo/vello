import { useRevealOnScroll } from './hooks/useReveal'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Positioning } from './sections/Positioning'
import { Services } from './sections/Services'
import { Showcase } from './sections/Showcase'
import { Portfolio } from './sections/Portfolio'
import { Compare } from './sections/Compare'
import { Process } from './sections/Process'
import { Manifesto } from './sections/Manifesto'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'

export default function App() {
  useRevealOnScroll()

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Positioning />
        <Services />
        <Showcase />
        <Portfolio />
        <Compare />
        <Process />
        <Manifesto />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
