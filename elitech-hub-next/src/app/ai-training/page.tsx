import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './ai-training.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { 
  Zap, Calendar, Clock, Laptop, Flame, ArrowRight,
  Briefcase, Bot, Award, GraduationCap, Code2, Shield,
  ChevronRight, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Powered Cybersecurity Training Nigeria | 6-Week Online Bootcamp | Elitech Hub',
  description:
    'Learn AI-powered cybersecurity in 6 weeks with Elitech Hub. Covers PowerShell, Python, Ubuntu, and AI Security Systems. 100% virtual, $100 USD, starts June 2026. Join from anywhere in Nigeria.',
  keywords: [
    'AI cybersecurity training Nigeria',
    'AI powered cybersecurity course',
    'cybersecurity AI Nigeria 2026',
    'PowerShell Python security course Nigeria',
    'AI security training online Nigeria',
    'cyber AI bootcamp Nigeria',
    'AI security course Lagos',
    'machine learning cybersecurity Nigeria',
    'automated threat detection course Nigeria',
  ],
  openGraph: {
    title: 'AI Powered Cybersecurity Training | 6 Weeks | $100 USD | Elitech Hub Nigeria',
    description: 'The only AI-integrated cybersecurity bootcamp in Nigeria. PowerShell, Python, Ubuntu, AI Security Systems. Virtual. Starts June 2026.',
    url: 'https://elitechub.com/ai-training',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AI Cybersecurity Bootcamp Nigeria — $100 | Elitech Hub', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/ai-training' },
};


export default function AITrainingPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <AnimateOnScroll>
            <div className={styles.badge}>
              <Zap size={14} /> NEXT GENERATION BOOTCAMP
            </div>
            <h1 className={styles.heroTitle}>
              Learn <span className={styles.highlightCyan}>AI Powered</span><br />
              <span className={styles.highlightRed}>Cybersecurity</span>
            </h1>
            <p className={styles.heroDesc}>
              Master the future of defensive and offensive security. Go from zero to deploying autonomous AI security systems in 6 weeks. Gain unpaid internship experience upon completion.
            </p>
            
            <div className={styles.heroMeta}>
              <span><Calendar size={18} /> Starts June 8th, 2026</span>
              <span><Clock size={18} /> 6 Weeks (Virtual)</span>
              <span><Laptop size={18} /> Beginner Friendly</span>
            </div>

            <div className={styles.scarcityBlock}>
              <div className={styles.scarcityTitle}>
                <Flame size={20} /> Next Cohort is filling fast
              </div>
              <p className={styles.scarcityText}>Only 15 spots remaining for personalized mentorship.</p>
            </div>

            <div className={styles.actionButtons}>
              <Link href="/apply" className={`${styles.ctaBtn} ${styles.pulse}`}>
                Apply For Cohort <ArrowRight size={20} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Trust Bar */}
      <AnimateOnScroll>
        <section className={styles.trustBar}>
          <div className={styles.container}>
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Briefcase size={24} />
                </div>
                <div>
                  <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Internship Experience</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Real-world experience post-graduation</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Bot size={24} />
                </div>
                <div>
                  <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Build Custom AI Agents</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Automate your security workflow</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconWrapper}>
                  <Award size={24} />
                </div>
                <div>
                  <strong style={{ color: 'white', display: 'block', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Verified Certificate</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Blockchain-verified credentials</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Who is this for */}
      <AnimateOnScroll>
        <section className={layoutStyles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Is This Bootcamp For You?</h2>
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIconWrapper} style={{ background: 'rgba(34, 211, 238, 0.1)' }}>
                  <GraduationCap size={32} color="#22d3ee" />
                </div>
                <h4>Absolute Beginners</h4>
                <p>No prior coding or IT experience required. We start from the absolute basics and build up your confidence.</p>
              </div>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIconWrapper} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <Code2 size={32} color="#ef4444" />
                </div>
                <h4>IT Professionals</h4>
                <p>Upgrade your existing skills to include cutting-edge AI automation, advanced scripting, and modern security engineering.</p>
              </div>
              <div className={styles.audienceCard}>
                <div className={styles.audienceIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <Shield size={32} color="#10b981" />
                </div>
                <h4>Career Switchers</h4>
                <p>Fast-track your entry into one of the highest-paying, fastest-growing tech sectors with our hands-on internship experience.</p>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Curriculum Summary */}
      <AnimateOnScroll>
        <section className={layoutStyles.section} style={{ background: '#020408' }}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You Will Learn</h2>
            <div className={styles.curriculumGrid}>
              <div className={styles.currPhase}>
                <div className={styles.phaseHeader}>Weeks 1-2: Foundations</div>
                <ul className={styles.currList}>
                  <li><ChevronRight size={18} /> Linux / Ubuntu CLI Mastery</li>
                  <li><ChevronRight size={18} /> PowerShell Administration</li>
                  <li><ChevronRight size={18} /> Advanced Networking Basics</li>
                  <li><ChevronRight size={18} /> Systems Architecture</li>
                </ul>
              </div>
              <div className={styles.currPhase}>
                <div className={styles.phaseHeader}>Weeks 3-4: Automation</div>
                <ul className={styles.currList}>
                  <li><ChevronRight size={18} /> Python for Security</li>
                  <li><ChevronRight size={18} /> Scripting & API Integration</li>
                  <li><ChevronRight size={18} /> Data Parsing & Log Analysis</li>
                  <li><ChevronRight size={18} /> Automating Routine Tasks</li>
                </ul>
              </div>
              <div className={styles.currPhase}>
                <div className={styles.phaseHeader}>Weeks 5-6: AI Security</div>
                <ul className={styles.currList}>
                  <li><ChevronRight size={18} /> Prompt Engineering for SecOps</li>
                  <li><ChevronRight size={18} /> Building Agentic Scanners</li>
                  <li><ChevronRight size={18} /> AI-Driven Threat Hunting</li>
                  <li><ChevronRight size={18} /> Final Capstone Project</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Pricing */}
      <AnimateOnScroll>
        <section className={layoutStyles.section}>
          <div className={styles.container}>
            <div className={styles.pricingBox}>
              <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>Full Program Access</h3>
              <div className={styles.priceTag}>$100</div>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>One-time payment (Approx. ₦120,000 NGN)</p>
              
              <ul className={styles.checklist}>
                <li><CheckCircle2 size={22} /> Live Weekend Classes</li>
                <li><CheckCircle2 size={22} /> 1-on-1 Dedicated Mentorship</li>
                <li><CheckCircle2 size={22} /> Hands-on Practical Lab Assignments</li>
                <li><CheckCircle2 size={22} /> Unpaid Internship Experience</li>
                <li><CheckCircle2 size={22} /> Resume Building & Interview Prep</li>
              </ul>
              
              <Link href="/apply" className={`${styles.ctaBtn} ${styles.pulse}`} style={{ width: '100%', justifyContent: 'center' }}>
                Secure Your Spot Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

    </PageLayout>
  );
}
