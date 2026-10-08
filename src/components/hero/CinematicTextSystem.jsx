import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Home, Leaf } from 'lucide-react';
import './CinematicTextSystem.css';

/**
 * Calculates smooth continuous opacity, translateY, blur, and scale
 * from progress using cosine interpolation.
 */
function getProgressTransform(progress, enterStart, enterFull, exitStart, exitEnd) {
  let opacity = 0;
  let translateY = 20;
  let blur = 8;
  let scale = 0.97;

  if (progress < enterStart) {
    opacity = 0;
    translateY = 24;
    blur = 8;
    scale = 0.96;
  } else if (progress <= enterFull) {
    const t = (progress - enterStart) / (enterFull - enterStart);
    const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
    opacity = ease;
    translateY = (1 - ease) * 20;
    blur = (1 - ease) * 8;
    scale = 0.96 + ease * 0.04;
  } else if (progress <= exitStart) {
    opacity = 1;
    translateY = 0;
    blur = 0;
    scale = 1.0;
  } else if (progress <= exitEnd) {
    const t = (progress - exitStart) / (exitEnd - exitStart);
    const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
    opacity = 1 - ease;
    translateY = -ease * 20;
    blur = ease * 8;
    scale = 1.0 + ease * 0.03;
  } else {
    opacity = 0;
    translateY = -24;
    blur = 8;
    scale = 1.03;
  }

  return {
    opacity: Math.max(0, Math.min(1, opacity)),
    translateY: translateY.toFixed(2),
    blur: blur.toFixed(2),
    scale: scale.toFixed(3),
    visibility: opacity > 0.005 ? 'visible' : 'hidden',
  };
}

