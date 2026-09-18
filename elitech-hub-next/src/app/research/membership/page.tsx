import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Research Membership | Elitech Hub',
  description:
    'Join the Elitech Hub Research Membership. An exclusive ecosystem for pioneering researchers in Behavioral Cybersecurity. Limited to 30 researchers globally. Applications open for January 2027.',
  keywords: 'behavioral cybersecurity, research membership, cybersecurity researchers, Elitech Hub research, cybersecurity ecosystem, January 2027 cohort',
  alternates: {
    canonical: 'https://elitechub.com/research/membership',
  },
  openGraph: {
    title: 'Research Membership | Elitech Hub',
    description:
      'An exclusive ecosystem for pioneering researchers in Behavioral Cybersecurity. Limited to 30 researchers globally. Applications open for January 2027.',
    url: 'https://elitechub.com/research/membership',
    siteName: 'Elitech Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Membership | Elitech Hub',
    description:
      'An exclusive ecosystem for pioneering researchers in Behavioral Cybersecurity. Limited to 30 researchers globally.',
  },
};

const benefits = [
  {
    icon: '🤝',
    title: 'Collaborative Ecosystem',
    description:
      'Connect with a curated group of 30 top-tier researchers. Share data, co-author papers, and tackle the most pressing behavioral cybersecurity challenges together.',
  },
  {
    icon: '🔐',
    title: 'Exclusive Resources',
    description:
      'Gain access to proprietary datasets, specialized analytical tools, and early-stage findings from Elitech Hub\u2019s internal research initiatives.',
  },
  {
    icon: '🌍',
    title: 'Global Visibility',
    description:
      'Amplify your work through Elitech Hub\u2019s platform. Feature your research in our publications and present at our exclusive symposiums.',
  },
];

const integrityPolicies = [
  {
    label: 'Ethical Data Usage',
    text: 'All research must respect user privacy, comply with global data protection regulations, and ensure informed consent where applicable.',
  },
  {
    label: 'Rigorous Methodology',
    text: 'We champion reproducible research. Members are expected to share their methodologies transparently with the cohort.',
  },
  {
    label: 'Constructive Collaboration',
    text: 'Foster a supportive environment. Critique ideas, not individuals, and actively contribute to the growth of fellow members.',
  },
  {
    label: 'Conflict of Interest Transparency',
    text: 'Any potential conflicts of interest must be disclosed promptly and fully.',
  },
];

const eligibilityItems = [
  'Active researchers in cybersecurity, behavioral science, or adjacent disciplines',
  'PhD candidates, postdoctoral researchers, or established academics',
  'Industry practitioners with a documented record of research output',
  'Independent researchers with peer-reviewed publications or equivalent work',
];

export default function ResearchMembershipPage() {
  return (
    <PageLayout>
      <section
        style={{
          background: "linear-gradient(135deg, rgba(10, 12, 16, 0.8) 0%, rgba(10, 12, 16, 0.95) 100%), url('/assets/images/research_membership_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--color-border)',
          padding: '6rem 1.5rem 5rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <AnimateOnScroll direction="up">
            <span
              style={{
                display: 'inline-block',
                background: 'var(--color-accent-dim)',
                color: 'var(--color-accent-bright)',
                border: '1px solid var(--color-accent)',
                borderRadius: '50px',
                padding: '0.35rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Coming January 2027
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Research{' '}
              <span style={{ color: 'var(--color-accent-bright)' }}>Membership</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: 'var(--color-text-secondary)',
                maxWidth: '680px',
                margin: '0 auto 1.75rem',
                lineHeight: 1.7,
              }}
            >
              An exclusive ecosystem for pioneering researchers in Behavioral Cybersecurity.
              We are accepting early applications for our inaugural cohort — limited to exactly{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>30 researchers</strong> globally.
              <br /><br />
              <strong style={{ color: 'var(--color-accent-bright)', fontSize: '1.1em' }}>Founding Cohort Membership: NGN 50,000</strong>
            </p>

            <Link href="/research/membership/apply" className="premium-button">
              Apply Now →
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section
        style={{
          background: 'var(--color-bg-base)',
          padding: '5rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <AnimateOnScroll direction="up">
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              Membership Benefits
            </h2>
          </AnimateOnScroll>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {benefits.map((benefit, i) => (
              <AnimateOnScroll key={benefit.title} direction="up" delay={i * 100}>
                <div
                  className="glass-panel"
                  style={{ padding: '2rem', height: '100%' }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }} aria-hidden="true">
                    {benefit.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--color-accent-bright)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                      margin: 0,
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Integrity ── */}
      <section
        style={{
          background: 'var(--color-bg-panel)',
          padding: '5rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <AnimateOnScroll direction="up">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  textAlign: 'center',
                  marginBottom: '1rem',
                }}
              >
                Our Commitment to Integrity
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                }}
              >
                Elitech Hub maintains the highest standards of research integrity, ethics, and
                transparency. As a member of this exclusive cohort, you agree to abide by our
                core principles:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {integrityPolicies.map((policy, i) => (
                  <AnimateOnScroll key={policy.label} direction="left" delay={i * 80}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        background: 'var(--color-bg-raised)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: '10px',
                        padding: '1.25rem 1.5rem',
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--color-accent)',
                          flexShrink: 0,
                          marginTop: '7px',
                        }}
                        aria-hidden="true"
                      />
                      <p
                        style={{
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.65,
                          fontSize: '0.95rem',
                          margin: 0,
                        }}
                      >
                        <strong style={{ color: 'var(--color-text-primary)' }}>
                          {policy.label}:
                        </strong>{' '}
                        {policy.text}
                      </p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              <p
                style={{
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  marginTop: '2rem',
                  fontSize: '0.9rem',
                }}
              >
                By applying for the Elitech Hub Research Membership, you acknowledge these
                principles and commit to upholding them throughout your tenure.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <section
        style={{
          background: 'var(--color-bg-base)',
          padding: '5rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <AnimateOnScroll direction="up">
            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              Who Should Apply?
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '640px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              This membership is designed for professionals at the intersection of technology,
              human behaviour, and security research.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              {eligibilityItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent-bright)',
                      fontWeight: 700,
                      flexShrink: 0,
                      fontSize: '1.1rem',
                    }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                      margin: 0,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-bg-panel) 0%, var(--color-bg-raised) 100%)',
          borderTop: '1px solid var(--color-border)',
          padding: '5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <AnimateOnScroll direction="up">
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                }}
              >
                Ready to Join the Cohort?
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                }}
              >
                Submit your application today. We are reviewing candidates on a rolling basis
                for the January 2027 launch.
              </p>
              <Link href="/research/membership/apply" className="premium-button">
                Submit Application →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
