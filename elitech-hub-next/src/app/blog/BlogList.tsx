'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.css';
import type { BlogPost } from '@/lib/supabase';
import { Search, Clock, Eye, ArrowRight, X, LayoutTemplate, Bug, Network, Coins, Fingerprint, Link as LinkIcon, Scale, Flag, Newspaper } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

const categoryColors: Record<string, string> = {
  Tutorial: "#3b82f6",
  Career: "#10b981",
  Certification: "#f59e0b",
  "Threat Intelligence": "#ef4444",
  Awareness: "#8b5cf6",
  "Career Guide": "#06b6d4",
  "Nigeria Business Insights": "#f97316",
  "Digital Finance": "#22c55e",
  "Identity Security": "#a855f7",
  "Supply Chain Security": "#ec4899",
  "Network Security": "#0ea5e9",
  "Digital Governance": "#14b8a6",
  "Artificial Intelligence, Tech News": "#f59e0b",
  "Cybersecurity, News": "#c3151c",
  Cybersecurity: "#c3151c",
};

function getCategoryColor(category: string): string {
  return categoryColors[category] || "#c3151c";
}

function getCategoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("ai") || c.includes("artificial")) return LayoutTemplate;
  if (c.includes("threat")) return Bug;
  if (c.includes("network")) return Network;
  if (c.includes("finance") || c.includes("fintech")) return Coins;
  if (c.includes("identity")) return Fingerprint;
  if (c.includes("supply")) return LinkIcon;
  if (c.includes("governance")) return Scale;
  if (c.includes("nigeria")) return Flag;
  return Newspaper;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function estimateReadTime(wordCount: number | null): string {
  if (!wordCount) return "5 min read";
  return `${Math.max(2, Math.ceil(wordCount / 200))} min read`;
}

function getAuthorInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function BlogImage({ 
  src, 
  alt, 
  Icon, 
  isFeatured = false 
}: { 
  src: string | null | undefined; 
  alt: string; 
  Icon: any;
  isFeatured?: boolean;
}) {
  const [error, setError] = useState(false);

  const isInvalid = error || !src || (typeof src === "string" && (src === "null" || src.trim() === ""));

  if (isInvalid) {
    if (isFeatured) {
      return (
        <div className={styles.blogCardVisual} style={{ background: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border)', width: '100%', height: '100%' }}>
          <Icon size={96} />
        </div>
      );
    }
    return (
      <div className={styles.blogCardVisual}>
        <Icon size={48} />
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill
      className={isFeatured ? styles.featuredImage : undefined}
      style={!isFeatured ? { objectFit: "cover" } : {}}
      sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 400px"}
      onError={() => setError(true)}
    />
  );
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.length > 0 && activeCategory === 'All' && !searchTerm ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <>
      <div className={styles.heroSearch}>
        <Search size={20} className={styles.heroSearchIcon} />
        <input 
          type="text" 
          placeholder="Search articles, topics, certifications..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', margin: '2rem auto', maxWidth: '1000px' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="premium-button"
            style={{
              padding: '0.5rem 1.25rem',
              background: activeCategory === cat ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              border: activeCategory === cat ? 'none' : '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== FEATURED POST ===== */}
      {featuredPost && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionInner}>
            <AnimateOnScroll direction="up">
              <p className={styles.sectionLabel}><Search size={14} /> Featured Article</p>
              <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <BlogImage 
                    src={featuredPost.thumbnail} 
                    alt={featuredPost.title} 
                    Icon={getCategoryIcon(featuredPost.category)}
                    isFeatured={true}
                  />
                  <div className={styles.featuredImageOverlay} />
                </div>
                <div className={styles.featuredCardInner}>
                  <div className={styles.featuredMeta}>
                    <span
                      className={styles.categoryTag}
                      style={{
                        background: `${getCategoryColor(featuredPost.category)}22`,
                        color: getCategoryColor(featuredPost.category),
                        borderColor: `${getCategoryColor(featuredPost.category)}44`
                      }}
                    >
                      {featuredPost.category}
                    </span>
                    <span className={styles.metaItem}><Clock size={14} /> {estimateReadTime(featuredPost.word_count)}</span>
                    <span className={styles.metaItem}>{formatDate(featuredPost.published_at)}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                  <div className={styles.featuredFooter}>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorAvatar}>{getAuthorInitials(featuredPost.author)}</div>
                      <div>
                        <div className={styles.authorName}>{featuredPost.author}</div>
                        <div className={styles.authorRole}>Elitech Hub Writer</div>
                      </div>
                    </div>
                    <span className={styles.readMoreBtn}>Read Article <ArrowRight size={16} /></span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ===== BLOG GRID ===== */}
      <section className={styles.blogSection}>
        <div className={styles.sectionInner}>
          {filteredPosts.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: "center", padding: "4rem 2rem", borderRadius: "1rem" }}>
              <Search size={48} style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.2)" }} />
              <h3 style={{ color: "white", fontSize: "1.25rem", marginBottom: "0.5rem" }}>No matching articles found</h3>
              <p style={{ color: "var(--color-text-secondary)" }}>Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="premium-button"
                style={{ marginTop: '2rem' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {gridPosts.map((post, i) => {
                const Icon = getCategoryIcon(post.category);
                return (
                  <AnimateOnScroll key={post.slug} direction="up" delay={i * 100}>
                    <Link href={`/blog/${post.slug}`} className={styles.blogCard}>
                      <div className={styles.blogCardImage}>
                        <BlogImage 
                          src={post.thumbnail} 
                          alt={post.title} 
                          Icon={Icon} 
                        />
                        <span
                          className={styles.categoryTagOverlay}
                          style={{
                            background: getCategoryColor(post.category),
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className={styles.blogCardBody}>
                        <div className={styles.blogMeta}>
                          <span className={styles.metaItem}><Clock size={14} /> {estimateReadTime(post.word_count)}</span>
                          <span className={styles.metaItem}><Eye size={14} /> {post.views}</span>
                        </div>
                        <h3 className={styles.blogCardTitle}>{post.title}</h3>
                        <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                        <div className={styles.blogCardFooter}>
                          <div className={styles.authorMini}>
                            <div className={styles.authorAvatarMini}>{getAuthorInitials(post.author)}</div>
                            <span>{post.author}</span>
                          </div>
                          <span className={styles.readMoreLink}>Read <ArrowRight size={14} /></span>
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
