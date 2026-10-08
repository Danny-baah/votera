import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Zap, ArrowRight, Menu, X } from 'lucide-react';
import './HeroNavbar.css';

export const HeroNavbar = forwardRef(function HeroNavbar(
  { isHeroPinned = true },
  ref
) {
  const [navOpacity, setNavOpacity] = useState(0); // 0 = fully transparent hero, 1 = solid dark boundary
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    updateProgress: (progress) => {
      // Near boundary (0.95 -> 1.0), transition navbar background smoothly
      if (progress > 0.92) {
        const factor = Math.min(1, (progress - 0.92) / 0.08);
        setNavOpacity(factor);
      } else if (navOpacity > 0) {
        setNavOpacity(0);
      }
    },
  }));

  return (
    <header
      className="hero-navbar-container"
      style={{
        backgroundColor: `rgba(5, 8, 14, ${(navOpacity * 0.88).toFixed(2)})`,
        borderBottom: `1px solid rgba(255, 255, 255, ${(navOpacity * 0.12).toFixed(2)})`,
        backdropFilter: navOpacity > 0.05 ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: navOpacity > 0.05 ? 'blur(16px)' : 'none',
      }}
    >
      <div className="navbar-inner">
        {/* BRAND LOGO */}
        <a href="#" className="brand-logo" aria-label="Volterra Electrical Engineering">
          <div className="brand-mark">
            <svg
              className="brand-lightning"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14H11L9 22L21 9H13L15 2H13Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="brand-text-col">
            <span className="brand-name">VOLTERRA</span>
            <span className="brand-subtitle">ELECTRICAL ENGINEERING</span>
          </div>
        </a>

        {/* CENTER NAVIGATION */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <a href="#home" className="nav-link active">
            HOME
            <span className="nav-active-pill" />
          </a>
          <a href="#services" className="nav-link">SERVICES</a>
          <a href="#work" className="nav-link">OUR WORK</a>
          <a href="#about" className="nav-link">ABOUT</a>
          <a href="#contact" className="nav-link">CONTACT</a>
        </nav>

        {/* RIGHT ACTION */}
        <div className="navbar-actions">
          <a href="#quote" className="quote-button">
            <span>GET A QUOTE</span>
            <ArrowRight size={15} className="quote-arrow" />
          </a>

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE FLYOUT */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="mobile-link active">HOME</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="mobile-link">SERVICES</a>
          <a href="#work" onClick={() => setMobileMenuOpen(false)} className="mobile-link">OUR WORK</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="mobile-link">ABOUT</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-link">CONTACT</a>
          <a href="#quote" onClick={() => setMobileMenuOpen(false)} className="mobile-quote-btn">
            <span>GET A QUOTE</span>
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </header>
  );
});
