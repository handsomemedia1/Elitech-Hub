import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './policies.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/policies' },
  title: 'Terms & Privacy Policy | Elitech Hub Nigeria',
  description: 'Elitech Hub Terms of Service and Privacy Policy. Learn about our data practices, user rights, and platform guidelines.',
  robots: { index: false, follow: false },
};

export default function PoliciesPage() {
  return (
    <PageLayout>
      <AnimateOnScroll>
        <section className={layoutStyles.pageHero} style={{ minHeight: '35vh' }}>
          <span className={layoutStyles.pageHeroLabel}>Legal Documents</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Terms &amp; <span className={layoutStyles.accentRed}>Privacy Policy</span>
          </h1>
          <p className={layoutStyles.pageHeroSub}>Last Updated: January 2026</p>
        </section>
      </AnimateOnScroll>

      <section className={layoutStyles.section}>
        <div className={styles.container}>

          {/* Quick Nav */}
          <div className={styles.quickNav}>
            <Link href="#terms" className={styles.quickNavLink}>Terms of Service</Link>
            <Link href="#privacy" className={styles.quickNavLink}>Privacy Policy</Link>
            <Link href="#cookies" className={styles.quickNavLink}>Cookie Policy</Link>
            <Link href="#refund" className={styles.quickNavLink}>Refund Policy</Link>
          </div>

          {/* Terms of Service */}
          <div id="terms" className={styles.policySection}>
            <h2 className={styles.policyTitle}>📋 Terms of Service</h2>
            <p className={styles.policyText}>By accessing and using Elitech Hub (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. Please read them carefully before enrolling in any program or using our services.</p>

            <h3 className={styles.subTitle}>1. Acceptance of Terms</h3>
            <p className={styles.policyText}>By registering or using any part of this platform, you confirm that you are at least 16 years old and agree to these terms in full. If you are under 18, you must have parental or guardian consent.</p>

            <h3 className={styles.subTitle}>2. Services Provided</h3>
            <p className={styles.policyText}>Elitech Hub provides cybersecurity training programs, educational content, mentorship, and career placement support. All programs are delivered virtually unless otherwise stated.</p>

            <h3 className={styles.subTitle}>3. Payment &amp; Enrollment</h3>
            <ul className={styles.policyList}>
              <li>Fees must be paid before access to program materials is granted.</li>
              <li>We accept bank transfer, Flutterwave (Nigeria) and Stripe (international).</li>
              <li>Installment payment plans are available for the 16-Week program — contact us before enrolling.</li>
              <li>Prices are listed in NGN and USD; currency conversion is approximate.</li>
            </ul>

            <h3 className={styles.subTitle}>4. Code of Conduct</h3>
            <ul className={styles.policyList}>
              <li>All cybersecurity techniques taught are for ethical, legal, and defensive purposes only.</li>
              <li>Using skills learned at Elitech Hub to perform unauthorized access on any system is strictly prohibited.</li>
              <li>Respect all community members, instructors, and staff at all times.</li>
              <li>Sharing course materials externally without written permission is prohibited.</li>
            </ul>

            <h3 className={styles.subTitle}>5. Certificates &amp; Credentials</h3>
            <p className={styles.policyText}>Certificates are issued only upon successful completion of a program (attendance + assessments). Elitech Hub certificates are not substitutes for industry certifications (CompTIA, CEH, etc.) but prepare you for them.</p>

            <h3 className={styles.subTitle}>6. Intellectual Property</h3>
            <p className={styles.policyText}>All course materials, videos, slides, and resources are the intellectual property of Elitech Hub. You are granted a personal, non-transferable license to access them for your own learning only.</p>

            <h3 className={styles.subTitle}>7. Limitation of Liability</h3>
            <p className={styles.policyText}>Elitech Hub provides educational services. We provide unpaid internship experience but we do not guarantee job placement or employment after program completion. We are not liable for any losses resulting from the application of skills learned on this platform.</p>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className={styles.policySection}>
            <h2 className={styles.policyTitle}>🔒 Privacy Policy</h2>
            <p className={styles.policyText}>Elitech Hub (RC: 8693883) is committed to protecting your personal data. This policy explains how we collect, use, store, and protect your information.</p>

            <h3 className={styles.subTitle}>Information We Collect</h3>
            <ul className={styles.policyList}>
              <li><strong>Personal Information:</strong> Name, email, phone number, country when you apply or register</li>
              <li><strong>Payment Information:</strong> Processed securely via Flutterwave or Stripe — we never store card details</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, device information via Google Analytics</li>
              <li><strong>Communications:</strong> Messages sent through contact forms or WhatsApp</li>
            </ul>

            <h3 className={styles.subTitle}>How We Use Your Information</h3>
            <ul className={styles.policyList}>
              <li>To deliver enrolled programs and send course materials</li>
              <li>To process payments and issue receipts</li>
              <li>To communicate about cohort schedules and updates</li>
              <li>To issue certificates and verify credentials</li>
              <li>To improve our platform through analytics</li>
              <li>To send marketing communications (you may unsubscribe anytime)</li>
            </ul>

            <h3 className={styles.subTitle}>Data Retention</h3>
            <p className={styles.policyText}>We retain your data for as long as you have an active relationship with Elitech Hub, plus 5 years for compliance. Certificate records are retained indefinitely for verification purposes.</p>

            <h3 className={styles.subTitle}>Your Rights (NDPR &amp; GDPR)</h3>
            <ul className={styles.policyList}>
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion (where legally permissible)</li>
              <li>Right to opt out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>
            <p className={styles.policyText}>To exercise your rights, email: <a href="mailto:privacy@elitechub.com" style={{ color: '#c3151c' }}>privacy@elitechub.com</a></p>

            <div className={styles.highlightBox}>
              <strong>Note:</strong> We comply with Nigeria&apos;s National Data Protection Regulation (NDPR) and, where applicable, the EU General Data Protection Regulation (GDPR).
            </div>
          </div>

          {/* Cookie Policy */}
          <div id="cookies" className={styles.policySection}>
            <h2 className={styles.policyTitle}>🍪 Cookie Policy</h2>
            <p className={styles.policyText}>We use cookies to improve your experience on our platform. Here&apos;s what we use:</p>
            <ul className={styles.policyList}>
              <li><strong>Essential Cookies:</strong> Required for the site to function (session management, security)</li>
              <li><strong>Analytics Cookies:</strong> Google Analytics to understand how visitors use our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className={styles.policyText}>You can disable non-essential cookies through your browser settings, though this may affect your experience.</p>
          </div>

          {/* Refund Policy */}
          <div id="refund" className={styles.policySection}>
            <h2 className={styles.policyTitle}>💰 Payment & Refund Policy</h2>
            <p className={styles.policyText}>We strive to provide premium educational content and hands-on experiences.</p>
            <ul className={styles.policyList}>
              <li><strong>All payments are strictly non-refundable.</strong> We encourage students to ask questions and review course details carefully before making a payment.</li>
              <li>Installment payment plans are strictly limited to exactly two (2) installments, and are only available for the 16-Week Professional Program. Split payments are not allowed for the 6-Week Bootcamp.</li>
              <li>Certificates are only issued after full completion of the curriculum, capstone projects, and full settlement of any outstanding tuition.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.contactBox}>
            <h3>Questions About These Policies?</h3>
            <p>Contact our team at <a href="mailto:info@elitechub.com">info@elitechub.com</a> or via WhatsApp at +234 708 196 8062.</p>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
