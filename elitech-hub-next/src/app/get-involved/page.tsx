import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './get-involved.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get Involved | Volunteer, Partner & Sponsor - Elitech Hub Nigeria',
  description:
    'Partner with Elitech Hub, Africa\'s fastest-growing cybersecurity training platform. Volunteer as a mentor, sponsor a cohort, or collaborate to secure Nigeria\'s digital future.',
  keywords: [
    'volunteer Elitech Hub Nigeria',
    'cybersecurity mentorship Nigeria',
    'sponsor cybersecurity training Africa',
    'partner Elitech Hub Lagos',
    'tech volunteer opportunities Nigeria',
    'cybersecurity community Nigeria',
    'tech sponsorship Nigeria',
    'teach cybersecurity Nigeria',
  ],
  openGraph: {
    title: 'Get Involved | Volunteer & Partner with Elitech Hub',
    description: 'Volunteer, mentor, or sponsor a cohort. Join us in securing Africa\'s digital future.',
    url: 'https://elitechub.com/get-involved',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Get Involved | Elitech Hub Nigeria', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/get-involved' },
};


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Elitech Hub",
  url: "https://elitechub.com",
  description: "Nigeria's premier AI-powered cybersecurity training platform.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@elitechub.com",
    contactType: "partnership",
  },
};

