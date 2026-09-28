import type { Project } from '../config/site'

/**
 * Ilustração provisória de um site, só com formas — para o portfólio não
 * ficar vazio enquanto não houver prints reais (ver PROJECTS em config/site).
 */
export function SiteMockup({ layout, name }: { layout: Project['layout']; name: string }) {
  return (
    <div className={`mock mock--${layout}`} aria-hidden>
      <div className="mock-bar">
        <i />
        <i />
        <i />
        <span className="mock-url">{name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g, '')}.com.br</span>
      </div>
      <div className="mock-page">
        <div className="mock-nav">
          <b>{name}</b>
          <span />
          <span />
          <span />
        </div>
        {layout === 'fullbleed' && (
          <>
            <div className="mock-img mock-slats mock-hero-img">
              <div className="mock-hero-text">
                <em />
                <em className="w70" />
                <u />
              </div>
            </div>
            <div className="mock-row3">
              <div className="mock-img mock-soft" />
              <div className="mock-img mock-dark" />
              <div className="mock-img mock-soft" />
            </div>
          </>
        )}
        {layout === 'split' && (
          <div className="mock-split">
            <div className="mock-split-text">
              <small />
              <em />
              <em />
              <em className="w60" />
              <p />
              <p className="w80" />
              <u />
            </div>
            <div className="mock-img mock-dark mock-tall">
              <div className="mock-cabinet">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        {layout === 'gallery' && (
          <>
            <div className="mock-title-row">
              <em />
              <em className="w40" />
            </div>
            <div className="mock-gallery">
              <div className="mock-img mock-slats g1" />
              <div className="mock-img mock-soft g2" />
              <div className="mock-img mock-dark g3" />
              <div className="mock-img mock-soft g4" />
            </div>
          </>
        )}
        {layout === 'editorial' && (
          <div className="mock-editorial">
            <div className="mock-img mock-dark mock-ed-img" />
            <div className="mock-ed-text">
              <small />
              <em />
              <em className="w70" />
              <p />
              <p />
              <p className="w60" />
            </div>
            <div className="mock-img mock-soft mock-ed-small" />
          </div>
        )}
      </div>
    </div>
  )
}
