"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./ScrollProgressBar.module.css";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/writer') || pathname.startsWith('/researcher');

  useEffect(() => {
    // Reset on route change
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (isDashboard) return null;

  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.bar}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
