import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, ExternalLink, Shield, Database, Award, BookOpen, Briefcase, GraduationCap, ChevronLeft } from 'lucide-react';
import { LinkedinLogo, PhosphorGlobe } from '@/components/PhosphorIcons';

export const metadata: Metadata = {
  title: 'Elijah Adeyeye - Founder & Lead Instructor | Elitech Hub',
  description: 'Profile of Elijah Adeyeye, Founder of Elitech Hub. Expert in Behavioral Cybersecurity, Data Analysis, and digital security.',
  alternates: { canonical: 'https://elitechub.com/founder' },
};

export default function FounderPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Elijah Adeyeye',
      jobTitle: 'Founder & Lead Instructor',
      worksFor: {
        '@type': 'Organization',
        name: 'Elitech Hub',
        url: 'https://elitechub.com'
      },
      url: 'https://elitechub.com/founder',
      sameAs: [
        'https://elijahadeyeye.vercel.app/',
        'https://orcid.org/0009-0005-4853-7813'
      ],
      description: 'Elijah Adeyeye approaches digital security through a behavioral lens, leveraging his background in Psychology, Cybersecurity, and Data Analysis.',
      knowsAbout: ['Behavioral Cybersecurity', 'Data Analysis', 'Psychology', 'Ethical Hacking']
    }
  };

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* HERO SECTION */}
      <section style={{ 
        paddingTop: '120px', 
        paddingBottom: '4rem',
        background: 'linear-gradient(to bottom, var(--color-bg-base), var(--color-bg-main))'
      }}>
        <div className="container">
          <Link href="/about" className="back-link">
            <ChevronLeft size={16} /> Back to About
          </Link>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'flex-start', marginTop: '2rem' }}>
            <AnimateOnScroll direction="left">
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto 2rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-border)', boxShadow: 'var(--shadow-glow)' }}>
                  <Image 
                    src="/assets/images/official pic.png" 
                    alt="Elijah Adeyeye" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Elijah Adeyeye</h1>
                <div style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  Founder & Lead Instructor
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="mailto:Elijahadeyeye@proton.me" className="premium-button" style={{ padding: '0.6rem 1.5rem' }}>
                    <Mail size={16} /> Contact
                  </a>
                  <a href="https://elijahadeyeye.vercel.app/" target="_blank" rel="noopener noreferrer" className="premium-button-outline">
                    <PhosphorGlobe size={16} /> Portfolio
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll direction="right" delay={200}>
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                  Behavioral <span className="text-accent">Cybersecurity</span> Expert
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                  With a unique background in <strong>Guidance and Counselling</strong> from the University of Ibadan paired with advanced certifications in <strong>Cybersecurity and Data Analysis</strong>, Elijah approaches digital security through a behavioral lens.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  His interdisciplinary approach enables him to see connections where others don't. He firmly believes that understanding human behavior is the key to predicting and preventing cyber threats.
                </p>
                
                <div style={{ padding: '2rem', borderLeft: '4px solid var(--color-accent)', background: 'var(--color-bg-panel)', borderRadius: '0 12px 12px 0', marginBottom: '2rem', fontStyle: 'italic', color: 'var(--color-text-primary)', fontSize: '1.2rem' }}>
                  "Cybersecurity isn't just about firewalls—it's about profiling. Hackers study their victims' habits, fears, and routines. The safest systems are built by psychologists who speak code."
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Shield size={16} color="var(--color-success)" /> Cybersecurity
                  </span>
                  <span className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Database size={16} color="#3b82f6" /> Data Analysis
                  </span>
                  <span className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <Award size={16} color="#a855f7" /> B.Sc. Psychology
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* EXPERTISE & PROJECTS */}
      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <AnimateOnScroll direction="up">
            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Briefcase size={28} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1.5rem' }}>Experience</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>Founder & Lead Instructor</div>
                  <div style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Elitech Hub</div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Leading cybersecurity training initiatives, curriculum development, and fostering Africa's next generation of digital defenders.</p>
                </li>
                {/* Additional experiences can be populated here */}
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={150}>
            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <BookOpen size={28} color="#3b82f6" />
                <h3 style={{ fontSize: '1.5rem' }}>Publications</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li>
                  <a href="https://orcid.org/0009-0005-4853-7813" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)', transition: 'all 0.2s ease' }} className="hover:border-blue-500">
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>View ORCID Profile</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      <ExternalLink size={14} /> 0009-0005-4853-7813
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={300}>
            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <GraduationCap size={28} color="#10b981" />
                <h3 style={{ fontSize: '1.5rem' }}>Education & Certifications</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>B.Sc. Guidance and Counselling (Psychology)</div>
                  <div style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>University of Ibadan</div>
                </li>
                <li>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>Advanced Data Analysis</div>
                  <div style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>Certification</div>
                </li>
                <li>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>Cybersecurity Specialist</div>
                  <div style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>Certification</div>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
