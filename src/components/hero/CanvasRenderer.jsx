import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * High-performance full-viewport Canvas Image Sequence Renderer
 * 
 * - Full viewport coverage
 * - Precise object-fit: cover aspect-fill mathematics
 * - devicePixelRatio handling with capped 2x for optimal mobile/retina performance
 * - Instant frame 0 paint on mount
 * - Direct RAF imperatively driven rendering (no React render cycles per frame)
 */
export const CanvasRenderer = forwardRef(function CanvasRenderer(
  { getFrame, frame0Loaded },
  ref
) {
  const canvasRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);

  // Core render function for an image onto canvas with cover aspect-fill
  const renderImage = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width || 1280;
    const ih = img.naturalHeight || img.height || 720;

    // Fill background with deep night tone
    ctx.fillStyle = '#050B14';
    ctx.fillRect(0, 0, cw, ch);

    // Architectural wide-angle framing:
    // Caps vertical expansion on taller viewports so the wide landscape
    // (lake on the left, garage with EV car on the right, subterranean trench below)
    // is never zoomed in or aggressively cropped.
    let scale = Math.max(cw / iw, ch / ih);
    if (ch / ih > cw / iw) {
      // Viewport is taller than 16:9; preserve the full horizontal landscape
      scale = Math.min(ch / ih, (cw / iw) * 1.04);
    }

    const drawW = iw * scale;
    const drawH = ih * scale;
    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas to match viewport and DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for GPU efficiency
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    // Immediately redraw current/fallback frame
    const currentFrame = lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0;
    const img = getFrame(currentFrame);
    if (img) {
      renderImage(img);
    }
  }, [getFrame, renderImage]);

  // Handle window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // When frame 0 loads initially, immediately paint it! (0ms static initial state)
  useEffect(() => {
    if (frame0Loaded) {
      const img = getFrame(0);
      if (img) {
        renderImage(img);
        lastDrawnFrameRef.current = 0;
      }
    }
  }, [frame0Loaded, getFrame, renderImage]);

  // Expose drawFrame API to parent / RAF loop
  useImperativeHandle(ref, () => ({
    drawFrame: (frameIndex) => {
      if (lastDrawnFrameRef.current === frameIndex) return;

      const img = getFrame(frameIndex);
      if (img) {
        renderImage(img);
        lastDrawnFrameRef.current = frameIndex;
      }
    },
    forceRedraw: () => {
      const img = getFrame(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
      if (img) renderImage(img);
    }
  }), [getFrame, renderImage]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        pointerEvents: 'none',
        objectFit: 'cover',
      }}
    />
  );
});
