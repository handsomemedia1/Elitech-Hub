import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase';
import { createServiceClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { FileText, Download, ArrowLeft, User, Tag, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) return { title: 'Resource Not Found' };

  const { data: resource } = await supabaseAdmin
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!resource) {
    return { title: 'Resource Not Found' };
  }

  const title = resource.title ? `${resource.title} | Elitech Hub Resources` : 'Elitech Hub Resources';
  const description = resource.description ? resource.description.substring(0, 160) : 'Download this resource from Elitech Hub.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    alternates: {
      canonical: `https://elitechub.com/resources/${slug}`
    }
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  
  const supabase = getSupabaseServerClient();
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !resource) {
    notFound();
  }

  const publishDate = resource.created_at ? new Date(resource.created_at) : new Date();

  return (
    <PageLayout>
      {/* ── HERO / HEADER ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0f1e 0%, #1e1b4b 50%, #312e81 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 2rem 4rem',
      }}>
        {/* Background decorative lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 60px)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Link href="/resources" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: '#cbd5e1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            marginBottom: '2.5rem', transition: 'color 0.2s',
          }}>
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{
              padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
              border: '1px solid rgba(59,130,246,0.3)',
            }}>
              {resource.topic || 'Resource'}
            </span>
            <span style={{
              padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <FileText size={11} /> PDF
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white',
            lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}>
            {resource.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: '#94a3b8', fontSize: '0.9rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            {resource.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} style={{ color: '#818cf8' }} />
                <span>{resource.author}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} style={{ color: '#818cf8' }} />
              <span>{publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {resource.views != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} style={{ color: '#818cf8' }} />
                <span>{resource.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#f8fafc', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>
          
          <main>
            <section style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Overview</h2>
              <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
                {resource.description ? (
                  resource.description.split('\n').map((para: string, i: number) => (
                    <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                  ))
                ) : (
                  <p>No description available for this resource.</p>
                )}
              </div>
            </section>
          </main>

          <aside style={{ position: 'sticky', top: '5rem' }}>
            <div style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Download Resource
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Get instant access to this resource by downloading the full document.
              </p>
              
              {resource.file_url ? (
                <a
                  href={`/api/resources/download?slug=${resource.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    background: '#4f46e5', color: 'white',
                    padding: '1rem', borderRadius: '12px', textDecoration: 'none',
                    fontWeight: 700, width: '100%',
                    boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <Download size={20} />
                  Download PDF
                </a>
              ) : (
                <div style={{
                  background: '#f1f5f9', padding: '1rem', borderRadius: '8px', 
                  color: '#64748b', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500
                }}>
                  File not available for download
                </div>
              )}
            </div>

            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '1.5rem', marginTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem' }}>Details</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resource.topic && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                    <Tag size={16} style={{ color: '#94a3b8' }} />
                    <span style={{ fontWeight: 500 }}>Topic:</span> {resource.topic}
                  </li>
                )}
                {resource.author && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                    <User size={16} style={{ color: '#94a3b8' }} />
                    <span style={{ fontWeight: 500 }}>Author:</span> {resource.author}
                  </li>
                )}
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                  <FileText size={16} style={{ color: '#94a3b8' }} />
                  <span style={{ fontWeight: 500 }}>Format:</span> PDF Document
                </li>
              </ul>
            </div>
          </aside>
          
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": resource.title,
            "description": resource.description || undefined,
            "author": resource.author ? {
              "@type": "Person",
              "name": resource.author
            } : {
              "@type": "Organization",
              "name": "Elitech Hub"
            },
            "datePublished": publishDate.toISOString(),
            "url": `https://elitechub.com/resources/${resource.slug}`
          })
        }}
      />
    </PageLayout>
  );
}
