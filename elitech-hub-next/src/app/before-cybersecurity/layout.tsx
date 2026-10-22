import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Before Cybersecurity: What to Know Before Learning',
  description:
    'Understand what cybersecurity involves, explore possible career directions, assess your starting point, and plan your first steps with the Before Cybersecurity guide and assessment.',
  alternates: {
    canonical: 'https://www.elitechub.com/before-cybersecurity',
  },
  openGraph: {
    title: 'Before Cybersecurity: What Nobody Tells You Before You Start Learning',
    description:
      'An interactive orientation system designed to help you understand the field, explore possible directions, identify what to learn first, and approach your cybersecurity journey with a clearer plan.',
    url: 'https://www.elitechub.com/before-cybersecurity',
    siteName: 'Elitech-Hub',
    images: [
      {
        url: 'https://www.elitechub.com/images/og-before-cybersecurity.jpg',
        width: 1200,
        height: 630,
        alt: 'Before Cybersecurity — Elitech-Hub Interactive Orientation System',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Before Cybersecurity: What to Know Before Learning',
    description:
      'An interactive orientation system designed to help you understand the field, explore directions, and avoid wasting months learning in the wrong direction.',
    images: ['https://www.elitechub.com/images/og-before-cybersecurity.jpg'],
  },
};

/**
 * Safe JSON-LD serialization that escapes '<' to prevent script breakout injection.
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function BeforeCybersecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.elitechub.com/before-cybersecurity/#webpage',
        url: 'https://www.elitechub.com/before-cybersecurity',
        name: 'Before Cybersecurity: What to Know Before Learning',
        description:
          'Understand what cybersecurity involves, explore possible career directions, assess your starting point, and plan your first steps with the Before Cybersecurity guide and assessment.',
        isPartOf: {
          '@id': 'https://www.elitechub.com/#website',
        },
        breadcrumb: {
          '@id': 'https://www.elitechub.com/before-cybersecurity/#breadcrumb',
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://www.elitechub.com/before-cybersecurity/#product',
        name: 'Before Cybersecurity',
        description:
          'Interactive cybersecurity orientation system featuring an authoritative 29-chapter guide, diagnostic archetype assessment, personalized gap analysis report, 30/60/90-day roadmap, and curated resource library.',
        brand: {
          '@type': 'Brand',
          name: 'Elitech-Hub',
        },
        author: {
          '@id': 'https://www.elitechub.com/#founder',
        },
        creator: {
          '@id': 'https://www.elitechub.com/#founder',
        },
        // Note: Offer schema omitted pending formal business confirmation and approval of the launch price.
      },
      {
        '@type': 'Person',
        '@id': 'https://www.elitechub.com/#founder',
        name: 'Elijah Adegboyega Adeyeye',
        jobTitle: 'Founder & Lead Instructor',
        worksFor: {
          '@id': 'https://www.elitechub.com/#organization',
        },
        url: 'https://www.elitechub.com/about',
        description:
          'Founder and lead instructor of Elitech Hub, working at the intersection of cybersecurity education, technical systems, and human behavior.',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.elitechub.com/before-cybersecurity/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.elitechub.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Before Cybersecurity',
            item: 'https://www.elitechub.com/before-cybersecurity',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      {children}
    </>
  );
}
