import { getSupabaseServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = getSupabaseServerClient();
  const { data: writer } = await supabase.from('writers').select('*').eq('slug', slug).single();

  if (!writer || !writer.is_public) return { title: 'Author Not Found | Elitech Hub' };

  return {
    title: `${writer.display_name} - ${writer.professional_title || 'Cybersecurity Writer'} | Elitech Hub`,
    description: writer.bio || `Read publications and insights by ${writer.display_name}.`,
    alternates: {
      canonical: `https://elitechub.com/authors/${slug}`
    },
    openGraph: {
      title: `${writer.display_name} - ${writer.professional_title || 'Author'} | Elitech Hub`,
      description: writer.bio || `Read publications and insights by ${writer.display_name}.`,
      url: `https://elitechub.com/authors/${slug}`,
      siteName: 'Elitech Hub',
      images: [
        {
          url: writer.avatar_url || 'https://elitechub.com/images/default-avatar.png',
          width: 800,
          height: 600,
        }
      ],
      type: 'profile',
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = getSupabaseServerClient();
  
  const { data: writer } = await supabase.from('writers').select('*').eq('slug', slug).single();
  if (!writer || !writer.is_public) notFound();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, summary, published_at, cover_image')
    .eq('writer_id', writer.id)
    .eq('published', true)
    .order('published_at', { ascending: false });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: writer.display_name,
    jobTitle: writer.professional_title || 'Cybersecurity Writer',
    worksFor: {
      '@type': 'Organization',
      name: 'Elitech Hub'
    },
    url: `https://elitechub.com/authors/${slug}`,
    image: writer.avatar_url || 'https://elitechub.com/images/default-avatar.png',
    description: writer.full_bio || writer.bio,
    sameAs: [writer.linkedin_url, writer.portfolio_url, writer.website_url].filter(Boolean)
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6">
        
        <div className="bg-[#111317] border border-gray-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 shrink-0">
            <img src={writer.avatar_url || '/images/default-avatar.png'} alt={writer.display_name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-1">{writer.display_name}</h1>
            {writer.professional_title && <p className="text-[#C3151C] font-medium mb-3">{writer.professional_title}</p>}
            {writer.location && <p className="text-gray-500 text-sm mb-4">📍 {writer.location}</p>}
            
            <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{writer.full_bio || writer.bio || 'Cybersecurity Author at Elitech Hub'}</p>
            
            {writer.expertise && writer.expertise.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-semibold">Expertise</h4>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {writer.expertise.map((skill: string) => (
                    <span key={skill} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center md:justify-start">
              {writer.linkedin_url && (
                <a href={writer.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              )}
              {writer.portfolio_url && (
                <a href={writer.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Portfolio</a>
              )}
              {writer.website_url && (
                <a href={writer.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Website</a>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Published Articles ({(posts || []).length})</h2>
          {(posts || []).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts?.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition flex flex-col">
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.summary}</p>
                    <div className="mt-auto text-xs text-gray-500">
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 bg-gray-900/50 rounded-lg p-6 text-center border border-gray-800">No articles published yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
