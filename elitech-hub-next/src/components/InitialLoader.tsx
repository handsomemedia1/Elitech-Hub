"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function InitialLoader() {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if we already played the animation this session
    const hasLoaded = sessionStorage.getItem("elitech_max_loaded");
    if (hasLoaded) {
      setPhase("done");
      return;
    }

    // Phase 1: Rapid Counting
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("reveal"); // Trigger phase 2
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 12) + 4, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "reveal") {
      // Hold the reveal state for 2.5 seconds, then split the screen
      const timeout = setTimeout(() => {
        setPhase("done");
        sessionStorage.setItem("elitech_max_loaded", "true");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  const text = "ElitechHub".split("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: phase === "done" ? "none" : "auto" }}>
      <AnimatePresence>
        {phase !== "done" && (
          <>
            {/* Top Split */}
            <motion.div
              initial={{ top: 0 }}
              exit={{ top: "-50vh" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              style={{
                position: "absolute", left: 0, right: 0, top: 0, height: "50vh",
                backgroundColor: "#030712", zIndex: 1
              }}
            />
            {/* Bottom Split */}
            <motion.div
              initial={{ bottom: 0 }}
              exit={{ bottom: "-50vh" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, height: "50vh",
                backgroundColor: "#030712", zIndex: 1
              }}
            />
          </>
        )}
      </AnimatePresence>

      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              style={{
                fontSize: "clamp(3rem, 20vw, 8rem)", fontWeight: 900, color: "rgba(255,255,255,0.1)",
                fontFamily: "var(--font-montserrat)", letterSpacing: "-0.05em"
              }}
            >
              {progress}%
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center", padding: "0 1rem" }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.1 }}
                  style={{ width: "80px", height: "80px", position: "relative", filter: "drop-shadow(0 0 20px rgba(195, 21, 28, 0.6))" }}
                >
                  <Image src="/images/logo.png" alt="Elitech Hub Logo" fill style={{ objectFit: 'contain' }} priority />
                </motion.div>
                
                <div style={{ display: "flex" }}>
                {text.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring", damping: 12, stiffness: 100,
                      delay: index * 0.05
                    }}
                    style={{
                      fontSize: "clamp(1.8rem, 8vw, 4rem)", fontWeight: 900, color: "white",
                      fontFamily: "var(--font-montserrat)", display: "inline-block"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                </div>
              </div>

              {/* Terminal Simulation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  width: "calc(100vw - 4rem)",
                  maxWidth: "500px",
                  fontFamily: "monospace",
                  fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)",
                  color: "#6ee7b7",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }}></div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }}></div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span style={{ color: "#3b82f6" }}>[BOOT]</span> Initializing secure kernel...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <span style={{ color: "#eab308" }}>[SYSTEM]</span> Loading defensive protocols...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  style={{ color: "#c3151c" }}
                >
                  <span style={{ color: "#22c55e" }}>[SUCCESS]</span> Access Granted. Welcome.
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
