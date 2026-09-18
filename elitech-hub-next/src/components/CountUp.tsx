"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // ms
  className?: string;
}

/**
 * CountUp — Next.js Client Component
 * Numbers animate from 0 to their target value when they scroll into view.
 * Uses requestAnimationFrame for buttery-smooth 60fps counting.
 * Impossible to do without JS hydration — only works because Next.js
 * hydrates this as a Client Component after SSR.
 */
export default function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.unobserve(el);

          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {prefix}{count}{suffix}
    </span>
  );
}
