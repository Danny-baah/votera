import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowDown } from 'lucide-react';
import './ServicesSection.css';

gsap.registerPlugin(ScrollTrigger);

const SERVICES_DATA = [
  {
    number: '01',
    title: 'ELEKTROINSTALLATION',
    desc: 'Durchdachte und zukunftssichere Installationen für Wohn-, Gewerbe- und Industrieprojekte.',
    image: '/services/service_01.webp',
    accent: 'blue',
  },
  {
    number: '02',
    title: 'WARTUNG & SERVICE',
    desc: 'Zuverlässiger Service für dauerhaft sichere und leistungsfähige Elektrosysteme.',
    image: '/services/service_02.webp',
    accent: 'gold',
  },
  {
    number: '03',
    title: 'SMART HOME & AUTOMATION',
    desc: 'Intelligente Lösungen für mehr Komfort, Effizienz und Kontrolle.',
    image: '/services/service_03.webp',
    accent: 'gold',
  },
  {
    number: '04',
    title: 'ENERGIE & NACHHALTIGKEIT',
    desc: 'Moderne Energielösungen für eine effizientere und nachhaltigere Zukunft.',
    image: '/services/service_04.webp',
    accent: 'gold',
  },
];

export function ServicesSection() {
  const sectionRef = useRef(null);
  const pinContainerRef = useRef(null);
  const headerRef = useRef(null);
  const svgRef = useRef(null);
  const cardsRef = useRef([]);

  // SVG path refs for animated stroke-dashoffset
  const trunkRef = useRef(null);
  const junctionBoxRef = useRef(null);
  const branch1Ref = useRef(null);
  const branch2Ref = useRef(null);
  const branch3Ref = useRef(null);
  const branch4Ref = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Measure all SVG path lengths for clean strokeDasharray setup
      const paths = [
        trunkRef.current,
        junctionBoxRef.current,
        branch1Ref.current,
        branch2Ref.current,
        branch3Ref.current,
        branch4Ref.current,
      ];

      paths.forEach((p) => {
        if (p) {
          const len = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        }
      });

      // Initially hide header & cards & contact nodes
      gsap.set(headerRef.current, { opacity: 0, y: 25 });
      gsap.set(cardsRef.current, { opacity: 0, y: 35 });
      gsap.set(nodesRef.current, { scale: 0, opacity: 0 });

      // 2. Master ScrollTrigger Timeline: Pinned sequence for the electrical journey
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600vh', // Extended 600vh scroll duration for deliberate, ultra-slow drawing
          pin: pinContainerRef.current,
          scrub: 1.5, // Silky, weighted fluid scrubbing
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // STAGE 1: Central trunk line travels down from hero (0.00 -> 0.14)
      if (trunkRef.current) {
        tl.to(trunkRef.current, { strokeDashoffset: 0, ease: 'none', duration: 0.14 }, 0);
      }

      // STAGE 2: Junction bus forms around header & header reveals (0.10 -> 0.28)
      if (junctionBoxRef.current) {
        tl.to(junctionBoxRef.current, { strokeDashoffset: 0, ease: 'none', duration: 0.18 }, 0.10);
      }
      tl.to(headerRef.current, { opacity: 1, y: 0, ease: 'power1.out', duration: 0.16 }, 0.14);

      // =========================================================================
      // PHASE A: FIRST & LAST (BRANCHES 01 & 04, THEN CARDS 01 & 04)
      // =========================================================================
      // Outer branches draw outward and downward very slowly and deliberately (0.26 -> 0.58)
      if (branch1Ref.current) {
        tl.to(branch1Ref.current, { strokeDashoffset: 0, ease: 'none', duration: 0.32 }, 0.26);
      }
      if (branch4Ref.current) {
        tl.to(branch4Ref.current, { strokeDashoffset: 0, ease: 'none', duration: 0.32 }, 0.26);
      }

      // Outer contact nodes ignite upon arrival of outer electrical currents (0.54 -> 0.62)
      if (nodesRef.current[0]) {
        tl.to(nodesRef.current[0], { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.08 }, 0.54);
      }
      if (nodesRef.current[3]) {
        tl.to(nodesRef.current[3], { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.08 }, 0.54);
      }

      // Outer cards (01 & 04) reveal first as energy energizes them (0.56 -> 0.66)
      if (cardsRef.current[0]) {
        tl.to(cardsRef.current[0], { opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 }, 0.56);
      }
      if (cardsRef.current[3]) {
        tl.to(cardsRef.current[3], { opacity: 1, y: 0, ease: 'power2.out', duration: 0.12 }, 0.56);
      }

      // =========================================================================
      // PHASE B: MIDDLE PAIR (BRANCHES 02 & 03, THEN CARDS 02 & 03)
      // =========================================================================
      // Middle branches follow the same drawing pattern downward very slowly (0.64 -> 0.92)
      if (branch2Ref.current) {
        tl.to(branch2Ref.current, { strokeDashoffset: 0, ease: 'none', duration: 0.28 }, 0.64);
      }
      if (branch3Ref.current) {
        tl.to(branch3Ref.current, { strokeDashoffset: 0, ease: 'none', duration: 0.28 }, 0.64);
      }

      // Middle contact nodes ignite upon arrival of middle electrical currents (0.88 -> 0.95)
      if (nodesRef.current[1]) {
        tl.to(nodesRef.current[1], { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.07 }, 0.88);
      }
      if (nodesRef.current[2]) {
        tl.to(nodesRef.current[2], { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.07 }, 0.88);
      }

      // Middle cards (02 & 03) reveal following the exact same pattern (0.90 -> 1.00)
      if (cardsRef.current[1]) {
        tl.to(cardsRef.current[1], { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 }, 0.90);
      }
      if (cardsRef.current[2]) {
        tl.to(cardsRef.current[2], { opacity: 1, y: 0, ease: 'power2.out', duration: 0.10 }, 0.90);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="services-section-wrapper" id="services">
      <div ref={pinContainerRef} className="services-pin-stage">
        
        {/* Ambient glow centered behind junction */}
        <div className="services-ambient-glow" />

        {/* Top Incoming Energy Anchor (Bridge from Hero) */}
        <div className="services-entry-anchor">
          <div className="entry-anchor-circle">
            <ArrowDown size={13} className="entry-anchor-icon" />
          </div>
          <span className="entry-anchor-text">WEITER SCROLLEN</span>
        </div>

        {/* SVG Electrical Network (Trunk -> Junction Loop -> 4 Branches) */}
        <div className="services-circuit-canvas">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 480"
            fill="none"
            preserveAspectRatio="none"
            className="services-circuit-svg"
          >
            <defs>
              {/* Cyan / Electric Blue Glow */}
              <filter id="circuit-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur1" />
                <feGaussianBlur stdDeviation="7" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gold / Amber Glow */}
              <filter id="circuit-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur1" />
                <feGaussianBlur stdDeviation="7" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* BASE PASSIVE CIRCUIT TRACE (Subtle dark blueprint guides) */}
            <g className="base-circuit-tracks">
              <path d="M 600,0 L 600,68" stroke="rgba(143, 223, 255, 0.12)" strokeWidth="1.5" />
              {/* Rounded Junction Frame enclosing header */}
              <rect
                x="260"
                y="68"
                width="680"
                height="110"
                rx="24"
                stroke="rgba(143, 223, 255, 0.12)"
                strokeWidth="1.5"
              />
              {/* Branch 1 */}
              <path d="M 260,123 L 150,123 Q 135,123 135,140 L 135,270" stroke="rgba(143, 223, 255, 0.12)" strokeWidth="1.5" />
              {/* Branch 2 */}
              <path d="M 445,178 L 445,270" stroke="rgba(201, 161, 90, 0.12)" strokeWidth="1.5" />
              {/* Branch 3 */}
              <path d="M 755,178 L 755,270" stroke="rgba(143, 223, 255, 0.12)" strokeWidth="1.5" />
              {/* Branch 4 */}
              <path d="M 940,123 L 1050,123 Q 1065,123 1065,140 L 1065,270" stroke="rgba(143, 223, 255, 0.12)" strokeWidth="1.5" />
            </g>

            {/* ACTIVE ANIMATED CURRENT (Driven by Scroll) */}
            <g className="active-circuit-currents">
              {/* Central Trunk Line entering from top */}
              <path
                ref={trunkRef}
                d="M 600,0 L 600,68"
                stroke="#8FDFFF"
                strokeWidth="2.5"
                filter="url(#circuit-glow-blue)"
              />

              {/* Junction Bus Frame */}
              <rect
                ref={junctionBoxRef}
                x="260"
                y="68"
                width="680"
                height="110"
                rx="24"
                stroke="#8FDFFF"
                strokeWidth="2"
                filter="url(#circuit-glow-blue)"
              />

              {/* Branch 01: to Card 1 (Electric Blue) */}
              <path
                ref={branch1Ref}
                d="M 260,123 L 150,123 Q 135,123 135,140 L 135,270"
                stroke="#8FDFFF"
                strokeWidth="2"
                filter="url(#circuit-glow-blue)"
              />

              {/* Branch 02: to Card 2 (Warm Gold) */}
              <path
                ref={branch2Ref}
                d="M 445,178 L 445,270"
                stroke="#C9A15A"
                strokeWidth="2"
                filter="url(#circuit-glow-gold)"
              />

              {/* Branch 03: to Card 3 (Electric Blue) */}
              <path
                ref={branch3Ref}
                d="M 755,178 L 755,270"
                stroke="#8FDFFF"
                strokeWidth="2"
                filter="url(#circuit-glow-blue)"
              />

              {/* Branch 04: to Card 4 (Electric Blue leading to gold dock) */}
              <path
                ref={branch4Ref}
                d="M 940,123 L 1050,123 Q 1065,123 1065,140 L 1065,270"
                stroke="#8FDFFF"
                strokeWidth="2"
                filter="url(#circuit-glow-blue)"
              />
            </g>

            {/* Terminal Connection Contact Nodes */}
            <g className="terminal-nodes">
              {/* Node 1 */}
              <circle
                ref={(el) => (nodesRef.current[0] = el)}
                cx="135"
                cy="270"
                r="4.5"
                fill="#ffffff"
                stroke="#8FDFFF"
                strokeWidth="2.5"
                filter="url(#circuit-glow-blue)"
              />
              {/* Node 2 */}
              <circle
                ref={(el) => (nodesRef.current[1] = el)}
                cx="445"
                cy="270"
                r="4.5"
                fill="#ffffff"
                stroke="#C9A15A"
                strokeWidth="2.5"
                filter="url(#circuit-glow-gold)"
              />
              {/* Node 3 */}
              <circle
                ref={(el) => (nodesRef.current[2] = el)}
                cx="755"
                cy="270"
                r="4.5"
                fill="#ffffff"
                stroke="#8FDFFF"
                strokeWidth="2.5"
                filter="url(#circuit-glow-blue)"
              />
              {/* Node 4 */}
              <circle
                ref={(el) => (nodesRef.current[3] = el)}
                cx="1065"
                cy="270"
                r="4.5"
                fill="#ffffff"
                stroke="#C9A15A"
                strokeWidth="2.5"
                filter="url(#circuit-glow-gold)"
              />
            </g>
          </svg>
        </div>

        {/* SECTION 2 HEADER (Enclosed inside the central electrical junction bus) */}
        <div ref={headerRef} className="services-header-container">
          <span className="services-eyebrow">UNSERE LEISTUNGEN</span>
          <h2 className="services-main-title">
            KOMPETENZ IN <span className="title-highlight">JEDER VERBINDUNG.</span>
          </h2>
          <p className="services-subtitle">
            Ganzheitliche Elektrolösungen – von der Planung bis zum sicheren Betrieb.
          </p>
        </div>

        {/* FOUR SERVICE CARDS (Directly anchored to the electrical branches) */}
        <div className="services-cards-grid">
          {SERVICES_DATA.map((service, idx) => (
            <div
              key={service.number}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`service-card ${service.accent}-accent`}
            >
              {/* Glowing Terminal Node Dock at Top Center */}
              <div className="card-terminal-dock" />

              {/* Card Image Thumbnail */}
              <div className="card-thumb-wrap">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="card-thumb-img"
                />
                <div className="card-thumb-overlay" />
              </div>

              {/* Card Content */}
              <div className="card-body">
                <span className="card-number">{service.number}</span>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-desc">{service.desc}</p>
                
                {/* Circular Arrow Interaction */}
                <div className="card-action">
                  <span className="action-circle-btn">
                    <ArrowRight size={14} className="action-arrow-icon" />
                  </span>
                  <span className="action-text">MEHR ERFAHREN</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
