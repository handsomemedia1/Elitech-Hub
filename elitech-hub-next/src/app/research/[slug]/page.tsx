import React from 'react';
import { getServerUser } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase-server';
import { getSupabaseServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { FileText, Download, Clock, ArrowLeft, Quote, User, BookOpen, Tag, Globe, Eye, Share2, Building2, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import styles from './paper.module.css';
import CiteModal from '@/components/CiteModal';
import { ClientTracker } from '@/components/ClientTracker';

type Props = {
  params: Promise<{ slug: string }>
};

// ─── DYNAMIC SSR METADATA ────────────────────────────────────────────────────
// This runs server-side: Google crawls fully-rendered HTML, not JS.
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  // Use service client so metadata generation works for all papers
  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) return { title: 'Paper Not Found | Elitech Hub Research' };

  const { data: paper } = await supabaseAdmin
    .from('research')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!paper) {
    return { title: 'Paper Not Found | Elitech Hub Research' };
  }

  const isPublished = paper.published === true || paper.publication_status === 'published';

  const authorsString =
    paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0
      ? paper.authors.map((a: any) => a.name || a.full_name).join(', ')
      : paper.author || 'Elitech Research Labs';

  const description =
    paper.seo_description ||
    (paper.abstract ? paper.abstract.substring(0, 200).trim() + '...' : `Read "${paper.title}" — a cybersecurity research paper published by Elitech Hub.`);

  const title = paper.seo_title || `${paper.title} | Elitech Hub Research`;

  const ogImage = paper.og_image || 'https://elitechub.com/images/og-research.jpg';

  const publishDate = paper.published_at ? new Date(paper.published_at) : new Date(paper.created_at);

  const baseMeta: Metadata = {
    title,
    description,
    authors: [{ name: authorsString }],
    keywords: paper.keywords
      ? [...paper.keywords, 'cybersecurity research', 'Elitech Hub', 'Nigeria research']
      : ['cybersecurity research', 'Elitech Hub', 'Nigeria'],
    robots: isPublished ? { index: true, follow: true } : { index: false, follow: false },
    alternates: {
      canonical: `https://elitechub.com/research/${slug}`,
    },
    openGraph: {
      title: paper.title,
      description,
      url: `https://elitechub.com/research/${slug}`,
      siteName: 'Elitech Hub',
      locale: 'en_NG',
      type: 'article',
      publishedTime: publishDate.toISOString(),
      authors: [authorsString],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: paper.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: paper.title,
      description,
      images: [ogImage],
    },
  };

  const authorList = paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0
    ? paper.authors.map((a: any) => a.name || a.full_name)
    : [paper.author || 'Elitech Hub'];

  if (!isPublished) {
    return baseMeta;
  }

  return {
    ...baseMeta,
    other: {
      'citation_title': paper.title,
      'citation_author': authorList,
      'citation_publication_date': publishDate.toISOString().split('T')[0],
      'citation_publisher': 'Elitech Hub',
      'citation_language': 'en',
      ...(paper.file_url && { 'citation_pdf_url': `https://elitechub.com/api/research/download?id=${paper.id}` }),
      ...(paper.doi && { 'citation_doi': paper.doi }),
      ...(paper.journal_title && { 'citation_journal_title': paper.journal_title }),
      ...(paper.volume && { 'citation_volume': paper.volume }),
      ...(paper.issue && { 'citation_issue': paper.issue }),
      ...(paper.pages && { 'citation_firstpage': paper.pages.split('-')[0] }),
      ...(paper.pages && paper.pages.includes('-') && { 'citation_lastpage': paper.pages.split('-')[1] }),
      ...(paper.abstract && { 'DC.description': paper.abstract.substring(0, 300) }),
    },
  };
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default async function ResearchPaperPage({ params }: Props) {
  const { slug } = await params;

  // Use service_role client to fetch — RLS bypass. Auth is enforced below in app code.
  const supabaseAdmin = createServiceClient();
  if (!supabaseAdmin) notFound();

  const { data: paper } = await supabaseAdmin!
    .from('research')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!paper) notFound();

  const isPublished = paper.published === true || paper.publication_status === 'published';

  if (!isPublished) {
    // App-layer gate: only the submitter or an admin can view a draft
    const user = await getServerUser();
    if (!user || (user.id !== paper.submitter_id && user.role !== 'admin')) {
      notFound();
    }
  }

  const authorsString =
    paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0
      ? paper.authors.map((a: any) => a.name).join(', ')
      : paper.author || 'Elitech Research Labs';

  const leadAuthor = paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0
      ? paper.authors[0].name
      : paper.author;

  // Fetch related publications by author or category
  const supabase = getSupabaseServerClient();
  let { data: relatedPapers } = await supabase
      .from('research')
      .select('title, slug, category, created_at, abstract, authors, type')
      .neq('id', paper.id)
      .or('published.eq.true,publication_status.eq.published')
    .ilike('author', `%${leadAuthor || ''}%`)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fallback to latest papers if author has no other papers
  if (!relatedPapers || relatedPapers.length === 0) {
    const { data: fallbackPapers } = await supabase
      .from('research')
      .select('title, slug, category, created_at, abstract, authors, type')
      .neq('id', paper.id)
      .or('published.eq.true,publication_status.eq.published')
      .order('created_at', { ascending: false })
      .limit(3);
    relatedPapers = fallbackPapers;
  }

  const authorsList: any[] =
    paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0
      ? paper.authors
      : [{ name: paper.author || 'Elitech Research Labs', institution: 'Elitech Hub' }];

  const publishDate = paper.published_at ? new Date(paper.published_at) : new Date(paper.created_at);

  // ─── JSON-LD SCHEMA (rendered in HTML by Next.js, fully crawlable) ──────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    name: paper.title,
    headline: paper.title,
    description: paper.abstract ? paper.abstract.substring(0, 300) : '',
    datePublished: publishDate.toISOString().split('T')[0],
    dateModified: publishDate.toISOString().split('T')[0],
    inLanguage: 'en',
    url: `https://elitechub.com/research/${slug}`,
    isAccessibleForFree: true,
    author:
      authorsList.length === 1
        ? {
            '@type': 'Person',
            name: authorsList[0].name,
            ...(authorsList[0].institution && {
              affiliation: { '@type': 'Organization', name: authorsList[0].institution },
            }),
          }
        : authorsList.map((a: any) => ({
            '@type': 'Person',
            name: a.name,
            ...(a.institution && { affiliation: { '@type': 'Organization', name: a.institution } }),
          })),
    publisher: {
      '@type': 'Organization',
      name: 'Elitech Hub',
      url: 'https://elitechub.com',
      logo: { '@type': 'ImageObject', url: 'https://elitechub.com/images/logo.png' },
    },
    ...(paper.doi && { sameAs: `https://doi.org/${paper.doi}` }),
    ...(paper.keywords && paper.keywords.length > 0 && { keywords: paper.keywords.join(', ') }),
    ...(paper.file_url && { encoding: { '@type': 'MediaObject', contentUrl: paper.file_url, encodingFormat: 'application/pdf' } }),
  };

  return (
    <PageLayout>
      {/* ── FULLY SERVER-RENDERED SCHEMA MARKUP ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO / HEADER ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '8rem 2rem 6rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Subtle premium accent line at the top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        }} />

        <div className={styles.heroInner}>
          {/* Back link */}
          <Link href="/research" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            marginBottom: '2.5rem', transition: 'color 0.2s',
          }}>
            <ArrowLeft size={16} /> Back to Research Repository
          </Link>

          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{
              padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(16,185,129,0.12)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.25)', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>● Published</span>
            <span style={{
              padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.25)',
            }}>{paper.category || 'Cybersecurity'}</span>
            <span style={{
              padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(239,68,68,0.1)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}><FileText size={11} /> {(paper.type || 'pdf').toUpperCase()}</span>
            {paper.doi && (
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" style={{
                padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(168,85,247,0.1)', color: '#c084fc',
                border: '1px solid rgba(168,85,247,0.2)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}><Globe size={11} /> DOI</a>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white',
            lineHeight: 1.2, marginBottom: '2.5rem', letterSpacing: '-0.02em',
            maxWidth: '820px',
          }}>
            {paper.title}
          </h1>

          {/* Author chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            {authorsList.map((author: any, i: number) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3rem', padding: '0.4rem 1rem',
              }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, hsl(${(i * 80 + 210) % 360}, 70%, 50%), hsl(${(i * 80 + 250) % 360}, 70%, 40%))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.65rem', fontWeight: 800,
                }}>
                  {author.name.charAt(0)}
                </div>
                <div>
                  <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{author.name}</div>
                  {author.institution && (
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{author.institution}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '2rem',
            padding: '1.25rem 0', borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              <Calendar size={15} style={{ color: '#3b82f6' }} />
              <span>Published {publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              <Eye size={15} style={{ color: '#3b82f6' }} />
              <span>{(paper.views || 0).toLocaleString()} reads</span>
            </div>
            {paper.citations_count > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                <Award size={15} style={{ color: '#3b82f6' }} />
                <span>{paper.citations_count} citation {paper.citations_count === 1 ? 'export' : 'exports'}</span>
              </div>
            )}
            {paper.doi && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                <Globe size={15} style={{ color: '#3b82f6' }} />
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#60a5fa', textDecoration: 'none', fontFamily: 'monospace' }}>
                  {paper.doi}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#f8fafc', color: '#334155' }}>
        <div className={styles.bodyGrid}>

          {/* ── MAIN CONTENT ── */}
          <main>
            {/* Abstract */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={18} color="white" />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Abstract</h2>
              </div>

              <div style={{
                background: 'white', border: '1px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '0 12px 12px 0', padding: '1.75rem',
                fontSize: '1.05rem', lineHeight: 1.85, color: '#475569',
              }}>
                {paper.abstract
                  ? paper.abstract.split('\n').map((para: string, i: number) => (
                      <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                    ))
                  : (
                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      Abstract not provided. Please download the full PDF to read the complete research paper.
                    </p>
                  )}
              </div>
            </section>

            {/* Keywords */}
            {paper.keywords && paper.keywords.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Tag size={20} style={{ color: '#3b82f6' }} />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Keywords</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {paper.keywords.map((kw: string, i: number) => (
                    <span key={i} style={{
                      background: '#eff6ff', color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '0.35rem 0.9rem', borderRadius: '2rem',
                      fontSize: '0.85rem', fontWeight: 500,
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Authors detail section */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={18} color="white" />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {authorsList.length === 1 ? 'Author' : 'Authors'}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {authorsList.map((author: any, i: number) => (
                  <div key={i} style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                    padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, hsl(${(i * 80 + 210) % 360}, 70%, 50%), hsl(${(i * 80 + 250) % 360}, 70%, 40%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '1.1rem', fontWeight: 800,
                    }}>
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{author.name}</div>
                      {author.institution && (
                        <div style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Building2 size={13} /> {author.institution}
                        </div>
                      )}
                      {author.orcid && (
                        <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#16a34a', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', textDecoration: 'none' }}>
                          <Globe size={12} /> ORCID: {author.orcid}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Publication details */}
            <section style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '1.75rem', marginBottom: '3rem',
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Paper Information</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', margin: 0 }}>
                {[
                  { label: 'Publisher', value: 'Elitech Hub' },
                  { label: 'Research Type', value: paper.research_type || paper.type?.toUpperCase() || 'PDF' },
                  { label: 'Published', value: publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  { label: 'Category', value: paper.category || 'Cybersecurity' },
                  ...(paper.doi ? [{ label: 'DOI', value: paper.doi }] : []),
                  { label: 'Access', value: 'Open Access' },
                  ...(paper.version ? [{ label: 'Version', value: `v${paper.version}` }] : []),
                  ...(paper.license ? [{ label: 'License', value: paper.license }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</dt>
                    <dd style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Full Paper section */}
            {paper.file_url && (
              <section style={{
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                border: '1px solid #bfdbfe', borderRadius: '12px',
                padding: '1.75rem', marginBottom: '3rem', textAlign: 'center',
              }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>Full Paper</h2>
                <p style={{ color: '#3b82f6', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Access the published research paper in PDF format.
                </p>
                <a
                  href={`/api/research/download?id=${paper.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                    padding: '0.8rem 1.75rem', borderRadius: '8px', textDecoration: 'none',
                    fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  }}
                >
                  Download PDF
                </a>
              </section>
            )}

            {/* Versioning UI */}
            <section style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '1.75rem', marginBottom: '3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Clock size={20} style={{ color: '#64748b' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Version History</h2>
              </div>
              
              {paper.version_history && Array.isArray(paper.version_history) && paper.version_history.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {paper.version_history.map((v: any, i: number) => (
                    <li key={i} style={{ 
                      padding: '1rem 0', 
                      borderBottom: i === paper.version_history.length - 1 ? 'none' : '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>Version {v.version || (paper.version_history.length - i)}</span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{v.date ? new Date(v.date).toLocaleDateString() : ''}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                        Status: <span style={{ textTransform: 'capitalize' }}>{v.status || 'Archived'}</span>
                      </div>
                      {v.notes && <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{v.notes}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.95rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Current Version: <strong>v{paper.version || '1.0'}</strong></span>
                  <span style={{
                    padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600,
                    background: '#f1f5f9', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {paper.status || paper.publication_status || (isPublished ? 'Published' : 'Draft')}
                  </span>
                </div>
              )}
            </section>

            {/* Inline Cite Section */}
            <section style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '1.75rem', marginBottom: '3rem',
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Cite This Research</h2>
              <div style={{ maxWidth: '400px' }}>
                <CiteModal
                  title={paper.title}
                  authors={authorsString}
                  year={publishDate.getFullYear().toString()}
                  doi={paper.doi}
                  publisher="Elitech Hub"
                  url={`https://elitechub.com/research/${slug}`}
                  slug={slug}
                />
              </div>
            </section>
          </main>

          {/* ── STICKY SIDEBAR ── */}
          <aside>
            <div style={{ position: 'sticky', top: '5rem' }}>

              {/* Download card */}
              <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
                padding: '1.75rem', marginBottom: '1.5rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Access this Paper</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  This is an open-access publication by Elitech Hub Research Labs. Download the full PDF manuscript.
                </p>

                {paper.file_url ? (
                  <a
                    href={`/api/research/download?id=${paper.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                      padding: '0.9rem', borderRadius: '10px', textDecoration: 'none',
                      fontWeight: 700, width: '100%', marginBottom: '0.75rem',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Download size={18} /> Download Full PDF
                  </a>
                ) : (
                  <Link
                    href="/login"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                      padding: '0.9rem', borderRadius: '10px', textDecoration: 'none',
                      fontWeight: 700, width: '100%', marginBottom: '0.75rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    <Download size={18} /> Request PDF Access
                  </Link>
                )}

                <CiteModal
                  title={paper.title}
                  authors={authorsString}
                  year={publishDate.getFullYear().toString()}
                  doi={paper.doi}
                  publisher="Elitech Hub"
                  url={`https://elitechub.com/research/${slug}`}
                  slug={slug}
                />
              </div>

              {/* Share card */}
              <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
                padding: '1.5rem', marginBottom: '1.5rem',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={16} /> Share
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?url=https://elitechub.com/research/${slug}`, color: '#0077B5' },
                    { label: 'Twitter/X', href: `https://twitter.com/intent/tweet?url=https://elitechub.com/research/${slug}&text=${encodeURIComponent(paper.title)}`, color: '#000000' },
                    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(paper.title + ' - https://elitechub.com/research/' + slug)}`, color: '#25D366' },
                    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(paper.title)}&body=${encodeURIComponent('Check out this research paper: https://elitechub.com/research/' + slug)}`, color: '#64748b' },
                  ].map(({ label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0',
                        fontSize: '0.8rem', fontWeight: 600, color, textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick metadata card */}
              <div style={{
                background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                padding: '1.5rem',
              }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Info</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: <Eye size={14} />, label: `${(paper.views || 0).toLocaleString()} reads` },
                    ...(paper.citations_count > 0 ? [{ icon: <Award size={14} />, label: `${paper.citations_count} citation exports` }] : []),
                    { icon: <FileText size={14} />, label: `${(paper.type || 'PDF').toUpperCase()} document` },
                    { icon: <Globe size={14} />, label: 'Open Access' },
                  ].map(({ icon, label }, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                      <span style={{ color: '#3b82f6' }}>{icon}</span> {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* ── RELATED RESEARCH ── */}
        {relatedPapers && relatedPapers.length > 0 && (
          <div style={{ background: '#f1f5f9', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0' }}>
            <div className={styles.relatedInner}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Related Research</h2>
                <Link href="/research" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                  Browse all publications →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {relatedPapers.map((rp: any) => (
                  <Link key={rp.slug} href={`/research/${rp.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px',
                      padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                    }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem', display: 'block' }}>
                        {rp.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.75rem', flex: 1 }}>
                        {rp.title}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {rp.abstract || 'Click to read the full paper.'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <span>{new Date(rp.published_at || rp.created_at).getFullYear()}</span>
                        <span style={{ color: '#3b82f6', fontWeight: 600 }}>Read Research →</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
