import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './corporate-training.module.css';
import { Building2, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Shield, Users, Target, Award, Globe, Clock, Briefcase, FileSearch, Network, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Corporate Cybersecurity Training Nigeria | Security Awareness for Teams | Elitech Hub',
  description: 'Elitech Hub delivers bespoke corporate cybersecurity training for organisations in Lagos, Ibadan, Abuja, and remotely across Nigeria. Security awareness training, custom curriculum, NDPR compliance training, and on-site delivery.',
  keywords: ['corporate cybersecurity training Nigeria', 'security awareness training Nigeria', 'corporate IT training Lagos', 'NDPR awareness training Nigeria', 'cybersecurity training for employees Nigeria', 'custom cybersecurity curriculum Nigeria', 'on-site cybersecurity training Nigeria', 'team security training Nigeria'],
  openGraph: {
    title: 'Corporate Cybersecurity Training Nigeria | Security Awareness for Teams | Elitech Hub',
    description: 'Elitech Hub delivers bespoke corporate cybersecurity training for organisations in Lagos, Ibadan, Abuja, and remotely across Nigeria.',
    url: 'https://elitechub.com/programs/corporate-training',
    siteName: 'Elitech Hub',
    images: [
      {
        url: 'https://elitechub.com/og-corporate.jpg',
        width: 1200,
        height: 630,
        alt: 'Corporate Cybersecurity Training by Elitech Hub',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Cybersecurity Training Nigeria | Security Awareness for Teams | Elitech Hub',
    description: 'Elitech Hub delivers bespoke corporate cybersecurity training for organisations in Lagos, Ibadan, Abuja, and remotely across Nigeria.',
    images: ['https://elitechub.com/og-corporate.jpg'],
  },
  alternates: {
    canonical: 'https://elitechub.com/programs/corporate-training',
  },
};

export default function CorporateTrainingPage() {
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
            "item": "https://elitechub.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Programs",
            "item": "https://elitechub.com/programs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Corporate Training",
            "item": "https://elitechub.com/programs/corporate-training"
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Corporate Cybersecurity Training",
        "provider": {
          "@type": "Organization",
          "name": "Elitech Hub",
          "url": "https://elitechub.com"
        },
        "description": "Elitech Hub delivers bespoke corporate cybersecurity training for organisations in Lagos, Ibadan, Abuja, and remotely across Nigeria.",
        "areaServed": [
          { "@type": "City", "name": "Lagos" },
          { "@type": "City", "name": "Ibadan" },
          { "@type": "City", "name": "Abuja" },
          { "@type": "Country", "name": "Nigeria" }
        ],
        "serviceType": "Corporate Cybersecurity Training"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can the training curriculum be customized for our industry?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. We tailor our cybersecurity training modules to address the specific threats and compliance requirements relevant to your industry, whether it's finance, healthcare, or government."
            }
          },
          {
            "@type": "Question",
            "name": "Do you offer on-site training in our offices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide both on-site training at your facilities across major Nigerian cities (Lagos, Abuja, Ibadan) and remote, instructor-led training via video conferencing."
            }
          },
          {
            "@type": "Question",
            "name": "Does the training cover NDPR compliance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our modules include comprehensive sections on the Nigeria Data Protection Regulation (NDPR) to ensure your staff understand their responsibilities regarding data privacy and security."
            }
          },
          {
            "@type": "Question",
            "name": "How is the effectiveness of the training measured?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We conduct pre- and post-training assessments, as well as simulated phishing campaigns, to measure knowledge retention and practical application of security principles by your team."
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
      
      {/* Hero Section */}
      <section className={`${layoutStyles.section} ${styles.heroSection}`} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <AnimateOnScroll>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Building2 className={styles.badgeIcon} />
                FOR ORGANISATIONS
              </div>
              <h1 className={layoutStyles.title}>Corporate Cybersecurity Training</h1>
              <p className={layoutStyles.subtitle}>
                Protect your team and secure your digital assets with bespoke, comprehensive security awareness and technical training tailored for modern organizations.
              </p>
              <div className={styles.heroFeatures}>
                <div className={styles.heroFeature}>
                  <Globe className={styles.featureIcon} />
                  <span>On-site & Remote</span>
                </div>
                <div className={styles.heroFeature}>
                  <Target className={styles.featureIcon} />
                  <span>Custom Curriculum</span>
                </div>
                <div className={styles.heroFeature}>
                  <Shield className={styles.featureIcon} />
                  <span>NDPR Compliant</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* The Hard Numbers Section */}
      <section className={`${layoutStyles.section} ${styles.statsSection}`}>
        <div className="container">
          <AnimateOnScroll>
            <div className={styles.statsHeader}>
              <h2 className={styles.sectionTitle}>The Hard Numbers</h2>
              <p className={styles.sectionSubtitle}>Why proactive training is non-negotiable</p>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3 className={styles.statValue}>$1.5M+</h3>
                <p className={styles.statLabel}>Average Ransomware Demand</p>
                <div className={styles.statGlow}></div>
              </div>
              <div className={styles.statCard}>
                <h3 className={styles.statValue}>21 Days</h3>
                <p className={styles.statLabel}>Average Incident Downtime</p>
                <div className={styles.statGlow}></div>
              </div>
              <div className={styles.statCard}>
                <h3 className={styles.statValue}>Up to 2%</h3>
                <p className={styles.statLabel}>NDPR Fines (of Annual Revenue)</p>
                <div className={styles.statGlow}></div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* What We Deliver Section */}
      <section className={`${layoutStyles.section} ${layoutStyles.bgDarker}`}>
        <div className="container">
          <AnimateOnScroll>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What We Deliver</h2>
              <p className={styles.sectionSubtitle}>Comprehensive modules designed for real-world impact</p>
            </div>
            <div className={styles.modulesGrid}>
              <div className={styles.moduleCard}>
                <Shield className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>Security Awareness Fundamentals</h3>
                <p className={styles.moduleDesc}>Essential security practices for everyday operations. Password hygiene, device security, and safe browsing habits.</p>
              </div>
              <div className={styles.moduleCard}>
                <Network className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>Phishing & Social Engineering Defense</h3>
                <p className={styles.moduleDesc}>Identify and thwart sophisticated phishing attempts, BEC scams, and physical social engineering tactics.</p>
              </div>
              <div className={styles.moduleCard}>
                <Clock className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>Incident Response Drills</h3>
                <p className={styles.moduleDesc}>Practical tabletop exercises to ensure your team knows exactly what to do when a breach occurs.</p>
              </div>
              <div className={styles.moduleCard}>
                <FileSearch className={styles.moduleIcon} />
                <h3 className={styles.moduleTitle}>NDPR / ISO 27001 Compliance Training</h3>
                <p className={styles.moduleDesc}>Data handling protocols, privacy principles, and compliance requirements specific to Nigerian and global standards.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`${layoutStyles.section} ${styles.processSection}`}>
        <div className="container">
          <AnimateOnScroll>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <p className={styles.sectionSubtitle}>Our proven methodology for effective training</p>
            </div>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Assess Posture</h3>
                <p className={styles.stepDesc}>We evaluate your team's current security awareness and identify critical vulnerabilities in your workflows.</p>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Custom Curriculum</h3>
                <p className={styles.stepDesc}>We build a tailored training program around your specific technology stack, industry threats, and compliance needs.</p>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Deliver & Simulate</h3>
                <p className={styles.stepDesc}>We conduct engaging on-site or remote training, followed by simulated attacks to test knowledge retention.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* For Organisations Section */}
      <section className={`${layoutStyles.section} ${layoutStyles.bgDarker}`}>
        <div className="container">
          <div className={styles.deliveryGrid}>
            <AnimateOnScroll className={styles.deliveryContent}>
              <h2 className={styles.sectionTitle}>Flexible Delivery Modes</h2>
              <p className={styles.deliveryDesc}>
                We understand that every organisation operates differently. Our training can be scheduled to minimize disruption to your core business operations.
              </p>
              <ul className={styles.deliveryList}>
                <li><CheckCircle2 className={styles.checkIcon} /> Weekday Intensive Sessions</li>
                <li><CheckCircle2 className={styles.checkIcon} /> Weekend Bootcamps</li>
                <li><CheckCircle2 className={styles.checkIcon} /> Self-Paced Online Modules</li>
                <li><CheckCircle2 className={styles.checkIcon} /> Blended Learning Approaches</li>
              </ul>
            </AnimateOnScroll>
            <AnimateOnScroll className={styles.industriesBox}>
              <h3 className={styles.industriesTitle}>Who We've Trained</h3>
              <div className={styles.industryTags}>
                <span className={styles.industryTag}><Building2 className={styles.industryIcon}/> Finance</span>
                <span className={styles.industryTag}><Shield className={styles.industryIcon}/> Government</span>
                <span className={styles.industryTag}><Target className={styles.industryIcon}/> Tech Startups</span>
                <span className={styles.industryTag}><BookOpen className={styles.industryIcon}/> Education</span>
                <span className={styles.industryTag}><Briefcase className={styles.industryIcon}/> Healthcare</span>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Get Quote CTA */}
      <section className={`${layoutStyles.section} ${styles.ctaSection}`}>
        <div className="container">
          <AnimateOnScroll>
            <div className={styles.ctaContainer}>
              <div className={styles.ctaContent}>
                <h2 className={styles.ctaTitle}>Ready to Secure Your Team?</h2>
                <p className={styles.ctaDesc}>Request a custom proposal for your organisation's cybersecurity training needs.</p>
              </div>
              <div className={styles.ctaForm}>
                <form className={styles.form}>
                  <div className={styles.formGroup}>
                    <input type="text" placeholder="Organisation Name" className={styles.input} required />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <input type="text" placeholder="Contact Person" className={styles.input} required />
                    </div>
                    <div className={styles.formGroup}>
                      <input type="email" placeholder="Work Email" className={styles.input} required />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <input type="tel" placeholder="Phone Number" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <div className={styles.selectWrapper}>
                        <select className={styles.select} required defaultValue="">
                          <option value="" disabled>Team Size</option>
                          <option value="1-10">1-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="51-200">51-200 Employees</option>
                          <option value="201+">201+ Employees</option>
                        </select>
                        <ChevronDown className={styles.selectIcon} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.selectWrapper}>
                      <select className={styles.select} required defaultValue="">
                        <option value="" disabled>Preferred Training Format</option>
                        <option value="on-site">On-site Training</option>
                        <option value="remote">Remote / Virtual</option>
                        <option value="hybrid">Hybrid (On-site + Remote)</option>
                      </select>
                      <ChevronDown className={styles.selectIcon} />
                    </div>
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Request Quote <ArrowRight className={styles.btnIcon} />
                  </button>
                </form>
              </div>
            </div>
            
            <div className={styles.backLinkWrapper}>
              <Link href="/programs" className="back-link">
                <ArrowLeft size={16} /> Back to All Programs
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </PageLayout>
  );
}
