"use client";

import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  enter:  { opacity: 1, y: 0,  filter: "blur(0px)" },
  exit:   { opacity: 0, y: -12, filter: "blur(2px)" },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
        duration: 0.5,
      }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
}
