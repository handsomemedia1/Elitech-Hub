"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number; // stagger delay in ms
  direction?: "up" | "left" | "right" | "fade";
  threshold?: number;
  style?: React.CSSProperties;
}

/**
 * AnimateOnScroll - Framer Motion Engine
 * Upgraded from native Intersection Observer to Framer Motion's whileInView.
 * Provides butter-smooth, physics-based spring animations when elements scroll into view.
 */
export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.15,
  style,
}: Props) {
  const getVariants = () => {
    const hidden = { opacity: 0 };
    const visible = { opacity: 1, x: 0, y: 0 };

    switch (direction) {
      case "up":
        return { hidden: { ...hidden, y: 50 }, visible };
      case "left":
        return { hidden: { ...hidden, x: -50 }, visible };
      case "right":
        return { hidden: { ...hidden, x: 50 }, visible };
      case "fade":
      default:
        return { hidden, visible };
    }
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0, margin: "50px" }}
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1,
        delay: delay / 1000, // framer motion uses seconds
      }}
    >
      {children}
    </motion.div>
  );
}
