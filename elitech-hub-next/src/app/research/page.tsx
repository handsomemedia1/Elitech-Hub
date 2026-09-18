import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './research.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import ResearchList from '@/components/ResearchList';
import { getSupabaseServerClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Cybersecurity Research & Publications | Elitech Hub Nigeria',
  description:
    'Advancing Research in Artificial Intelligence, Cybersecurity, Human Behaviour and Emerging Technologies.',
  keywords: [
    'cybersecurity research Nigeria',
    'cybersecurity publications Nigeria',
    'AI security research Africa',
    'threat intelligence research Nigeria',
    'malware analysis Africa',
    'cybersecurity paper Nigeria',
    'open source security tools Nigeria',
    'blockchain security research',
    'African cybersecurity researchers',
    'Elitech Hub research',
  ],
  openGraph: {
    title: 'Cybersecurity Research & Publications | Elitech Hub Nigeria',
    description: 'Original cybersecurity research from Elitech Hub — AI security, threat intelligence, and African cyber threats.',
    url: 'https://elitechub.com/research',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: { canonical: 'https://elitechub.com/research' },
};


export default async function ResearchPage() {
  const supabase = getSupabaseServerClient();

  // Fetch all published papers for stats
  const { data: allPapers } = await supabase
    .from('research')
    .select('id, category, authors, author, created_at, published_at')
    .or('published.eq.true,publication_status.eq.published');

  // Compute real stats
  const publishedCount = allPapers?.length || 0;
  const categories = new Set(allPapers?.map(p => p.category).filter(Boolean));
  const institutionSet = new Set<string>();
  const authorSet = new Set<string>();
  allPapers?.forEach(p => {
    if (p.authors && Array.isArray(p.authors)) {
      p.authors.forEach((a: any) => {
        if (a.name) authorSet.add(a.name);
        if (a.institution) institutionSet.add(a.institution);
      });
    } else if (p.author) {
      authorSet.add(p.author);
    }
  });

  const { data: featuredPaper } = await supabase
    .from('research')
    .select('title, slug, abstract, category, authors, author, published_at, created_at, keywords')
    .or('published.eq.true,publication_status.eq.published')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  const jsonLd = [
    // BreadcrumbList
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'Research', item: 'https://elitechub.com/research' },
      ],
    },
    // Published paper (Dynamic)
    ...(featuredPaper ? [{
      '@context': 'https://schema.org',
      '@type': 'ScholarlyArticle',
      name: featuredPaper.title,
      headline: featuredPaper.title,
      description: featuredPaper.abstract ? featuredPaper.abstract.substring(0, 200) + '...' : `Read "${featuredPaper.title}"`,
      datePublished: featuredPaper.published_at ? new Date(featuredPaper.published_at).toISOString().split('T')[0] : (featuredPaper.created_at ? new Date(featuredPaper.created_at).toISOString().split('T')[0] : undefined),
      publisher: { '@type': 'Organization', name: 'Elitech Hub Research Repository' },
      author: { '@type': 'Organization', name: 'Elitech Hub Research Team', url: 'https://elitechub.com/research' },
      about: featuredPaper.keywords || [featuredPaper.category || 'Cybersecurity'],
      url: `https://elitechub.com/research/${featuredPaper.slug}`,
    }] : []),
    // CollectionPage for the repository
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Elitech Hub Research Repository',
      description: 'A curated open-access repository for cybersecurity and technology research submitted by researchers and reviewed for quality before publication.',
      url: 'https://elitechub.com/research',
      publisher: { '@type': 'Organization', name: 'Elitech Hub', url: 'https://elitechub.com' },
    },
    // Organization as research entity
    {
      '@context': 'https://schema.org',
      '@type': 'ResearchOrganization',
      name: 'Elitech Hub',
      url: 'https://elitechub.com/research',
      description: 'Elitech Hub conducts community-driven cybersecurity research across threat intelligence, malware analysis, AI security, and African cyber threat landscapes.',
      foundingDate: '2023',
      knowsAbout: ['Cybersecurity', 'Threat Intelligence', 'Malware Analysis', 'AI Security', 'Blockchain Security'],
    },
  ];

  const featuredAuthors = featuredPaper?.authors && Array.isArray(featuredPaper.authors) && featuredPaper.authors.length > 0
    ? featuredPaper.authors
    : featuredPaper?.author ? [{ name: featuredPaper.author }] : [{ name: 'Elitech Research Labs' }];

  const featuredDate = featuredPaper?.published_at
    ? new Date(featuredPaper.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : featuredPaper?.created_at
    ? new Date(featuredPaper.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <AnimateOnScroll>
        <div className={layoutStyles.pageHero} style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.8)), url(/assets/images/research-hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', paddingBottom: featuredPaper ? '8rem' : '4rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1.5rem', borderRadius: '3rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.1em', color: 'white' }}>
            🔬 RESEARCH REPOSITORY
          </div>
          <h1 className={layoutStyles.pageTitle}>
            Elitech Hub <span className={layoutStyles.accentText}>Research</span>
          </h1>
          <p className={layoutStyles.pageSubtitle} style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
            A curated open-access repository for selected cybersecurity and technology research. Submissions are administratively reviewed for relevance and quality before publication, making them publicly discoverable and citable.
          </p>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <span style={{ color: '#6ee7b7', fontSize: '1.5rem' }}>✓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Submission</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>By Researchers</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <span style={{ color: '#3b82f6', fontSize: '1.5rem' }}>✓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Editorial Review</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Admin Approval</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <span style={{ color: '#c3151c', fontSize: '1.5rem' }}>✓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Publication</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>Open Access</div>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <section className={layoutStyles.section}>
        <div className={styles.researchContainer}>
          {/* ── REPOSITORY STATS (real data) ── */}
          {publishedCount > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3rem', marginTop: '-2rem' }}>
              {[
                { value: publishedCount, label: 'Published Papers' },
                ...(authorSet.size > 0 ? [{ value: authorSet.size, label: 'Authors' }] : []),
                ...(institutionSet.size > 0 ? [{ value: institutionSet.size, label: 'Institutions' }] : []),
                ...(categories.size > 0 ? [{ value: categories.size, label: 'Research Areas' }] : []),
              ].map(({ value, label }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── FEATURED PAPER ── */}
          {featuredPaper && (
            <div style={{ marginTop: '1rem', position: 'relative', zIndex: 10, background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Research</span>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)' }}>{featuredPaper.category || 'Cybersecurity'}</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.3 }}>
                <Link href={`/research/${featuredPaper.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {featuredPaper.title}
                </Link>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {featuredPaper.abstract}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 }}>
                    {featuredAuthors.map((a: any) => a.name).join(', ')}
                  </div>
                  {featuredAuthors[0]?.institution && (
                    <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>{featuredAuthors[0].institution}</div>
                  )}
                  {featuredDate && (
                    <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '2px' }}>Published {featuredDate}</div>
                  )}
                </div>
                <Link href={`/research/${featuredPaper.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', background: 'white', color: '#0f172a', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s', flexShrink: 0 }}>
                  Read Full Paper →
                </Link>
              </div>
            </div>
          )}

          {/* ── RESEARCH LIST ── */}
          <div style={{ marginTop: '3rem' }}>
            <ResearchList />
          </div>

          {/* ── EDITORIAL REVIEW ── */}
          <AnimateOnScroll>
            <div style={{ marginTop: '4rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.25rem' }}>Editorial Review</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '720px' }}>
                Every submission to the Elitech Hub Research Repository goes through an administrative editorial review before publication. The repository is not an unrestricted file host — it is a curated collection of relevant research.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { step: '01', title: 'Submission', desc: 'Researcher submits title, abstract, authors, keywords, and PDF.' },
                  { step: '02', title: 'Review', desc: 'Admin checks relevance, metadata completeness, authorship, and rights confirmation.' },
                  { step: '03', title: 'Revision', desc: 'If required, the researcher may be asked to revise before acceptance.' },
                  { step: '04', title: 'Publication', desc: 'Accepted research is published, indexed, and becomes publicly citable.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{step}</div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{title}</div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* ── SUBMISSION CTA BANNER ── */}
          <AnimateOnScroll>
            <div className={styles.researchBanner} style={{ marginTop: '3rem' }}>
              <span className={styles.bannerDecor}>🔬</span>
              <h2 className={styles.researchBannerTitle}>Have Research to Share?</h2>
              <p className={styles.researchBannerText}>
                Have relevant cybersecurity or technology research to share? Submit your work for consideration in the Elitech Hub Research Repository. Submissions are administratively reviewed before publication.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link href="/researcher/submit" className="premium-button">
                  Submit Research
                </Link>
                <Link href="/researcher-guidelines" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  View Guidelines
                </Link>
              </div>
            </div>
          </AnimateOnScroll>

        </div>
      </section>
    </PageLayout>
  );
}


