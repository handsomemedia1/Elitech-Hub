import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import PriceDisplay from '@/components/PriceDisplay';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './bootcamp.module.css';
import {
  Zap, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Shield, Terminal,
  Clock, Calendar, Globe, Award, Target, Code, Network, ShieldCheck, Repeat, Briefcase
} from 'lucide-react';

export const metadata = {
  title: '6-Week Cybersecurity Bootcamp Nigeria | Fast-Track Career | Elitech Hub',
  description:
    'Launch your cybersecurity career in 6 weeks. Elitech Hub\'s intensive bootcamp in Nigeria covers ethical hacking, network security, and hands-on labs. Weekend classes, ₦75,000, no experience needed.',
  keywords: [
    '6 week cybersecurity bootcamp Nigeria',
    'cybersecurity bootcamp Lagos',
    'cybersecurity bootcamp Ibadan',
    'fast track cybersecurity Nigeria',
    'weekend cybersecurity course Nigeria',
    'ethical hacking course Nigeria',
    'cybersecurity for beginners Nigeria',
    'learn hacking Nigeria',
    'network security course Lagos',
    'cybersecurity certificate Nigeria',
    'short cybersecurity course Nigeria',
    'online cybersecurity bootcamp Nigeria',
  ],
  openGraph: {
    title: '6-Week Cybersecurity Bootcamp | ₦75,000 | Elitech Hub Nigeria',
    description:
      'Go from zero to job-ready in 6 weeks. Weekend classes, real hacking labs, and a certificate of completion. No prior IT experience needed.',
    url: 'https://elitechub.com/programs/cybersecurity-bootcamp',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [
      {
        url: 'https://elitechub.com/images/bootcamp-og.jpg',
        width: 1200,
        height: 630,
        alt: '6-Week Cybersecurity Bootcamp Nigeria — Elitech Hub',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6-Week Cybersecurity Bootcamp in Nigeria — ₦75,000',
    description: 'Weekend classes. Real labs. Certificate. No experience needed. Join Elitech Hub.',
    images: ['https://elitechub.com/images/bootcamp-og.jpg'],
  },
  alternates: { canonical: 'https://elitechub.com/programs/cybersecurity-bootcamp' },
};

export default function BootcampPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://elitechub.com/programs' },
        { '@type': 'ListItem', position: 3, name: '6-Week Cybersecurity Bootcamp', item: 'https://elitechub.com/programs/cybersecurity-bootcamp' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://elitechub.com/programs/cybersecurity-bootcamp#course',
      name: '6-Week Intensive Cybersecurity Bootcamp',
      description:
        'A 6-week weekend cybersecurity bootcamp in Nigeria covering ethical hacking, network penetration testing, and hands-on defence labs. No experience required.',
      url: 'https://elitechub.com/programs/cybersecurity-bootcamp',
      image: 'https://elitechub.com/images/bootcamp-og.jpg',
      inLanguage: 'en',
      provider: {
        '@type': 'Organization',
        '@id': 'https://elitechub.com/#organization',
        name: 'Elitech Hub',
        sameAs: 'https://elitechub.com',
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
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I become a cybersecurity professional in just 6 weeks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Honestly, no. A 6-week bootcamp is an entry point. It gives you the foundational knowledge and basic practical skills required to start. True mastery requires continuous learning and practice. We bridge this gap by transitioning you into an internship to gain workflow experience.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need prior experience to join the 6-week cybersecurity bootcamp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The Elitech Hub 6-week bootcamp is designed for complete beginners. You only need a laptop, a stable internet connection, and the willingness to work hard.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if I don\'t know my specialization yet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'That\'s perfectly normal. Our core methodology involves learning the basics and applying them first. Over the 6 weeks, you will be exposed to different domains like ethical hacking and network security, allowing you to discover what interests you before specializing.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens after the training?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After training, you enter the internship phase. Short-term training only introduces concepts; the internship bridges your learning to professional workflow experience. While we do not guarantee employment, we equip you with real-world project portfolios and verifiable certificates to make you highly employable.',
          },
        },
        {
          '@type': 'Question',
          name: 'When are the 6-week bootcamp classes held?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Classes run on weekends (Saturdays and Sundays), so you can keep your current job or studies while learning. All sessions are live and virtual.',
          },
        },
      ],
    },
  ];

  const curriculum = [
    {
      week: 'Week 1–2',
      title: 'Foundations & Linux',
      color: '#ef4444',
      topics: [
        'Cybersecurity landscape & threat actors',
        'Linux command line mastery',
        'Networking fundamentals (TCP/IP, DNS, HTTP)',
        'Setting up your virtual hacking lab',
      ],
    },
    {
      week: 'Week 3–4',
      title: 'Ethical Hacking Basics',
      color: '#f97316',
      topics: [
        'Reconnaissance & OSINT techniques',
        'Scanning with Nmap and Nessus',
        'Exploitation basics with Metasploit',
        'Password attacks & privilege escalation',
      ],
    },
    {
      week: 'Week 5',
      title: 'Web & Network Security',
      color: '#a855f7',
      topics: [
        'OWASP Top 10 vulnerabilities',
        'Web app testing with Burp Suite',
        'Network traffic analysis with Wireshark',
        'Firewall and IDS evasion',
      ],
    },
    {
      week: 'Week 6',
      title: 'Industry Project & Cert',
      color: '#10b981',
      topics: [
        'Full penetration test on a target environment',
        'Write a professional security report',
        'Present findings to instructors',
        'Receive certificate of completion',
      ],
    },
  ];

  const tools = [
    'Kali Linux', 'Metasploit', 'Nmap', 'Burp Suite',
    'Wireshark', 'Nessus', 'Hydra', 'OSINT Framework',
  ];

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── BREADCRUMB ── */}
      <div className={styles.breadcrumb} style={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="/programs" className="back-link">
          <ArrowLeft size={16} /> Back to All Programs
        </Link>
      </div>

      {/* ── HERO ── */}
      <section className={layoutStyles.pageHero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={100}>
          <div className={styles.heroBadge}><Zap size={15} /> 6-WEEK BOOTCAMP</div>
          <h1 className={layoutStyles.pageHeroTitle}>
            Go From Zero to<br />
            <span className="text-gradient-primary">Cybersecurity Fundamentals</span><br />
            in 6 Weeks
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Short-term training is your entry point, not the finish line. Our 6-week curriculum builds your foundational knowledge. You will learn Linux, Networking, and Ethical Hacking, bridging the gap to professional workflow experience.
          </p>

          <div className={styles.heroMeta}>
            <div className={styles.heroMetaItem}><Calendar size={18} /> Weekend Classes</div>
            <div className={styles.heroMetaItem}><Globe size={18} /> 100% Virtual</div>
            <div className={styles.heroMetaItem}><Clock size={18} /> 6 Weeks</div>
          </div>

          <div className={styles.heroPriceRow}>
            <div className={styles.pricingBox}>
              <span className={styles.priceAmount}><PriceDisplay courseId="bootcamp" fallback="₦75,000" /></span>
              <span className={styles.priceDesc}>One-time payment. No hidden fees.</span>
              <Link href="/apply?course=bootcamp" className="premium-button">
                Enroll Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── METHODOLOGY SECTION ── */}
      <section className={styles.methodologySection} style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <AnimateOnScroll direction="fade">
          <h2 className={styles.sectionTitle}>Our Methodology</h2>
          <p className={styles.sectionSub} style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
            We do not believe in overnight success or false guarantees. Cybersecurity requires continuous evolution. Our process ensures you build competence through deliberate practice.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', alignItems: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            <span>Learn</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Apply</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Relearn</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Apply Again</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Specialise</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Practice</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Intern</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Certify</span> <ArrowRight size={16} className="text-gradient-primary" />
            <span>Continue Learning</span>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className={styles.includesSection}>
        <AnimateOnScroll direction="up">
          <h2 className={styles.sectionTitle}>What&apos;s Included</h2>
          <div className={styles.includesGrid}>
            {[
              { icon: <Terminal size={22} />, label: '6 Weeks of Live Training', sub: 'Weekend sessions, not pre-recorded' },
              { icon: <Shield size={22} />, label: 'Hands-on Hacking Labs', sub: 'Real environments, real attacks' },
              { icon: <Briefcase size={22} />, label: 'Internship Experience', sub: 'Bridges learning to professional workflow' },
              { icon: <Award size={22} />, label: 'Certificate of Completion', sub: 'Verifiable at elitechub.com/verify' },
              { icon: <Network size={22} />, label: 'Community Access', sub: 'Lifetime alumni group membership' },
              { icon: <Repeat size={22} />, label: 'Continuous Learning', sub: 'Foundations to grow in the industry' },
            ].map((item, i) => (
              <div key={i} className={styles.includeCard}>
                <div className={styles.includeIcon}>{item.icon}</div>
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── CURRICULUM ── */}
      <section className={styles.curriculumSection}>
        <AnimateOnScroll direction="fade">
          <h2 className={styles.sectionTitle}>6-Week Curriculum</h2>
          <p className={styles.sectionSub}>
            Every week is structured to build directly on the last. By week 6, you are doing real penetration tests.
          </p>
          <div className={styles.curriculumGrid}>
            {curriculum.map((phase, i) => (
              <AnimateOnScroll key={i} direction="up" delay={i * 100}>
                <div className={styles.phaseCard} style={{ borderColor: phase.color + '44' }}>
                  <div className={styles.phaseWeek} style={{ color: phase.color }}>{phase.week}</div>
                  <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  <ul className={styles.phaseList}>
                    {phase.topics.map((t, j) => (
                      <li key={j}><CheckCircle2 size={15} color={phase.color} /> {t}</li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── TOOLS ── */}
      <section className={styles.toolsSection}>
        <AnimateOnScroll direction="up">
          <h2 className={styles.sectionTitle}>Tools You&apos;ll Master</h2>
          <div className={styles.toolsGrid}>
            {tools.map((tool, i) => (
              <div key={i} className={styles.toolChip}><Terminal size={14} /> {tool}</div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── IS THIS FOR YOU ── */}
      <section className={styles.forYouSection}>
        <AnimateOnScroll direction="up">
          <div className={styles.forYouGrid}>
            <div className={styles.forYouBox}>
              <h3 className={styles.forYouTitle} style={{ color: '#10b981' }}>✅ This is for you if...</h3>
              <ul className={styles.forYouList}>
                {[
                  <span key="1">You want a solid entry point into cybersecurity</span>,
                  <span key="2">You have no prior IT experience</span>,
                  <span key="3">You can commit to weekends for 6 weeks</span>,
                  <span key="4">You are ready to learn, apply, and relearn</span>,
                  <span key="5">You need something affordable (<PriceDisplay courseId="bootcamp" fallback="₦75,000" />)</span>,
                ].map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div className={styles.forYouBox}>
              <h3 className={styles.forYouTitle} style={{ color: '#ef4444' }}>❌ Consider the 16-week if...</h3>
              <ul className={styles.forYouList}>
                {[
                  'You want a deeper career transformation',
                  'You want our full internship and capstone projects',
                  'You want 1-on-1 mentorship',
                  'You want CompTIA Security+ / CEH prep',
                  'You want hands-on career support',
                ].map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
          <div className={styles.upgradeHint}>
            Unsure which to choose? <Link href="/programs">Compare all programs →</Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <AnimateOnScroll direction="fade">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {[
              {
                q: 'Can I become a cybersecurity professional in just 6 weeks?',
                a: 'Honestly, no. A 6-week bootcamp is an entry point. It gives you the foundational knowledge and basic practical skills required to start. True mastery requires continuous learning and practice. We bridge this gap by transitioning you into an internship to gain workflow experience.',
              },
              {
                q: 'What if I do not know my specialization yet?',
                a: 'That is perfectly normal. Our core methodology involves learning the basics and applying them first. Over the 6 weeks, you will be exposed to different domains like ethical hacking and network security, allowing you to discover what interests you before specializing.',
              },
              {
                q: 'What happens after the training?',
                a: 'After training, you enter the internship phase. Short-term training only introduces concepts; the internship bridges your learning to professional workflow experience. While we do not guarantee employment, we equip you with real-world project portfolios and verifiable certificates to make you highly employable.',
              },
              {
                q: 'Do I need prior experience?',
                a: 'No. Zero experience required. If you can use a computer and have internet access, you are ready to start.',
              },
              {
                q: 'When are classes held?',
                a: 'All classes run on weekends — Saturdays and Sundays — so you do not need to quit your job or pause school.',
              },
              {
                q: 'What equipment do I need?',
                a: 'A laptop with at least 8GB RAM (16GB recommended) and a reliable internet connection. All software used is free and open-source.',
              },
            ].map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQ}>{item.q} <ChevronDown size={18} /></summary>
                <div className={styles.faqA}>{item.a}</div>
              </details>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>View Full FAQ</Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={styles.ctaSection}>
        <AnimateOnScroll direction="up">
          <ShieldCheck size={48} className={styles.ctaIcon} />
          <h2 className={styles.ctaTitle}>Ready to Start Your Cybersecurity Career?</h2>
          <p className={styles.ctaSub}>
            6 weeks. <PriceDisplay courseId="bootcamp" fallback="₦75,000" />. Weekend classes. Real skills. A certificate you can verify.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/apply?course=bootcamp" className="premium-button">
              Apply Now — <PriceDisplay courseId="bootcamp" fallback="₦75,000" /> <ArrowRight size={18} />
            </Link>
            <Link href="/programs/professional" className={styles.ctaSecondary}>
              See 16-Week Program Instead →
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </PageLayout>
  );
}

