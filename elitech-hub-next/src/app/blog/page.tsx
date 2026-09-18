import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import layoutStyles from "@/components/PageLayout.module.css";
import styles from "./blog.module.css";
import { getSupabaseServerClient, type BlogPost } from "@/lib/supabase";
import BlogList from "./BlogList";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Mail, ArrowRight } from "lucide-react";
import { HubCard } from "@/components/HubCard";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Cybersecurity Blog Nigeria | Career Guides, Tutorials & Threat Intel | Elitech Hub',
  description:
    'Expert Insights on AI, Cybersecurity, Technology, Digital Business and Innovation.',
  keywords: [
    'cybersecurity blog',
    'ethical hacking tutorials',
    'cybersecurity career guide',
    'how to learn cybersecurity',
    'cybersecurity news',
    'threat intelligence blog',
    'cybersecurity scholarships',
    'penetration testing tutorials',
    'OSCP preparation',
    'cybersecurity jobs',
    'Elitech Hub blog',
  ],
  openGraph: {
    title: 'Cybersecurity Blog | Elitech Hub Nigeria',
    description: 'Expert cybersecurity articles, career guides, and tutorials from Nigeria\'s top security training platform.',
    url: 'https://elitechub.com/blog',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cybersecurity Blog | Elitech Hub Nigeria', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/blog' },
};


export default async function BlogPage() {
  const supabase = getSupabaseServerClient();
  
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, author, thumbnail, published_at, views, tags, word_count")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(24);

  const blogPosts = (posts || []) as BlogPost[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Elitech Hub Blog",
    url: "https://elitechub.com/blog",
    description: "Cybersecurity articles, career tips, and tutorials from Elitech Hub.",
    publisher: {
      "@type": "Organization",
      name: "Elitech Hub",
      logo: { "@type": "ImageObject", url: "https://elitechub.com/images/logo.png" },
    },
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== PAGE HERO ===== */}
      <section className={layoutStyles.pageHero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={200}>
          <span className={layoutStyles.pageHeroLabel} style={{ color: '#ef4444' }}>Knowledge Base</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Blog &amp; <span className="text-gradient-primary">Resources</span>
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            Expert cybersecurity insights, career guides, and hands-on tutorials crafted
            by certified professionals for the next generation of defenders.
          </p>
        </AnimateOnScroll>
      </section>
      
      <BlogList posts={blogPosts} />

      {/* ===== INTERNAL FUNNEL: Blog → Programs ===== */}
      {/* This section is the SEO content cluster bridge: article readers → program pages */}
      <section style={{ padding: '4rem 5%', borderTop: '1px solid var(--color-border)' }}>
        <AnimateOnScroll direction="up">
          <p style={{ textAlign: 'center', color: 'var(--color-accent-bright)', fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.8rem', marginBottom: '0.75rem' }}>READY TO GO BEYOND READING?</p>
          <h2 style={{ textAlign: 'center', color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, marginBottom: '0.75rem' }}>Turn Knowledge Into a Career</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>Every article on this blog connects to a real skill you can learn in our programs. Choose the path that fits you.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', maxWidth: '960px', margin: '0 auto' }}>
            <HubCard href="/programs/cybersecurity-bootcamp" label="6-Week Bootcamp" sub="Fast-track · ₦75,000 · Weekends" color="#ef4444" cta="Enroll now →" />
            <HubCard href="/programs/professional" label="16-Week Professional" sub="Internship guaranteed · ₦200,000" color="#a855f7" cta="View program →" />
            <HubCard href="/programs/corporate-training" label="Corporate Training" sub="For teams · Custom curriculum" color="#06b6d4" cta="Get a quote →" />
          </div>
        </AnimateOnScroll>
      </section>


      {error && (
        <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "2rem" }}>
          Unable to load articles at this time. Please try again later.
        </div>
      )}

      {/* ===== NEWSLETTER ===== */}
      <section className={styles.newsletterSection}>
        <div className={styles.sectionInner}>
          <AnimateOnScroll direction="up">
            <div className={styles.newsletterCard}>
              <Mail size={48} style={{ color: "var(--color-primary)", marginBottom: "1.5rem" }} />
              <h2 className={styles.newsletterTitle}>Stay Ahead of Cyber Threats</h2>
              <p className={styles.newsletterSub}>
                Join 2,000+ security professionals getting weekly insights, job openings, and
                course updates straight to their inbox.
              </p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="your@email.com" className={styles.newsletterInput} />
                <button className="premium-button">
                  Subscribe Free <ArrowRight size={16} />
                </button>
              </div>
              <p className={styles.newsletterNote}>No spam. Unsubscribe anytime.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageLayout>
  );
}
