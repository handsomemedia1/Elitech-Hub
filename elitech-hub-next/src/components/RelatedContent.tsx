import { getSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';

interface RelatedContentProps {
  sourceId: string;
  sourceType: string;
}

export async function RelatedContent({ sourceId, sourceType }: RelatedContentProps) {
  const supabase = getSupabaseServerClient();

  const { data: relationships, error } = await supabase
    .from('content_relationships')
    .select('target_type, target_id')
    .eq('source_id', sourceId)
    .eq('source_type', sourceType)
    .eq('approved', true);

  if (error || !relationships || relationships.length === 0) {
    return null;
  }

  const idsByType = relationships.reduce((acc, rel) => {
    if (!acc[rel.target_type]) acc[rel.target_type] = [];
    acc[rel.target_type].push(rel.target_id);
    return acc;
  }, {} as Record<string, string[]>);

  let blogs: any[] = [];
  let research: any[] = [];
  let labs: any[] = [];

  if (idsByType['blog']?.length) {
    const { data } = await supabase.from('blog_posts')
      .select('id, title, slug')
      .in('id', idsByType['blog'])
      .eq('published', true);
    if (data) blogs = data;
  }

  if (idsByType['research']?.length) {
    const { data } = await supabase.from('research')
      .select('id, title, slug')
      .in('id', idsByType['research'])
      .eq('published', true);
    if (data) research = data;
  }

  if (idsByType['lab']?.length) {
    const { data } = await supabase.from('labs')
      .select('id, title, slug')
      .in('id', idsByType['lab'])
      .eq('status', 'published');
    if (data) labs = data;
  }

  const hasContent = blogs.length > 0 || research.length > 0 || labs.length > 0;
  if (!hasContent) return null;

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Related Content</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {blogs.map(blog => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} style={cardStyle}>
            <span style={typeStyle}>Blog</span>
            <h4 style={titleStyle}>{blog.title}</h4>
          </Link>
        ))}
        {research.map(r => (
          <Link key={r.id} href={`/research/${r.slug}`} style={cardStyle}>
            <span style={typeStyle}>Research</span>
            <h4 style={titleStyle}>{r.title}</h4>
          </Link>
        ))}
        {labs.map(lab => (
          <Link key={lab.id} href={`/lab/${lab.slug}`} style={cardStyle}>
            <span style={typeStyle}>Lab</span>
            <h4 style={titleStyle}>{lab.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  display: 'block',
  padding: '1.25rem',
  background: 'var(--color-bg-panel)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  textDecoration: 'none',
  transition: 'transform 0.2s',
};

const typeStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-accent-primary)',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  marginBottom: '0.5rem',
  display: 'block',
};

const titleStyle = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'white',
  margin: 0,
  lineHeight: 1.4,
};
