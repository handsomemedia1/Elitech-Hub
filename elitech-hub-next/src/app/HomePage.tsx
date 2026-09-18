"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import MagneticButton from "@/components/MagneticButton";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import FAQAccordion from "@/components/FAQAccordion";
import NewsletterForm from "@/components/NewsletterForm";
import SmoothScroll from "@/components/SmoothScroll";
import InitialLoader from "@/components/InitialLoader";
import CountUp from "@/components/CountUp";
import ParallaxWrapper from "@/components/ParallaxWrapper";
import ScrollRevealText from "@/components/ScrollRevealText";
import PriceDisplay from "@/components/PriceDisplay";
import Footer from "@/components/Footer";
import { getSupabaseServerClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  ShieldAlert, Terminal, Lock, ChevronRight, CheckCircle2, 
  BrainCircuit, Database, Network, Building2, Send, Zap,
  ArrowDown, Star, QrCode, Award, Flame, User, Eye, Newspaper,
  FileText, Globe, Key
} from "lucide-react";

export default function Home() {
  const [latestPost, setLatestPost] = React.useState<any>(null);
  const [cohortData, setCohortData] = React.useState({ month: 'June 8', seats: '10' });

  React.useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseServerClient();
      
      // Fetch latest blog post
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, author, thumbnail, views")
        .eq("published", true)
        .order("views", { ascending: false })
        .limit(1);

      if (posts && posts.length > 0) {
        setLatestPost(posts[0]);
      }

      // Fetch cohort settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'elitechub_cohort')
        .single();
        
      if (settings && settings.setting_value) {
        setCohortData({
          month: settings.setting_value.month || 'June 8',
          seats: settings.setting_value.seats || '10'
        });
      }
    }
    fetchData();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://elitechub.com/#organization",
        "name": "Elitech Hub",
        "url": "https://elitechub.com",
        "logo": "https://elitechub.com/images/logo.png",
        "description": "Premium cybersecurity training in Ibadan, Nigeria.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ibadan",
          "addressCountry": "NG"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://elitechub.com/#website",
        "url": "https://elitechub.com/",
        "name": "Elitech Hub",
        "description": "Nigeria's #1 AI Cybersecurity Training",
        "publisher": {
          "@id": "https://elitechub.com/#organization"
        },
        "potentialAction": [{
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://elitechub.com/blog?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }]
      }
    ]
  };

  return (
    <div className={styles.container}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── HERO STACKING WRAPPER ──────────────────────────────── */}
      <div className={styles.heroWrapper}>
        <div className={styles.heroSticky}>
            <video autoPlay loop muted playsInline className={styles.heroVideo}>
              <source src="/videos/Elite_Cyber_Defense_Commercial_Spot.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroOverlay} />
            
            <div className={styles.heroContent} style={{ paddingTop: "8rem" }}>
              <AnimateOnScroll direction="fade" delay={100}>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge}>
                <ShieldAlert size={13} /> RC: 8693883
              </span>
              <span className={styles.trustBadge}>
                <Lock size={13} /> SMEDAN Certified
              </span>
              <span className={styles.trustBadge}>
                <Star size={13} /> Nigeria&apos;s #1 Cybersecurity Bootcamp
              </span>
            </div>

            <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.2, maxWidth: '1000px', margin: '0 auto 1.5rem' }}>
              Elite Cybersecurity Training & <span className="text-gradient-primary">Enterprise Digital Solutions.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We train individuals to become highly skilled cybersecurity professionals, and we partner with businesses to build secure, AI-driven, and future-ready digital solutions worldwide.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={350}>
            <div className={styles.heroStatsRow}>
              <div className={styles.heroStatCard}>
                <div className={styles.heroStatNum}><span className="sr-only">16</span><CountUp end={16} /></div>
                <div className={styles.heroStatLabel}>Weeks</div>
              </div>
              <div className={styles.heroStatCard}>
                <div className={styles.heroStatNum}><span className="sr-only">100%</span><CountUp end={100} suffix="%" /></div>
                <div className={styles.heroStatLabel}>Internship Rate</div>
              </div>
              <div className={styles.heroStatCard}>
                <div className={styles.heroStatNum}><span className="sr-only">₦200K</span>₦<CountUp end={200} suffix="K" /></div>
                <div className={styles.heroStatLabel}>Total Cost</div>
              </div>
            </div>

            <div className={styles.heroActions}>
              <MagneticButton strength={30}>
                <Link href="#programs" className="premium-button">
                  Start Your Journey <ChevronRight size={16} />
                </Link>
              </MagneticButton>
              <Link href="/programs" className="premium-button-outline">
                View All Programs
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Scroll indicator */}
          <motion.div
            style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>
        </div>
      </div>

      {/* ─── CONTENT (SLIDES OVER HERO) ─────────────────────────── */}
      <div className={styles.sectionWrapper}>
        
        {/* ─── PROGRAMS BENTO GRID ────────────────────────────────── */}
        <section id="programs" className={styles.section}>
          <div className="glow-bg" />
          <AnimateOnScroll direction="up">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Our Programs</p>
              <h2 className={styles.sectionTitle}>Choose Your Path</h2>
            <p className={styles.sectionBody}>Three programs. One goal: Get you a cybersecurity job.</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.bentoGrid}>
          {/* 16-Week Professional — featured card */}
          <AnimateOnScroll direction="left" delay={100} className={styles.bentoPro}>
            <div style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className={styles.promoBadge} style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}>
                ⭐ RECOMMENDED
              </div>
              <h3 className={styles.bentoTitle}>16-Week Professional</h3>
              <p className={styles.bentoPrice}><PriceDisplay courseId="professional" fallback="₦200,000" /></p>
              <ul className={styles.bentoFeatures}>
                <li><CheckCircle2 size={16} className="text-accent" /> Comprehensive 16-week training</li>
                <li><CheckCircle2 size={16} className="text-accent" /> 4-Week Unpaid Internship Experience</li>
                <li><CheckCircle2 size={16} className="text-accent" /> Industry certifications prep</li>
                <li><CheckCircle2 size={16} className="text-accent" /> 1-on-1 mentorship & alumni network</li>
              </ul>
              <Link href="/programs" className="premium-button" style={{ justifyContent: 'center' }}>
                Get Started <ChevronRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>

          {/* 6-Week Bootcamp */}
          <AnimateOnScroll direction="right" delay={300} className={styles.bentoBootcamp}>
            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className={styles.bentoIconBox}>
                <Terminal size={30} />
              </div>
              <h3 className={styles.bentoTitle} style={{ fontSize: '1.6rem' }}>6-Week Bootcamp</h3>
              <p className={styles.bentoPrice}><PriceDisplay courseId="bootcamp" fallback="₦75,000" /></p>
              <ul className={styles.bentoFeatures}>
                <li><CheckCircle2 size={16} className="text-accent" /> Fast-track AI cybersecurity skills</li>
                <li><CheckCircle2 size={16} className="text-accent" /> Hands-on hacking labs</li>
                <li><CheckCircle2 size={16} className="text-accent" /> Certificate of completion</li>
              </ul>
              <Link href="/programs" className="premium-button-outline" style={{ justifyContent: 'center' }}>
                Learn More
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Corporate Training */}
          <AnimateOnScroll direction="up" delay={500} className={styles.bentoCorp}>
            <div style={{
              padding: '2.5rem',
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <div>
                <div className={styles.bentoIconBox} style={{ marginBottom: '1rem' }}>
                  <Building2 size={30} />
                </div>
                <h3 className={styles.bentoTitle}>Corporate Training</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', maxWidth: '500px' }}>
                  Custom-tailored security training for your entire team. On-site or virtual, designed around your business needs.
                </p>
              </div>
              <Link href="/services" className="premium-button-outline">
                Contact Sales <ChevronRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── R&D / FEATURES GRID ────────────────────────────────── */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Research & Development</p>
            <ScrollRevealText 
              text="Where Learning Meets Innovation" 
              className={styles.sectionTitle} 
            />
          </div>
        </AnimateOnScroll>

        <div className={styles.featureGrid}>
          {[
            { 
              icon: BrainCircuit, 
              title: 'AI Security Research', 
              desc: 'Exploring adversarial AI, prompt injection, and LLM security vulnerabilities to stay ahead of tomorrow\'s threats.',
            },
            { 
              icon: ShieldAlert, 
              title: 'PSEDS Framework', 
              desc: 'Phishing & Social Engineering Detection System — our flagship research project protecting African enterprises.',
            },
            { 
              icon: Database, 
              title: 'Threat Intelligence', 
              desc: 'Building automated threat intelligence frameworks tailored for African organizations and their unique threat landscape.',
            },
            { 
              icon: Network, 
              title: 'Network Defense', 
              desc: 'Developing next-gen intrusion detection & response playbooks grounded in real-world incident data.',
            }
          ].map((feat, i) => (
            <AnimateOnScroll key={feat.title} direction="up" delay={i * 120}>
              <div className={styles.featureCard}>
                <feat.icon size={40} className={styles.featureIcon} />
                <h4 className={styles.featureTitle}>{feat.title}</h4>
                <p className={styles.featureBody}>{feat.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Student Success Stories</p>
            <h2 className={styles.sectionTitle}>What Our Graduates Say</h2>
          </div>
        </AnimateOnScroll>
        <TestimonialsMarquee />
        <AnimateOnScroll direction="up">
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/testimonials" className="premium-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View All Testimonials & Reviews <ChevronRight size={18} />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── STUDENT WORK ───────────────────────────────────────── */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>Student Work</p>
            <h2 className={styles.sectionTitle}>Real Skills. Real Projects. <span className="text-gradient-primary">Real Results.</span></h2>
            <p className={styles.sectionBody}>
              In just 4 weeks, our students go from IT professionals to builders. Roy built a fully functioning cybersecurity dashboard with AI-powered threat detection — under live mentorship from our founder.
            </p>
          </div>
        </AnimateOnScroll>
        
        <AnimateOnScroll direction="up">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '504px' }}>
              <iframe 
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7353777252897099777" 
                height="817" 
                width="100%" 
                frameBorder="0" 
                allowFullScreen={false} 
                title="Embedded post" 
                style={{ background: 'var(--color-bg-panel)', borderRadius: '12px' }}
              ></iframe>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={200}>
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '1.5rem' }}>
              The next cohort starts {cohortData.month}. Only <strong>{cohortData.seats} seats</strong> available.
            </p>
            <Link href="/programs" className="premium-button">
              See the Full Programme
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── VERIFIABLE CERTIFICATION ──────────────────────────── */}
      <section className={styles.section} style={{ background: 'var(--color-bg-base)' }}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel} style={{ color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>[AUTH] VERIFIABLE CREDENTIALS</p>
            <h2 className={styles.sectionTitle}>Prove Your Skills with <span className="text-gradient-primary">Terminal-Grade</span> Certification</h2>
            <p className={styles.sectionBody}>
              Upon completion of our professional programs, you earn a unique, cryptographically-verifiable certificate. Scan the QR code or use the unique ID to instantly prove your credentials to employers globally.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
            {/* Certificate Image Mockup */}
            <div className="glass-panel" style={{ padding: '10px', display: 'inline-block', maxWidth: '100%' }}>
              <img 
                src="/images/certificate-placeholder.png" 
                alt="Elitech Hub Certificate of Learning" 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  height: 'auto', 
                  borderRadius: '4px', 
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }} 
              />
            </div>
          </div>
        </AnimateOnScroll>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <AnimateOnScroll direction="up" delay={100}>
            <div style={{ textAlign: 'center' }}>
              <QrCode size={40} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>QR Verification</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Instant scan-to-verify for recruiters.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={200}>
            <div style={{ textAlign: 'center' }}>
              <Key size={40} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Unique ID</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Immutable tracking of your achievement.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={300}>
            <div style={{ textAlign: 'center' }}>
              <Globe size={40} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>LinkedIn Ready</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>1-click add to your LinkedIn profile.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── MOST READ ARTICLE ──────────────────────────────────── */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader} style={{ textAlign: 'left', margin: '0 auto 2rem', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(195,21,28,0.1)', border: '1px solid rgba(195,21,28,0.2)', padding: '0.4rem 1rem', borderRadius: '2rem', marginBottom: '0.75rem' }}>
                <Flame size={14} color="var(--color-primary)" />
                <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>This Week</span>
              </div>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>🔥 Most Read Article</h2>
            </div>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              View All Articles <ChevronRight size={16} />
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <div className="glass-panel" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0', overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '2.5rem' }}>
              <span style={{ display: 'inline-block', padding: '0.3rem 0.85rem', background: 'rgba(195,21,28,0.1)', color: 'var(--color-primary)', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                {latestPost?.category || 'THREAT INTEL'}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>
                {latestPost?.title || 'Understanding the Rise of AI-Powered Phishing Attacks in African Enterprises'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {latestPost?.excerpt || 'Discover how malicious actors are leveraging large language models to craft hyper-personalized social engineering campaigns, and what organizations can do to detect and prevent them.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--color-primary)" /> {latestPost?.author || 'Elijah Adeyeye'}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={14} color="var(--color-primary)" /> {latestPost?.views || 4205} reads
                </span>
                <Link href={`/blog/${latestPost?.slug || ''}`} className="premium-button" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                  Read Article <ChevronRight size={14} />
                </Link>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--color-bg-base), var(--color-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px', position: 'relative', overflow: 'hidden' }}>
              {latestPost?.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={latestPost.thumbnail} alt={latestPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              ) : (
                <Newspaper size={80} color="rgba(255,255,255,0.2)" />
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── COMMUNITY / TELEGRAM BANNER ────────────────────────── */}
      <section className={styles.section} style={{ background: 'linear-gradient(135deg, var(--color-bg-main) 0%, #0e1e38 40%, var(--color-bg-main) 100%)' }}>
        <AnimateOnScroll direction="up">
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.5rem 1.25rem', borderRadius: '2rem' }}>
                <Send size={14} color="#38bdf8" />
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Free Community</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <h2 className={styles.sectionTitle} style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                  Don't Just Learn Cybersecurity — <span className="text-gradient-secondary">Live It Daily</span>
                </h2>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                  Our <strong>Cyber Pulse Telegram channel</strong> delivers the cybersecurity intelligence that most people pay for — for <strong style={{ color: '#38bdf8' }}>absolutely free</strong>. Wake up every morning to breaking threat alerts, trending CVE breakdowns, scholarships, and stories that make complex security topics actually fun to read.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    <Zap size={16} color="#f59e0b" style={{ marginTop: '4px' }} />
                    <span><strong style={{ color: 'white' }}>Daily threat intel & CVE alerts</strong> — know what's happening before your colleagues do</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    <Award size={16} color="#10b981" style={{ marginTop: '4px' }} />
                    <span><strong style={{ color: 'white' }}>Scholarship & job opportunities</strong> — exclusive posts you won't find anywhere else</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                    <FileText size={16} color="#a855f7" style={{ marginTop: '4px' }} />
                    <span><strong style={{ color: 'white' }}>Beginner-friendly cyber stories</strong> — learn hacking concepts without the jargon</span>
                  </li>
                </ul>

                <a href="https://t.me/Elitechub" target="_blank" rel="noopener noreferrer" className="premium-button" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                  <Send size={16} /> Join Cyber Pulse — It's Free
                </a>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                  <Lock size={12} style={{ marginRight: '0.25rem', display: 'inline' }} /> No spam. Pure cybersecurity value. Leave anytime.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Send size={24} color="white" />
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '1.15rem' }}>Cyber Pulse</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>by Elitech Hub</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1rem', borderLeft: '3px solid #38bdf8' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                      "🔴 BREAKING: Critical RCE vulnerability discovered in widely-used enterprise VPN software. CVSS 9.8. Patch immediately..."
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    <span><Newspaper size={14} color="#38bdf8" style={{ marginRight: '0.3rem', display: 'inline' }} /> Daily Posts</span>
                    <span><User size={14} color="#38bdf8" style={{ marginRight: '0.3rem', display: 'inline' }} /> Growing Community</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>24/7</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Threat Alerts</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>100%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Free Access</div>
                  </div>
                  <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>Daily</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Fresh Content</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <AnimateOnScroll direction="up">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>FAQ</p>
            <h2 className={styles.sectionTitle}>Common Questions</h2>
            <p className={styles.sectionBody}>Everything you need to know before applying.</p>
          </div>
          <FAQAccordion />
        </AnimateOnScroll>
      </section>
      </div>

      {/* ====== FOOTER ====== */}
      <Footer />
    </div>
  );
}

