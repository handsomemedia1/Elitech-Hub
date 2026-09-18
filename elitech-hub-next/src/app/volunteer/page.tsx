import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Volunteer & Mentor | Elitech Hub',
  description: 'Join Elitech Hub as a volunteer mentor and help shape the next generation of African cybersecurity professionals.',
  keywords: 'volunteer mentor, cybersecurity mentor Nigeria, tech mentoring Africa, give back to tech community, cybersecurity instructor, Elitech Hub volunteer',
  alternates: { canonical: 'https://elitechub.com/volunteer' },
  openGraph: {
    title: 'Volunteer & Mentor | Elitech Hub',
    description: 'Join Elitech Hub as a volunteer mentor and help shape the next generation of African cybersecurity professionals.',
    url: 'https://elitechub.com/volunteer',
    type: 'website',
  }
};

export default function VolunteerPage() {
  return (
    <PageLayout>
      <AnimateOnScroll>
        <section className={layoutStyles.pageHero}>
          <span className={layoutStyles.pageHeroLabel}>Give Back</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Become a <span className={layoutStyles.accentRed}>Mentor</span>
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Your cybersecurity expertise can change lives. Join 20+ active mentors guiding the next generation of African cyber defenders.
          </p>
        </section>
      </AnimateOnScroll>

      <section className={layoutStyles.section}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          <AnimateOnScroll>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '1rem',
              padding: '2.5rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>
                🧭 Mentorship Program
              </h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                As an Elitech Hub mentor, you&apos;ll guide students through their cybersecurity journey — answering questions, reviewing projects, and providing career advice based on your real-world experience.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {['2–4 hours per week, fully flexible schedule', '1:1 sessions plus optional group guidance', 'Join a growing network of 20+ mentors', 'Access to Elitech Hub resources and community'].map(item => (
                  <li key={item} style={{ color: '#94a3b8', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#c3151c', fontWeight: 800 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:mentors@elitechub.com?subject=Mentor Application"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#c3151c',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Apply to Mentor
              </a>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>Want to contribute in other ways?</p>
              <Link href="/get-involved" style={{ color: '#c3151c', fontWeight: 700, textDecoration: 'underline' }}>
                See all ways to get involved →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
