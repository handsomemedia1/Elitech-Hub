import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Mock function - replace with actual DB fetch
async function getWriterBySlug(slug: string) {
  // Return basic mock data
  return {
    name: 'Jane Doe',
    slug: slug,
    bio: 'An experienced tech writer and content creator.',
    jobTitle: 'Senior Tech Writer',
    url: `https://elitechhub.com/writer/${slug}`,
    image: 'https://elitechhub.com/images/default-avatar.png',
    socialLinks: ['https://twitter.com/janedoe', 'https://linkedin.com/in/janedoe'],
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const writer = await getWriterBySlug(params.slug);

  if (!writer) {
    return {
      title: 'Writer Not Found',
    };
  }

  return {
    title: `${writer.name} | Elitech Hub Writer`,
    description: writer.bio,
    openGraph: {
      title: `${writer.name} - Writer Profile`,
      description: writer.bio,
      url: writer.url,
      images: [
        {
          url: writer.image,
          width: 800,
          height: 600,
          alt: writer.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: writer.name,
      description: writer.bio,
      images: [writer.image],
    },
  };
}

export default async function WriterProfilePage({ params }: { params: { slug: string } }) {
  const writer = await getWriterBySlug(params.slug);

  if (!writer) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: writer.name,
    url: writer.url,
    image: writer.image,
    jobTitle: writer.jobTitle,
    description: writer.bio,
    sameAs: writer.socialLinks,
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
          <img src={writer.image} alt={writer.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{writer.name}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{writer.jobTitle}</h2>
          <p className="text-lg text-gray-800">{writer.bio}</p>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Recent Articles</h3>
        <p className="text-gray-600">Articles written by {writer.name} will appear here.</p>
      </div>
    </main>
  );
}
