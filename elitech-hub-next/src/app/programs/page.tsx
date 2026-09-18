import React from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import styles from './programs.module.css';
import layoutStyles from '@/components/PageLayout.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import PriceDisplay from '@/components/PriceDisplay';
import { 
  GraduationCap, ShieldCheck, Briefcase, Zap, Crown, Building2, 
  ArrowRight, ShieldAlert, CheckCircle2, ChevronDown, Terminal,
  Network, Search, Server, FileSearch, Flag, Target, Award,
  Database, Code, Brain, ChevronRight, Sparkles, Calendar,
  Globe, Clock, Users, Shield, BookOpen, UserPlus, Check, Send
} from 'lucide-react';
import CountUp from '@/components/CountUp';

export const metadata = {
  title: 'Best Cybersecurity Bootcamp in Nigeria | 100% Job Guarantee | Elitech Hub',
  description:
    'Industry-Focused Training in Cybersecurity, Artificial Intelligence, Data Science and Emerging Technologies.',
  keywords: [
    // LOCAL (high-intent, low competition)
    'cybersecurity training in Lagos',
    'cybersecurity course in Nigeria',
    'ethical hacking course Lagos',
    'learn cybersecurity in Lagos',
    'cybersecurity training Ibadan',
    'cybersecurity course Ibadan',
    'ethical hacking Oyo State',
    'cybersecurity bootcamp Nigeria',
    'cybersecurity school Nigeria',
    'IT security training Nigeria',
    'online cybersecurity Nigeria',
    // PROGRAM-SPECIFIC
    'AI cybersecurity course',
    'CompTIA Security+ training Nigeria',
    'CEH training Lagos',
    'OSCP prep Nigeria',
    '6 week cybersecurity bootcamp',
    '16 week cybersecurity program',
    // INTENT-BASED
    'cybersecurity jobs Nigeria',
    'how to learn cybersecurity in Nigeria',
    'cybersecurity internship Nigeria',
    'guaranteed cybersecurity internship',
    'cybersecurity career Nigeria',
    'cybersecurity for beginners Nigeria',
    // LLM-TARGETED (how people ask AI assistants)
    'best cybersecurity school in Nigeria',
    'how to become a hacker in Nigeria',
    'how to get into cybersecurity in Nigeria',
    'cybersecurity certification Nigeria cost',
  ],
  openGraph: {
    title: 'Best Cybersecurity Bootcamp in Nigeria | Internship Experience',
    description:
      'Join Nigeria\'s most brutal and effective cybersecurity bootcamp. Live attack simulations, real tools, AI-powered security curriculum. No experience required.',
    url: 'https://elitechub.com/programs',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [
      {
        url: 'https://elitechub.com/images/programs-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Elitech Hub Cybersecurity Programs in Nigeria',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Cybersecurity Bootcamp in Nigeria — Gain Experience',
    description:
      'The premier cybersecurity bootcamp in Nigeria with practical internship experience. Enroll today.',
    images: ['https://elitechub.com/images/programs-og.jpg'],
  },
  alternates: {
    canonical: 'https://elitechub.com/programs',
  },
};


export default function ProgramsPage() {
  const jsonLd = [
    // ——— COURSE 1: AI 6-Week with pricing ———
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://elitechub.com/programs#ai6week',
      name: 'Learn AI Powered Cybersecurity in 6 Weeks',
      description:
        'Master AI security systems, Python scripting, PowerShell, and Ubuntu in this intensive 6-week live virtual bootcamp in Nigeria.',
      url: 'https://elitechub.com/programs',
      image: 'https://elitechub.com/images/programs-og.jpg',
      inLanguage: 'en',
      availableLanguage: ['English'],
      provider: {
        '@type': 'Organization',
        '@id': 'https://elitechub.com/#organization',
        name: 'Elitech Hub',
        sameAs: 'https://elitechub.com',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'PT15H',
        startDate: '2026-06-08',
        location: { '@type': 'VirtualLocation', url: 'https://elitechub.com' },
      },
      offers: {
        '@type': 'Offer',
        price: '100',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://elitechub.com/apply?program=ai6week',
      },
    },
    // ——— COURSE 2: 6-Week Bootcamp with pricing ———
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://elitechub.com/programs#bootcamp6',
      name: '6-Week Intensive Cybersecurity Bootcamp',
      description:
        'Fast-track cybersecurity bootcamp in Nigeria covering ethical hacking, network security, and defense fundamentals. Weekend classes, hands-on labs.',
      url: 'https://elitechub.com/programs',
      image: 'https://elitechub.com/images/programs-og.jpg',
      inLanguage: 'en',
      provider: {
        '@type': 'Organization',
        '@id': 'https://elitechub.com/#organization',
        name: 'Elitech Hub',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        location: { '@type': 'VirtualLocation', url: 'https://elitechub.com' },
      },
      offers: {
        '@type': 'Offer',
        price: '75000',
        priceCurrency: 'NGN',
        eligibleRegion: {
          '@type': 'Country',
          name: 'NG',
        },
        availability: 'https://schema.org/InStock',
        url: 'https://elitechub.com/apply?program=bootcamp6',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '87',
        bestRating: '5',
      },
    },
    // ——— COURSE 3: 16-Week Program with pricing ———
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://elitechub.com/programs#prof16',
      name: '16-Week Professional Cybersecurity Program',
      description:
        'Nigeria\'s most comprehensive cybersecurity career program with unpaid internship experience, 1-on-1 mentorship, CompTIA Security+, CEH, and OSCP preparation.',
      url: 'https://elitechub.com/programs',
      image: 'https://elitechub.com/images/programs-og.jpg',
      inLanguage: 'en',
      provider: {
        '@type': 'Organization',
        '@id': 'https://elitechub.com/#organization',
        name: 'Elitech Hub',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        location: { '@type': 'VirtualLocation', url: 'https://elitechub.com' },
      },
      offers: {
        '@type': 'Offer',
        price: '200000',
        priceCurrency: 'NGN',
        eligibleRegion: {
          '@type': 'Country',
          name: 'NG',
        },
        availability: 'https://schema.org/InStock',
        url: 'https://elitechub.com/apply?program=prof16',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '43',
        bestRating: '5',
      },
    },
    // ——— FAQ PAGE (shows in Google's People Also Ask) ———
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need prior IT experience to enroll at Elitech Hub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No prior IT experience is required. Elitech Hub\'s programs are designed for complete beginners. We start with the fundamentals and build progressively to advanced skills.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the internship experience work at Elitech Hub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Upon successful completion of the 16-week program, Elitech Hub provides students with practical, hands-on internship experience. This program is designed to build the necessary portfolio and skills for career entry.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does the Elitech Hub cybersecurity course cost in Nigeria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 6-week bootcamp is ₦75,000 (one-time). The 16-week professional program is ₦200,000 with flexible payment plans available. The AI Cybersecurity course is $100 USD.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Elitech Hub cybersecurity training online or in-person?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'All Elitech Hub classes are fully virtual and live on Zoom with real-time labs, not pre-recorded videos. Students from anywhere in Nigeria and the world can join.',
          },
        },
        {
          '@type': 'Question',
          name: 'What certifications will I be prepared for at Elitech Hub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Elitech Hub prepares students for CompTIA Security+, Certified Ethical Hacker (CEH), and OSCP (Offensive Security Certified Professional).',
          },
        },
      ],
    },
    // ——— BREADCRUMB (improves click-through in search results) ———
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://elitechub.com/programs' },
      ],
    },
  ];

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Hero */}
      <section className={layoutStyles.pageHero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={200}>
          <div className={styles.badge}><GraduationCap size={16} /> TRAINING PROGRAMS</div>
          <h1 className={layoutStyles.pageHeroTitle}>
            Choose Your <span className="text-gradient-primary">Career Path</span>
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Two programs. One goal: Get you a cybersecurity job.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#10b981' }}><ShieldCheck size={28} /></div>
              <div className={styles.statText}>
                <div className={styles.statNumber}><span className="sr-only">100%</span><CountUp end={100} suffix="%" /></div>
                <div className={styles.statLabel}>Internship Experience</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#3b82f6' }}><Briefcase size={28} /></div>
              <div className={styles.statText}>
                <div className={styles.statNumber}><span className="sr-only">100%</span><CountUp end={100} suffix="%" /></div>
                <div className={styles.statLabel}>Hands-on Labs</div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <div className={styles.programsContainer}>
        {/* === PROGRAM HUB CARDS — links to dedicated sub-pages === */}
        <section className={layoutStyles.section}>
          <AnimateOnScroll direction="fade">
            <div className={styles.hubIntro}>
              <p className={styles.hubLabel}>CHOOSE YOUR PROGRAM</p>
              <h2 className={styles.hubTitle}>Each program has its own dedicated page with full curriculum, pricing, and FAQs.</h2>
            </div>
          </AnimateOnScroll>
          <div className={styles.hubGrid}>
            <AnimateOnScroll direction="left" delay={100}>
              <Link href="/programs/cybersecurity-bootcamp" className={styles.hubCard}>
                <div className={styles.hubCardIcon} style={{ background: 'linear-gradient(135deg, #ff2a55, #991b1b)' }}><Zap size={28} /></div>
                <div className={styles.hubCardBadge}>FAST-TRACK</div>
                <h3>6-Week Cybersecurity Bootcamp</h3>
                <p>Weekend classes · No experience needed · <PriceDisplay courseId="bootcamp" fallback="₦75,000" /></p>
                <ul className={styles.hubCardFeatures}>
                  <li><CheckCircle2 size={14} color="#ff2a55" /> Hands-on hacking labs</li>
                  <li><CheckCircle2 size={14} color="#ff2a55" /> Industry project</li>
                  <li><CheckCircle2 size={14} color="#ff2a55" /> Certificate of completion</li>
                </ul>
                <span className={styles.hubCardCta}>View Bootcamp <ChevronRight size={16} /></span>
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={200}>
              <Link href="/programs/professional" className={`${styles.hubCard} ${styles.hubCardFeatured}`}>
                <div className={styles.hubCardMostPopular}>MOST POPULAR</div>
                <div className={styles.hubCardIcon} style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}><Crown size={28} /></div>
                <div className={styles.hubCardBadge} style={{ background: '#3b82f6' }}>RECOMMENDED</div>
                <h3>16-Week Professional Program</h3>
                <p>3× per week · Internship Experience · <PriceDisplay courseId="professional" fallback="₦200,000" /></p>
                <ul className={styles.hubCardFeatures}>
                  <li><CheckCircle2 size={14} color="#a855f7" /> 1-on-1 mentorship</li>
                  <li><CheckCircle2 size={14} color="#a855f7" /> CompTIA, CEH, OSCP prep</li>
                  <li><CheckCircle2 size={14} color="#a855f7" /> Practical internship experience</li>
                </ul>
                <span className={styles.hubCardCta}>View Full Program <ChevronRight size={16} /></span>
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll direction="right" delay={300}>
              <Link href="/programs/corporate-training" className={styles.hubCard}>
                <div className={styles.hubCardIcon} style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)' }}><Building2 size={28} /></div>
                <div className={styles.hubCardBadge}>FOR TEAMS</div>
                <h3>Corporate Training</h3>
                <p>On-site or remote · Custom curriculum · Get a quote</p>
                <ul className={styles.hubCardFeatures}>
                  <li><CheckCircle2 size={14} color="#06b6d4" /> Security awareness</li>
                  <li><CheckCircle2 size={14} color="#06b6d4" /> NDPR compliance training</li>
                  <li><CheckCircle2 size={14} color="#06b6d4" /> Custom delivery formats</li>
                </ul>
                <span className={styles.hubCardCta}>View Corporate Training <ChevronRight size={16} /></span>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>


        {/* Pricing/Program Cards */}
        <section className={layoutStyles.section}>
          <div className={styles.pricingContainer}>
            {/* 6-Week Bootcamp */}
            <AnimateOnScroll direction="left" delay={100}>
              <div className={styles.pricingCard}>
                <div className={styles.pricingIcon} style={{ color: '#06B6D4' }}><Zap size={32} /></div>
                <div className={styles.pricingHeader}>
                  <h3>6-Week Bootcamp</h3>
                  <p className={styles.pricingSubtitle}>Fast-Track Skills</p>
                </div>
                <div className={styles.pricingPrice}>
                  <PriceDisplay courseId="bootcamp" fallback="₦75,000" />
                </div>
                <span className={styles.pricingPeriod}>one-time payment</span>
                <ul className={styles.pricingFeatures}>
                  <li><CheckCircle2 size={18} color="#06B6D4" /> 6 weeks intensive training</li>
                  <li><CheckCircle2 size={18} color="#06B6D4" /> Weekend classes</li>
                  <li><CheckCircle2 size={18} color="#06B6D4" /> Hands-on labs</li>
                  <li><CheckCircle2 size={18} color="#06B6D4" /> Industry project</li>
                  <li><CheckCircle2 size={18} color="#06B6D4" /> Certificate of completion</li>
                </ul>
                <Link href="/apply?program=6week" className="premium-button-outline w-full" style={{ justifyContent: 'center' }}>Learn More</Link>
              </div>
            </AnimateOnScroll>

            {/* 16-Week Professional */}
            <AnimateOnScroll direction="up" delay={200}>
              <div className={`${styles.pricingCard} ${styles.featured}`}>
                <div className={styles.pricingBadge}>MOST POPULAR</div>
                <div className={styles.pricingIcon} style={{ color: '#ef4444' }}><Crown size={32} /></div>
                <div className={styles.pricingHeader}>
                  <h3>16-Week Professional</h3>
                  <p className={styles.pricingSubtitle}>Complete Career Transformation</p>
                </div>
                <div className={styles.pricingPrice}>
                  <PriceDisplay courseId="professional" fallback="₦200,000" />
                </div>
                <span className={styles.pricingPeriod}>flexible payments available</span>
                <ul className={styles.pricingFeatures}>
                  <li><CheckCircle2 size={18} color="#ef4444" /> Comprehensive 16-week program</li>
                  <li><Award size={18} color="#ef4444" /> <strong>Unpaid internship experience</strong></li>
                  <li><CheckCircle2 size={18} color="#ef4444" /> Industry certifications</li>
                  <li><CheckCircle2 size={18} color="#ef4444" /> 1-on-1 mentorship</li>
                  <li><CheckCircle2 size={18} color="#ef4444" /> Portfolio building</li>
                  <li><CheckCircle2 size={18} color="#ef4444" /> Alumni network access</li>
                </ul>
                <Link href="/apply?program=16week" className="premium-button w-full" style={{ justifyContent: 'center' }}>Get Started</Link>
              </div>
            </AnimateOnScroll>

            {/* Corporate Training */}
            <AnimateOnScroll direction="right" delay={300}>
              <div className={`${styles.pricingCard} ${styles.corporate}`}>
                <div className={styles.pricingIcon} style={{ color: '#10B981' }}><Building2 size={32} /></div>
                <div className={styles.pricingHeader}>
                  <h3>Corporate Training</h3>
                  <p className={styles.pricingSubtitle}>Team Development</p>
                </div>
                <div className={styles.pricingPrice}>
                  <span className={styles.pricingAmountCustom}>Custom</span>
                </div>
                <span className={styles.pricingPeriod}>tailored to your needs</span>
                <ul className={styles.pricingFeatures}>
                  <li><CheckCircle2 size={18} color="#10B981" /> Customized curriculum</li>
                  <li><CheckCircle2 size={18} color="#10B981" /> On-site or virtual</li>
                  <li><CheckCircle2 size={18} color="#10B981" /> Team-based projects</li>
                  <li><CheckCircle2 size={18} color="#10B981" /> Executive briefings</li>
                  <li><CheckCircle2 size={18} color="#10B981" /> Ongoing support</li>
                </ul>
                <Link href="/contact" className="premium-button-outline w-full" style={{ justifyContent: 'center' }}>Contact Sales</Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 6-Week Bootcamp Deep Dive */}
        <section className={layoutStyles.section} style={{ padding: '0 5%' }}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Comprehensive Program Breakdown</h2>
          </AnimateOnScroll>
          
          <div className={styles.deepDiveCard}>
            <AnimateOnScroll direction="up">
              <h3 className={styles.deepDiveTitle}>
                <Zap className={styles.iconRed} size={32} /> 6-Week Intensive Bootcamp
              </h3>
              <p className={styles.deepDiveDesc}>
                Our accelerated bootcamp is designed for professionals looking to quickly acquire fundamental cybersecurity skills. Perfect for career switchers, IT professionals expanding their expertise, or beginners wanting a solid foundation in cybersecurity.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up">
              <h4 className={styles.subTitle}>Week-by-Week Curriculum</h4>
              <div className={styles.curriculumGrid}>
                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberRed}>1</div>
                    <h5>Introduction to Cybersecurity</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>Cybersecurity fundamentals and threat landscape</li>
                    <li>CIA Triad: Confidentiality, Integrity, Availability</li>
                    <li>Types of cyber threats and attack vectors</li>
                    <li>Security policies and compliance frameworks</li>
                    <li>Hands-on: Setting up a home security lab</li>
                  </ul>
                </div>

                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberBlue}>2</div>
                    <h5>Network Security Essentials</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>TCP/IP protocol suite and network architecture</li>
                    <li>Firewalls, IDS/IPS, and VPNs</li>
                    <li>Network scanning and reconnaissance with Nmap</li>
                    <li>Wireless security and common Wi-Fi attacks</li>
                    <li>Hands-on: Network traffic analysis with Wireshark</li>
                  </ul>
                </div>

                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberGreen}>3</div>
                    <h5>Vulnerability Assessment & Pen Testing</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>Vulnerability scanning with Nessus and OpenVAS</li>
                    <li>Introduction to Kali Linux and penetration testing tools</li>
                    <li>OWASP Top 10 vulnerabilities and exploitation</li>
                    <li>SQL injection, XSS, and CSRF attacks</li>
                    <li>Hands-on: Penetration testing on vulnerable systems</li>
                  </ul>
                </div>

                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberBlue}>4</div>
                    <h5>System Security & Hardening</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>Operating system security (Windows, Linux, macOS)</li>
                    <li>Access control, authentication, and authorization</li>
                    <li>System hardening techniques and best practices</li>
                    <li>Malware analysis fundamentals</li>
                    <li>Hands-on: Hardening a Linux server and Windows workstation</li>
                  </ul>
                </div>

                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberGreen}>5</div>
                    <h5>Incident Response & Digital Forensics</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>Incident response lifecycle and procedures</li>
                    <li>Digital forensics fundamentals and evidence handling</li>
                    <li>Log analysis and SIEM tools (Splunk basics)</li>
                    <li>Security monitoring and threat detection</li>
                    <li>Hands-on: Investigating a simulated security breach</li>
                  </ul>
                </div>

                <div className={styles.weekCard}>
                  <div className={styles.weekHeader}>
                    <div className={styles.weekNumberRed}>6</div>
                    <h5>Capstone Project & Career Prep</h5>
                  </div>
                  <ul className={styles.weekList}>
                    <li>Final capstone project: Complete security assessment</li>
                    <li>Professional security reporting and documentation</li>
                    <li>Resume building and interview preparation</li>
                    <li>Cybersecurity career paths and certifications roadmap</li>
                    <li>Project presentation and peer review</li>
                  </ul>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={200}>
              <h4 className={styles.subTitle}>Tools & Technologies You'll Master</h4>
              <div className={styles.toolsGrid}>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><Terminal size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Kali Linux & Command Line</span>
                </div>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><Network size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Nmap & Wireshark</span>
                </div>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><Target size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Metasploit Framework</span>
                </div>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><ShieldAlert size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Burp Suite & OWASP ZAP</span>
                </div>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><Search size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Nessus & OpenVAS</span>
                </div>
                <div className={styles.toolItem}>
                  <div className={styles.toolIcon}><Server size={20} color="#39ff14" /></div>
                  <span className={styles.toolName}>Splunk & Log Analysis</span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 16-Week Professional Program */}
        <section className={layoutStyles.section} style={{ padding: '0 5%' }}>
          <AnimateOnScroll direction="up">
            <div className={styles.masterclassHero}>
              <div className={styles.flagshipBadge}><Crown size={16} /> FLAGSHIP PROGRAM</div>
              <h3 className={styles.masterclassTitle}>16-Week Professional Cybersecurity Program</h3>
              <p className={styles.masterclassDesc}>
                Our flagship comprehensive program transforms complete beginners into job-ready cybersecurity professionals. With an <strong className={styles.textGreen}>unpaid internship experience</strong> and <strong className={styles.textGreen}>intensive hands-on labs</strong>, this program includes everything from foundational concepts to advanced penetration testing.
              </p>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <div className={styles.statBoxNumBlue}>16</div>
                  <div className={styles.statBoxLabel}>Weeks</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxNumGreen}>100%</div>
                  <div className={styles.statBoxLabel}>Internship</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxNumRed}>100%</div>
                  <div className={styles.statBoxLabel}>Experience</div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <div className={styles.phasesContainer}>
            {/* Phase 1 */}
            <AnimateOnScroll direction="up">
              <div className={styles.phaseRow}>
                <div className={styles.phaseIndicator}>
                  <div className={styles.phaseCircleGreen}>
                    <div className={styles.phaseNum}>1</div>
                    <div className={styles.phaseText}>Phase</div>
                  </div>
                  <div className={styles.phaseLineGreen}></div>
                </div>
                <div className={styles.phaseContent}>
                  <div className={styles.phaseHeaderGreen}>
                    <div>
                      <div className={styles.phaseWeeks}>Weeks 1-4</div>
                      <h5 className={styles.phaseTitle}>Foundations</h5>
                      <p className={styles.phaseSubtitle}>Network Security, Linux, Python basics</p>
                    </div>
                  </div>
                  <div className={styles.phaseBody}>
                    <div className={styles.phaseGrid}>
                      <div className={styles.phaseCard}>
                        <h6>PowerShell Live Forensics</h6>
                        <p>Process analysis, logs, and memory</p>
                        <ul>
                          <li><Terminal size={14} color="#6ee7b7" /> <span><strong>Process Analysis:</strong> Build suspicious process scanner</span></li>
                          <li><FileSearch size={14} color="#6ee7b7" /> <span><strong>Event Log Triage:</strong> Create breach timeline generator</span></li>
                          <li><Database size={14} color="#6ee7b7" /> <span><strong>Memory Forensics:</strong> Develop memory scraper</span></li>
                        </ul>
                      </div>
                      <div className={styles.phaseCard}>
                        <h6>Disk & Network Forensics</h6>
                        <p>NTFS, Packets, and Automated Triage</p>
                        <ul>
                          <li><Database size={14} color="#6ee7b7" /> <span><strong>Disk Forensics:</strong> Build $MFT analyzer</span></li>
                          <li><Network size={14} color="#6ee7b7" /> <span><strong>Network Forensics:</strong> Create beaconing detection</span></li>
                          <li><Zap size={14} color="#6ee7b7" /> <span><strong>Automated Triage:</strong> KAPE integration</span></li>
                        </ul>
                      </div>
                      <div className={styles.phaseCard}>
                        <h6>Python Security Essentials</h6>
                        <p>Scapy, Yara, and Forensic Automation</p>
                        <ul>
                          <li><Code size={14} color="#6ee7b7" /> <span><strong>Python Basics:</strong> Custom network scanner with Scapy</span></li>
                          <li><ShieldCheck size={14} color="#6ee7b7" /> <span><strong>Defensive Automation:</strong> Ransomware detection</span></li>
                          <li><Zap size={14} color="#6ee7b7" /> <span><strong>Forensic Automation:</strong> Auto-timeline generator</span></li>
                        </ul>
                      </div>
                      <div className={styles.phaseCard}>
                        <h6>AI Threat Detection</h6>
                        <p>Machine Learning for Security</p>
                        <ul>
                          <li><Brain size={14} color="#6ee7b7" /> <span><strong>AI Threat Detection:</strong> Login anomaly detector</span></li>
                          <li><Search size={14} color="#6ee7b7" /> <span><strong>ML Malware Analysis:</strong> Static malware classifier</span></li>
                          <li><Target size={14} color="#6ee7b7" /> <span><strong>Capstone Integration:</strong> Endpoint monitoring</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Phase 2 */}
            <AnimateOnScroll direction="up">
              <div className={styles.phaseRow}>
                <div className={styles.phaseIndicator}>
                  <div className={styles.phaseCircleBlue}>
                    <div className={styles.phaseNum}>2</div>
                    <div className={styles.phaseText}>Phase</div>
                  </div>
                  <div className={styles.phaseLineBlue}></div>
                </div>
                <div className={styles.phaseContent}>
                  <div className={styles.phaseHeaderBlue}>
                    <div>
                      <div className={styles.phaseWeeks}>Weeks 5-8</div>
                      <h5 className={styles.phaseTitle}>Offensive Security</h5>
                      <p className={styles.phaseSubtitle}>Penetration testing, web app hacking</p>
                    </div>
                  </div>
                  <div className={styles.phaseBody}>
                    <div className={styles.phaseListOnly}>
                      <ul>
                        <li><CheckCircle2 size={18} color="#67e8f9" /> SIEM deployment and management (Splunk, ELK Stack)</li>
                        <li><CheckCircle2 size={18} color="#67e8f9" /> Log analysis and correlation techniques</li>
                        <li><CheckCircle2 size={18} color="#67e8f9" /> Threat hunting and proactive defense</li>
                        <li><CheckCircle2 size={18} color="#67e8f9" /> Incident response procedures and playbooks</li>
                        <li><CheckCircle2 size={18} color="#67e8f9" /> Digital forensics and evidence preservation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Phase 3 */}
            <AnimateOnScroll direction="up">
              <div className={styles.phaseRow}>
                <div className={styles.phaseIndicator}>
                  <div className={styles.phaseCircleRed}>
                    <div className={styles.phaseNum}>3</div>
                    <div className={styles.phaseText}>Phase</div>
                  </div>
                  <div className={styles.phaseLineRed}></div>
                </div>
                <div className={styles.phaseContent}>
                  <div className={styles.phaseHeaderRed}>
                    <div>
                      <div className={styles.phaseWeeks}>Weeks 9-12</div>
                      <h5 className={styles.phaseTitle}>Defensive Security</h5>
                    </div>
                  </div>
                  <div className={styles.phaseBody}>
                    <div className={styles.phaseGrid}>
                      <div className={styles.phaseCard}>
                        <h6>Vulnerability Assessment & Exploitation</h6>
                        <p>Find and exploit vulnerabilities</p>
                        <ul>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Advanced vulnerability scanning (Nessus, OpenVAS, Qualys)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> OWASP Top 10 in-depth analysis and exploitation</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Web application security testing (Burp Suite, OWASP ZAP)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> SQL injection, XSS, CSRF, and XXE attacks</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> API security testing and GraphQL vulnerabilities</li>
                        </ul>
                      </div>
                      <div className={styles.phaseCard}>
                        <h6>Advanced Penetration Testing</h6>
                        <p>Master advanced attack techniques</p>
                        <ul>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Metasploit Framework mastery and exploit development</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Active Directory attacks (Kerberoasting, Pass-the-Hash)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Privilege escalation techniques (Windows & Linux)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Post-exploitation and lateral movement</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Social engineering and phishing campaigns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Phase 4 */}
            <AnimateOnScroll direction="up">
              <div className={styles.phaseRow}>
                <div className={styles.phaseIndicator}>
                  <div className={styles.phaseCircleDarkRed}>
                    <div className={styles.phaseNum}>4</div>
                    <div className={styles.phaseText}>Phase</div>
                  </div>
                  <div className={styles.phaseLineDarkRed}></div>
                </div>
                <div className={styles.phaseContent}>
                  <div className={styles.phaseHeaderDarkRed}>
                    <div>
                      <div className={styles.phaseWeeks}>Weeks 13-16</div>
                      <h5 className={styles.phaseTitle}>The Internship</h5>
                    </div>
                  </div>
                  <div className={styles.phaseBody}>
                    <div className={styles.phaseGrid}>
                      <div className={styles.phaseCard}>
                        <h6>Specialized Security Tracks</h6>
                        <p>Choose your specialization path</p>
                        <ul>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Cloud security (AWS, Azure security fundamentals)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Container security (Docker, Kubernetes)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Mobile application security (Android & iOS)</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Malware analysis and reverse engineering basics</li>
                          <li><ChevronRight size={14} color="#6ee7b7" /> Cryptography and secure coding practices</li>
                        </ul>
                      </div>
                      <div className={styles.phaseCardGreen}>
                        <h6>Capstone Project & Career Preparation</h6>
                        <p>Real-world application at partner companies</p>
                        <ul>
                          <li><Award size={14} color="white" /> Full-scale penetration testing capstone project</li>
                          <li><Award size={14} color="white" /> Professional security report writing</li>
                          <li><Award size={14} color="white" /> Resume building and LinkedIn optimization</li>
                          <li><Award size={14} color="white" /> Mock interviews with industry professionals</li>
                          <li><Award size={14} color="white" /> Final presentation to partner companies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* NEW: A Day in the Trenches */}
          <AnimateOnScroll direction="fade" delay={100}>
            <div className={styles.trenchesHero}>
              <h4 className={styles.trenchesTitle}>IMMERSIVE EXPERIENCE</h4>
              <h3>A Day in the Trenches</h3>
              <p>This isn&apos;t a passive lecture. Experience what a typical day looks like during the intensive phases of the 16-Week Professional Program.</p>
            </div>
            <div className={styles.trenchesTimeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>[09:00 AM]</div>
                <div className={styles.timelineContent}>
                  <h5>Threat Intel Briefing</h5>
                  <p>Review the latest overnight CVEs and zero-days. Discuss real-world attacks happening right now and how to defend against them.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>[11:00 AM]</div>
                <div className={styles.timelineContent}>
                  <h5>Live Attack Simulation</h5>
                  <p>Connect to the Elitech Hypervisor. We launch an active Ransomware simulation on a dummy network. Your job? Detect it, isolate the infected nodes, and stop the spread.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>[14:00 PM]</div>
                <div className={styles.timelineContent}>
                  <h5>Defensive Coding & Scripting</h5>
                  <p>Build custom Python scripts to parse massive log files in seconds. Write YARA rules to detect the malware signature you saw in the morning session.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>[16:00 PM]</div>
                <div className={styles.timelineContent}>
                  <h5>Code Review & Hot Seat</h5>
                  <p>Present your findings to the instructor and peers. Defend your incident response decisions. This is where real confidence is built before job interviews.</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* NEW: Certifications & Career Support */}
        <section className={layoutStyles.section} style={{ padding: '0 5%' }}>
          <div className={styles.careerGrid}>
            <AnimateOnScroll direction="left">
              <div className={styles.certsBox}>
                <h3 className={styles.sectionTitle}>Industry Certifications Preparation</h3>
                <p className={styles.sectionSubtitle}>Our program prepares you for the most sought-after cybersecurity certifications in the industry:</p>
                <div className={styles.certList}>
                  <div className={styles.certCard}>
                    <Shield size={24} className={styles.certIcon} />
                    <div>
                      <h5>CompTIA Security+</h5>
                      <p>Foundation certification covering essential security concepts</p>
                    </div>
                  </div>
                  <div className={styles.certCard}>
                    <Code size={24} className={styles.certIcon} />
                    <div>
                      <h5>Certified Ethical Hacker (CEH)</h5>
                      <p>Advanced penetration testing and ethical hacking</p>
                    </div>
                  </div>
                  <div className={styles.certCard}>
                    <Target size={24} className={styles.certIcon} />
                    <div>
                      <h5>OSCP (Recommended)</h5>
                      <p>Hands-on penetration testing certification</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll direction="right" delay={100}>
              <div className={styles.supportBox}>
                <h3 className={styles.sectionTitle}>Comprehensive Career Support</h3>
                <p className={styles.sectionSubtitle}>We don&apos;t just train you; we prepare you for the workforce.</p>
                <div className={styles.supportList}>
                  <div className={styles.supportItem}>
                    <UserPlus size={20} className={styles.supportIcon} />
                    <div>
                      <h6>1-on-1 Mentorship</h6>
                      <p>Personal guidance from industry professionals</p>
                    </div>
                  </div>
                  <div className={styles.supportItem}>
                    <Briefcase size={20} className={styles.supportIcon} />
                    <div>
                      <h6>Internship Experience</h6>
                      <p>Real-world experience with our partner companies</p>
                    </div>
                  </div>
                  <div className={styles.supportItem}>
                    <FileSearch size={20} className={styles.supportIcon} />
                    <div>
                      <h6>Resume & LinkedIn Optimization</h6>
                      <p>Professional profile building and personal branding</p>
                    </div>
                  </div>
                  <div className={styles.supportItem}>
                    <Users size={20} className={styles.supportIcon} />
                    <div>
                      <h6>Interview Preparation</h6>
                      <p>Mock interviews and technical assessment practice</p>
                    </div>
                  </div>
                  <div className={styles.supportItem}>
                    <Network size={20} className={styles.supportIcon} />
                    <div>
                      <h6>Alumni Network</h6>
                      <p>Lifetime access to our growing professional community</p>
                    </div>
                  </div>
                </div>
                <div className={styles.placementBadge}>
                  <Briefcase size={28} />
                  <strong>Unpaid internship experience</strong>
                  <span>Gain real-world SOC & Pentesting skills</span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Program Comparison — responsive card layout */}
        <section className={layoutStyles.section} style={{ padding: '0 5%' }}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Program Comparison</h2>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '900px', margin: '0 auto 1rem' }}>
              <div style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '1rem' }}>⚡ 6-Week Bootcamp</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Fast-Track Skills</div>
              </div>
              <div style={{ background: 'rgba(195,21,28,0.1)', border: '2px solid rgba(195,21,28,0.4)', borderRadius: '12px', padding: '1rem', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: '20px', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '1rem' }}>👑 16-Week Professional</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Complete Career Transformation</div>
              </div>
            </div>

            {/* Comparison rows */}
            {[
              { label: 'Duration', bootcamp: '6 Weeks', pro: '16 Weeks' },
              { label: 'Class Schedule', bootcamp: 'Weekends Only', pro: '3× per week' },
              { label: 'Price', bootcamp: null, pro: null, isPrice: true },
              { label: 'Hands-on Labs', bootcamp: '✅', pro: '✅' },
              { label: 'Industry Project', bootcamp: '✅', pro: '✅' },
              { label: 'Internship Experience', bootcamp: '—', pro: '✅ Yes', proHighlight: true },
              { label: '1-on-1 Mentorship', bootcamp: '—', pro: '✅', proHighlight: true },
              { label: 'Certification Prep', bootcamp: 'Basic', pro: 'Security+, CEH, OSCP', proHighlight: true },
              { label: 'Career Support', bootcamp: 'Basic Resume Help', pro: 'Full Career Services', proHighlight: true },
              { label: 'Alumni Network', bootcamp: '—', pro: '✅', proHighlight: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '900px', margin: '0 auto 0.5rem', alignItems: 'stretch' }}>
                {/* Feature label spans full width above */}
                <div style={{ gridColumn: '1 / -1', color: 'var(--color-text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.4rem 0 0.1rem' }}>{row.label}</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.75rem 1rem', color: 'white', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  {row.isPrice ? <PriceDisplay courseId="bootcamp" fallback="₦75,000" /> : row.bootcamp}
                </div>
                <div style={{ background: 'rgba(195,21,28,0.07)', border: '1px solid rgba(195,21,28,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: row.proHighlight ? '#10b981' : 'white', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
                  {row.isPrice ? <PriceDisplay courseId="professional" fallback="₦200,000" /> : row.pro}
                </div>
              </div>
            ))}
          </AnimateOnScroll>
        </section>

        {/* NEW: Apply Application Form */}
        <section className={styles.applySection} id="applyForm">
          <AnimateOnScroll direction="fade">
            <div className={styles.applyContainer}>
              <div className={styles.applyHeader}>
                <h4 className={styles.applyPretitle}>START YOUR JOURNEY</h4>
                <h2 className={styles.applyTitle}>Apply to Elitech Hub</h2>
                <p>Take the first step towards your cybersecurity career. Fill out the form below and we&apos;ll get back to you within 48 hours.</p>
              </div>
              <form className={styles.applyForm}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Full Name *</label>
                    <input type="text" placeholder="Enter your full name" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email *</label>
                    <input type="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Phone *</label>
                    <input type="tel" placeholder="+234 XXX XXX XXXX" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Select Program *</label>
                    <select required defaultValue="">
                      <option value="" disabled>Choose a program...</option>
                      <option value="ai6">Learn AI Powered Cybersecurity in 6 Weeks</option>
                      <option value="bootcamp6">6-Week Cybersecurity Bootcamp</option>
                      <option value="prof16">16-Week Professional Program</option>
                      <option value="corp">Corporate Training</option>
                    </select>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Current Experience Level *</label>
                  <select required defaultValue="">
                    <option value="" disabled>Select your experience...</option>
                    <option value="none">No IT experience (Complete Beginner)</option>
                    <option value="some">Some IT experience, new to security</option>
                    <option value="pro">IT Professional looking to specialize</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Why do you want to learn cybersecurity? *</label>
                  <textarea rows={4} placeholder="Tell us about your goals and what motivates you to pursue a career in cybersecurity..." required></textarea>
                </div>
                <button type="submit" className={`premium-button w-full ${styles.submitBtn}`}>
                  Submit Application <Send size={18} />
                </button>
                <p className={styles.secureText}><ShieldCheck size={14} /> Your information is secure and will never be shared.</p>
              </form>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Warning Section */}
        <section className={styles.warningSection}>
          <AnimateOnScroll direction="up">
            <div className={styles.warningCard}>
              <div className={styles.warningTape}>WARNING</div>
              <div className={styles.warningIcon}><ShieldAlert size={48} /></div>
              <h2 className={styles.warningTitle}>This Bootcamp is <span className={styles.textRed}>Not For Everyone</span></h2>
              <p className={styles.warningDesc}>
                We provide rigorous <strong>internship experience</strong>. We protect that statistic fiercely. 
                If you are looking for easy videos to watch passively while you scroll social media, <strong className={styles.textRed}>do not apply.</strong>
              </p>
              <div className={styles.warningGrid}>
                <div className={styles.warningBoxRed}>
                  <h4>We demand grit.</h4>
                  <p>You will get stuck. Servers will crash. Scripts will fail. You must be willing to troubleshoot and fight through the frustration.</p>
                </div>
                <div className={styles.warningBoxDark}>
                  <h4>We demand time.</h4>
                  <p>This requires intensive focus. You must commit to the schedule and the demanding hands-on labs.</p>
                </div>
              </div>
              <p className={styles.warningFooter}>
                But if you are ready to do the work, <span className={styles.highlightBgRed}>we will equip you with industry skills.</span>
              </p>
            </div>
          </AnimateOnScroll>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>Do I need prior IT experience? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  No! Our programs are designed for complete beginners. We start with the fundamentals and progressively build your skills. If you can use a computer and have a passion for cybersecurity, you're ready to start.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>What equipment do I need? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  A laptop with at least 8GB RAM (16GB recommended) and a stable internet connection. We'll guide you through setting up all necessary software including virtual machines and security tools—all free and open-source.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>How does the internship experience work? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  Upon successful completion of the 16-week program, we place you in a 4-week intensive internship experience. This provides real-world experience and helps build a solid portfolio to support your future job applications.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>Are the classes online or in-person? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  All classes are conducted live online via Zoom with interactive labs and breakout sessions. This allows you to learn from anywhere while still getting real-time interaction with instructors and peers. Recordings are available for review.
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>Can I pay in installments? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  Yes! The 16-week program (<PriceDisplay courseId="professional" fallback="₦200,000" />) offers flexible payment plans. You can pay in a maximum of 2 installments. Contact our admissions team via WhatsApp to discuss payment options that work for your budget. (Note: Split payments are not available for the 6-Week Bootcamp).
                </div>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>What's the difference between the 6-week and 16-week programs? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  The 6-week bootcamp is perfect for getting fundamental skills quickly and is ideal for professionals with time constraints. The 16-week program is comprehensive, includes unpaid internship experience, advanced topics, certification prep, and full career services—making it ideal for complete career transformation.
                </div>
              </details>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
