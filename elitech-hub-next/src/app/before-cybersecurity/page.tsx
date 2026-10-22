'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { PARTS, BOOK_METADATA } from '@/data/beforeCybersecurityData';
import { ARCHETYPES } from '@/data/beforeCybersecurityAssessment';
import { BC_PRICING_CONFIG, getPriceForCurrency } from '@/lib/before-cybersecurity/pricing';

export default function BeforeCybersecurityLandingPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('NGN');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPrice = getPriceForCurrency(selectedCurrency);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is Before Cybersecurity another coding or ethical hacking course?',
      a: 'No. Before Cybersecurity comes BEFORE the course. It is an interactive orientation system designed to help you understand the computing foundations, the 8 career specializations, system layers, legal boundaries, and realistic expectations before you commit hundreds of dollars or months of study.',
    },
    {
      q: 'Do I need prior programming or computer science knowledge?',
      a: 'Not at all. In fact, this guide was written specifically for complete beginners, career switchers, and students who have never opened a terminal. It explains core concepts—such as IP addresses, RAM budgets, ports, operating systems, and logs—from first principles.',
    },
    {
      q: 'What is the difference between the Free Assessment and Full Experience?',
      a: 'The Free Assessment features 14 diagnostic questions that identify your natural archetype (Builder, Defender, Investigator, etc.) and gives you immediate starting suggestions. The paid Full Experience unlocks the complete 29-chapter interactive guide, downloadable PDF, detailed gap analysis report, 30/60/90-day actionable roadmap, and curated resource library.',
    },
    {
      q: 'Does this product guarantee a job in cybersecurity in 90 days?',
      a: 'No, and anyone who makes that promise is misleading you. As Chapter 14 and Chapter 21 explain, developing reliable cybersecurity capability takes time and compounded practice. What this product guarantees is clarity: you will understand what the field actually involves, where you fit, and how to execute your first 90 days with verifiable projects rather than guesswork.',
    },
    {
      q: 'What payment methods do you support for Nigerian and international learners?',
      a: 'We accept payments in Nigerian Naira (NGN) via Paystack (Debit Card, Bank Transfer, USSD). For international learners, we support USD, GBP, EUR, and CAD with card checkout options.',
    },
    {
      q: 'Can I read the book on my phone or tablet?',
      a: 'Yes. The entire 29-chapter guide is available in a responsive web reader optimized for mobile screens, laptops, and tablets. Entitled purchasers can also download the standalone PDF edition for offline reading.',
    },
  ];

  return (
    <div className={styles.page}>
      {/* 1. PRODUCT NAVIGATION & IDENTITY */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/before-cybersecurity" className={styles.brandLink}>
            <span className={styles.brandPill}>Orientation</span>
            <span className={styles.brandTitle}>BEFORE CYBERSECURITY</span>
          </Link>

          <nav className={styles.headerNav}>
            <Link href="#problem" className={styles.navLink}>
              The Problem
            </Link>
            <Link href="#included" className={styles.navLink}>
              What&apos;s Included
            </Link>
            <Link href="#guide-preview" className={styles.navLink}>
              The 10 Parts
            </Link>
            <Link href="#assessment" className={styles.navLink}>
              Assessment
            </Link>
            <Link href="#pricing" className={styles.navLink}>
              Pricing
            </Link>
            <Link href="/before-cybersecurity/dashboard" className={styles.appLink}>
              App Dashboard
            </Link>
            <Link href="/before-cybersecurity/assessment" className={styles.navCta}>
              Free Assessment
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroTag}>
            <span>★</span> Elitech Hub Press // 2026 Revised Interactive Edition
          </div>

          <h1 className={styles.heroHeadline}>
            Before You Learn Cybersecurity, <span>Understand What You&apos;re Starting.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Before Cybersecurity is an interactive orientation system designed to help you understand the field, explore possible directions, identify what to learn first, and approach your cybersecurity journey with a clearer plan.
          </p>

          <div className={styles.heroActions}>
            <Link href="/before-cybersecurity/assessment" className={styles.btnPrimary}>
              Take the Free Assessment →
            </Link>
            <Link href="#guide-preview" className={styles.btnSecondary}>
              Explore the Guide
            </Link>
            <Link href="#pricing" className={styles.btnOutline}>
              Get the Full Experience
            </Link>
          </div>

          <div className={styles.heroMeta}>
            <div className={styles.heroMetaItem}>
              <span>✓</span> 10 Parts & 29 In-Depth Chapters
            </div>
            <div className={styles.heroMetaItem}>
              <span>✓</span> 9 Safe Hands-On Lab Worksheets
            </div>
            <div className={styles.heroMetaItem}>
              <span>✓</span> Grounded in NIST NICE, OWASP & 2024 Cyber Law
            </div>
            <div className={styles.heroMetaItem}>
              <span>✓</span> Designed for Nigerian & International Learners
            </div>
          </div>

          {/* Interactive-looking product telemetry frame */}
          <div className={styles.heroVisual}>
            <div className={styles.terminalBar}>
              <div className={styles.terminalDots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
              <div className={styles.terminalTitle}>before-cybersecurity // orientation-telemetry v1.0</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontFamily: 'monospace' }}>● LIVE_READOUT</div>
            </div>
            <div className={styles.visualContent}>
              <div className={styles.visualCard}>
                <div className={styles.visualCardTitle}>01 // Orientation Principle</div>
                <div className={styles.visualCardHeading}>The Core Premise</div>
                <div className={styles.visualCardText}>
                  &ldquo;You do not need to know everything before you start cybersecurity. You need to understand what you are starting.&rdquo;
                </div>
              </div>
              <div className={styles.visualCard}>
                <div className={styles.visualCardTitle}>02 // Diagnostic Radar</div>
                <div className={styles.visualCardHeading}>8 Work-Style Archetypes</div>
                <div className={styles.visualCardText}>
                  Builder, Defender, Investigator, Analyst, Researcher, Strategist, Communicator, and Organizer.
                </div>
              </div>
              <div className={styles.visualCard}>
                <div className={styles.visualCardTitle}>03 // Legal Grounding</div>
                <div className={styles.visualCardHeading}>Statutory Law 2024</div>
                <div className={styles.visualCardText}>
                  Fact-checked against Nigerian Cybercrimes (Amendment) Act 2024, NDPA 2023, and global safe harbor standards.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM BEGINNERS ENCOUNTER */}
      <section id="problem" className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>The Beginner Dilemma</span>
            <h2 className={styles.sectionTitle}>Most People Start Cybersecurity From the Wrong Place</h2>
            <p className={styles.sectionSubtitle}>
              They rush to download Kali Linux, copy terminal scripts from YouTube videos, buy courses on penetration testing, or chase expensive certification syllabuses without understanding how operating systems, networking stacks, or data governance actually work.
            </p>
          </div>

          <div className={styles.grid2}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>01</span>
                <span className={styles.cardBadge}>Common Failure Mode</span>
              </div>
              <h3 className={styles.cardTitle}>Tool Collecting Over Problem Solving</h3>
              <p className={styles.cardText}>
                Beginners collect dozens of tools—Nmap, Metasploit, Burp Suite, Wireshark—and feel productive until an error occurs or the target network behaves differently. Without understanding TCP handshakes or process memory, they are completely stuck.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>02</span>
                <span className={styles.cardBadge}>Common Failure Mode</span>
              </div>
              <h3 className={styles.cardTitle}>The 90-Day Mastery Trap</h3>
              <p className={styles.cardText}>
                Marketing hype promises that anyone can become an &ldquo;ethical hacker&rdquo; in 3 months and secure a remote six-figure job. When real-world troubleshooting takes patience and deep systems knowledge, learners assume they are not smart enough and burn out.
              </p>
            </div>
          </div>

          <div className={styles.calloutBox}>
            <div className={styles.calloutQuote}>
              &ldquo;The problem isn&apos;t a lack of motivation. The problem is a lack of orientation. Advanced security rests on ordinary fundamentals.&rdquo;
            </div>
            <div className={styles.calloutCite}>— Elijah Adeyeye, Founder & Lead Instructor, Elitech Hub</div>
          </div>
        </div>
      </section>

      {/* 4. WHY ORIENTATION MATTERS */}
      <section className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Strategic Clarity</span>
            <h2 className={styles.sectionTitle}>Why Orientation Matters Before Learning</h2>
            <p className={styles.sectionSubtitle}>
              Cybersecurity is an interconnected landscape, not a single vertical ladder. Understanding the terrain saves you months of wasted effort.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardNum}>STAGE 1</div>
              <h3 className={styles.cardTitle}>Understand Your Computer</h3>
              <p className={styles.cardText}>
                Before trying to test someone else&apos;s system, learn the machine on your own desk. Study processes, RAM allocation, BIOS layers, local sockets, and event logs in a controlled home environment.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardNum}>STAGE 2</div>
              <h3 className={styles.cardTitle}>Identify What Fits You</h3>
              <p className={styles.cardText}>
                Are you energized by building secure architectures, investigating anomalous logs, hunting vulnerabilities, or formulating data privacy policies? Your daily workflow preference matters.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardNum}>STAGE 3</div>
              <h3 className={styles.cardTitle}>Build Evidence, Not Just Resumes</h3>
              <p className={styles.cardText}>
                Hiring managers evaluate verifiable troubleshooting evidence over paper credentials. Learn how to document your lab setups, what failed first, and how you fixed it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT BEFORE CYBERSECURITY IS */}
      <section className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>The Philosophy</span>
            <h2 className={styles.sectionTitle}>This Is Not Another Cybersecurity Course</h2>
            <p className={styles.sectionSubtitle}>
              Before Cybersecurity is a dedicated digital orientation product designed to prepare your mind, your computer, your legal ethics, and your learning strategy before you invest time or tuition.
            </p>
          </div>

          <div style={{ fontSize: '1.05rem', color: '#D4D4D8', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p>
              Traditional courses teach you how to click buttons inside specific tools. They assume you already know why an operating system schedules processes, what an IP address represents, or how enterprise security teams actually coordinate during a breach.
            </p>
            <p>
              <strong>Before Cybersecurity bridges that critical missing gap.</strong> It connects your existing analytical, technical, or human background to the National Institute of Standards and Technology (NIST NICE) framework, teaches you the physical memory limits of running local virtualization labs, and grounds your learning in statutory law.
            </p>
          </div>
        </div>
      </section>

      {/* 6. WHAT THE PRODUCT INCLUDES */}
      <section id="included" className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>The Integrated Offering</span>
            <h2 className={styles.sectionTitle}>What Before Cybersecurity Contains</h2>
            <p className={styles.sectionSubtitle}>
              One integrated product experience. Everything you need to start with confidence and purpose.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>01</span>
                <span className={styles.cardBadge}>Core Guide</span>
              </div>
              <h3 className={styles.cardTitle}>The Authoritative Guide</h3>
              <p className={styles.cardText}>
                10 structured parts, 29 chapters, and 9 safe home-lab worksheets written specifically for beginners and career switchers.
              </p>
              <ul className={styles.cardPoints}>
                <li>Web reader with progress tracking</li>
                <li>Downloadable standalone PDF edition</li>
                <li>Zero filler, technical first-principles</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>02</span>
                <span className={styles.cardBadge}>Diagnostic</span>
              </div>
              <h3 className={styles.cardTitle}>Reality Assessment</h3>
              <p className={styles.cardText}>
                A structured diagnostic evaluating your cognitive habits, problem preferences, systems curiosity, and risk intuition.
              </p>
              <ul className={styles.cardPoints}>
                <li>14-question free diagnostic summary</li>
                <li>In-depth 32-question full evaluation</li>
                <li>Explores 8 functional archetypes</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>03</span>
                <span className={styles.cardBadge}>Personalized</span>
              </div>
              <h3 className={styles.cardTitle}>Personalized Report</h3>
              <p className={styles.cardText}>
                A detailed breakdown of your primary and secondary archetypes, transferable competencies, and immediate knowledge gaps.
              </p>
              <ul className={styles.cardPoints}>
                <li>Dimension scores & radar analysis</li>
                <li>Transferable skills mapping</li>
                <li>Identifies exact areas to explore first</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>04</span>
                <span className={styles.cardBadge}>Direction</span>
              </div>
              <h3 className={styles.cardTitle}>Starting Point Compass</h3>
              <p className={styles.cardText}>
                Stop guessing between SOC analysis, penetration testing, DevSecOps, and GRC. Get clear alignment on which direction to pursue first.
              </p>
              <ul className={styles.cardPoints}>
                <li>Maps to NIST NICE work roles</li>
                <li>Prevents analysis paralysis</li>
                <li>Provides targeted first lab objectives</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>05</span>
                <span className={styles.cardBadge}>Actionable</span>
              </div>
              <h3 className={styles.cardTitle}>30/60/90-Day Roadmap</h3>
              <p className={styles.cardText}>
                A practical, deliverable-driven framework: Days 1–30 (Understand), Days 31–60 (Explore), Days 61–90 (Choose & Build).
              </p>
              <ul className={styles.cardPoints}>
                <li>Focuses on tangible lab deliverables</li>
                <li>Interactive progress checklist</li>
                <li>No false 90-day mastery promises</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>06</span>
                <span className={styles.cardBadge}>Curated</span>
              </div>
              <h3 className={styles.cardTitle}>Curated Resource Library</h3>
              <p className={styles.cardText}>
                Authoritative, verified learning resources across systems, protocols, labs, security frameworks, and statutory law.
              </p>
              <ul className={styles.cardPoints}>
                <li>No fabricated or unverified links</li>
                <li>Categorized by difficulty and discipline</li>
                <li>Connected directly to chapter concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GUIDE PREVIEW */}
      <section id="guide-preview" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Table of Contents</span>
            <h2 className={styles.sectionTitle}>The 10 Parts of Before Cybersecurity</h2>
            <p className={styles.sectionSubtitle}>
              Explore the intellectual architecture of the complete 29-chapter manuscript authored by Elijah Adeyeye.
            </p>
          </div>

          <div className={styles.partsList}>
            {PARTS.map((part) => (
              <div key={part.number} className={styles.partRow}>
                <div className={styles.partLeft}>
                  <div className={styles.partBadge}>PART 0{part.number}</div>
                  <div>
                    <div className={styles.partTitle}>{part.title}</div>
                    <div className={styles.partTheme}>{part.theme}</div>
                  </div>
                </div>
                <div className={styles.partChaptersCount}>
                  {part.chapters.length} Chapters // Exercises included
                </div>
              </div>
            ))}
          </div>

          {/* Sample Excerpt Spotlight */}
          <div className={styles.excerptBox}>
            <div className={styles.excerptHeader}>
              <span className={styles.excerptLabel}>Field Inspection // Excerpt from Chapter 3 & 18</span>
              <span style={{ fontSize: '0.8rem', color: '#71717A' }}>The Office-Pin Analogy & Statutory Cyber Law</span>
            </div>
            <div className={styles.excerptText}>
              &ldquo;An ordinary metal office pin is manufactured to hold sheets of paper together. Yet in practice, engineers frequently unbend that pin to press a recessed reset button on a router circuit board or eject a locked drive tray. <strong>Core Principle: Systems and objects do not always behave solely within the assumptions made by their designers.</strong> That is a powerful intuition for hacking—though not its formal legal definition.&rdquo;
            </div>
            <div className={styles.excerptText} style={{ borderTop: '1px solid #1F1F24', paddingTop: '1rem', color: '#A1A1AA' }}>
              &ldquo;In Nigeria, unauthorized access is penalized under the Cybercrimes (Prohibition, Prevention, etc.) Act 2015, as updated by the Cybercrimes (Amendment) Act 2024. Handling personal data is governed by the Nigeria Data Protection Act (NDPA) 2023. Golden Rule: <strong>Technical capability never creates legal permission.</strong>&rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREE ASSESSMENT INTRODUCTION */}
      <section id="assessment" className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Interactive Diagnostic</span>
            <h2 className={styles.sectionTitle}>Take the Free Orientation Assessment</h2>
            <p className={styles.sectionSubtitle}>
              14 questions. 5 minutes. Discover how you approach problems, systems, uncertainty, and learning before investing in a single course.
            </p>
          </div>

          <div className={styles.grid2} style={{ alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Discover Your Natural Cybersecurity Archetype
              </h3>
              <p style={{ color: '#A1A1AA', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                The assessment does not claim to diagnose your personality with mystical certainty. It looks at your problem-solving instincts, technical preferences, and investigative habits to highlight which areas of the NIST NICE workforce landscape naturally resonate with you.
              </p>
              <ul className={styles.cardPoints} style={{ marginBottom: '2rem' }}>
                <li>100% Free with immediate results</li>
                <li>Identifies Primary & Secondary Archetypes</li>
                <li>Provides concrete, practical next steps</li>
                <li>No credit card or setup required</li>
              </ul>
              <Link href="/before-cybersecurity/assessment" className={styles.btnPrimary}>
                Start Free Assessment Now →
              </Link>
            </div>

            <div className={styles.archetypeGrid}>
              {Object.values(ARCHETYPES).slice(0, 4).map((arch) => (
                <div key={arch.id} className={styles.archetypeCard}>
                  <div className={styles.archetypeName}>{arch.name}</div>
                  <div className={styles.archetypeTagline}>{arch.tagline}</div>
                  <div className={styles.archetypeDesc}>{arch.description.slice(0, 110)}...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. PERSONALIZED REPORT PREVIEW */}
      <section className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Diagnostic Artifact</span>
            <h2 className={styles.sectionTitle}>Your Personalized Report</h2>
            <p className={styles.sectionSubtitle}>
              Unlock an in-depth analysis tailored to your specific assessment responses.
            </p>
          </div>

          <div className={styles.card} style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #222228', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#C3151C', fontFamily: 'monospace', fontWeight: 700 }}>SAMPLE OUTPUT</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Profile: The Defender / Investigator</div>
              </div>
              <div style={{ background: 'rgba(195,21,28,0.15)', color: '#FF5A60', fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '4px', fontWeight: 600 }}>
                High Alignment: Blue Team & DFIR
              </div>
            </div>

            <p style={{ color: '#8E8E93', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your responses demonstrate strong situational vigilance and a structured, evidence-first approach to technical anomalies. You naturally prioritize understanding how an intrusion occurred and verifying that telemetry is preserved over guessing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#121215', padding: '1.25rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Key Strength</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Log & Telemetry Analysis</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Recommended Starting Role</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Junior SOC Analyst</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>First Knowledge Gap</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>TCP/UDP Transport Protocols</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. 30/60/90-DAY ROADMAP PREVIEW */}
      <section className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Structured Execution</span>
            <h2 className={styles.sectionTitle}>The 30/60/90-Day Deliverable Framework</h2>
            <p className={styles.sectionSubtitle}>
              From Chapter 28: Stop wondering what to study tomorrow. Measure your progress by tangible lab artifacts.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card} style={{ borderTop: '3px solid #3B82F6' }}>
              <div style={{ color: '#3B82F6', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                DAYS 01 – 30 // UNDERSTAND
              </div>
              <h3 className={styles.cardTitle}>Foundations & Machine</h3>
              <p className={styles.cardText}>
                Focus: Yourself, computer hardware, OS internals, networking protocols, core vocabulary, and safe lab habits.
              </p>
              <ul className={styles.cardPoints}>
                <li>Deliverable 1: Starting Skills Inventory</li>
                <li>Deliverable 2: Host RAM & Virtualization Plan</li>
                <li>Deliverable 3: 1-Page Home Network Diagram</li>
              </ul>
            </div>

            <div className={styles.card} style={{ borderTop: '3px solid #EAB308' }}>
              <div style={{ color: '#EAB308', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                DAYS 31 – 60 // EXPLORE
              </div>
              <h3 className={styles.cardTitle}>Telemetry & Defense</h3>
              <p className={styles.cardText}>
                Focus: Exposure across networking sockets, defensive log interpretation, web application architecture, cloud basics, and threat modeling.
              </p>
              <ul className={styles.cardPoints}>
                <li>Deliverable 1: Local Network Socket Audit</li>
                <li>Deliverable 2: Guided SSH/Web Log Analysis</li>
                <li>Deliverable 3: Comparison of 2 Career Paths</li>
              </ul>
            </div>

            <div className={styles.card} style={{ borderTop: '3px solid #10B981' }}>
              <div style={{ color: '#10B981', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                DAYS 61 – 90 // CHOOSE & BUILD
              </div>
              <h3 className={styles.cardTitle}>Specialization & Proof</h3>
              <p className={styles.cardText}>
                Focus: Commit to one starting direction based on what held your sustained attention. Build a verifiable portfolio project.
              </p>
              <ul className={styles.cardPoints}>
                <li>Deliverable 1: 1 Published GitHub Lab Report</li>
                <li>Deliverable 2: Documented Failure & Fix Log</li>
                <li>Deliverable 3: Next-Quarter Learning Contract</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. WHO THE PRODUCT IS FOR */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Audience Fit</span>
            <h2 className={styles.sectionTitle}>Who Before Cybersecurity Is Designed For</h2>
          </div>

          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Complete Beginners & University Students</h3>
              <p className={styles.cardText}>
                You are intrigued by technology, security, or computers, but feel overwhelmed by conflicting online advice, intimidating jargon, and endless lists of certifications.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Career Switchers from Non-Technical Fields</h3>
              <p className={styles.cardText}>
                You have a background in business, administration, law, psychology, education, or healthcare and want to know how your existing skills translate to cybersecurity roles.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>IT Support, Admins & Software Developers</h3>
              <p className={styles.cardText}>
                You already manage computers or write code, but want a strategic roadmap to pivot into security engineering, blue team defense, or application security.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Self-Learners Stalled on Tutorials</h3>
              <p className={styles.cardText}>
                You have watched dozens of YouTube tutorials and followed CTF write-ups, but struggle to understand the bigger picture or build real troubleshooting competence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. WHAT THE PRODUCT DOES NOT PROMISE */}
      <section className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.narrowContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Intellectual Honesty</span>
            <h2 className={styles.sectionTitle}>What We Do Not Promise</h2>
            <p className={styles.sectionSubtitle}>
              Real capability requires truth. We reject predatory marketing, fake scarcity, and unrealistic guarantees.
            </p>
          </div>

          <div className={styles.antiPromiseGrid}>
            <div className={styles.antiPromiseCard}>
              <div className={styles.crossIcon}>✕</div>
              <div className={styles.antiPromiseTitle}>No 90-Day Mastery Illusions</div>
              <div className={styles.antiPromiseText}>
                We will not tell you that you can become an expert or master in 3 months. Competence compounds through continuous practice over 9 to 18 months.
              </div>
            </div>

            <div className={styles.antiPromiseCard}>
              <div className={styles.crossIcon}>✕</div>
              <div className={styles.antiPromiseTitle}>No Guaranteed Employment</div>
              <div className={styles.antiPromiseText}>
                No legitimate educational institution can guarantee hiring. We teach you how to build verifiable evidence and interview competence so you can compete honestly.
              </div>
            </div>

            <div className={styles.antiPromiseCard}>
              <div className={styles.crossIcon}>✕</div>
              <div className={styles.antiPromiseTitle}>No Movie-Style Hacker Tricks</div>
              <div className={styles.antiPromiseText}>
                We do not teach unauthorized exploitation or illegal tricks. Technical capability without authorization is a crime under statutory law.
              </div>
            </div>

            <div className={styles.antiPromiseCard}>
              <div className={styles.crossIcon}>✕</div>
              <div className={styles.antiPromiseTitle}>No Fake Certifications</div>
              <div className={styles.antiPromiseText}>
                We do not sell worthless certificates of completion. We guide you toward recognized industry credentials and practical project evidence that hiring teams respect.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. CREATOR & ELITECH-HUB EXPERTISE */}
      <section className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.authorCard}>
            <div className={styles.authorAvatarPlaceholder}>EA</div>
            <div>
              <div className={styles.authorName}>Elijah Adegboyega Adeyeye</div>
              <div className={styles.authorRole}>Founder & Lead Instructor, Elitech Hub</div>
              <div className={styles.authorBio}>
                Elijah Adeyeye works at the intersection of cybersecurity education, technical systems, and human behavior. With a background in Guidance and Counselling combined with professional focus on cybersecurity, automation, and systems research, he brings an interdisciplinary perspective to understanding how people interact with technology and security controls.
              </div>
              <div className={styles.authorBio}>
                His educational work focuses on helping learners develop practical skills, think critically about digital threats, understand the legal and operational boundaries of practice, and build a lasting foundation for cybersecurity capability.
              </div>
              <div className={styles.authorLinks}>
                <Link href="/about" className={styles.authorLink}>
                  About Elitech-Hub →
                </Link>
                <Link href="/research" className={styles.authorLink}>
                  Research Repository →
                </Link>
                <Link href="/contact" className={styles.authorLink}>
                  Contact the Team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. RELEVANT EVIDENCE & STATUTORY REFERENCES */}
      <section className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Evidence-Based Foundations</span>
            <h2 className={styles.sectionTitle}>Authoritative Frameworks & Statutory Law</h2>
            <p className={styles.sectionSubtitle}>
              Before Cybersecurity is grounded in verified international standards and Nigerian cyber law.
            </p>
          </div>

          <div className={styles.grid3}>
            {BOOK_METADATA.frameworksReferenced.map((fw) => (
              <div key={fw.name} className={styles.card} style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#C3151C', fontFamily: 'monospace', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {fw.org}
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{fw.name}</div>
                <div style={{ color: '#8E8E93', fontSize: '0.85rem' }}>{fw.version}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FREQUENTLY ASKED QUESTIONS */}
      <section className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Clarity & FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className={styles.faqItem}>
                  <button className={styles.faqQuestion} onClick={() => toggleFaq(index)} aria-expanded={isOpen}>
                    <span>{faq.q}</span>
                    <span style={{ color: '#C3151C', fontSize: '1.25rem', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                      +
                    </span>
                  </button>
                  {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 16. PRICING & PURCHASE OPTIONS */}
      <section id="pricing" className={`${styles.section} ${styles.sectionDarker}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Simple Transparent Pricing</span>
            <h2 className={styles.sectionTitle}>Start Your Orientation Today</h2>
            <p className={styles.sectionSubtitle}>
              Experience the free assessment or unlock the complete system for lifetime access.
            </p>
          </div>

          <div className={styles.pricingWrapper}>
            {/* Currency selector */}
            <div className={styles.pricingCurrencySelector}>
              <span style={{ fontSize: '0.85rem', color: '#71717A', marginRight: '0.5rem' }}>Select Currency:</span>
              {(['NGN', 'USD', 'GBP', 'EUR', 'CAD'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`${styles.currencyBtn} ${selectedCurrency === curr ? styles.currencyBtnActive : ''}`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <div className={styles.pricingCardsContainer}>
              {/* Free Tier */}
              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <div className={styles.pricingTierName}>Free Assessment</div>
                  <div className={styles.pricingTierSubtitle}>Immediate baseline orientation</div>
                </div>

                <div className={styles.pricingAmount}>
                  0 <sub>Free forever</sub>
                </div>

                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> 14-Question Diagnostic Assessment
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Primary Archetype Identification
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Broad Problem Preferences
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Suggested First Next Step
                  </li>
                </ul>

                <Link href="/before-cybersecurity/assessment" className={styles.btnSecondary} style={{ width: '100%', textAlign: 'center' }}>
                  Take Free Assessment
                </Link>
                <div className={styles.providersNote}>No credit card required. Instant access.</div>
              </div>

              {/* Paid Full Tier */}
              <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
                <div className={styles.featuredBadge}>Complete System</div>

                <div className={styles.pricingHeader}>
                  <div className={styles.pricingTierName}>Full Experience</div>
                  <div className={styles.pricingTierSubtitle}>Complete Guide, Report, Roadmap & PDF</div>
                </div>

                <div className={styles.pricingAmount}>
                  {currentPrice.symbol}
                  {currentPrice.amount.toLocaleString()} <sub>One-time</sub>
                </div>

                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Complete 29-Chapter Interactive Guide
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Downloadable Standalone PDF Edition
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Full 32-Question Assessment
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Detailed Personalized Gap Analysis Report
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Interactive 30/60/90-Day Deliverable Roadmap
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Full Curated Resource Library Access
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon}>✓</span> Eligible Future Product Updates
                  </li>
                </ul>

                <Link href="/before-cybersecurity/dashboard" className={styles.btnPrimary} style={{ width: '100%', textAlign: 'center' }}>
                  Get the Full Experience
                </Link>

                <div className={styles.providersNote}>
                  Supports Paystack (NGN cards, Bank Transfer, USSD) & International card checkouts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17. FINAL CALL TO ACTION */}
      <section className={styles.section}>
        <div className={styles.narrowContainer}>
          <div className={styles.ctaBanner}>
            <h2 className={styles.ctaHeadline}>You Are Not Late. You Are At The Beginning.</h2>
            <p className={styles.ctaText}>
              Do not measure your Day 1 against someone else&apos;s Year 10. Understand what you are starting before you invest your time and tuition.
            </p>
            <div className={styles.heroActions} style={{ justifyContent: 'center' }}>
              <Link href="/before-cybersecurity/assessment" className={styles.btnPrimary}>
                Take the Free Assessment →
              </Link>
              <Link href="#pricing" className={styles.btnSecondary}>
                Unlock Full Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 18. FOOTER & TRUST LINKS */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerColTitle}>Before Cybersecurity</div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#8E8E93', marginBottom: '1rem' }}>
                An interactive orientation system authored by Elijah Adegboyega Adeyeye and published by Elitech Hub Press.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#71717A' }}>
                Lagos, Nigeria // Serving global learners
              </div>
            </div>

            <div>
              <div className={styles.footerColTitle}>Navigation</div>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/before-cybersecurity" className={styles.footerLink}>
                    Product Overview
                  </Link>
                </li>
                <li>
                  <Link href="/before-cybersecurity/assessment" className={styles.footerLink}>
                    Free Assessment
                  </Link>
                </li>
                <li>
                  <Link href="/before-cybersecurity/guide" className={styles.footerLink}>
                    Guide Index
                  </Link>
                </li>
                <li>
                  <Link href="/before-cybersecurity/dashboard" className={styles.footerLink}>
                    Student Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/before-cybersecurity/resources" className={styles.footerLink}>
                    Curated Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className={styles.footerColTitle}>Elitech Hub</div>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/about" className={styles.footerLink}>
                    About Elitech-Hub
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className={styles.footerLink}>
                    Training Programs
                  </Link>
                </li>
                <li>
                  <Link href="/research" className={styles.footerLink}>
                    Research Repository
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={styles.footerLink}>
                    Blog & Articles
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={styles.footerLink}>
                    Contact & Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className={styles.footerColTitle}>Trust & Legal</div>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/policies" className={styles.footerLink}>
                    Privacy & Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className={styles.footerLink}>
                    Security Policy
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className={styles.footerLink}>
                    Credential Verification
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={styles.footerLink}>
                    Elitech Member Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div>
              © 2026 Elijah Adeyeye / Elitech Hub. All rights reserved.
            </div>
            <div>
              Fact-checked against NIST NICE SP 800-181 Rev. 1 & Nigerian Cybercrimes Act 2024.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
