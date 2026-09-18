import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, Zap, Shield, Search, Layout } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to fetch from DB
  const { data: caseStudy } = await supabase
    .from('web_case_studies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!caseStudy) {
    return { title: 'Case Study Not Found | Elitech Hub' };
  }

  const title = `${caseStudy.title} | Web Development Case Study | Elitech Hub`;
  const description = caseStudy.problem ? caseStudy.problem.substring(0, 150) + '...' : 'A premium web development case study by Elitech Hub.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: caseStudy.cover_image ? [{ url: caseStudy.cover_image }] : undefined,
    },
    alternates: {
      canonical: `https://elitechub.com/portfolio/${slug}`,
    }
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  
  // Try to fetch from DB
  const { data: caseStudy } = await supabase
    .from('web_case_studies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!caseStudy) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "image": caseStudy.cover_image,
    "author": {
      "@type": "Organization",
      "name": "Elitech Hub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Elitech Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://elitechub.com/images/logo.png"
      }
    }
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem 4rem', background: '#0a0f1e', color: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
          
          <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1rem' }}>
            Case Study • {caseStudy.client_industry || 'Web Development'}
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
            {caseStudy.title}
          </h1>
          
          {caseStudy.client_name && (
            <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '2rem' }}>
              Client: {caseStudy.client_name}
            </p>
          )}

          {caseStudy.live_url && (
            <a href={caseStudy.live_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              <ExternalLink size={18} /> View Live Project
            </a>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '4rem' }}>
          
          {/* Cover Image */}
          {caseStudy.cover_image && (
            <div style={{ width: '100%', height: 'auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img src={caseStudy.cover_image} alt={caseStudy.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Left Column: Story */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {caseStudy.problem && (
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>The Challenge</h2>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>{caseStudy.problem}</p>
                </div>
              )}

              {caseStudy.solution && (
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Our Solution</h2>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>{caseStudy.solution}</p>
                </div>
              )}

              {caseStudy.results && (
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>The Results</h2>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>{caseStudy.results}</p>
                </div>
              )}

            </div>

            {/* Right Column: Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layout size={18} color="#3b82f6" /> Technologies Used
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {caseStudy.technologies.map((tech: string, i: number) => (
                      <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 500 }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {caseStudy.features && caseStudy.features.length > 0 && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Key Features</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {caseStudy.features.map((feature: string, i: number) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#475569', fontSize: '0.95rem' }}>
                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Implementation details */}
              {(caseStudy.security_implementation || caseStudy.seo_implementation) && (
                <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Technical Implementation</h3>
                  
                  {caseStudy.security_implementation && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                        <Shield size={16} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Security First</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{caseStudy.security_implementation}</p>
                    </div>
                  )}

                  {caseStudy.seo_implementation && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.5rem' }}>
                        <Search size={16} /> <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>SEO Architecture</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{caseStudy.seo_implementation}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section style={{ padding: '5rem 2rem', background: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Ready to build your digital presence?</h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Let's collaborate to create a secure, high-performing website that perfectly represents your brand.</p>
        <Link href="/contact" style={{ display: 'inline-block', background: '#ff2a55', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
          Start a Project Today
        </Link>
      </section>

    </PageLayout>
  );
}
