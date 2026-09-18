import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './services.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { ShieldCheck, GraduationCap, ArrowRight, Skull, Shield, Microscope, CheckCircle2 } from 'lucide-react';
import { HubCard } from '@/components/HubCard';


export const metadata: Metadata = {
  title: 'Cybersecurity, Web Development & AI Chatbot Services in Nigeria | Elitech Hub',
  description:
    'Professional Technology Solutions for Businesses, Institutions and Government Organizations.',
  keywords: [
    'cybersecurity services',
    'web development',
    'AI chatbot development',
    'penetration testing',
    'security awareness training',
    'corporate IT training',
    'cybersecurity research',
    'custom web application',
    'NDPR compliance',
    'Elitech Hub Nigeria',
  ],
  openGraph: {
    title: 'Cybersecurity, Web Dev & AI Services | Elitech Hub Nigeria',
    description:
      'From penetration testing and vCISO services to custom websites, AI chatbots, and automation scripts — Elitech Hub is Nigeria\'s full-stack tech and security partner.',
    url: 'https://elitechub.com/services',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [
      {
        url: 'https://elitechub.com/images/services-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Elitech Hub Services — Cybersecurity, Web Dev, AI Chatbots Nigeria',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cybersecurity, Web Dev & AI Chatbot Services in Nigeria',
    description:
      'Pentesting, custom websites, agentic AI apps, and corporate training — all from Elitech Hub.',
    images: ['https://elitechub.com/images/services-og.jpg'],
    site: '@ElitechHub',
  },
  alternates: { canonical: 'https://elitechub.com/services' },
};


export default function ServicesPage() {
  const jsonLd = [
    // --- BREADCRUMB ---
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://elitechub.com/services' },
      ],
    },
    // --- SERVICE 1: Cybersecurity Training ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#training',
      name: 'Corporate Cybersecurity Training Nigeria',
      description:
        'Elitech Hub delivers corporate cybersecurity training, security awareness programs, and custom curriculum for organisations in Lagos, Ibadan, Abuja, and across Nigeria.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'Cybersecurity Training',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }, { '@type': 'City', name: 'Lagos' }, { '@type': 'City', name: 'Ibadan' }],
    },
    // --- SERVICE 2: Penetration Testing ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#pentesting',
      name: 'Penetration Testing & Security Consulting Nigeria',
      description:
        'Web application pentesting, network penetration testing, mobile security assessment, cloud infrastructure auditing, vCISO, ISO 27001, and NDPR compliance consulting for Nigerian businesses.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'Penetration Testing',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }, { '@type': 'City', name: 'Lagos' }, { '@type': 'City', name: 'Ibadan' }],
    },
    // --- SERVICE 3: Web Development ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#webdev',
      name: 'Custom Website Development Nigeria',
      description:
        'Elitech Hub builds custom, premium websites and web applications for businesses in Lagos, Ibadan, Abuja, and across Nigeria. Fast, secure, and SEO-optimised.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'Web Development',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }, { '@type': 'City', name: 'Lagos' }, { '@type': 'City', name: 'Ibadan' }, { '@type': 'City', name: 'Abuja' }],
    },
    // --- SERVICE 4: AI Chatbot / Agentic AI ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#aichatbot',
      name: 'AI Chatbot & Agentic AI Application Development Nigeria',
      description:
        'Elitech Hub builds custom AI chatbots, agentic AI applications, and intelligent automation systems for Nigerian businesses. Powered by large language models and real-time data integration.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'AI Application Development',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }],
    },
    // --- SERVICE 5: Custom Scripts ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#scripts',
      name: 'Custom Script Development for Organisations Nigeria',
      description:
        'Elitech Hub writes bespoke Python, PowerShell, and Bash automation scripts for organisations. Security scripts, data processing pipelines, DevOps automation, and more.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'Custom Software Development',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }],
    },
    // --- SERVICE 6: Research ---
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://elitechub.com/services#research',
      name: 'Cybersecurity Research & Threat Intelligence Nigeria',
      description:
        'Community-driven cybersecurity research covering threat intelligence, malware analysis, reverse engineering, blockchain security, and open-source security tooling.',
      url: 'https://elitechub.com/services',
      provider: { '@type': 'Organization', '@id': 'https://elitechub.com/#organization', name: 'Elitech Hub' },
      serviceType: 'Cybersecurity Research',
      areaServed: [{ '@type': 'Country', name: 'Nigeria' }],
    },
    // --- FAQ PAGE (People Also Ask targeting) ---
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does Elitech Hub build websites and AI chatbots?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Elitech Hub builds custom websites and agentic AI applications including intelligent chatbots for businesses in Nigeria. Services are available remotely across all states.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can Elitech Hub write custom automation scripts for my organisation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Elitech Hub writes bespoke Python, PowerShell, and Bash scripts for organisations, including security automation, data processing, and DevOps pipelines.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Elitech Hub offer penetration testing in Nigeria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Elitech Hub provides web application pentesting, network penetration testing, mobile app security assessments, and cloud infrastructure auditing for Nigerian businesses.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can Elitech Hub help with NDPR compliance in Nigeria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Elitech Hub offers ISO 27001 and NDPR readiness consulting, virtual CISO (vCISO) services, and incident response planning for Nigerian organisations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Elitech Hub offer corporate cybersecurity training?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Elitech Hub delivers corporate security awareness training, custom curriculum development, and on-site or remote training for teams across Nigeria.',
          },
        },
      ],
    },
  ];

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === SERVICES HUB CARDS — link to dedicated sub-pages === */}
      <section style={{ padding: '3rem 5% 0' }}>
        <AnimateOnScroll direction="fade">
          <p style={{ textAlign: 'center', color: 'var(--color-accent-bright)', fontWeight: 800, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '0.5rem' }}>EXPLORE BY SERVICE</p>
          <h2 style={{ textAlign: 'center', color: 'white', fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', fontWeight: 800, marginBottom: '2rem' }}>Every service has its own dedicated page with full details, pricing, and FAQs.</h2>
        </AnimateOnScroll>
        <AnimateOnScroll direction="up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '0 auto 1rem' }}>
            <HubCard href="/services/web-development" icon="🌐" label="Web Development" sub="Custom websites & web apps" color="#3b82f6" />
            <HubCard href="/services/ai-chatbots" icon="🤖" label="AI Chatbots & Agents" sub="GPT-4, Claude, Gemini apps" color="#a855f7" />
            <HubCard href="/services/penetration-testing" icon="🛡️" label="Penetration Testing" sub="Web, network, mobile, cloud" color="#ef4444" />
            <HubCard href="/services/custom-scripts" icon="💻" label="Custom Scripts" sub="Python, PowerShell, Bash" color="#10b981" />
          </div>
        </AnimateOnScroll>
      </section>

      {/* Hero */}
      <section className={layoutStyles.pageHero}>
        <AnimateOnScroll direction="fade" delay={200}>
          <span className={layoutStyles.pageHeroLabel} style={{ color: '#ef4444' }}>Our Services</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Complete <span className="text-gradient-primary">Cybersecurity</span> Solutions
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            From education and training to security consulting and cutting-edge research — we cover all aspects of cybersecurity.
          </p>
          <div className={styles.heroFeature}>
            <div className={styles.heroFeatureItem}>
              <div className={styles.heroFeatureIcon} style={{ color: '#ef4444' }}><GraduationCap size={24} /></div>
              <div className={styles.heroFeatureText}>
                <strong>Education</strong>
                <span>World-class Training</span>
              </div>
            </div>
            <div className={styles.heroFeatureItem}>
              <div className={styles.heroFeatureIcon} style={{ color: '#10b981' }}><ShieldCheck size={24} /></div>
              <div className={styles.heroFeatureText}>
                <strong>Security</strong>
                <span>Expert Consulting</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* The Cost of Inaction */}
      <section className={styles.costSection}>
        <AnimateOnScroll direction="up">
          <div className={styles.sectionHeader}>
            <span className={styles.hardTruthLabel}>THE HARD TRUTH</span>
            <h2 className={styles.sectionTitle}>
              Cybersecurity is Not an Expense.<br />
              <span className={styles.textGradientRed}>It's the Cost of Doing Business.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Most organizations wait until they are breached to take security seriously. By then, the damage is catastrophic. Let's look at the real numbers for a typical mid-sized African enterprise.
            </p>
          </div>
        </AnimateOnScroll>

        <div className={styles.grid2Col}>
          {/* The Cost of a Breach */}
          <AnimateOnScroll direction="left" delay={100}>
            <div className={styles.riskCard}>
              <div className={styles.riskIndicator}></div>
              <h3 className={styles.riskCardTitle}>
                <Skull className={styles.iconRed} size={28} /> The Cost of Inaction
              </h3>
              <ul className={styles.riskList}>
                <li>
                  <span>Average Ransomware Demand</span>
                  <strong className={styles.textRed}>$1.5M+</strong>
                </li>
                <li>
                  <span>System Downtime (Days)</span>
                  <strong className={styles.textRed}>21 Days</strong>
                </li>
                <li>
                  <span>Regulatory Fines (NDPR/GDPR)</span>
                  <strong className={styles.textRed}>Up to 2% Revenue</strong>
                </li>
                <li>
                  <span>Reputation Damage</span>
                  <strong className={styles.textRed}>Immeasurable</strong>
                </li>
              </ul>
              <div className={styles.riskTotal}>
                Total Risk: Substantial
              </div>
            </div>
          </AnimateOnScroll>

          {/* The Investment */}
          <AnimateOnScroll direction="right" delay={300}>
            <div className={styles.investCard}>
              <div className={styles.investIndicator}></div>
              <h3 className={styles.investCardTitle}>
                <Shield className={styles.iconGreen} size={28} /> The Investment
              </h3>
              <ul className={styles.investList}>
                <li>
                  <span>Corporate Awareness Training</span>
                  <strong className={styles.textGreen}>Fractional</strong>
                </li>
                <li>
                  <span>Annual Penetration Testing</span>
                  <strong className={styles.textGreen}>Predictable</strong>
                </li>
                <li>
                  <span>Continuous Monitoring (vCISO)</span>
                  <strong className={styles.textGreen}>Budgeted</strong>
                </li>
                <li>
                  <span>Client Trust & Compliance</span>
                  <strong className={styles.textGreen}>Verified</strong>
                </li>
              </ul>
              <div className={styles.investTotal}>
                <Link href="/contact">
                  Secure Your Assets <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Main Services */}
      <section className={layoutStyles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader} style={{ marginBottom: '4rem' }}>
            <h2 className={styles.sectionTitle}>Our Services</h2>
            <p className={styles.sectionDesc}>Three core areas of expertise: Education, Security Solutions, and Research Innovation</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.grid3Col}>
          {/* Education */}
          <AnimateOnScroll direction="up" delay={100}>
            <div className={styles.serviceCard} style={{ borderColor: 'rgba(195, 21, 28, 0.3)' }}>
              <div className={styles.serviceIcon} style={{ background: 'linear-gradient(135deg, #c3151c, #991B1B)' }}>
                <GraduationCap size={32} />
              </div>
              <h3 className={styles.serviceTitle} style={{ color: '#ef4444' }}>Education & Training</h3>
              <p className={styles.serviceDesc}>Comprehensive cybersecurity training for individuals and organizations</p>

              <div className={styles.serviceGroup}>
                <h4>For Individuals:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#ef4444" /> 6-Week Bootcamp</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> 16-Week Professional Program</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> Guaranteed Internship Placement</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> Career Support & Job Placement</li>
                </ul>
              </div>

              <div className={styles.serviceGroup}>
                <h4>For Organizations:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#ef4444" /> Corporate Training Programs</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> Security Awareness Training</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> Custom Curriculum Development</li>
                  <li><CheckCircle2 size={16} color="#ef4444" /> On-site or Remote Delivery</li>
                </ul>
              </div>

              <div className={styles.serviceActions}>
                <Link href="/programs" className={styles.btnPrimary}>View Programs</Link>
                <Link href="/contact" className={styles.btnOutline}>Get Quote</Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Security Solutions */}
          <AnimateOnScroll direction="up" delay={300}>
            <div className={styles.serviceCard} style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div className={styles.serviceIcon} style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 className={styles.serviceTitle} style={{ color: '#10b981' }}>Security Solutions</h3>
              <p className={styles.serviceDesc}>Protecting your business with enterprise-grade security consulting and testing</p>

              <div className={styles.serviceGroup}>
                <h4>Offensive Security:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#10b981" /> Web Application Pentesting</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> Network Penetration Testing</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> Mobile App Security Assessment</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> Cloud Infrastructure Auditing</li>
                </ul>
              </div>

              <div className={styles.serviceGroup}>
                <h4>Defensive & Consulting:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#10b981" /> Virtual CISO (vCISO) Services</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> ISO 27001 / NDPR Readiness</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> Vulnerability Assessment</li>
                  <li><CheckCircle2 size={16} color="#10b981" /> Incident Response Planning</li>
                </ul>
              </div>

              <div className={styles.serviceActions}>
                <Link href="/contact" className={styles.btnGreen}>Request Assessment</Link>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Research */}
          <AnimateOnScroll direction="up" delay={500}>
            <div className={styles.serviceCard} style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <div className={styles.serviceIcon} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <Microscope size={32} />
              </div>
              <h3 className={styles.serviceTitle} style={{ color: '#3b82f6' }}>Research & Innovation</h3>
              <p className={styles.serviceDesc}>Pushing the boundaries of cybersecurity through community-driven research</p>

              <div className={styles.serviceGroup}>
                <h4>Our Focus Areas:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Threat Intelligence Analysis</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Malware & Reverse Engineering</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Open Source Security Tools</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Blockchain Security Research</li>
                </ul>
              </div>

              <div className={styles.serviceGroup}>
                <h4>For Researchers:</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Access to Cyber Lab</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Research Grants & Funding</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Publication Support</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" /> Collaborative Projects</li>
                </ul>
              </div>

              <div className={styles.serviceActions}>
                <Link href="/research" className={styles.btnBlue}>Explore Research</Link>
                <Link href="/researcher-guidelines" className={styles.btnOutline}>Join Lab</Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