export const CinematicTextSystem = forwardRef(function CinematicTextSystem(
  { isReducedMotion },
  ref
) {
  const state1Ref = useRef(null);
  const state2Ref = useRef(null);
  const state3Ref = useRef(null);
  const state4Ref = useRef(null);
  const state5Ref = useRef(null);
  const state2GlowRef = useRef(null);

  const applyTransform = (el, transform) => {
    if (!el) return;
    el.style.opacity = transform.opacity;
    el.style.transform = `translate3d(0, ${transform.translateY}px, 0) scale(${transform.scale})`;
    el.style.filter = `blur(${transform.blur}px)`;
    el.style.visibility = transform.visibility;
    el.style.pointerEvents = transform.opacity > 0.8 ? 'auto' : 'none';
  };

  const update = (videoProgress, currentProgress) => {
    if (isReducedMotion) {
      applyTransform(state1Ref.current, { opacity: 0, translateY: 0, blur: 0, scale: 1, visibility: 'hidden' });
      applyTransform(state2Ref.current, { opacity: 0, translateY: 0, blur: 0, scale: 1, visibility: 'hidden' });
      applyTransform(state3Ref.current, { opacity: 0, translateY: 0, blur: 0, scale: 1, visibility: 'hidden' });
      applyTransform(state4Ref.current, { opacity: 0, translateY: 0, blur: 0, scale: 1, visibility: 'hidden' });
      applyTransform(state5Ref.current, { opacity: 1, translateY: 0, blur: 0, scale: 1, visibility: 'visible' });
      return;
    }

    // STATE 01 — BEGINNING (Cable Approach) 0.00 -> 0.20
    const s1 = getProgressTransform(videoProgress, -0.05, 0.03, 0.14, 0.22);
    applyTransform(state1Ref.current, s1);

    // STATE 02 — CONNECTION (Pulse & Spark) 0.18 -> 0.36
    const s2 = getProgressTransform(videoProgress, 0.18, 0.24, 0.30, 0.38);
    applyTransform(state2Ref.current, s2);
    if (state2GlowRef.current) {
      const sparkPeak = Math.max(0, 1 - Math.abs(videoProgress - 0.24) / 0.06);
      state2GlowRef.current.style.opacity = sparkPeak.toFixed(2);
      state2GlowRef.current.style.transform = `scale(${(0.9 + sparkPeak * 0.3).toFixed(2)})`;
    }

    // STATE 03 — FLOW (Circuit Motion) 0.34 -> 0.54
    const s3 = getProgressTransform(videoProgress, 0.33, 0.40, 0.48, 0.55);
    applyTransform(state3Ref.current, s3);

    // STATE 04 — TRANSFORMATION (House Powers Up) 0.52 -> 0.77
    const s4 = getProgressTransform(videoProgress, 0.51, 0.59, 0.69, 0.78);
    applyTransform(state4Ref.current, s4);

    // STATE 05 — FINAL REVEAL (Final Frame + Hold Phase)
    // Fades in as video completes (0.75 -> 0.85) and STAYS 100% VISIBLE through the entire hold (0.85 -> 1.00)
    const s5 = getProgressTransform(videoProgress, 0.74, 0.85, 1.05, 1.05);
    applyTransform(state5Ref.current, s5);
  };

  useImperativeHandle(ref, () => ({
    updateProgress: (videoProgress, currentProgress) => {
      update(videoProgress, currentProgress);
    },
  }));

  useEffect(() => {
    update(0, 0);
  }, [isReducedMotion]);

  return (
    <div className="cinematic-text-layer">
      {/* STATE 01 — BEGINNING */}
      <div ref={state1Ref} className="text-state text-state-1">
        <span className="eyebrow-accent">ELEKTROTECHNIK</span>
        <h1 className="hero-headline">
          ALLES BEGINNT
          <br />
          MIT EINER VERBINDUNG.
        </h1>
        <p className="narrative-hint">Scrollen für Energiefluss</p>
      </div>

      {/* STATE 02 — CONNECTION */}
      <div ref={state2Ref} className="text-state text-state-2">
        <div ref={state2GlowRef} className="spark-aura" />
        <span className="eyebrow-cyan">SCHALTUNGSVERBINDUNG</span>
        <h2 className="pulse-headline">
          EINE VERBINDUNG.
        </h2>
        <div className="energy-line" />
      </div>

      {/* STATE 03 — FLOW */}
      <div ref={state3Ref} className="text-state text-state-3">
        <span className="eyebrow-accent">STROMFLUSS</span>
        <h2 className="motion-headline">
          ENERGIE IN BEWEGUNG.
        </h2>
        <p className="motion-subtext">Präzise Leiterbahnen für verlustfreie Energieübertragung</p>
      </div>

      {/* STATE 04 — TRANSFORMATION */}
      <div ref={state4Ref} className="text-state text-state-4">
        <span className="eyebrow-gold">GEBÄUDETECHNIK</span>
        <h2 className="warmth-headline">
          ENERGIE WIRD ZU LEBEN.
        </h2>
        <p className="warmth-subtext">Moderne Infrastruktur trifft architektonischen Wohnkomfort</p>
      </div>

      {/* STATE 05 — FINAL REVEAL (MATCHING REFERENCE IMAGE) */}
      <div ref={state5Ref} className="text-state text-state-5">
        <div className="final-reveal-content">
          <span className="eyebrow-gold tracking-wide">ELEKTROTECHNIK</span>
          <h1 className="final-main-headline">
            ENERGIE FÜR DAS,
            <br />
            WAS ZÄHLT.
          </h1>
          <p className="final-description">
            Elektroinstallationen mit Präzision, Sicherheit und Zukunft im Blick.
          </p>

          <div className="cta-group">
            <a href="#services" className="primary-cta-button">
              <span>UNSERE LEISTUNGEN ENTDECKEN</span>
              <ArrowRight className="cta-icon" size={17} />
            </a>
          </div>
        </div>

        {/* BOTTOM TRUST BADGES (GERMAN MARKET ADAPTATION) */}
        <div className="bottom-trust-bar">
          <div className="trust-card">
            <div className="trust-icon-box">
              <ShieldCheck size={20} className="trust-icon" />
            </div>
            <div className="trust-text">
              <div className="trust-title">SICHERE SYSTEME</div>
              <div className="trust-sub">HÖCHSTE STANDARDS</div>
            </div>
          </div>

          <div className="trust-divider" />

          <div className="trust-card">
            <div className="trust-icon-box">
              <Zap size={20} className="trust-icon" />
            </div>
            <div className="trust-text">
              <div className="trust-title">FACHINSTALLATION</div>
              <div className="trust-sub">ZERTIFIZIERTE EXPERTEN</div>
            </div>
          </div>

          <div className="trust-divider" />

          <div className="trust-card">
            <div className="trust-icon-box">
              <Home size={20} className="trust-icon" />
            </div>
            <div className="trust-text">
              <div className="trust-title">WOHN- &amp; GEWERBEBAU</div>
              <div className="trust-sub">ZUVERLÄSSIG VERSORGT</div>
            </div>
          </div>

          <div className="trust-divider" />

          <div className="trust-card">
            <div className="trust-icon-box">
              <Leaf size={20} className="trust-icon" />
            </div>
            <div className="trust-text">
              <div className="trust-title">EFFIZIENTE ENERGIE</div>
              <div className="trust-sub">ZUKUNFTSSICHER GEPLANT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
