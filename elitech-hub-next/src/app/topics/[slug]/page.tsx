import { getSupabaseServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = getSupabaseServerClient();
  const { slug } = await params;

  // Since we don't have a specific `topics` table defined in the standard schema,
  // we'll just format the slug for display as the topic name.
  const topicName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // 1. Fetch content directly matching the topic slug (via category or topic field)
  
  const [blogsRes, researchRes, labsRes, resourcesRes] = await Promise.all([
    supabase.from('blog_posts').select('id, title, slug, excerpt').eq('published', true).eq('category', slug),
    supabase.from('research').select('id, title, slug, summary').eq('published', true).eq('category', slug),
    supabase.from('labs').select('id, title, slug, short_description').eq('status', 'published').eq('category', slug),
    supabase.from('resources').select('id, title, slug, description').eq('status', 'published').eq('topic', slug)
  ]);

  let blogs = blogsRes.data || [];
  let research = researchRes.data || [];
  let labs = labsRes.data || [];
  let resources = resourcesRes.data || [];

  // 2. Also try fetching using content_relationships where source_type = 'topic' and source_id mapped to something?
  // We don't have a `topic` UUID since there is no topics table, so the relationships table may not map topics by UUID easily.
  // Wait, if source_id is a UUID, and we only have a slug, we might not be able to query content_relationships by topic slug easily
  // unless we resolve the topic to an ID first. Let's rely on the category/topic field matching the slug for now, which is robust.
  
  const hasContent = blogs.length > 0 || research.length > 0 || labs.length > 0 || resources.length > 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem', minHeight: '80vh' }}>
      <header style={{ marginBottom: '3rem' }}>
        <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Topic</span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem', color: 'white' }}>
          {topicName}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Explore all resources, research, labs, and blogs related to {topicName.toLowerCase()}.
        </p>
      </header>

      {!hasContent && (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-panel)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No content found for this topic yet.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '3rem' }}>
        {blogs.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Blogs</h2>
            <div style={gridStyle}>
              {blogs.map(blog => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} style={cardStyle}>
                  <h3 style={titleStyle}>{blog.title}</h3>
                  {blog.excerpt && <p style={descStyle}>{blog.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {research.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Research Papers</h2>
            <div style={gridStyle}>
              {research.map(r => (
                <Link key={r.id} href={`/research/${r.slug}`} style={cardStyle}>
                  <h3 style={titleStyle}>{r.title}</h3>
                  {r.summary && <p style={descStyle}>{r.summary.substring(0, 100)}...</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {labs.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Interactive Labs</h2>
            <div style={gridStyle}>
              {labs.map(lab => (
                <Link key={lab.id} href={`/lab/${lab.slug}`} style={cardStyle}>
                  <h3 style={titleStyle}>{lab.title}</h3>
                  {lab.short_description && <p style={descStyle}>{lab.short_description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {resources.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Resources</h2>
            <div style={gridStyle}>
              {resources.map(res => (
                <Link key={res.id} href={`/resources/${res.slug}`} style={cardStyle}>
                  <h3 style={titleStyle}>{res.title}</h3>
                  {res.description && <p style={descStyle}>{res.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  padding: '1.5rem',
  background: 'var(--color-bg-panel)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  textDecoration: 'none',
  transition: 'transform 0.2s, borderColor 0.2s',
  height: '100%'
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'white',
  marginBottom: '0.75rem',
  lineHeight: 1.4
};

const descStyle = {
  color: 'var(--color-text-secondary)',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  margin: 0
};
