"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TestimonialCard.module.css";

export interface TestimonialProps {
  id?: string;
  authorName: string;
  authorRole?: string | null;
  quote: string;
  rating?: number | null;
  avatarInitials: string;
  source: string;
  externalUrl?: string | null;
  avatarImage?: string | null;
}

export default function TestimonialCard({
  authorName,
  authorRole,
  quote,
  rating,
  avatarInitials,
  source,
  externalUrl,
  avatarImage,
}: TestimonialProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isVisible ? styles.visible : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>
          {avatarImage ? (
            <Image
              src={avatarImage}
              alt={`${authorName} avatar`}
              fill
              className={styles.avatarImage}
              sizes="48px"
            />
          ) : (
            avatarInitials
          )}
        </div>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{authorName}</span>
          {authorRole && <span className={styles.authorRole}>{authorRole}</span>}
        </div>
        {rating && (
          <div className={styles.rating} aria-label={`Rating: ${rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={styles.star}
                fill={i < rating ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
        )}
      </div>

      <p className={styles.quote}>{quote}</p>

      <div className={styles.footer}>
        <span className={styles.dot}></span>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verifiedLink}
          >
            [VERIFIED] via {source.charAt(0).toUpperCase() + source.slice(1)}
            <svg
              className={styles.externalIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          <span>[VERIFIED] via {source.charAt(0).toUpperCase() + source.slice(1)}</span>
        )}
      </div>
    </div>
  );
}
