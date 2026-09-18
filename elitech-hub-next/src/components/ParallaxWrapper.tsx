"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  children: ReactNode;
  speed?: number; // 0.1 to 1.0 (multiplier for movement)
  className?: string;
  direction?: "up" | "down";
}

export default function ParallaxWrapper({ 
  children, 
  speed = 0.5, 
  className = "",
  direction = "up"
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const movement = speed * 100;
  
  // If direction is up, it moves slower than scroll (appears to go down relative to container)
  const yValues = direction === "up" ? [`-${movement}%`, `${movement}%`] : [`${movement}%`, `-${movement}%`];
  
  const y = useTransform(scrollYProgress, [0, 1], yValues);

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
      <motion.div style={{ y, width: "100%", height: "100%" }}>
        {children}
      </motion.div>
    </div>
  );
}
