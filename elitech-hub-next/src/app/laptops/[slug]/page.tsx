import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import layoutStyles from "@/components/PageLayout.module.css";
import { getSupabaseServerClient } from "@/lib/supabase";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Cpu, HardDrive, Monitor, Battery, CheckCircle, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('laptops').select('name, seo_title, seo_description, laptop_images(image_url)').eq('slug', slug).single();
  
  if (!data) return { title: 'Laptop Not Found' };
  
  return {
    title: data.seo_title || `${data.name} | Elitech Hub Nigeria`,
    description: data.seo_description || `View specifications and pricing for ${data.name} at Elitech Hub Nigeria.`,
    alternates: { canonical: `https://elitechub.com/laptops/${slug}` },
    openGraph: {
      title: data.seo_title || data.name,
      description: data.seo_description,
      images: data.laptop_images?.[0]?.image_url ? [{ url: data.laptop_images[0].image_url }] : undefined,
    }
  };
}

export default async function LaptopDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const supabase = getSupabaseServerClient();
  
  const { data: laptop } = await supabase
    .from("laptops")
    .select("*, laptop_images(*)")
    .eq("slug", slug)
    .single();

  if (!laptop || !laptop.published || laptop.archived) {
    notFound();
  }

  const primaryImage = laptop.laptop_images?.find((img: any) => img.is_primary)?.image_url 
    || laptop.laptop_images?.[0]?.image_url 
    || '/assets/images/placeholder.jpg';

  const priceFormatted = new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: laptop.currency || 'NGN',
    maximumFractionDigits: 0
  }).format(laptop.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": laptop.name,
    "image": laptop.laptop_images?.map((img: any) => img.image_url) || [],
    "description": laptop.seo_description || laptop.short_description || laptop.description,
    "brand": {
      "@type": "Brand",
      "name": laptop.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://elitechub.com/laptops/${laptop.slug}`,
      "priceCurrency": laptop.currency || "NGN",
      "price": laptop.price,
      "availability": laptop.availability === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      "itemCondition": laptop.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition'
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://elitechub.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Laptops",
      "item": "https://elitechub.com/laptops"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": laptop.name
    }]
  };

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section style={{ padding: '6rem 5% 4rem', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/laptops" style={{ color: 'inherit', textDecoration: 'none' }}>Laptops</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'white' }}>{laptop.model}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Left: Images */}
          <div>
            <div style={{ background: '#0a0a0a', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--color-border)', aspectRatio: '4/3', marginBottom: '1rem' }}>
              <img src={primaryImage} alt={laptop.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {laptop.laptop_images && laptop.laptop_images.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {laptop.laptop_images.map((img: any, i: number) => (
                  <div key={i} style={{ width: '80px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                    <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{laptop.brand}</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{laptop.condition === 'new' ? 'Brand New' : 'UK Used'}</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, margin: '0 0 1rem 0', color: 'white' }}>
              {laptop.name}
            </h1>
            
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              {priceFormatted}
            </div>

            {laptop.availability !== 'available' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.5rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <Info size={18} />
                {laptop.availability === 'sold' ? 'Currently Unavailable' : `Status: ${laptop.availability}`}
              </div>
            )}

            {laptop.short_description && (
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1.1rem' }}>
                {laptop.short_description}
              </p>
            )}

            {/* CTA */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '3rem' }}>
              <h3 style={{ color: 'white', marginTop: 0, marginBottom: '0.5rem' }}>Interested in this laptop?</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {laptop.condition === 'uk-used' ? 'UK-used laptop availability changes rapidly.' : 'Need to confirm current stock or variations?'} Contact us for the latest availability and to arrange purchase.
              </p>
              <Link href="/contact" className="premium-button" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                Ask About This Laptop
              </Link>
            </div>

            {/* Suitability */}
            {(laptop.cybersecurity_suitability || laptop.programming_suitability) && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: 'white', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Why choose this laptop?</h3>
                {laptop.cybersecurity_suitability && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#06b6d4', display: 'block', marginBottom: '0.25rem' }}>Cybersecurity Student Fit:</strong>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{laptop.cybersecurity_suitability}</p>
                  </div>
                )}
                {laptop.programming_suitability && (
                  <div>
                    <strong style={{ color: '#a855f7', display: 'block', marginBottom: '0.25rem' }}>Programming Fit:</strong>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>{laptop.programming_suitability}</p>
                  </div>
                )}
              </div>
            )}

            {/* Specs */}
            <div>
              <h3 style={{ color: 'white', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Technical Specifications</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {laptop.cpu && <li style={{ display: 'flex', gap: '1rem' }}><Cpu size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Processor</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.cpu} {laptop.cpu_generation}</div></div></li>}
                {laptop.ram_gb && <li style={{ display: 'flex', gap: '1rem' }}><HardDrive size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Memory (RAM)</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.ram_gb}GB</div></div></li>}
                {laptop.storage_gb && <li style={{ display: 'flex', gap: '1rem' }}><HardDrive size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Storage</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.storage_gb}GB {laptop.storage_type}</div></div></li>}
                {laptop.gpu && <li style={{ display: 'flex', gap: '1rem' }}><Monitor size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Graphics</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.gpu}</div></div></li>}
                {laptop.display_size && <li style={{ display: 'flex', gap: '1rem' }}><Monitor size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Display</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.display_size} {laptop.display_resolution}</div></div></li>}
                {laptop.battery && <li style={{ display: 'flex', gap: '1rem' }}><Battery size={20} color="var(--color-primary)"/><div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: 500 }}>Battery</div><div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{laptop.battery}</div></div></li>}
              </ul>
            </div>

            {laptop.description && (
              <div style={{ marginTop: '3rem' }}>
                 <h3 style={{ color: 'white', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Additional Information</h3>
                 <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                   {laptop.description}
                 </div>
              </div>
            )}
            
          </div>
        </div>

      </section>
    </PageLayout>
  );
}
