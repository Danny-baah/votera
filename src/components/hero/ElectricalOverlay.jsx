import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

/**
 * Procedural Electrical Effects & Micro-Arcs Overlay
 * 
 * - Micro-sparks and ambient electromagnetic particles
 * - Connection payoff: concentrated blue-white flash and directional spark burst
 * - Color transformation: cool electric blue -> warm architectural amber
 * - Motion-design quality: subtle, refined, no cartoon arcade effects
 * - High-efficiency particle pooling (zero GC garbage collection)
 */
export const ElectricalOverlay = forwardRef(function ElectricalOverlay(
  { isReducedMotion },
  ref
) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const flashAlphaRef = useRef(0);
  const prevProgressRef = useRef(0);
  const microArcTimerRef = useRef(0);

  // Initialize particle pool (50 max particles for luxury subtlety and high performance)
  useEffect(() => {
    const pool = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      pool.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        size: 0.8 + Math.random() * 1.6,
        alpha: 0,
        targetAlpha: 0.1 + Math.random() * 0.4,
        color: 'blue', // 'blue' or 'amber'
        life: Math.random(),
        isBurst: false,
      });
    }
    particlesRef.current = pool;
  }, []);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useImperativeHandle(ref, () => ({
    renderOverlay: (progress, velocity) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // Clear previous frame
      ctx.clearRect(0, 0, cw, ch);

      if (isReducedMotion) return;

      const prev = prevProgressRef.current;
      prevProgressRef.current = progress;

      // 1. CONNECTION PAYOFF DETECTOR (around 0.21 - 0.26)
      // When entering or scrubbing across the exact cable connection point
      const isConnectionMoment = progress >= 0.20 && progress <= 0.28;
      const crossedConnection = (prev < 0.23 && progress >= 0.23) || (prev > 0.23 && progress <= 0.23);

      if (crossedConnection) {
        flashAlphaRef.current = 0.45; // Refined subtle flash

        // Spawn a burst of 12 directed micro-sparks from center
        const burstParticles = particlesRef.current.slice(0, 16);
        burstParticles.forEach((p, idx) => {
          const angle = (idx / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const speed = 0.003 + Math.random() * 0.006;
          p.x = 0.5 + (Math.random() - 0.5) * 0.04;
          p.y = 0.5 + (Math.random() - 0.5) * 0.04;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed * 0.6; // Slight horizontal elongation
          p.alpha = 0.9;
          p.color = 'blue';
          p.isBurst = true;
          p.size = 1.2 + Math.random() * 1.8;
        });
      }

      // Draw Connection Flash if active
      if (flashAlphaRef.current > 0.01) {
        const cx = cw * 0.5;
        const cy = ch * 0.5;
        const radius = Math.min(cw, ch) * 0.35;

        const radialGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        radialGlow.addColorStop(0, `rgba(221, 247, 255, ${flashAlphaRef.current})`);
        radialGlow.addColorStop(0.3, `rgba(143, 223, 255, ${flashAlphaRef.current * 0.5})`);
        radialGlow.addColorStop(1, 'rgba(143, 223, 255, 0)');

        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        flashAlphaRef.current *= 0.88; // Decays quickly in ~120ms
      }

      // 2. MICRO-ARCS (Subtle electric filament near connection & flow)
      if (isConnectionMoment || (progress > 0.28 && progress < 0.45)) {
        microArcTimerRef.current++;
        if (microArcTimerRef.current % 14 === 0) {
          // Draw a faint single micro-arc
          const startX = cw * (0.48 + (Math.random() - 0.5) * 0.06);
          const startY = ch * (0.49 + (Math.random() - 0.5) * 0.04);
          const endX = startX + (Math.random() - 0.5) * 40;
          const endY = startY + (Math.random() - 0.5) * 20;

          ctx.strokeStyle = 'rgba(221, 247, 255, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 12;
          const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 12;
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arc outer glow
          ctx.strokeStyle = 'rgba(143, 223, 255, 0.35)';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }
      }

      // 3. COLOR PALETTE TRANSFORMATION
      // Before 0.65: Cool Electric Blue / Cyan
      // After 0.65: Warm Architectural Amber
      const isWarmPhase = progress >= 0.68;
      const transitionFactor = Math.max(0, Math.min(1, (progress - 0.60) / 0.15));

      // 4. UPDATE & DRAW AMBIENT PARTICLES
      const absVelocity = Math.abs(velocity) * 40;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isBurst) {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha *= 0.92;
          if (p.alpha < 0.02) {
            p.isBurst = false;
            p.alpha = 0;
          }
        } else {
          // Normal ambient particles
          p.x += p.vx * (1 + absVelocity * 2);
          p.y += p.vy * (1 + absVelocity * 2);

          // Wrap around viewport edges
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;

          // Pulse alpha subtly
          p.life += 0.015;
          const baseAlpha = 0.15 + 0.25 * Math.sin(p.life);
          p.alpha = baseAlpha * (0.4 + absVelocity * 0.6);
        }

        const px = p.x * cw;
        const py = p.y * ch;

        // Determine particle color matching reference palette
        let r, g, b;
        if (!isWarmPhase || p.isBurst) {
          // Electric Blue / White (#8FDFFF)
          r = 143;
          g = 223;
          b = 255;
        } else {
          // Lerp between Electric Blue (#8FDFFF) and Warm Gold (#C9A15A: 201, 161, 90)
          r = Math.round(143 + (201 - 143) * transitionFactor);
          g = Math.round(223 + (161 - 223) * transitionFactor);
          b = Math.round(255 + (90 - 255) * transitionFactor);
        }

        // Particle Core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Glow Halo for larger particles
        if (p.size > 1.4 && p.alpha > 0.2) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
});
