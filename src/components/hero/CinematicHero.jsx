import { useRef, useCallback, useState } from 'react';
import { useFramePreloader } from './useFramePreloader';
import { useScrollScrubbing } from './useScrollScrubbing';
import { CanvasRenderer } from './CanvasRenderer';
import { ElectricalOverlay } from './ElectricalOverlay';
import { CinematicTextSystem } from './CinematicTextSystem';
import { HeroNavbar } from './HeroNavbar';
import { ChevronDown, Sparkles } from 'lucide-react';
import './CinematicHero.css';

const STORY_STAGES = [
  { id: 1, name: 'START', progress: 0.0 },
  { id: 2, name: 'VERBINDUNG', progress: 0.22 },
  { id: 3, name: 'STROMFLUSS', progress: 0.42 },
  { id: 4, name: 'GEBÄUDE', progress: 0.65 },
  { id: 5, name: 'ENERGIE', progress: 0.85 },
];

export function CinematicHero() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRendererRef = useRef(null);
  const electricalOverlayRef = useRef(null);
  const textSystemRef = useRef(null);
  const navbarRef = useRef(null);
  const exitGlowRef = useRef(null);

  const [activeStage, setActiveStage] = useState(1);
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);

  // 1. Frame preloader (Instant Frame 0 + priority streaming)
  const { getFrame, frame0Loaded, totalFrames, loadProgress } = useFramePreloader();

  // 2. High-performance RAF tick callback
  // Seamlessly updates Canvas, Particles, and Typography without React re-render thrashing
  const handleTick = useCallback(({ currentProgress, videoProgress, frameIndex, velocity, isReducedMotion, isHoldPhase }) => {
    // 1. Canvas frame sequence rendering
    if (canvasRendererRef.current) {
      canvasRendererRef.current.drawFrame(frameIndex);
    }

    // 2. Procedural electrical spark & micro-arc overlay
    if (electricalOverlayRef.current) {
      electricalOverlayRef.current.renderOverlay(videoProgress, velocity);
    }

    // 3. Cinematic text choreograph with final state hold
    if (textSystemRef.current) {
      textSystemRef.current.updateProgress(videoProgress, currentProgress);
    }

    // 4. Navbar boundary transition
    if (navbarRef.current) {
      navbarRef.current.updateProgress(currentProgress);
    }

    // 5. Downward conduit energy transition toward Section 2 (around 0.90 -> 1.00)
    if (exitGlowRef.current) {
      if (currentProgress > 0.88) {
        const exitFactor = Math.min(1, (currentProgress - 0.88) / 0.12);
        exitGlowRef.current.style.opacity = (exitFactor * 0.9).toFixed(2);
        exitGlowRef.current.style.transform = `scaleY(${(0.4 + exitFactor * 0.6).toFixed(2)})`;
      } else {
        exitGlowRef.current.style.opacity = '0';
      }
    }

    // Update active story milestone on sidebar
    let stage = 1;
    if (videoProgress >= 0.84) stage = 5;
    else if (videoProgress >= 0.60) stage = 4;
    else if (videoProgress >= 0.36) stage = 3;
    else if (videoProgress >= 0.18) stage = 2;
    setActiveStage(stage);

    if (currentProgress > 0.02 && !hasStartedScrolling) {
      setHasStartedScrolling(true);
    } else if (currentProgress <= 0.01 && hasStartedScrolling) {
      setHasStartedScrolling(false);
    }
  }, [hasStartedScrolling]);

  // 3. Scroll Scrubbing engine with GSAP ScrollTrigger pinning
  const { isReducedMotion, triggerRef } = useScrollScrubbing({
    containerRef,
    pinRef,
    totalFrames,
    onTick: handleTick,
  });

  // Jump to specific milestone on indicator click
  const scrollToMilestone = (milestoneVideoProgress) => {
    const trigger = triggerRef.current;
    if (trigger) {
      const targetScrollProgress = milestoneVideoProgress * 0.85;
      const targetScrollY = trigger.start + targetScrollProgress * (trigger.end - trigger.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
      return;
    }
    if (!containerRef.current) return;
    const targetScrollProgress = milestoneVideoProgress * 0.85;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerRef.current.offsetTop + targetScrollProgress * scrollableDistance;
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={containerRef} className="hero-scroll-container" id="home">
      {/* Pinned Stage - Locked to viewport by GSAP ScrollTrigger for 650vh */}
      <div ref={pinRef} className="hero-pin">
        {/* Full-Viewport Canvas Sequence */}
        <CanvasRenderer
          ref={canvasRendererRef}
          getFrame={getFrame}
          frame0Loaded={frame0Loaded}
        />

        {/* Procedural Electrical Spark Overlay */}
        <ElectricalOverlay
          ref={electricalOverlayRef}
          isReducedMotion={isReducedMotion}
        />

        {/* Cinematic Vignette & Optical Shading */}
        <div className="cinematic-vignette" />

        {/* Downward Electrical Exit Flow (Connects into Section 2) */}
        <div ref={exitGlowRef} className="exit-energy-conduit" />

        {/* Cinematic Choreographed Typography */}
        <CinematicTextSystem
          ref={textSystemRef}
          isReducedMotion={isReducedMotion}
        />

        {/* Transparent / Boundary-Transitioning Navbar */}
        <HeroNavbar ref={navbarRef} isHeroPinned={true} />

        {/* SIDE STORYLINE NAVIGATION (Interactive Milestones) */}
        {!isReducedMotion && (
          <aside className="storyline-timeline" aria-label="Story Progression">
            <div className="timeline-rail">
              {STORY_STAGES.map((s) => {
                const isActive = activeStage >= s.id;
                const isCurrent = activeStage === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToMilestone(s.progress)}
                    className={`timeline-node ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    title={`Jump to ${s.name}`}
                  >
                    <span className="node-marker" />
                    <span className="node-label">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* INITIAL SCROLL HINT (Fades out when scrubbing begins) */}
        <div className={`initial-scroll-hint ${hasStartedScrolling ? 'fade-out' : ''}`}>
          <div className="scroll-hint-inner">
            <span className="hint-pulse-dot" />
            <span className="hint-text">SCROLLEN FÜR ENERGIEFLUSS</span>
            <ChevronDown size={14} className="hint-arrow" />
          </div>
        </div>

        {/* ASSET CACHE STREAM STATUS */}
        {loadProgress < 100 && (
          <div className="load-progress-pill" title={`Preloading frames: ${loadProgress}%`}>
            <Sparkles size={11} className="load-spin-icon" />
            <span>SYNCHRONISIERE DATEN {loadProgress}%</span>
          </div>
        )}
      </div>
    </section>
  );
}
