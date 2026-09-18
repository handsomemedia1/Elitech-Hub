"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../app/page.module.css";

const ROW_1 = [
  { name: "Adebayo O.", role: "Now: SOC Analyst, Lagos", text: "Elitech Hub gave me real skills. I landed my first cybersecurity internship within 2 weeks of graduating. The hands-on labs are unlike anything else in Nigeria.", blue: false },
  { name: "Fatima A.", role: "Now: Security Engineer, UK", text: "I was in the diaspora thinking cybersecurity was too expensive. Elitech Hub changed that. World-class training at a Nigerian price. Highly recommended!", blue: true },
  { name: "Chukwuemeka N.", role: "Now: Pen Tester, Abuja", text: "The 16-week program was intense but transformative. I passed my CEH on the first attempt and got placed immediately. Best cybersecurity course price in Nigeria by far.", blue: false },
  { name: "Ngozi P.", role: "Now: Cloud Security, USA", text: "From Ibadan to Silicon Valley. The mentorship and research exposure at Elitech Hub opened doors I didn't know existed. 100% internship rate is real!", blue: true },
  { name: "Taiwo S.", role: "Now: Ethical Hacker, GTB", text: "Searched for cybersecurity training near me Ibadan and found Elitech Hub. Best decision of my career. The AI security curriculum is cutting-edge.", blue: false },
];

const ROW_2 = [
  { name: "Ibrahim K.", role: "Now: CISO Advisor, UAE", text: "I was skeptical about online cybersecurity training in Nigeria but Elitech Hub proved me wrong. Excellent instructors, real labs, guaranteed internship.", blue: true },
  { name: "Blessing E.", role: "Now: Bug Bounty Hunter", text: "The PSEDS research project I worked on during the program is now my portfolio centerpiece. It got me interviews at top companies worldwide.", blue: false },
  { name: "Yusuf M.", role: "Now: Network Security, Kuwait", text: "From Kuwait, I joined the online program. The virtual labs and live mentorship sessions were as good as being physically present. My cybersecurity job was secured before I finished!", blue: true },
  { name: "Amina R.", role: "Now: Incident Responder, Lagos", text: "The price was unbeatable for the quality. Cybersecurity course price in Nigeria can't get better than this. Plus I got a job immediately after.", blue: false },
  { name: "Samuel B.", role: "Now: Security Consultant, UK", text: "Elitech Hub is the real deal. Not just theory—actual attack and defense scenarios. My UK employer was impressed by my practical knowledge.", blue: false },
];

/**
 * TestimonialsMarquee — Client Component loaded via next/dynamic({ ssr: false })
 *
 * The infinite marquee relies on DOM measurements to clone rows for seamless looping.
 * SSR would produce HTML without real widths, causing a hydration mismatch and
 * a broken animation. By using next/dynamic with ssr:false, Next.js renders this
 * ONLY on the client — impossible to achieve in plain HTML/CSS frameworks.
 */
function Card({ name, role, text, blue }: { name: string; role: string; text: string; blue: boolean }) {
  return (
    <div className={`${styles.marqueeCard} ${blue ? styles.marqueeCardBlue : ""}`}>
      <p className={styles.marqueeQuote}>&ldquo;{text}&rdquo;</p>
      <div className={styles.marqueeAuthorRow}>
        <div className={styles.marqueeAvatar}>
          {name.charAt(0)}
        </div>
        <div>
          <div className={styles.marqueeAuthorName}>{name}</div>
          <div className={styles.marqueeAuthorRole}>{role}</div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction }: { items: typeof ROW_1; direction: "left" | "right" }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Pause on hover
    const pause = () => el.style.animationPlayState = "paused";
    const resume = () => el.style.animationPlayState = "running";
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className={`${styles.marqueeRow} ${direction === "left" ? styles.marqueeLeft : styles.marqueeRight}`}
    >
      {/* Duplicate set for seamless loop */}
      {[...items, ...items].map((t, i) => (
        <Card key={i} {...t} />
      ))}
    </div>
  );
}

export default function TestimonialsMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return empty shell matching dimensions to prevent layout shift during SSR
    return <div className={styles.marqueeWrap} style={{ minHeight: '300px' }} />;
  }

  return (
    <div className={styles.marqueeWrap}>
      <MarqueeRow items={ROW_1} direction="left" />
      <MarqueeRow items={ROW_2} direction="right" />
    </div>
  );
}
