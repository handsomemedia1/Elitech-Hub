import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseServerClient } from '@/lib/supabase';
import { ChevronRight, Building2, Globe, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Advisors | Elitech Hub',
  description: 'Meet the experienced professionals and industry leaders guiding Elitech Hub.',
  keywords: 'Elitech Hub advisors, cybersecurity advisory board, tech industry leaders Nigeria, cybersecurity mentors',
  alternates: { canonical: 'https://elitechub.com/advisors' },
  openGraph: {
    title: 'Our Advisors | Elitech Hub',
    description: 'Meet the experienced professionals and industry leaders guiding Elitech Hub.',
    url: 'https://elitechub.com/advisors',
    type: 'website',
  }
};

export default async function AdvisorsPage() {
  const supabase = getSupabaseServerClient();
  const { data: advisors, error } = await supabase
    .from('advisors')
    .select('full_name, slug, professional_title, organization, profile_image_url, role_at_elitech, linkedin_url, x_url, personal_website_url')
    .eq('status', 'active')
    .order('full_name');

  return (
    <PageLayout>
      <section style={{ 
        paddingTop: '120px', 
        paddingBottom: '4rem',
        background: 'linear-gradient(to bottom, var(--color-bg-base), var(--color-bg-main))'
      }}>
        <div className="container">
          <AnimateOnScroll direction="fade">
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
              <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(195, 21, 28, 0.1)', color: 'var(--color-accent)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
                Leadership & Guidance
              </div>
              <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Our <span className="text-gradient-primary">Advisors</span></h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                Meet the experienced professionals, industry leaders, and academic experts guiding our curriculum and vision to secure Africa's digital future.
              </p>
            </div>
          </AnimateOnScroll>

          {error && (
            <div style={{ padding: '2rem', background: 'var(--color-bg-panel)', border: '1px solid var(--color-error)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-error)' }}>Failed to load advisors. Please try again later.</p>
            </div>
          )}

          {!error && (!advisors || advisors.length === 0) && (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--color-bg-panel)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No active advisors found.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {advisors?.map((advisor, index) => (
              <AnimateOnScroll key={advisor.slug} direction="up" delay={index * 100}>
                <Link href={`/advisors/${advisor.slug}`} style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}>
                  <div
                    className="glass-panel"
                    style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(195,21,28,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-border)', flexShrink: 0, position: 'relative', background: 'var(--color-bg-raised)' }}>
                        {advisor.profile_image_url ? (
                          <Image src={advisor.profile_image_url} alt={advisor.full_name} fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--color-text-muted)' }}>
                            {advisor.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{advisor.full_name}</h3>
                        <p style={{ color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 500 }}>{advisor.professional_title}</p>
                      </div>
                    </div>
                    
                    {advisor.organization && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <Building2 size={14} /> {advisor.organization}
                      </div>
                    )}
                    
                    <p style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', lineHeight: 1.5, flexGrow: 1, marginBottom: '1.5rem' }}>
                      {advisor.role_at_elitech || 'Advisor at Elitech Hub'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                        {advisor.linkedin_url && (
                          <a href={advisor.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }} className="hover:text-blue-500">
                            LinkedIn
                          </a>
                        )}
                        {advisor.x_url && (
                          <a href={advisor.x_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }} className="hover:text-gray-300">
                            X/Twitter
                          </a>
                        )}
                        {advisor.personal_website_url && (
                          <a href={advisor.personal_website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }} className="hover:text-green-500">
                            <Globe size={18} />
                          </a>
                        )}
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                        View Profile <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
