import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './custom-scripts.module.css';
import { Terminal, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Code, Zap, Shield, Database, GitBranch, Server, Settings, FileSearch } from 'lucide-react';
import { PricingTiers } from '@/components/PricingTiers';

export const metadata = {
  title: 'Custom Script Development for Organisations Nigeria | Python, PowerShell | Elitech Hub',
  description: 'Elitech Hub writes bespoke Python, PowerShell, and Bash scripts for Nigerian organisations. Security automation, data pipelines, DevOps scripts, and custom tooling. Fast delivery, clean code.',
  keywords: [
    'custom script development',
    'Python scripting',
    'PowerShell scripting',
    'Bash scripting',
    'automation scripts',
    'security automation',
    'DevOps scripting',
    'data pipeline development',
    'custom tooling',
    'IT automation',
    'Elitech Hub custom scripts',
  ],
  alternates: {
    canonical: 'https://elitechub.com/services/custom-scripts',
  },
  openGraph: {
    title: 'Custom Script Development for Organisations Nigeria | Elitech Hub',
    description: 'Bespoke Python, PowerShell, and Bash scripts for Nigerian organisations. Automation, DevOps, and custom tooling.',
    url: 'https://elitechub.com/services/custom-scripts',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function CustomScriptsPage() {
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
            "name": "Custom Scripts",
            "item": "https://elitechub.com/services/custom-scripts"
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Custom Script Development for Organisations Nigeria",
        "serviceType": "Custom Software Development",
        "provider": {
          "@type": "Organization",
          "name": "Elitech Hub",
          "url": "https://elitechub.com"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Nigeria"
        },
        "description": "Elitech Hub writes bespoke Python, PowerShell, and Bash scripts for Nigerian organisations. Security automation, data pipelines, DevOps scripts, and custom tooling."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What kinds of scripts do you write?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We write a wide variety of scripts including security automation (SIEM parsing, alerts), data processing (ETL, CSV/JSON manipulation), DevOps automation (deployments, backups), network tools, and custom CLI administration utilities."
            }
          },
          {
            "@type": "Question",
            "name": "What languages do you use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our primary scripting languages are Python, PowerShell, and Bash. We also use Go and Rust for high-performance tooling, along with tools like Docker and Git."
            }
          },
          {
            "@type": "Question",
            "name": "How long does script development take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simple automation scripts can often be delivered within a few days. More complex data pipelines or security integrations may take 1 to 3 weeks depending on requirements and testing needs."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide documentation and maintenance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every script we deliver includes clean, commented code and full documentation. We also offer a 30-day support window after delivery to ensure everything runs smoothly in your environment."
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
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <AnimateOnScroll direction="right">
                <span className={styles.badge}>CUSTOM SCRIPTS</span>
                <h1 className={styles.heroTitle}>
                  Bespoke <span className={styles.textAccent}>Automation Scripts</span><br />
                  for Your Organisation
                </h1>
                <p className={styles.heroSubtitle}>
                  Save time, reduce human error, and streamline your operations with custom-built tools tailored to your exact workflow.
                </p>
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
            
            <div className={styles.heroTerminal}>
              <AnimateOnScroll direction="left" delay={200}>
                <div className={styles.terminalWindow}>
                  <div className={styles.terminalHeader}>
                    <span className={styles.dot} style={{ background: '#ff5f56' }}></span>
                    <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
                    <span className={styles.dot} style={{ background: '#27c93f' }}></span>
                  </div>
                  <div className={styles.terminalBody}>
                    <p className={styles.command}><span>$</span> python3 elitech_audit.py --target 192.168.1.0/24</p>
                    <p className={styles.output}>[+] Initializing security audit on 192.168.1.0/24</p>
                    <p className={styles.output}>[+] Scanning for open ports...</p>
                    <p className={styles.output}>[!] Found vulnerable service on 192.168.1.45:445</p>
                    <p className={styles.output}>[+] Generating executive summary...</p>
                    <p className={styles.success}>[✔] Report saved to ./reports/audit_2026.pdf</p>
                    <p className={styles.command}><span>$</span> <span className={styles.cursor}></span></p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection} id="pricing">
        <div className="container">
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Custom Tooling Pricing</h2>
            <p className={styles.sectionSubtitle}>Clear deliverables. Maintainable code. Predictable costs.</p>
            <PricingTiers tiers={[
              {
                id: "script-basic",
                title: "Basic Automation Script",
                priceNgn: 300000,
                description: "Simple ETL, data formatting, and basic cron jobs.",
                features: [
                  "Single-purpose Python/Bash script",
                  "Automated cron scheduling setup",
                  "Basic logging and error handling",
                  "Full documentation included"
                ]
              },
              {
                id: "script-standard",
                title: "Advanced Security Automation",
                priceNgn: 500000,
                description: "SIEM integrations and custom vulnerability scanners.",
                features: [
                  "API integrations (SIEM, Slack, etc.)",
                  "Custom security event parsing",
                  "Multi-stage execution flow",
                  "30-day post-delivery support"
                ],
                isPopular: true
              },
              {
                id: "script-premium",
                title: "Enterprise DevOps Tooling",
                priceNgn: 800000,
                description: "Full CI/CD pipelines and custom CLI administration tools.",
                features: [
                  "Custom CLI application (Go/Rust/Python)",
                  "Container orchestration scripts",
                  "Complex state management",
                  "Enterprise SLA and maintenance"
                ]
              }
            ]} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Languages & Tools */}
      <section className={styles.toolsSection}>
        <div className="container">
          <div className={styles.toolsTrack}>
            <span className={styles.toolChip}><Code className={styles.toolIcon} /> Python</span>
            <span className={styles.toolChip}><Terminal className={styles.toolIcon} /> PowerShell</span>
            <span className={styles.toolChip}><Terminal className={styles.toolIcon} /> Bash</span>
            <span className={styles.toolChip}><Settings className={styles.toolIcon} /> Go</span>
            <span className={styles.toolChip}><Settings className={styles.toolIcon} /> Rust</span>
            <span className={styles.toolChip}><Server className={styles.toolIcon} /> Docker</span>
            <span className={styles.toolChip}><GitBranch className={styles.toolIcon} /> Git</span>
            <span className={styles.toolChip}><Zap className={styles.toolIcon} /> Cron</span>
          </div>
        </div>
      </section>

      {/* What We Script */}
      <section className={styles.servicesSection}>
        <div className="container">
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>What We Script</h2>
            <p className={styles.sectionSubtitle}>From simple tasks to complex data pipelines.</p>
          </AnimateOnScroll>

          <div className={styles.servicesGrid}>
            <AnimateOnScroll direction="up" delay={100}>
              <div className={styles.serviceCard}>
                <Shield className={styles.serviceIcon} />
                <h3>Security Automation</h3>
                <p>Log parsers, SIEM integrations, alert generation scripts, and automated vulnerability scanning wrappers.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={200}>
              <div className={styles.serviceCard}>
                <Database className={styles.serviceIcon} />
                <h3>Data Processing</h3>
                <p>ETL pipelines, CSV/JSON manipulation, log parsing, data sanitization, and automated report generators.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={300}>
              <div className={styles.serviceCard}>
                <GitBranch className={styles.serviceIcon} />
                <h3>DevOps & CI/CD</h3>
                <p>Deployment scripts, infrastructure health checks, backup automation, and container orchestration.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={400}>
              <div className={styles.serviceCard}>
                <Server className={styles.serviceIcon} />
                <h3>Network Tools</h3>
                <p>Custom port scanners, asset inventory collectors, uptime monitoring agents, and config backups.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={500}>
              <div className={styles.serviceCard}>
                <FileSearch className={styles.serviceIcon} />
                <h3>Forensics & IR</h3>
                <p>Digital evidence collectors, system timeline builders, hash verifiers, and automated triage tools.</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={600}>
              <div className={styles.serviceCard}>
                <Terminal className={styles.serviceIcon} />
                <h3>Custom CLI Tools</h3>
                <p>Internal administrative tools, workflow automation, and wrapper scripts for existing software.</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Process & Included */}
      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.processGrid}>
            <div className={styles.processContent}>
              <AnimateOnScroll direction="right">
                <h2 className={styles.sectionTitleLeft}>Our Process</h2>
                <div className={styles.processSteps}>
                  <div className={styles.step}>
                    <div className={styles.stepNum}>01</div>
                    <div>
                      <h4>Brief & Requirements</h4>
                      <p>We discuss your goals, environment constraints, and expected inputs/outputs.</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.stepNum}>02</div>
                    <div>
                      <h4>Build & Test</h4>
                      <p>We write the code following best practices, and test it against edge cases.</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.stepNum}>03</div>
                    <div>
                      <h4>Deliver & Document</h4>
                      <p>You receive the source code, installation guide, and usage instructions.</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
            
            <div className={styles.includedContent}>
              <AnimateOnScroll direction="left">
                <div className={styles.includedBox}>
                  <h3 className={styles.includedTitle}>What's Included</h3>
                  <ul className={styles.includedList}>
                    <li><CheckCircle2 className={styles.checkIcon} /> Clean, well-commented code</li>
                    <li><CheckCircle2 className={styles.checkIcon} /> Full README documentation</li>
                    <li><CheckCircle2 className={styles.checkIcon} /> Unit tests (where applicable)</li>
                    <li><CheckCircle2 className={styles.checkIcon} /> 30-day bug support window</li>
                    <li><CheckCircle2 className={styles.checkIcon} /> 100% Source code ownership</li>
                  </ul>
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
              { q: "What kinds of scripts do you write?", a: "We write a wide variety of scripts including security automation (SIEM parsing, alerts), data processing (ETL, CSV/JSON manipulation), DevOps automation (deployments, backups), network tools, and custom CLI administration utilities." },
              { q: "What languages do you use?", a: "Our primary scripting languages are Python, PowerShell, and Bash. We also use Go and Rust for high-performance tooling, along with tools like Docker and Git." },
              { q: "How long does script development take?", a: "Simple automation scripts can often be delivered within a few days. More complex data pipelines or security integrations may take 1 to 3 weeks depending on requirements and testing needs." },
              { q: "Do you provide documentation and maintenance?", a: "Yes. Every script we deliver includes clean, commented code and full documentation. We also offer a 30-day support window after delivery to ensure everything runs smoothly in your environment." }
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
              <h2 className={styles.ctaTitle}>Ready to Automate?</h2>
              <p className={styles.ctaDesc}>Stop doing repetitive manual work. Let our custom scripts handle it securely and efficiently.</p>
              <Link href="/contact" className="premium-button">
                Let's Talk Automation
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
