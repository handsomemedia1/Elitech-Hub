import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Placeholder for fetching from the "researchers" table
async function fetchResearcherFromTable(slug: string) {
  // Replace this mock with your actual database call (e.g., Prisma, Drizzle, supabase, etc.)
  // const researcher = await db.researchers.findUnique({ where: { slug } });
  
  return {
    name: 'Dr. John Smith',
    slug: slug,
    bio: 'Lead researcher in Artificial Intelligence.',
    jobTitle: 'Principal Researcher',
    url: `https://elitechhub.com/researcher/${slug}`,
    image: 'https://elitechhub.com/images/researcher-avatar.png',
    socialLinks: ['https://twitter.com/drjohnsmith', 'https://linkedin.com/in/drjohnsmith'],
    fieldsOfStudy: ['Artificial Intelligence', 'Machine Learning'],
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const researcher = await fetchResearcherFromTable(params.slug);

  if (!researcher) {
    return {
      title: 'Researcher Not Found',
    };
  }

  return {
    title: `${researcher.name} | Elitech Hub Researcher`,
    description: researcher.bio,
    openGraph: {
      title: `${researcher.name} - Researcher Profile`,
      description: researcher.bio,
      url: researcher.url,
      images: [
        {
          url: researcher.image,
          width: 800,
          height: 600,
          alt: researcher.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: researcher.name,
      description: researcher.bio,
      images: [researcher.image],
    },
  };
}

export default async function ResearcherProfilePage({ params }: { params: { slug: string } }) {
  const researcher = await fetchResearcherFromTable(params.slug);

  if (!researcher) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: researcher.name,
    url: researcher.url,
    image: researcher.image,
    jobTitle: researcher.jobTitle,
    description: researcher.bio,
    sameAs: researcher.socialLinks,
    knowsAbout: researcher.fieldsOfStudy,
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={researcher.image} alt={researcher.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{researcher.name}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{researcher.jobTitle}</h2>
          <p className="text-lg text-gray-800 mb-4">{researcher.bio}</p>
          <div className="flex flex-wrap gap-2">
            {researcher.fieldsOfStudy.map((field) => (
              <span key={field} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Publications & Research</h3>
        <p className="text-gray-600">Publications by {researcher.name} will appear here.</p>
      </div>
    </main>
  );
}
