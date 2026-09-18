import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import layoutStyles from "@/components/PageLayout.module.css";
import { getSupabaseServerClient } from "@/lib/supabase";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { LaptopCard } from "@/components/LaptopCard";
import { Laptop } from "@/types/laptop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Best Laptops for Cybersecurity & Programming | Elitech Hub Nigeria',
  description: 'Find the right laptop for cybersecurity, programming, and technology. Brand new and UK-used laptops optimized for performance and actual use cases.',
  openGraph: {
    title: 'Best Laptops for Cybersecurity | Elitech Hub Nigeria',
    description: 'Find the right laptop for cybersecurity, programming, and technology. Brand new and UK-used laptops optimized for performance and actual use cases.',
    url: 'https://elitechub.com/laptops',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: { canonical: 'https://elitechub.com/laptops' },
};

export default async function LaptopsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const supabase = getSupabaseServerClient();
  
  // Extract filters from URL
  const brand = typeof searchParams.brand === 'string' ? searchParams.brand : null;
  const condition = typeof searchParams.condition === 'string' ? searchParams.condition : null;
  
  let query = supabase
    .from("laptops")
    .select("*, laptop_images(*)")
    .eq("published", true)
    .eq("archived", false);
    
  if (brand) query = query.ilike("brand", brand);
  if (condition) query = query.eq("condition", condition);
  
  query = query.order("created_at", { ascending: false });
  
  const { data: laptopsData, error } = await query;
  const laptops = (laptopsData || []) as Laptop[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "url": "https://elitechub.com/laptops",
    "name": "Laptops for Cybersecurity and Programming",
    "description": "Catalog of recommended brand new and UK-used laptops for technology professionals and students.",
    "itemListElement": laptops.map((laptop, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": laptop.name,
        "url": `https://elitechub.com/laptops/${laptop.slug}`,
        "image": laptop.laptop_images?.find(img => img.is_primary)?.image_url,
        "offers": {
          "@type": "Offer",
          "priceCurrency": laptop.currency || "NGN",
          "price": laptop.price,
          "availability": laptop.availability === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    }))
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== PAGE HERO ===== */}
      <section className={layoutStyles.pageHero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.9) 100%), url('/assets/images/cyber-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={200}>
          <span className={layoutStyles.pageHeroLabel} style={{ color: '#06b6d4' }}>Hardware Resources</span>
          <h1 className={layoutStyles.pageHeroTitle}>
            Laptops for <span className="text-gradient-primary">Cybersecurity</span> &amp; Programming
          </h1>
          <p className={layoutStyles.pageHeroSub}>
            We help cybersecurity students, programmers, and technology users in Nigeria find reliable laptops suited for their actual technical needs.
          </p>
        </AnimateOnScroll>
      </section>
      
      {/* ===== CATALOG SECTION ===== */}
      <section style={{ padding: '4rem 5%', maxWidth: '1280px', margin: '0 auto', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Informational Notice */}
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderLeft: '4px solid #06b6d4', padding: '1.5rem', borderRadius: '0 0.5rem 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            <strong style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>Looking for a UK-used laptop?</strong>
            Availability can change quickly as individual devices sell. Tell us your budget and what you need the laptop for, and we'll help you find what's currently available.
          </div>

          {/* Simple Filters Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
             {/* A real app would have client-side routing for these filters, using basic links for now to stay server-side clean */}
             <a href="/laptops" style={{ padding: '0.5rem 1rem', background: !brand && !condition ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', borderRadius: '999px', textDecoration: 'none', color: 'white', fontSize: '0.85rem' }}>All Laptops</a>
             <a href="/laptops?condition=new" style={{ padding: '0.5rem 1rem', background: condition === 'new' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', borderRadius: '999px', textDecoration: 'none', color: 'white', fontSize: '0.85rem' }}>Brand New</a>
             <a href="/laptops?condition=uk-used" style={{ padding: '0.5rem 1rem', background: condition === 'uk-used' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)', borderRadius: '999px', textDecoration: 'none', color: 'white', fontSize: '0.85rem' }}>UK Used</a>
          </div>

          {error && (
            <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "2rem" }}>
              Unable to load laptops at this time.
            </div>
          )}

          {!error && laptops.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "4rem 2rem" }}>
              No laptops found matching your criteria.
            </div>
          )}

          {/* Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {laptops.map(laptop => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>

        </div>
      </section>
    </PageLayout>
  );
}
