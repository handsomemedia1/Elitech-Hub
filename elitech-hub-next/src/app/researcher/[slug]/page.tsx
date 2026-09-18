import { getSupabaseServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = getSupabaseServerClient();
  const { data: researcher } = await supabase.from('researchers').select('*').eq('slug', slug).single();

  if (!researcher) return { title: 'Researcher Not Found | Elitech Hub' };

  return {
    title: `${researcher.full_name} - Cybersecurity Researcher | Elitech Hub`,
    description: researcher.biography || `Research profile and publications by ${researcher.full_name}.`,
    alternates: {
      canonical: `https://elitechub.com/researcher/${slug}`
    }
  };
}

export default async function ResearcherProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = getSupabaseServerClient();
  const { data: researcher } = await supabase.from('researchers').select('*').eq('slug', slug).single();

  if (!researcher) notFound();

  // JSON-LD Person Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: researcher.full_name,
    jobTitle: 'Cybersecurity Researcher',
    worksFor: {
      '@type': 'Organization',
      name: researcher.institution || 'Elitech Hub'
    },
    url: `https://elitechub.com/researcher/${slug}`,
    image: researcher.profile_image_url || 'https://elitechub.com/images/default-avatar.png',
    description: researcher.biography,
    sameAs: [
      researcher.linkedin_url,
      researcher.personal_website_url,
      researcher.orcid ? `https://orcid.org/${researcher.orcid}` : null
    ].filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto py-24 px-4 sm:px-6">
        <div className="bg-[#0a0c10] border border-gray-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          {/* Subtle gradient glow behind the avatar */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          <div className="w-40 h-40 rounded-2xl overflow-hidden border border-gray-700 shrink-0 relative z-10">
            <img src={researcher.profile_image_url || '/images/default-avatar.png'} alt={researcher.full_name} className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{researcher.full_name}</h1>
                <p className="text-xl text-primary font-medium mb-1">
                  {researcher.institution} {researcher.department ? `— ${researcher.department}` : ''}
                </p>
                <p className="text-gray-400 mb-6 max-w-2xl">{researcher.biography}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {researcher.orcid && (
                  <a href={`https://orcid.org/${researcher.orcid}`} target="_blank" rel="noreferrer" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2">
                    <span className="text-green-500 font-bold">iD</span> ORCID
                  </a>
                )}
                {researcher.linkedin_url && (
                  <a href={researcher.linkedin_url} target="_blank" rel="noreferrer" className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-blue-400 px-3 py-1.5 rounded-md text-sm transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            {researcher.research_interests && researcher.research_interests.length > 0 && (
              <div className="mt-8 border-t border-gray-800 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Research Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {researcher.research_interests.map((interest: string, i: number) => (
                    <span key={i} className="bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Publications</h2>
            <div className="bg-[#111317] rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400">Loading publications...</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Datasets & Projects</h2>
            <div className="bg-[#111317] rounded-xl p-6 border border-gray-800">
              <p className="text-gray-400">Loading datasets...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
