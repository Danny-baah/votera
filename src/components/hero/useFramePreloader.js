import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 140;

const getFramePath = (index) => {
  const padded = String(index).padStart(3, '0');
  return `/frames/frame_${padded}.webp`;
};

/**
 * Intelligent frame preloader hook
 * - Immediately loads Frame 0 (0ms static display)
 * - Dynamic priority window around current scroll index
 * - Background progressive batch loading
 * - Closest-loaded fallback guarantee (never blank)
 */
export function useFramePreloader() {
  const [frame0Loaded, setFrame0Loaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const framesCache = useRef(new Map());
  const activeLoads = useRef(new Set());
  const currentIndexRef = useRef(0);

  // Helper to load a single frame
  const loadSingleFrame = useCallback((index) => {
    if (framesCache.current.has(index) || activeLoads.current.has(index)) {
      return Promise.resolve(framesCache.current.get(index));
    }

    activeLoads.current.add(index);

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index);

      img.onload = () => {
        framesCache.current.set(index, img);
        activeLoads.current.delete(index);
        setLoadedCount(framesCache.current.size);
        if (index === 0) {
          setFrame0Loaded(true);
        }
        resolve(img);
      };

      img.onerror = () => {
        activeLoads.current.delete(index);
        resolve(null);
      };
    });
  }, []);

  // Priority window loader around current index
  const prioritizeWindow = useCallback((centerIdx) => {
    currentIndexRef.current = centerIdx;
    
    // Immediate neighborhood: forward 12 frames, backward 6 frames
    const priorityIndices = [];
    for (let offset = 1; offset <= 15; offset++) {
      const forward = centerIdx + offset;
      if (forward < TOTAL_FRAMES && !framesCache.current.has(forward)) {
        priorityIndices.push(forward);
      }
      const backward = centerIdx - offset;
      if (backward >= 0 && !framesCache.current.has(backward)) {
        priorityIndices.push(backward);
      }
    }

    // Load top priority items
    priorityIndices.slice(0, 8).forEach(idx => {
      loadSingleFrame(idx);
    });
  }, [loadSingleFrame]);

  // Initial mount: load frame 0 immediately, then key milestone frames, then background stream
  useEffect(() => {
    let isCancelled = false;

    // 1. Frame 0 immediately
    loadSingleFrame(0).then(() => {
      if (isCancelled) return;

      // 2. Load key milestones (connection, flow, house start, final reveal)
      // This ensures smooth navigation even if user jumps or scrolls quickly
      const keyMilestones = [30, 60, 90, 115, 139];
      keyMilestones.forEach(idx => loadSingleFrame(idx));

      // 3. Progressive chunk loader for all remaining frames
      let nextIndex = 1;
      const loadNextBatch = () => {
        if (isCancelled) return;
        
        let batchLoaded = 0;
        while (nextIndex < TOTAL_FRAMES && batchLoaded < 4) {
          if (!framesCache.current.has(nextIndex) && !activeLoads.current.has(nextIndex)) {
            loadSingleFrame(nextIndex);
            batchLoaded++;
          }
          nextIndex++;
        }

        if (nextIndex < TOTAL_FRAMES || framesCache.current.size < TOTAL_FRAMES) {
          // Schedule next batch on idle or timeout
          if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(loadNextBatch, { timeout: 120 });
          } else {
            setTimeout(loadNextBatch, 30);
          }
        }
      };

      // Slight breather to let initial paint complete smoothly
      setTimeout(loadNextBatch, 50);
    });

    return () => {
      isCancelled = true;
    };
  }, [loadSingleFrame]);

  // Query frame with closest-loaded fallback
  const getFrame = useCallback((index) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    
    // Notify window prioritizer
    prioritizeWindow(clamped);

    // Exact hit
    if (framesCache.current.has(clamped)) {
      return framesCache.current.get(clamped);
    }

    // Fallback: search closest loaded frame
    let closestFrame = null;
    let minDistance = Infinity;

    for (const [key, img] of framesCache.current.entries()) {
      const dist = Math.abs(key - clamped);
      if (dist < minDistance) {
        minDistance = dist;
        closestFrame = img;
      }
    }

    return closestFrame;
  }, [prioritizeWindow]);

  return {
    getFrame,
    frame0Loaded,
    totalFrames: TOTAL_FRAMES,
    loadedCount,
    loadProgress: Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100)),
  };
}
