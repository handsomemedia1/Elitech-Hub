"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        padding: "1rem 1.5rem",
        background: "rgba(0, 255, 65, 0.08)",
        border: "1px solid rgba(0, 255, 65, 0.25)",
        borderRadius: "0.75rem",
        color: "#6ee7b7",
        fontWeight: 600,
        fontSize: "0.95rem",
      }}>
        ✅ You&apos;re subscribed! Watch your inbox for cybersecurity updates.
      </div>
    );
  }

  return (
    <form className={styles.footerEmailForm} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        className={styles.footerEmailInput}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
        }}
        required
        disabled={isLoading}
      />
      <button type="submit" className={styles.footerEmailBtn} disabled={isLoading}>
        {isLoading ? "..." : "Subscribe"}
      </button>
      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem", width: "100%" }}>
          ⚠ {error}
        </p>
      )}
    </form>
  );
}
