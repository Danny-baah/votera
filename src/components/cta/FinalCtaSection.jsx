import { ArrowRight, Phone, ShieldCheck, Zap, Home } from 'lucide-react';
import './FinalCtaSection.css';

export function FinalCtaSection() {
  return (
    <section className="final-cta-section" id="kontakt">
      {/* Desktop Background Architectural Villa Imagery (Right Column Blend) */}
      <div className="cta-backdrop-wrap desktop-only">
        <img
          src="/cta_villa_retina.webp"
          alt="Modern Architectural Villa Illuminated at Twilight"
          className="cta-backdrop-img"
          loading="lazy"
        />
        {/* Directional gradient mask for seamless edge dissolve into dark canvas */}
        <div className="cta-backdrop-gradient" />
      </div>

      <div className="final-cta-container">
        {/* Upper Content Block (Left Aligned on Desktop) */}
        <div className="cta-content-column">
          {/* Eyebrow with gold horizontal accent line */}
          <div className="cta-eyebrow-wrap">
            <span className="cta-eyebrow-line" />
            <span className="cta-eyebrow-text">BEREIT FÜR IHR PROJEKT?</span>
          </div>

          {/* Main Headline */}
          <h2 className="cta-headline">
            <span className="headline-line-1">LASSEN SIE UNS</span>
            <span className="cta-headline-highlight">GEMEINSAM REALISIEREN.</span>
          </h2>

          {/* Supporting Copy */}
          <p className="cta-description">
            Ob Neubau, Modernisierung oder individuelle Lösung – wir sind Ihr
            zuverlässiger Partner für elektrotechnische Projekte, die heute
            überzeugen und morgen bestehen.
          </p>

          {/* Action Row */}
          <div className="cta-actions-row">
            {/* Primary CTA Button */}
            <a href="#anfrage" className="cta-primary-btn">
              <span>JETZT ANFRAGE STELLEN</span>
              <ArrowRight size={16} className="cta-btn-arrow" />
            </a>

            {/* Secondary Direct Contact */}
            <a href="tel:+491234567890" className="cta-secondary-contact">
              <span className="cta-phone-circle">
                <Phone size={15} />
              </span>
              <span className="cta-phone-label">DIREKT KONTAKTIEREN</span>
            </a>
          </div>
        </div>

        {/* Mobile Architectural Villa Card (Follows exact order 6: architectural image) */}
        <div className="cta-mobile-image-card mobile-only">
          <div className="mobile-image-inner">
            <img
              src="/cta_villa_retina.webp"
              alt="Architekturbeleuchtung bei Dämmerung"
              className="mobile-villa-img"
              loading="lazy"
            />
            <div className="mobile-image-glow" />
          </div>
        </div>

        {/* Bottom Value Proposition Strip (Follows exact order 7: value propositions) */}
        <div className="cta-value-strip">
          {/* Item 01 */}
          <div className="value-item">
            <div className="value-icon-box">
              <ShieldCheck size={20} className="value-icon" />
            </div>
            <div className="value-text-wrap">
              <h3 className="value-title">ZUVERLÄSSIGE PARTNERSCHAFT</h3>
              <p className="value-desc">Von der Planung bis zur Umsetzung</p>
            </div>
          </div>

          <div className="value-divider" />

          {/* Item 02 */}
          <div className="value-item">
            <div className="value-icon-box">
              <Zap size={20} className="value-icon" />
            </div>
            <div className="value-text-wrap">
              <h3 className="value-title">FACHKOMPETENZ</h3>
              <p className="value-desc">Zertifizierte Experten</p>
            </div>
          </div>

          <div className="value-divider" />

          {/* Item 03 */}
          <div className="value-item">
            <div className="value-icon-box">
              <Home size={20} className="value-icon" />
            </div>
            <div className="value-text-wrap">
              <h3 className="value-title">INDIVIDUELLE LÖSUNGEN</h3>
              <p className="value-desc">Für Wohn-, Gewerbe- und Industrieprojekte</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