export default function GetInvolvedPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <AnimateOnScroll>
        <section className={layoutStyles.pageHero}>
          <span className={layoutStyles.pageHeroLabel}>Join Our Mission</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Build the <span className={layoutStyles.accentRed}>Cyber-Secure</span> Future of Africa
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Together, we can bridge the cybersecurity skills gap and build a safer digital future for Africa and beyond.
          </p>
          <div className={styles.heroActions}>
            <Link href="/apply" className={styles.btnPrimary}>Apply Now →</Link>
            <Link href="/contact" className={styles.btnOutline}>Partner With Us</Link>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Impact Stats */}
      <AnimateOnScroll>
        <section className={styles.impactSection}>
          <div className={styles.impactRow}>
            {[
              { number: '300+', label: 'Students Trained' },
              { number: '100%', label: 'Internship Rate' },
              { number: '4+', label: 'Countries Served' },
              { number: '20+', label: 'Active Mentors' },
            ].map(({ number, label }) => (
              <div key={label} className={styles.statBox}>
                <div className={styles.statNumber}>{number}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      </AnimateOnScroll>

      {/* For Students */}
      <AnimateOnScroll>
        <section className={`${layoutStyles.section} ${styles.involvementSection}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag} style={{ borderColor: '#c3151c', color: '#c3151c', background: 'rgba(195,21,28,0.08)' }}>
              🎓 For Students
            </div>
            <div className={styles.contentGrid}>
              <div className={styles.contentText}>
                <h2 className={styles.sectionTitle}>Launch Your Cyber Career</h2>
                <p className={styles.sectionDesc}>
                  Our hands-on training programs are designed to take you from beginner to job-ready professional. Join hundreds of successful graduates working in top companies.
                </p>
                <ul className={styles.benefitsList}>
                  <li>16-Week Professional Program with guaranteed internship</li>
                  <li>Industry-recognized certification prep (CEH, Security+, CompTIA)</li>
                  <li>1-on-1 mentorship from cybersecurity professionals</li>
                  <li>Lifetime access to our alumni network and Discord community</li>
                  <li>AI-powered cybersecurity tools training</li>
                </ul>
                <div className={styles.actionButtons}>
                  <Link href="/programs" className={styles.btnPrimary}>View Programs</Link>
                  <Link href="/apply" className={styles.btnOutline}>Apply Now</Link>
                </div>
              </div>
              <div className={styles.contentCard}>
                <div className={styles.cohortCard}>
                  <h3>Next Cohort Details</h3>
                  <div className={styles.cohortItem}>
                    <span className={styles.cohortLabel}>Program</span>
                    <span>16-Week Professional Masterclass</span>
                  </div>
                  <div className={styles.cohortItem}>
                    <span className={styles.cohortLabel}>Format</span>
                    <span>100% Virtual</span>
                  </div>
                  <div className={styles.cohortItem}>
                    <span className={styles.cohortLabel}>Duration</span>
                    <span>16 Weeks</span>
                  </div>
                  <div className={styles.cohortItem}>
                    <span className={styles.cohortLabel}>Availability</span>
                    <span className={styles.availableStatus}>● Open for Applications</span>
                  </div>
                  <Link href="/apply" className={styles.btnPrimary} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem' }}>
                    Apply Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* For Partners */}
      <AnimateOnScroll>
        <section className={`${layoutStyles.section} ${styles.involvementSection} ${styles.altSection}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag} style={{ borderColor: '#0ea5e9', color: '#0ea5e9', background: 'rgba(14,165,233,0.08)' }}>
              🤝 For Partners
            </div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Partner With Excellence</h2>
              <p className={styles.sectionDesc}>Collaborate with Elitech Hub to drive innovation in cybersecurity education and workforce development.</p>
            </div>
            <div className={styles.oppGrid}>
              {[
                { icon: '🏛️', title: 'Academic Partners', color: '#8b5cf6', items: ['Curriculum integration', 'Joint research opportunities', 'Student workshops & hackathons', 'Faculty exchange programs'] },
                { icon: '💼', title: 'Corporate Partners', color: '#0ea5e9', items: ['Custom employee security training', 'Brand visibility with future professionals', 'CSR opportunities', 'Internship pipeline access'] },
                { icon: '🛠️', title: 'Technology Partners', color: '#10b981', items: ['Product showcase to cyber students', 'Direct access to future professionals', 'Co-branded certification programs', 'Beta testing opportunities'] },
              ].map(({ icon, title, color, items }) => (
                <div key={title} className={styles.oppCard} style={{ borderTop: `3px solid ${color}` }}>
                  <div className={styles.oppIcon} style={{ color }}>{icon}</div>
                  <h3 className={styles.oppTitle}>{title}</h3>
                  <ul className={styles.oppList}>
                    {items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.partnerCta}>
              <a href="mailto:info@elitechub.com" className={styles.btnOutline}>
                ✉️ Email Us to Partner
              </a>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* For Volunteers / Mentors */}
      <AnimateOnScroll>
        <section className={`${layoutStyles.section} ${styles.involvementSection}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag} style={{ borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.08)' }}>
              🤲 Volunteers & Mentors
            </div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Give Back, Shape the Future</h2>
              <p className={styles.sectionDesc}>Your expertise can change lives. Join our growing community of cybersecurity volunteers and mentors.</p>
            </div>
            <div className={styles.oppGrid}>
              {[
                { icon: '🧭', title: 'Become a Mentor', color: '#f59e0b', items: ['Guide students through their career journey', '2-4 hours per week, flexible schedule', 'Join 20+ active mentors', '1:1 sessions + group guidance'] },
                { icon: '📚', title: 'Curriculum Contributor', color: '#c3151c', items: ['Help design and review course material', 'Create lab exercises and CTF challenges', 'Keep curriculum industry-relevant', 'Get credited as a co-author'] },
                { icon: '💬', title: 'Community Moderator', color: '#8b5cf6', items: ['Manage our Discord community', 'Host virtual study groups', 'Answer student questions', 'Build a thriving cyber community'] },
              ].map(({ icon, title, color, items }) => (
                <div key={title} className={styles.oppCard} style={{ borderTop: `3px solid ${color}` }}>
                  <div className={styles.oppIcon} style={{ color }}>{icon}</div>
                  <h3 className={styles.oppTitle}>{title}</h3>
                  <ul className={styles.oppList}>
                    {items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.partnerCta}>
              <Link href="/volunteer" className={styles.btnPrimary}>Apply to Volunteer</Link>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Host Interns / Sponsor */}
      <AnimateOnScroll>
        <section className={`${layoutStyles.section} ${styles.involvementSection} ${styles.altSection}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionTag} style={{ borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.08)' }}>
              🏢 Host Interns / Sponsor Talent
            </div>
            <div className={styles.contentGrid}>
              <div className={styles.contentText}>
                <h2 className={styles.sectionTitle}>Invest in Cybersecurity Talent</h2>
                <p className={styles.sectionDesc}>
                  Access a pipeline of vetted, trained cybersecurity professionals ready to contribute to your organisation. Or sponsor a talented student who can't afford training.
                </p>
                <div className={styles.twoCards}>
                  <div className={styles.miniCard}>
                    <h4>🏢 Host an Intern</h4>
                    <ul className={styles.benefitsList}>
                      <li>Pre-vetted, trained candidates</li>
                      <li>3 to 6 month internship programs</li>
                      <li>Zero recruitment cost</li>
                      <li>Option to hire full-time after</li>
                    </ul>
                  </div>
                  <div className={styles.miniCard}>
                    <h4>🎓 Sponsor a Student</h4>
                    <ul className={styles.benefitsList}>
                      <li>$100 sponsors one student fully</li>
                      <li>Named scholarship recognition</li>
                      <li>Impact report quarterly</li>
                      <li>Tax-deductible contribution</li>
                    </ul>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <a href="mailto:info@elitechub.com" className={styles.btnPrimary}>Contact Us to Host Interns</a>
                </div>
              </div>
              <div className={styles.contentCard}>
                <div className={styles.sponsorCard}>
                  <div className={styles.sponsorIcon}>💡</div>
                  <h3>Why Sponsor?</h3>
                  <p>Nigeria alone needs 50,000+ cybersecurity professionals by 2030. Every dollar you invest builds the talent pipeline your industry needs.</p>
                  <div className={styles.sponsorStat}>
                    <span className={styles.sponsorNumber}>$100</span>
                    <span>sponsors one complete cybersecurity education</span>
                  </div>
                  <a href="mailto:sponsorship@elitechub.com" className={styles.btnOutline} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem' }}>
                    Become a Sponsor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Final CTA */}
      <AnimateOnScroll>
        <section className={styles.ctaBanner}>
          <h2>Ready to Make an Impact?</h2>
          <p>Every action counts. Whether you apply, mentor, partner, or sponsor — you're building a more secure Africa.</p>
          <div className={styles.ctaActions}>
            <Link href="/apply" className={styles.btnPrimary}>Apply Now</Link>
            <Link href="/contact" className={styles.btnOutline}>Get in Touch</Link>
          </div>
        </section>
      </AnimateOnScroll>
    </PageLayout>
  );
}
