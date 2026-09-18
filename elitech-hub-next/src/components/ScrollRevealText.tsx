"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = "" }: Props) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"] // Starts animating when top of text hits 85% of viewport, finishes when bottom hits 50%
  });

  const words = text.split(" ");

  return (
    <h2 
      ref={containerRef} 
      className={className} 
      style={{ display: "flex", flexWrap: "wrap", columnGap: "0.25em" }}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </h2>
  );
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word = ({ children, progress, range }: WordProps) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const filter = useTransform(progress, range, ["blur(4px)", "blur(0px)"]);
  
  return (
    <span style={{ position: "relative" }}>
      <motion.span style={{ opacity, filter, display: "inline-block" }}>
        {children}
      </motion.span>
    </span>
  );
};
