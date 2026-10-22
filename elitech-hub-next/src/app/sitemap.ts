import { MetadataRoute } from 'next';
import { getSupabaseServerClient } from '@/lib/supabase';
import { createServiceClient } from '@/lib/supabase-server';

// Safely format and validate ISO modification timestamps from genuine database records.
// According to Google Search Central sitemap guidelines, <lastmod> should be omitted
// if an accurate, verifiable modification date cannot be established.
function parseReliableDate(dateStr?: string | null): string | undefined {
  if (!dateStr || typeof dateStr !== 'string') return undefined;
  try {
    const d = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
    const parsed = new Date(d);
    if (isNaN(parsed.getTime()) || parsed.getFullYear() < 2020) return undefined;
    return parsed.toISOString();
  } catch {
    return undefined;
  }
}

// Enable Incremental Static Regeneration (hourly) so newly published database records automatically reflect in sitemap.xml
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.elitechub.com';

  // Deterministic deduplication map guaranteeing unique URLs across static and dynamic entries
  const sitemapMap = new Map<string, MetadataRoute.Sitemap[number]>();

  function registerRoute(entry: MetadataRoute.Sitemap[number]) {
    if (!entry || !entry.url) return;
    const normalizedUrl = entry.url.trim();
    if (!normalizedUrl.startsWith(baseUrl)) {
      console.warn(`[sitemap] Rejecting invalid non-canonical host: ${normalizedUrl}`);
      return;
    }
    sitemapMap.set(normalizedUrl, {
      ...entry,
      url: normalizedUrl,
    });
  }

  // 1. Static core routes
  // Notice: lastModified is omitted for static routes because Next.js omits <lastmod>
  // when undefined, preventing misleading static date claims per Google Search Central.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/cybersecurity-bootcamp`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/professional`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/programs/corporate-training`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-development`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/ai-chatbots`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/penetration-testing`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/custom-scripts`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/research`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ai-training`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portfolio/cyberoutreach-agent`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/elitech-admin-bot`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/rusty-threads-bot`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/get-involved`,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/lab`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/security-check`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/founder`,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/advisors`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writers`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/consultation`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/coaching`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/before-cybersecurity`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research/membership`,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/research/membership/apply`,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/research/behavioral-cybersecurity`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research-paper`,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/researcher-guidelines`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/security`,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/volunteer`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/laptops`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  for (const route of staticRoutes) {
    registerRoute(route);
  }

  // Slugs that are permanently redirected (308) in next.config.ts must be excluded
  // to prevent Google Search Console "Submitted URL has redirect" indexing warnings.
  const REDIRECTED_BLOG_SLUGS = new Set([
    'step-by-step-cybersecurity-guide-for-overwhelmed-beginners-moftm94x',
  ]);

  try {
    const supabase = createServiceClient() || getSupabaseServerClient();

    // 2. Dynamic Blog Posts
    const { data: bPosts, error: bError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('published', true);

    if (bError) {
      console.warn('[sitemap] blog_posts query notice:', bError.message);
    } else if (Array.isArray(bPosts)) {
      for (const post of bPosts) {
        if (!post.slug || REDIRECTED_BLOG_SLUGS.has(post.slug)) continue;
        const lastMod = parseReliableDate(post.updated_at || post.published_at);
        registerRoute({
          url: `${baseUrl}/blog/${post.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // 3. Dynamic Research Papers (published only)
    const { data: rPapers, error: rError } = await supabase
      .from('research')
      .select('slug, updated_at, created_at')
      .or('published.eq.true,publication_status.eq.published');

    if (rError) {
      console.warn('[sitemap] research query notice:', rError.message);
    } else if (Array.isArray(rPapers)) {
      for (const paper of rPapers) {
        if (!paper.slug) continue;
        const lastMod = parseReliableDate(paper.updated_at || paper.created_at);
        registerRoute({
          url: `${baseUrl}/research/${paper.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // 4. Dynamic Laptops Catalog
    const { data: laptopData, error: lError } = await supabase
      .from('laptops')
      .select('slug, updated_at')
      .eq('published', true)
      .eq('archived', false);

    if (lError) {
      console.warn('[sitemap] laptops query notice:', lError.message);
    } else if (Array.isArray(laptopData)) {
      for (const laptop of laptopData) {
        if (!laptop.slug) continue;
        const lastMod = parseReliableDate(laptop.updated_at);
        registerRoute({
          url: `${baseUrl}/laptops/${laptop.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'daily',
          priority: 0.85,
        });
      }
    }

    // 5. Dynamic Case Studies (Web Development)
    const { data: cStudies, error: csError } = await supabase
      .from('web_case_studies')
      .select('slug, created_at')
      .eq('published', true);

    if (csError) {
      console.warn('[sitemap] web_case_studies query notice:', csError.message);
    } else if (Array.isArray(cStudies)) {
      for (const cs of cStudies) {
        if (!cs.slug) continue;
        const lastMod = parseReliableDate(cs.created_at);
        registerRoute({
          url: `${baseUrl}/portfolio/${cs.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // 6. Dynamic Contributing Writers (Approved + Public profile)
    const { data: writers, error: wError } = await supabase
      .from('writers')
      .select('slug, last_profile_update_at, created_at')
      .eq('status', 'approved')
      .eq('is_public', true)
      .not('slug', 'is', null);

    if (wError) {
      console.warn('[sitemap] writers query notice:', wError.message);
    } else if (Array.isArray(writers)) {
      for (const writer of writers) {
        if (!writer.slug) continue;
        const lastMod = parseReliableDate(writer.last_profile_update_at || writer.created_at);
        registerRoute({
          url: `${baseUrl}/authors/${writer.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'monthly',
          priority: 0.75,
        });
      }
    }

    // 7. Dynamic Labs (Defensively queried)
    const { data: labEntries, error: labError } = await supabase
      .from('labs')
      .select('slug, updated_at, published_at')
      .eq('status', 'published');

    if (labError) {
      console.warn('[sitemap] labs query notice:', labError.message);
    } else if (Array.isArray(labEntries)) {
      for (const lab of labEntries) {
        if (!lab.slug) continue;
        const lastMod = parseReliableDate(lab.updated_at || lab.published_at);
        registerRoute({
          url: `${baseUrl}/lab/${lab.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // 8. Dynamic Advisors (Defensively queried)
    const { data: advisors, error: advError } = await supabase
      .from('advisors')
      .select('slug, updated_at')
      .eq('status', 'active');

    if (advError) {
      console.warn('[sitemap] advisors query notice:', advError.message);
    } else if (Array.isArray(advisors)) {
      for (const advisor of advisors) {
        if (!advisor.slug) continue;
        const lastMod = parseReliableDate(advisor.updated_at);
        registerRoute({
          url: `${baseUrl}/advisors/${advisor.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // 9. Dynamic Resources (Defensively queried)
    const { data: resources, error: resError } = await supabase
      .from('resources')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (resError) {
      console.warn('[sitemap] resources query notice:', resError.message);
    } else if (Array.isArray(resources)) {
      for (const resource of resources) {
        if (!resource.slug) continue;
        const lastMod = parseReliableDate(resource.updated_at);
        registerRoute({
          url: `${baseUrl}/resources/${resource.slug}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    console.log(`[sitemap] Dynamic summary: blog_posts=${bPosts?.length ?? 0}, laptops=${laptopData?.length ?? 0}, research=${rPapers?.length ?? 0}, writers=${writers?.length ?? 0}, total_urls=${sitemapMap.size}`);
  } catch (error) {
    console.error('[sitemap] Fatal unexpected error during dynamic route collection:', error);
  }

  return Array.from(sitemapMap.values());
}
