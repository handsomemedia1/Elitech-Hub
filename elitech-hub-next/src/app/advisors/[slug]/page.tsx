import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseServerClient } from '@/lib/supabase';
import { ChevronLeft, Building2, Globe, Award, BookOpen, Star, ShieldCheck, Briefcase } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

async function getAdvisor(slug: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('advisors')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const advisor = await getAdvisor(slug);

  if (!advisor) {
    return { title: 'Advisor Not Found | Elitech Hub' };
  }

  const title = `${advisor.full_name} - ${advisor.professional_title || 'Advisor'} | Elitech Hub`;
  const description = advisor.biography ? advisor.biography.substring(0, 160) + '...' : `Profile of ${advisor.full_name}, ${advisor.professional_title} advising at Elitech Hub.`;

  return {
    title,
    description,
    alternates: { canonical: `https://elitechub.com/advisors/${slug}` },
    openGraph: {
      title,
      description,
      type: 'profile',
      images: advisor.profile_image_url ? [{ url: advisor.profile_image_url }] : undefined,
    }
  };
}

export default async function AdvisorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const advisor = await getAdvisor(slug);

  if (!advisor) {
    notFound();
  }

  // Generate sameAs array for structured data
  const sameAs = [advisor.linkedin_url, advisor.x_url, advisor.personal_website_url].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: advisor.full_name,
      jobTitle: advisor.professional_title || 'Advisor',
      ...(advisor.organization && {
        worksFor: {
          '@type': 'Organization',
          name: advisor.organization,
        }
      }),
      image: advisor.profile_image_url || undefined,
      description: advisor.biography || undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
      knowsAbout: advisor.expertise || undefined,
      url: `https://elitechub.com/advisors/${slug}`,
    }
  };

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <section style={{ 
        paddingTop: '120px', 
        paddingBottom: '4rem',
        background: 'linear-gradient(to bottom, var(--color-bg-base), var(--color-bg-main))'
      }}>
        <div className="container">
          <Link href="/advisors" className="back-link">
            <ChevronLeft size={16} /> Back to Advisors
          </Link>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'flex-start', marginTop: '2rem' }}>
            {/* LEFT SIDE: Profile Card */}
            <AnimateOnScroll direction="left">
              <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 2rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--color-border)', boxShadow: 'var(--shadow-glow)', background: 'var(--color-bg-raised)' }}>
                  {advisor.profile_image_url ? (
                    <Image 
                      src={advisor.profile_image_url} 
                      alt={advisor.full_name} 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: 'var(--color-text-muted)' }}>
                      {advisor.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{advisor.full_name}</h1>
                <div style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  {advisor.professional_title}
                </div>
                
                {advisor.organization && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    <Building2 size={16} /> {advisor.organization}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  {advisor.linkedin_url && (
                    <a href={advisor.linkedin_url} target="_blank" rel="noopener noreferrer" className="premium-button-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      LinkedIn
                    </a>
                  )}
                  {advisor.x_url && (
                    <a href={advisor.x_url} target="_blank" rel="noopener noreferrer" className="premium-button-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      X/Twitter
                    </a>
                  )}
                  {advisor.personal_website_url && (
                    <a href={advisor.personal_website_url} target="_blank" rel="noopener noreferrer" className="premium-button-outline" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
            
            {/* RIGHT SIDE: Bio & Details */}
            <AnimateOnScroll direction="right" delay={200}>
              <div>
                {advisor.role_at_elitech && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-accent-dim)', color: 'var(--color-accent-bright)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem' }}>
                    <Star size={16} /> {advisor.role_at_elitech}
                  </div>
                )}
                
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Biography</h2>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
                  {advisor.biography || 'No biography provided.'}
                </div>

                {advisor.expertise && advisor.expertise.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={20} color="var(--color-accent)" /> Expertise
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {advisor.expertise.map((item: string, index: number) => (
                        <span key={index} className="glass-panel" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {advisor.areas_of_specialization && advisor.areas_of_specialization.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={20} color="#3b82f6" /> Specializations
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {advisor.areas_of_specialization.map((item: string, index: number) => (
                        <span key={index} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', border: '1px solid var(--color-border-light)', borderRadius: '6px', color: 'var(--color-text-secondary)' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ADDITIONAL INFO TABS / SECTIONS */}
      {(advisor.achievements || advisor.credentials || advisor.publications) && (
        <section className="container" style={{ paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {advisor.achievements && (
              <AnimateOnScroll direction="up">
                <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Award size={24} color="#f59e0b" />
                    <h3 style={{ fontSize: '1.3rem' }}>Achievements</h3>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                    {advisor.achievements}
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {advisor.credentials && (
              <AnimateOnScroll direction="up" delay={150}>
                <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={24} color="#10b981" />
                    <h3 style={{ fontSize: '1.3rem' }}>Credentials</h3>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                    {advisor.credentials}
                  </div>
                </div>
              </AnimateOnScroll>
            )}

            {advisor.publications && (
              <AnimateOnScroll direction="up" delay={300}>
                <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <BookOpen size={24} color="#a855f7" />
                    <h3 style={{ fontSize: '1.3rem' }}>Publications</h3>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                    {advisor.publications}
                  </div>
                </div>
              </AnimateOnScroll>
            )}
            
          </div>
        </section>
      )}
    </PageLayout>
  );
}
