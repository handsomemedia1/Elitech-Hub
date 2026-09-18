import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/research/', '/lab/'],
        disallow: ['/admin/', '/api/', '/dashboard/', '/thank-you', '/verify', '/researcher/', '/writer/'],
      },
      // --- LLM / AI Crawlers: explicitly allow for indexing ---
      // This is what gets you into ChatGPT, Perplexity, Gemini etc.
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
    ],
    sitemap: 'https://elitechub.com/sitemap.xml',
  };
}
