"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How much it pulls towards cursor
}

/**
 * MagneticButton - Ultra Premium Interaction
 * Element subtly pulls towards the user's cursor on hover, creating a 
 * highly tactile and premium "magnetic" feeling. Standard in Awwwards sites.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 15,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (strength / 100), y: middleY * (strength / 100) });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={{ cursor: "pointer", display: "inline-block", background: 'none', border: 'none', padding: 0 }}
      {...props}
    >
      {/* Inner wrapper gets a slightly stronger pull for a parallax effect */}
      <motion.div
        animate={{ x: position.x * 0.5, y: position.y * 0.5 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
}
