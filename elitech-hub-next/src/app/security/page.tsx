import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './security.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Security & Trust | Verified Certifications - Elitech Hub',
  description: 'Security and Trust at Elitech Hub - Responsible Disclosure Policy, Security Practices, Accessibility Statement, and our commitment to cybersecurity excellence in Nigeria.',
  keywords: ['security policy Elitech Hub', 'responsible disclosure Nigeria', 'cybersecurity trust', 'Elitech Hub security practices', 'vulnerability reporting', 'WCAG accessibility Nigeria', 'data protection Elitech Hub'],
  openGraph: {
    title: 'Security & Trust | Elitech Hub',
    description: 'Our commitment to safety, transparency, and accessibility at Elitech Hub.',
    url: 'https://elitechub.com/security',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: { canonical: 'https://elitechub.com/security' },
};

export default function SecurityPage() {
  return (
    <PageLayout>
      <section className={layoutStyles.pageHero} style={{ minHeight: '40vh' }}>
        <AnimateOnScroll>
          <span className={layoutStyles.pageHeroLabel}>Our Commitment</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Security & <span className={layoutStyles.accentRed}>Trust</span>
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Our commitment to safety, transparency, and accessibility.
          </p>
        </AnimateOnScroll>
      </section>

      <section className={layoutStyles.section}>
        <div className={styles.container}>
          
          {/* Responsible Disclosure */}
          <AnimateOnScroll>
            <div className={styles.policyCard} style={{ borderLeftColor: '#c3151c' }}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} style={{ color: '#c3151c' }}>🐞</span>
                <h2 className={styles.cardTitle}>Responsible Disclosure Policy</h2>
              </div>
              <p className={styles.cardText}>
                At Elitech Hub, we take the security of our systems and user data seriously. We appreciate the work of security researchers who help us identify vulnerabilities.
              </p>

              <h3 className={styles.cardSubtitle}>How to Report</h3>
              <p className={styles.cardText}>
                If you believe you have found a security vulnerability in our platform, please report it to us immediately.
              </p>
              <div className={styles.codeBox}>
                Email: security@elitechub.com
              </div>
              <p className={styles.cardText}>
                Please include proof of concept and steps to reproduce. We aim to acknowledge reports within 48 hours.
              </p>

              <h3 className={styles.cardSubtitle}>Scope</h3>
              <ul className={styles.cardList}>
                <li><strong>IN SCOPE:</strong> elitechub.com, api.elitechub.com</li>
                <li><strong>OUT OF SCOPE:</strong> Third-party services (payment gateways, etc.), Social Engineering, DDoS</li>
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Security Practices */}
          <AnimateOnScroll>
            <div className={styles.policyCard} style={{ borderLeftColor: '#0ea5e9' }}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} style={{ color: '#0ea5e9' }}>🛡️</span>
                <h2 className={styles.cardTitle}>Our Security Practices</h2>
              </div>
              <p className={styles.cardText}>
                We implement industry-standard security measures to protect your data:
              </p>
              <div className={styles.badgeGrid}>
                <div className={styles.securityBadge}>
                  <span style={{ color: '#10b981' }}>🔒</span> SSL/TLS Encryption
                </div>
                <div className={styles.securityBadge}>
                  <span style={{ color: '#8b5cf6' }}>🗄️</span> Encrypted Data Storage
                </div>
                <div className={styles.securityBadge}>
                  <span style={{ color: '#f59e0b' }}>📱</span> 2FA / MFA Enabled
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Accessibility */}
          <AnimateOnScroll>
            <div className={styles.policyCard} style={{ borderLeftColor: '#10b981' }}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} style={{ color: '#10b981' }}>👁️</span>
                <h2 className={styles.cardTitle}>Accessibility Statement (WCAG 2.1)</h2>
              </div>
              <p className={styles.cardText}>
                Elitech Hub is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>

              <h3 className={styles.cardSubtitle}>Conformance Status</h3>
              <p className={styles.cardText}>
                We aim to conform to WCAG 2.1 level AA. This includes:
              </p>
              <ul className={styles.cardList}>
                <li>High contrast dark mode design</li>
                <li>Keyboard navigable interfaces</li>
                <li>Screen-reader friendly HTML structure</li>
                <li>Clear focus indicators on interactive elements</li>
              </ul>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p className={styles.cardText} style={{ margin: 0, fontSize: '0.9rem' }}>
                  If you experience any difficulty accessing any part of this website, please email us at <a href="mailto:accessibility@elitechub.com" style={{ color: '#c3151c' }}>accessibility@elitechub.com</a>.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

        </div>
      </section>
    </PageLayout>
  );
}
