import { Zap } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand & Claim */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="footer-logo">
              <Zap size={18} className="footer-logo-icon" />
              <span className="footer-brand-name">VOLTERRA</span>
            </div>
            <span className="footer-brand-sub">ELEKTROTECHNIK</span>
          </div>

          {/* Quick Nav Links */}
          <nav className="footer-nav" aria-label="Footer Navigation">
            <a href="#home" className="footer-nav-link">Home</a>
            <a href="#services" className="footer-nav-link">Leistungen</a>
            <a href="#kontakt" className="footer-nav-link">Kontakt</a>
            <a href="#impressum" className="footer-nav-link">Impressum</a>
            <a href="#datenschutz" className="footer-nav-link">Datenschutz</a>
          </nav>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copy">
            © 2026 VOLTERRA Elektrotechnik GmbH. Alle Rechte vorbehalten.
          </p>
          <p className="footer-location">
            München · Frankfurt · Hamburg
          </p>
        </div>
      </div>
    </footer>
  );
}
