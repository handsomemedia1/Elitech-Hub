import React from 'react';
import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { Star, MessageCircle, Heart, Quote } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabase';
import styles from '../about/about.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Testimonials & Reviews | Elitech Hub',
  description: 'See what our students, partners, and clients are saying about Elitech Hub. Read our verified testimonials.',
  keywords: [
    'Elitech Hub reviews',
    'Elitech Hub testimonials',
    'Cybersecurity training reviews Nigeria',
    'Web development agency reviews'
  ],
  openGraph: {
    title: 'Testimonials | Elitech Hub',
    description: 'Real feedback from our students and clients.',
    url: 'https://elitechub.com/testimonials',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://elitechub.com/testimonials'
  }
};

export default async function TestimonialsPage() {
  const supabase = getSupabaseServerClient();
  
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  const featuredTestimonials = testimonials?.filter(t => t.featured) || [];
  const standardTestimonials = testimonials?.filter(t => !t.featured) || [];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className={styles.hero} style={{ backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={200}>
          <div className={styles.badge}>
            <Heart size={16} style={{ color: '#ef4444' }} />
            <span style={{ marginLeft: '8px' }}>Wall of Love</span>
          </div>
          <h1 className={styles.title}>
            Trusted by <span className="text-gradient-primary">Hundreds</span> of Students, Clients & Partners
          </h1>
          <p className={styles.subtitle} style={{ maxWidth: '700px', margin: '0 auto' }}>
            Don't just take our word for it. Read verified reviews from the interns, volunteers, students, and businesses whose careers and platforms we've helped transform.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Featured Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section style={{ padding: '6rem 5%', background: 'var(--color-bg-base)' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text-primary)' }}>Featured Stories</h2>
              <div style={{ width: '60px', height: '4px', background: 'var(--color-primary)', margin: '1.5rem auto' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {featuredTestimonials.map(t => (
                <div key={t.id} style={{ background: '#111317', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                  <Quote size={32} style={{ color: 'var(--color-primary)', opacity: 0.5, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)', fontStyle: 'italic', marginBottom: '2rem', flex: 1 }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {t.avatar_url ? (
                        <img src={t.avatar_url} alt={t.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{t.avatar_initials || t.author_name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{t.author_name}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        {t.author_role} {t.organization ? `at ${t.organization}` : ''}
                      </p>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Standard Testimonials Grid */}
      <section style={{ padding: '6rem 5%', background: 'var(--color-bg-alt)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <MessageCircle size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Community Feedback
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Direct feedback collected from our diverse community.
            </p>
          </div>
          
          <div style={{ padding: '2rem 0' }}>
            {standardTestimonials.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {standardTestimonials.map(t => (
                  <div key={t.id} style={{ background: '#111317', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>"{t.quote}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt={t.author_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{t.avatar_initials || t.author_name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{t.author_name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {t.author_role} {t.organization ? `at ${t.organization}` : ''}
                        </p>
                      </div>
                    </div>
                    {t.source && t.source !== 'manual' && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Verified via {t.source.charAt(0).toUpperCase() + t.source.slice(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>More testimonials coming soon.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ padding: '4rem 5%', background: 'var(--color-bg-base)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111317', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '3rem' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to start your journey?</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Join the hundreds of successful professionals who have transformed their careers with Elitech Hub.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/programs" className="premium-button">
              Explore Programs
            </Link>
            <Link href="/services" className="premium-button-outline">
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
