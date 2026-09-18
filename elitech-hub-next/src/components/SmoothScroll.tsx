"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,                 // Slightly longer for more cinematic feel
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease-out: fast start, graceful stop
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,          // Slightly slower wheel for elegance
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
