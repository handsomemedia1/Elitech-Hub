import React from 'react';
import PageLayout from '@/components/PageLayout';
import ApplyForm from './ApplyForm';
import styles from './apply.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import PriceDisplay from '@/components/PriceDisplay';
import { 
  Rocket, 
  Users, 
  CreditCard, 
  Check, 
  Quote 
} from 'lucide-react';

export const metadata = {
  title: 'Apply Now | Start Your Cybersecurity Career | Elitech Hub Nigeria',
  description:
    'Apply to Elitech Hub\'s cybersecurity bootcamp or 16-week professional program in Nigeria. 300+ trained. 100% internship rate. Weekend classes available. No experience required. Enroll today.',
  keywords: [
    'apply cybersecurity bootcamp Nigeria',
    'enroll cybersecurity training Lagos',
    'cybersecurity program application Nigeria',
    'start cybersecurity career Nigeria',
    'Elitech Hub apply',
    'cybersecurity course enrollment Nigeria',
    'cybersecurity bootcamp registration Nigeria',
    'IT training application Nigeria',
  ],
  openGraph: {
    title: 'Apply to Elitech Hub | Start Your Cybersecurity Career',
    description: '300+ trained. Unpaid internship experience. Apply now — next cohort filling fast.',
    url: 'https://elitechub.com/apply',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Apply to Elitech Hub Nigeria', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/apply' },
};


export default function ApplyPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'Apply', item: 'https://elitechub.com/apply' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Elitech Hub',
      url: 'https://elitechub.com',
      potentialAction: [
        { '@type': 'ApplyAction', target: 'https://elitechub.com/apply?program=bootcamp6', name: 'Apply for 6-Week Bootcamp' },
        { '@type': 'ApplyAction', target: 'https://elitechub.com/apply?program=prof16', name: 'Apply for 16-Week Professional Program' },
        { '@type': 'ApplyAction', target: 'https://elitechub.com/apply?program=corporate', name: 'Apply for Corporate Training' },
      ],
    },
  ];


  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className={styles.container}>
        {/* Program selector banner */}
        <section style={{ padding: '2rem 5% 0', maxWidth: '900px', margin: '0 auto' }}>
          <AnimateOnScroll direction="fade">
            <p style={{ textAlign: 'center', color: 'var(--color-accent-bright)', fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.78rem', marginBottom: '0.75rem' }}>CHOOSE YOUR PROGRAM</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { href: '/programs/cybersecurity-bootcamp', label: '6-Week Bootcamp', price: <PriceDisplay courseId="bootcamp" fallback="₦75,000" />, color: '#ef4444' },
                { href: '/programs/professional', label: '16-Week Professional', price: <><PriceDisplay courseId="professional" fallback="₦200,000" /> · Internship</>, color: '#a855f7' },
                { href: '/programs/corporate-training', label: 'Corporate Training', price: 'Custom quote', color: '#06b6d4' },
              ].map((p, i) => (
                <a key={p.href} href={p.href} style={{ display: 'block', background: 'var(--color-bg-panel)', border: `1px solid ${p.color}33`, borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', textAlign: 'center', transition: 'border-color 0.2s' }}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{p.label}</div>
                  <div style={{ color: p.color, fontWeight: 700, fontSize: '0.82rem' }}>{p.price}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginTop: '0.35rem' }}>View full details →</div>
                </a>
              ))}
            </div>
          </AnimateOnScroll>
        </section>

        {/* Page Hero */}
        <section className={styles.hero}>
          <AnimateOnScroll direction="fade">
            <span className={styles.label}>Join The Next Cohort</span>
            <h1 className={styles.title}>Begin Your Cybersecurity Journey</h1>
            <p className={styles.subtitle}>
              300+ students trained. 100% internship rate. Your success starts here.
            </p>
          </AnimateOnScroll>
        </section>

        {/* Application Steps */}
        <AnimateOnScroll direction="up" delay={100}>
          <section className={styles.steps}>
            <div className={`${styles.stepItem} ${styles.active}`}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepText}>Submit Application</div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepText}>Admissions Review<br/>(24-48hrs)</div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepText}>Orientation Call</div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepText}>Begin Training</div>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Application Form Component */}
        <AnimateOnScroll direction="up" delay={200}>
          <ApplyForm />
        </AnimateOnScroll>

        {/* Why Apply Now */}
        <section className={styles.whyApplyGrid}>
          <AnimateOnScroll direction="up" delay={100}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Users size={40} color="#22d3ee" />
              </div>
              <h3 className={styles.cardTitle}>Limited Seats</h3>
              <p className={styles.cardText}>
                We keep our class sizes small to ensure personalized attention and direct mentorship for every student.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={200}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Rocket size={40} color="#f59e0b" />
              </div>
              <h3 className={styles.cardTitle}>Cohort Starting Soon</h3>
              <p className={styles.cardText}>
                The next rigorous cybersecurity bootcamp cohort is starting in a few weeks. Secure your spot now before it closes.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={300}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <CreditCard size={40} color="#10b981" />
              </div>
              <h3 className={styles.cardTitle}>Flexible Payment Plans</h3>
              <p className={styles.cardText}>
                We offer a flexible installment plan (maximum of 2 installments) for the 16-Week Professional class to make learning accessible without any financial stress. All payments are non-refundable.
              </p>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Bottom Section */}
        <section className={styles.bottomSection}>
          <AnimateOnScroll direction="left" delay={100}>
            <div className={styles.testimonialCard}>
              <Quote className={styles.quoteIcon} size={80} />
              <p className={styles.quote}>
                Applying to Elitech Hub was the best career decision I've ever made. Within 4 months of graduating, I landed a role as a SOC Analyst. The hands-on training is unmatched.
              </p>
              <div>
                <div className={styles.author}>Sarah Johnson</div>
                <div className={styles.authorRole}>SOC Analyst & Alumni</div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={200}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>
                <CreditCard size={24} color="#38bdf8" /> Payment Information
              </h3>
              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoIcon}><Check size={16} /></span>
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Pay in exactly 2 Installments (16-Week class only)</strong><br/>
                    We support monthly payment splits. Begin your training with an initial deposit.
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon}><Check size={16} /></span>
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Bank Transfer Available</strong><br/>
                    Secure direct bank transfers supported for all major local and international banks.
                  </div>
                </li>
                <li>
                  <span className={styles.infoIcon}><Check size={16} /></span>
                  <div>
                    <strong style={{ color: '#f8fafc' }}>Refund Policy</strong><br/>
                    All payments are non-refundable. We advise you to ask necessary questions before paying.
                  </div>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
