import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './penetration-testing.module.css';
import { Shield, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Terminal, Network, Smartphone, Cloud, FileText, Lock, AlertTriangle, FileSearch, Target, ShieldAlert } from 'lucide-react';
import { PricingTiers } from '@/components/PricingTiers';

export const metadata = {
  title: 'Penetration Testing Nigeria | Ethical Hacking & Security Audits | Elitech Hub',
  description: 'Elitech Hub provides professional penetration testing in Nigeria including web app pentesting, network security audits, mobile security assessment, and cloud infrastructure testing for Lagos, Ibadan, Abuja businesses.',
  keywords: [
    'penetration testing Nigeria',
    'web application pentesting Lagos',
    'network penetration testing Nigeria',
    'ethical hacking service Nigeria',
    'security audit Nigeria',
    'mobile app security testing Nigeria',
    'cloud security audit Nigeria',
    'vulnerability assessment Nigeria',
    'hire ethical hacker Nigeria',
    'VAPT Nigeria',
    'cybersecurity audit Lagos',
    'red team Nigeria',
    'OWASP testing Nigeria',
    'NDPR security audit Nigeria',
  ],
  alternates: {
    canonical: 'https://elitechub.com/services/penetration-testing',
  },
  openGraph: {
    title: 'Penetration Testing Nigeria | Ethical Hacking & Security Audits',
    description: 'Professional penetration testing in Nigeria including web app, network, mobile, and cloud infrastructure security assessments.',
    url: 'https://elitechub.com/services/penetration-testing',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function PenetrationTestingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://elitechub.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://elitechub.com/services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Penetration Testing",
            "item": "https://elitechub.com/services/penetration-testing"
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Penetration Testing & Ethical Hacking Nigeria",
        "serviceType": "Penetration Testing",
        "provider": {
          "@type": "Organization",
          "name": "Elitech Hub",
          "url": "https://elitechub.com"
        },
        "areaServed": ["Lagos", "Ibadan", "Abuja", "Nigeria"],
        "description": "Professional penetration testing in Nigeria including web app pentesting, network security audits, mobile security assessment, and cloud infrastructure testing."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is penetration testing and why does my business need it?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Penetration testing is a simulated cyberattack against your systems to check for exploitable vulnerabilities. Your business needs it to identify security weaknesses before malicious hackers do, protect sensitive data, and maintain customer trust."
            }
          },
          {
            "@type": "Question",
            "name": "How much does a pentest cost in Nigeria?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The cost of a pentest depends on the scope of the assessment, such as the size of the network, the number of web applications, and the depth of the test. Contact us for a custom quote based on your specific needs."
            }
          },
          {
            "@type": "Question",
            "name": "Is penetration testing legal in Nigeria?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, penetration testing is legal when performed with explicit written consent and authorization from the system owner. We operate strictly under signed Rules of Engagement and NDAs."
            }
          },
          {
            "@type": "Question",
            "name": "How long does a penetration test take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A standard penetration test usually takes between 1 to 3 weeks, depending on the complexity of the target environment and the scope defined during the initial planning phase."
            }
          }
        ]
      }
    ]
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb Nav */}
      <div className={styles.breadcrumbWrapper}>
        <div className="container">
          <Link href="/services" className="back-link">
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <div className={styles.heroContent}>
            <AnimateOnScroll direction="up">
              <span className={styles.badge}>OFFENSIVE SECURITY</span>
              <h1 className={styles.heroTitle}>
                Find Your <span className={styles.textAccent}>Vulnerabilities</span><br />
                Before Hackers Do
              </h1>
              <p className={styles.heroSubtitle}>
                Proactive security testing to identify and eliminate weaknesses in your web apps, networks, and cloud infrastructure.
              </p>
              
              <div className={styles.threatStat}>
                <AlertTriangle className={styles.threatIcon} />
                <p><strong>60%</strong> of small and medium businesses close within 6 months of a successful cyberattack. Don't be a statistic.</p>
              </div>

              <div className={styles.metaIcons}>
                <div className={styles.metaIcon}><Terminal /> Web</div>
                <div className={styles.metaIcon}><Network /> Network</div>
                <div className={styles.metaIcon}><Smartphone /> Mobile</div>
                <div className={styles.metaIcon}><Cloud /> Cloud</div>
              </div>
              
              <div className={styles.ctaGroup}>
                <Link href="/portfolio" className="premium-button">
                  View Portfolio <ArrowRight size={20} />
                </Link>
                <Link href="#pricing" className="premium-button secondary">
                  View Prices
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
        <div className={styles.heroBackground}></div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing">
        <div className="container">
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Penetration Testing Pricing</h2>
            <p className={styles.sectionSubtitle}>Clear deliverables. Maintainable code. Predictable costs.</p>
            <PricingTiers tiers={[
              {
                id: "pentest-basic",
                title: "Basic Web Vulnerability Scan",
                priceNgn: 300000,
                description: "Automated scan and basic manual testing for 1 application.",
                features: [
                  "OWASP Top 10 Coverage",
                  "Automated Scanning",
                  "Basic Manual Validation",
                  "Executive Summary Report"
                ]
              },
              {
                id: "pentest-standard",
                title: "Standard Web App Pentest",
                priceNgn: 500000,
                description: "Deep dive manual pentest for 1 application.",
                features: [
                  "Deep Manual Exploitation",
                  "Business Logic Testing",
                  "Detailed Remediation Report",
                  "1 Free Retest after patch"
                ],
                isPopular: true
              },
              {
                id: "pentest-premium",
                title: "Full Network Pentest",
                priceNgn: 800000,
                description: "External and Internal Network Pentesting.",
                features: [
                  "Internal & External Scope",
                  "Active Directory Assessment",
                  "Lateral Movement Simulation",
                  "Executive & Technical Reports"
                ]
              }
            ]} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Our Pentest Services */}
      <section className={styles.servicesSection}>
        <div className="container">
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Our Penetration Testing Services</h2>
            <p className={styles.sectionSubtitle}>Comprehensive offensive security assessments tailored to your environment.</p>
          </AnimateOnScroll>

          <div className={styles.servicesGrid}>
            <AnimateOnScroll direction="up" delay={100}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIconWrapper}>
                  <Terminal className={styles.serviceIcon} />
                </div>
                <h3>Web Application Pentesting</h3>
                <p>Deep-dive assessment of your web apps using OWASP Top 10 guidelines.</p>
                <ul className={styles.serviceList}>
                  <li><CheckCircle2 className={styles.checkIcon} /> SQLi, XSS, SSRF testing</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Business logic flaws (IDOR)</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Authentication bypass</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> API security testing</li>
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={200}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIconWrapper}>
                  <Network className={styles.serviceIcon} />
                </div>
                <h3>Network Penetration Testing</h3>
                <p>Simulated attacks on your internal and external network infrastructure.</p>
                <ul className={styles.serviceList}>
                  <li><CheckCircle2 className={styles.checkIcon} /> External/Internal perimeter</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Firewall rule evasion</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Active Directory exploitation</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Lateral movement tests</li>
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={300}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIconWrapper}>
                  <Smartphone className={styles.serviceIcon} />
                </div>
                <h3>Mobile App Security</h3>
                <p>Security reviews for iOS and Android applications to prevent data leaks.</p>
                <ul className={styles.serviceList}>
                  <li><CheckCircle2 className={styles.checkIcon} /> Reverse engineering</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Insecure data storage</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Jailbreak/Root detection</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Mobile API vulnerabilities</li>
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={400}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIconWrapper}>
                  <Cloud className={styles.serviceIcon} />
                </div>
                <h3>Cloud Infrastructure Audit</h3>
                <p>Identifying misconfigurations in your AWS, Azure, or GCP environments.</p>
                <ul className={styles.serviceList}>
                  <li><CheckCircle2 className={styles.checkIcon} /> IAM privilege escalation</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Publicly exposed buckets</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Serverless function security</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Container & Kubernetes flaws</li>
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className={styles.methodologySection}>
        <div className="container">
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Our Pentest Methodology</h2>
            <p className={styles.sectionSubtitle}>A structured, repeatable approach to uncovering hidden risks.</p>
          </AnimateOnScroll>

          <div className={styles.timeline}>
            {[
              { title: "Scoping & Rules of Engagement", desc: "Defining targets, constraints, and legal boundaries.", icon: FileSearch },
              { title: "Reconnaissance & OSINT", desc: "Gathering intelligence on the target surface.", icon: Target },
              { title: "Vulnerability Analysis", desc: "Automated scanning and manual discovery.", icon: ShieldAlert },
              { title: "Exploitation & Post-Exploitation", desc: "Safely exploiting flaws to determine business impact.", icon: Terminal },
              { title: "Reporting & Remediation", desc: "Delivering actionable insights and fix validation.", icon: Shield },
            ].map((step, idx) => (
              <AnimateOnScroll key={idx} direction="right" delay={100 * idx}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIconWrapper}>
                    <step.icon className={styles.timelineIcon} />
                  </div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineTitle}>Step {idx + 1}: {step.title}</h4>
                    <p className={styles.timelineDesc}>{step.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className={styles.deliverablesSection}>
        <div className="container">
          <div className={styles.deliverablesGrid}>
            <div className={styles.deliverablesContent}>
              <AnimateOnScroll direction="right">
                <h2 className={styles.sectionTitleLeft}>What You Get</h2>
                <p className={styles.sectionDescLeft}>We don't just hand you an automated scan. You receive a comprehensive, human-validated report designed for both executives and developers.</p>
                
                <ul className={styles.deliverablesList}>
                  <li>
                    <CheckCircle2 className={styles.delivIcon} />
                    <div>
                      <strong>Executive Summary</strong>
                      <p>High-level overview of business risks, impact, and overall security posture.</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle2 className={styles.delivIcon} />
                    <div>
                      <strong>Technical Findings with CVSS</strong>
                      <p>Detailed breakdown of vulnerabilities scored by the Common Vulnerability Scoring System.</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle2 className={styles.delivIcon} />
                    <div>
                      <strong>Step-by-Step Reproduction</strong>
                      <p>Clear proof-of-concept steps so your team can verify the flaws.</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle2 className={styles.delivIcon} />
                    <div>
                      <strong>Remediation Roadmap</strong>
                      <p>Actionable, prioritized recommendations to fix identified vulnerabilities.</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle2 className={styles.delivIcon} />
                    <div>
                      <strong>Free Re-test Included</strong>
                      <p>We verify your fixes within 30 days to ensure the vulnerabilities are truly resolved.</p>
                    </div>
                  </li>
                </ul>
              </AnimateOnScroll>
            </div>
            
            <div className={styles.complianceContent}>
              <AnimateOnScroll direction="left">
                <div className={styles.complianceBox}>
                  <h3 className={styles.complianceTitle}>Compliance We Support</h3>
                  <p className={styles.complianceDesc}>Our pentests satisfy regulatory requirements and framework mandates.</p>
                  <div className={styles.complianceChips}>
                    <span className={styles.chip}>NDPR</span>
                    <span className={styles.chip}>ISO 27001</span>
                    <span className={styles.chip}>PCI DSS</span>
                    <span className={styles.chip}>SOC 2</span>
                    <span className={styles.chip}>CBN Cyber Guidelines</span>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className="container">
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </AnimateOnScroll>
          <div className={styles.faqGrid}>
            {[
              { q: "What is penetration testing and why does my business need it?", a: "Penetration testing is a simulated cyberattack against your systems to check for exploitable vulnerabilities. Your business needs it to identify security weaknesses before malicious hackers do, protect sensitive data, and maintain customer trust." },
              { q: "How much does a pentest cost in Nigeria?", a: "The cost of a pentest depends on the scope of the assessment, such as the size of the network, the number of web applications, and the depth of the test. Contact us for a custom quote based on your specific needs." },
              { q: "Is penetration testing legal in Nigeria?", a: "Yes, penetration testing is legal when performed with explicit written consent and authorization from the system owner. We operate strictly under signed Rules of Engagement and NDAs." },
              { q: "How long does a penetration test take?", a: "A standard penetration test usually takes between 1 to 3 weeks, depending on the complexity of the target environment and the scope defined during the initial planning phase." }
            ].map((faq, i) => (
              <AnimateOnScroll key={i} direction="fade" delay={i * 100}>
                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    {faq.q}
                    <ChevronDown className={styles.faqIcon} />
                  </summary>
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                </details>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <AnimateOnScroll direction="up">
            <div className={styles.ctaBox}>
              <h2 className={styles.ctaTitle}>Secure Your Assets Today</h2>
              <p className={styles.ctaDesc}>Get a comprehensive view of your security gaps before attackers exploit them.</p>
              <Link href="/contact" className="premium-button">
                Request a Proposal
              </Link>
              <p className={styles.ctaNote}>
                <Shield className={styles.ctaNoteIcon} /> All tests are performed under signed NDA and strict Rules of Engagement.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
