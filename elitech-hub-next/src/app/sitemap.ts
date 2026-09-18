import { MetadataRoute } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase';

// All routes with their priority and change frequency
// Higher priority = Google crawls more often
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://elitechub.com';
  const now = new Date().toISOString();
  
  let blogPosts = null;
  let researchPapers = null;
  let caseStudies = null;
  let labEntries = null;
  let laptops = null;

  try {
    const supabase = getSupabaseServerClient();
    
    // Fetch dynamic blog posts
    const { data: bPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('published', true);
    blogPosts = bPosts;
      
    // Fetch dynamic research papers (only published)
    const { data: rPapers } = await supabase
      .from('research')
      .select('slug, updated_at, created_at')
      .or('published.eq.true,publication_status.eq.published');
    researchPapers = rPapers;

    // Fetch dynamic case studies
    const { data: cStudies } = await supabase
      .from('web_case_studies')
      .select('slug, created_at')
      .eq('published', true);
    caseStudies = cStudies;
    // Fetch published labs
    const { data: lData } = await supabase
      .from('labs')
      .select('slug, updated_at, published_at')
      .eq('status', 'published');
    labEntries = lData;

    // Fetch published laptops
    const { data: laptopData } = await supabase
      .from('laptops')
      .select('slug, updated_at')
      .eq('published', true)
      .eq('archived', false);
    laptops = laptopData;

  } catch (error) {
    console.error('Failed to fetch dynamic routes for sitemap:', error);
  }

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/cybersecurity-bootcamp`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/professional`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/corporate-training`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/ai-chatbots`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/penetration-testing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/custom-scripts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ai-training`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/verify`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/researcher-guidelines`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/security-check`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/founder`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/advisors`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/membership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/research/membership/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  if (blogPosts) {
    const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || post.published_at || now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    routes.push(...blogUrls);
  }

  // Add /laptops catalog explicitly
  routes.push({
    url: `${baseUrl}/laptops`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  if (laptops) {
    const laptopUrls: MetadataRoute.Sitemap = (laptops as any[]).map((laptop) => ({
      url: `${baseUrl}/laptops/${laptop.slug}`,
      lastModified: laptop.updated_at || now,
      changeFrequency: 'daily',
      priority: 0.85,
    }));
    routes.push(...laptopUrls);
  }

  if (researchPapers) {
    const researchUrls: MetadataRoute.Sitemap = researchPapers.map((paper) => ({
      url: `${baseUrl}/research/${paper.slug}`,
      lastModified: paper.updated_at || paper.created_at || now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    routes.push(...researchUrls);
  }

  // Add static portfolio routes explicitly
  routes.push(
    { url: `${baseUrl}/portfolio/cyberoutreach-agent`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/elitech-admin-bot`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/portfolio/rusty-threads-bot`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 }
  );

  if (caseStudies) {
    const caseStudyUrls: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
      url: `${baseUrl}/portfolio/${cs.slug}`,
      lastModified: cs.created_at || now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    routes.push(...caseStudyUrls);
  }

  
  if (labEntries) {
    const labUrls: MetadataRoute.Sitemap = labEntries.map((lab) => ({
      url: `${baseUrl}/lab/${lab.slug}`,
      lastModified: lab.updated_at || lab.published_at || now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    routes.push(...labUrls);
  }

  try {
    const supabase = getSupabaseServerClient();
    
    // Add individual advisor profile pages (dynamic slugs from DB)
    const { data: advisors } = await supabase.from('advisors').select('slug, updated_at').eq('status', 'active');
    if (advisors) {
      routes.push(...advisors.map(a => ({
        url: `${baseUrl}/advisors/${a.slug}`,
        lastModified: a.updated_at || now,
        changeFrequency: 'monthly' as const,
        priority: 0.7
      })));
    }

    // NOTE: /founder, /advisors, /research/membership are already added as static routes above.

    // Add Topics (no dedicated topics table yet — skip for now)

    // Add Resources
    const { data: resources } = await supabase.from('resources').select('slug, updated_at').eq('status', 'published');
    if (resources) {
      routes.push(...resources.map(r => ({
        url: `${baseUrl}/resources/${r.slug}`,
        lastModified: r.updated_at || now,
        changeFrequency: 'monthly' as const,
        priority: 0.7
      })));
    }

    // Add Researchers
    const { data: researchers } = await supabase.from('researchers').select('slug, updated_at').eq('status', 'active');
    if (researchers) {
      routes.push(...researchers.map(r => ({
        url: `${baseUrl}/researcher/${r.slug}`,
        lastModified: r.updated_at || now,
        changeFrequency: 'monthly' as const,
        priority: 0.7
      })));
    }
  } catch (e) {
    console.error('Failed to add ecosystem routes to sitemap', e);
  }

  return routes;
}
