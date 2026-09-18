import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import styles from "./post.module.css";
import { getSupabaseServerClient } from "@/lib/supabase";
import { Send, Briefcase, GraduationCap, MessageCircle, BookOpen } from "lucide-react";
import { ArticleFeedback } from "@/components/ArticleFeedback";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabaseServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, thumbnail, category, author, published_at, tags")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    return {
      title: "Post Not Found | Elitech Hub Blog",
    };
  }

  return {
    title: `${post.title} | Elitech Hub Blog`,
    description: post.excerpt || "Cybersecurity insights from Elitech Hub.",
    keywords: post.tags || ["cybersecurity", "tech", "elitech hub", "training", "Zero Trust"],
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: [
        {
          url: post.thumbnail || 'https://elitechub.com/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      url: `https://elitechub.com/blog/${slug}`,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
      siteName: "Elitech Hub",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [post.thumbnail || 'https://elitechub.com/images/og-default.jpg'],
    },
    alternates: { canonical: `https://elitechub.com/blog/${slug}` },
  };
}

function estimateReadTime(wordCount: number | null): string {
  if (!wordCount) return "5 min read";
  return `${Math.max(2, Math.ceil(wordCount / 200))} min read`;
}

function getAuthorInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabaseServerClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, author, thumbnail, published_at, views, tags, word_count, writer_id, writers(id, display_name, slug, avatar_url, professional_title, is_public)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post || error) {
    notFound();
  }

  // Also fetch related posts
  const { data: related } = await supabase
    .from("blog_posts")
    .select("id, title, slug, thumbnail, category, published_at, word_count")
    .eq("published", true)
    .eq("category", post.category)
    .neq("slug", slug)
    .limit(3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { "@type": "Person", name: post.author, url: "https://elitechub.com/about" },
    publisher: {
      "@type": "Organization",
      name: "Elitech Hub",
      logo: { "@type": "ImageObject", url: "https://elitechub.com/images/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://elitechub.com/blog/${slug}` },
    keywords: post.tags?.join(", "),
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* ===== ARTICLE HERO ===== */}
      <section className={styles.articleHero}>
        {post.thumbnail && (
          <div className={styles.heroImageWrapper}>
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
              className={styles.heroImage}
            />
            <div className={styles.heroImageOverlay} />
          </div>
        )}
        <div className={styles.articleHeroInner}>
          <Link href="/blog" className={styles.backLink}>
            <i className="fas fa-arrow-left" /> Back to Blog
          </Link>
          <div className={styles.articleMeta}>
            <span className={styles.categoryTag} style={{ background: "#c3151c" }}>{post.category}</span>
            <span className={styles.readTime}><i className="far fa-clock" /> {estimateReadTime(post.word_count)}</span>
            <span className={styles.postDate}>{formatDate(post.published_at)}</span>
            {post.views > 0 && (
              <span className={styles.readTime}><i className="fas fa-eye" /> {post.views} views</span>
            )}
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.excerpt && (
            <p className={styles.articleExcerpt}>{post.excerpt}</p>
          )}
          <div className={styles.articleAuthor}>
            {post.writers?.is_public && post.writers?.slug ? (
              <Link href={`/authors/${post.writers.slug}`} className="flex items-center gap-4 hover:opacity-80 transition" style={{ textDecoration: 'none' }}>
                <div className={styles.authorAvatar} style={{ overflow: 'hidden' }}>
                  {post.writers.avatar_url ? (
                    <img src={post.writers.avatar_url} alt={post.writers.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getAuthorInitials(post.writers.display_name || post.author)
                  )}
                </div>
                <div>
                  <div className={styles.authorName}>{post.writers.display_name || post.author}</div>
                  <div className={styles.authorRole}>
                    {post.writers.professional_title || 'Elitech Hub Writer'}
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <div className={styles.authorAvatar}>{getAuthorInitials(post.author)}</div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.authorRole}>
                    {post.author?.toLowerCase().includes('elijah') ? 'Founder & Lead Instructor' : 'Elitech Hub Writer'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== ARTICLE CONTENT & SIDEBAR ===== */}
      <div className={styles.articleBody}>
        <article className={styles.articleInner}>
          {post.content ? (
            <div
              className={styles.richContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className={styles.articleLead}>{post.excerpt}</p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsSection}>
              <h4>Tags</h4>
              <div className={styles.tagsList}>
                {post.tags.slice(0, 6).map((tag: string, i: number) => (
                  <span key={i} className={styles.tagPill}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          <ArticleFeedback slug={slug} />

          {/* Share */}
          <div className={styles.shareSection}>
            <h4>Share this article</h4>
            <div className={styles.shareButtons}>
              <a href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + `https://elitechub.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://elitechub.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-twitter" /> X (Twitter)
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://elitechub.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-linkedin" /> LinkedIn
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://elitechub.com/blog/${slug}`)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-facebook" /> Facebook
              </a>
              <a href="https://www.threads.net/@elitechhub" target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-threads" /> Threads
              </a>
              <a href="https://www.instagram.com/elitechhub" target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-instagram" /> Instagram
              </a>
              <a href="https://www.tiktok.com/@elitechhub" target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                <i className="fab fa-tiktok" /> TikTok
              </a>
            </div>
          </div>
        </article>

        {/* ===== STICKY SIDEBAR CTAs ===== */}
        <aside className={styles.sidebar}>
          <div className={styles.stickyWrapper}>
            <div className={styles.sidebarCard}>
              <Send className={styles.sidebarIcon} size={28} />
              <h3 className={styles.sidebarTitle}>Join Our Community</h3>
              <p className={styles.sidebarText}>Connect with thousands of cybersecurity enthusiasts and pros.</p>
              <a href="https://t.me/elitechhub" target="_blank" rel="noopener noreferrer" className={styles.sidebarLink}>
                Join Telegram →
              </a>
            </div>

            {/* Conditionally render Web Dev or Cyber CTA based on category */}
            {post.category?.toLowerCase().includes('development') || post.category?.toLowerCase().includes('web') || post.category?.toLowerCase().includes('ai') ? (
              <>
                <div className={styles.sidebarCard}>
                  <Briefcase className={styles.sidebarIcon} size={28} />
                  <h3 className={styles.sidebarTitle}>Custom Web Development</h3>
                  <p className={styles.sidebarText}>Build secure, high-performing websites and web applications.</p>
                  <Link href="/services/web-development" className={styles.sidebarLink}>
                    View Services →
                  </Link>
                </div>
                <div className={styles.sidebarCard}>
                  <BookOpen className={styles.sidebarIcon} size={28} />
                  <h3 className={styles.sidebarTitle}>AI & Chatbot Solutions</h3>
                  <p className={styles.sidebarText}>Automate your business with custom agentic AI applications.</p>
                  <Link href="/services/ai-chatbots" className={styles.sidebarLink}>
                    Learn More →
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className={styles.sidebarCard}>
                  <GraduationCap className={styles.sidebarIcon} size={28} />
                  <h3 className={styles.sidebarTitle}>Master Cybersecurity</h3>
                  <p className={styles.sidebarText}>Enroll in our industry-recognized practical training programs.</p>
                  <Link href="/programs" className={styles.sidebarLink}>
                    Enroll Now →
                  </Link>
                </div>
                <div className={styles.sidebarCard}>
                  <BookOpen className={styles.sidebarIcon} size={28} />
                  <h3 className={styles.sidebarTitle}>Cybersecurity Research</h3>
                  <p className={styles.sidebarText}>Read our latest published papers and open-source threat intelligence.</p>
                  <Link href="/research" className={styles.sidebarLink}>
                    Read Research →
                  </Link>
                </div>
              </>
            )}

            <div className={styles.sidebarCard}>
              <Briefcase className={styles.sidebarIcon} size={28} />
              <h3 className={styles.sidebarTitle}>Elitech Portfolio</h3>
              <p className={styles.sidebarText}>See our success stories, corporate training, and VAPT services.</p>
              <Link href="/portfolio" className={styles.sidebarLink}>
                View Portfolio →
              </Link>
            </div>

            <div className={styles.sidebarCard}>
              <MessageCircle className={styles.sidebarIcon} size={28} />
              <h3 className={styles.sidebarTitle}>Need Expert Advice?</h3>
              <p className={styles.sidebarText}>Talk to our team about securing your business infrastructure.</p>
              <Link href="/contact" className={styles.sidebarLink}>
                Book Consultation →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== RELATED POSTS ===== */}
      {related && related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <h2 className={styles.relatedTitle}>Related Articles</h2>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className={styles.relatedCard}>
                  {r.thumbnail && (
                    <div className={styles.relatedCardImage}>
                      <Image src={r.thumbnail} alt={r.title} fill style={{ objectFit: "cover" }} sizes="350px" />
                    </div>
                  )}
                  <div className={styles.relatedCardBody}>
                    <span className={styles.relatedCategory}>{r.category}</span>
                    <h3>{r.title}</h3>
                    <span className={styles.relatedDate}>{formatDate(r.published_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <h2>Ready to start your cybersecurity journey?</h2>
        <p>Join 300+ students who have already transformed their careers with Elitech Hub.</p>
        <Link href="/apply" className="btn btn-primary">Apply Now → </Link>
      </section>
    </PageLayout>
  );
}
