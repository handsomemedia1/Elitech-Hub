import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { FileText, Download, Tag, Calendar, User, Search, BookOpen, Clock, File } from 'lucide-react';
import styles from './resources.module.css';

export const metadata: Metadata = {
  title: 'Resources | Elitech Hub',
  description: 'Explore research resources, guides, reports, educational materials, and other useful documents from Elitech Hub.',
  keywords: 'cybersecurity resources, Elitech Hub library, free cybersecurity guides, threat reports, tech educational materials Nigeria',
  alternates: {
    canonical: 'https://elitechub.com/resources',
  },
  openGraph: {
    title: 'Resources | Elitech Hub',
    description: 'Explore research resources, guides, reports, educational materials, and other useful documents from Elitech Hub.',
    type: 'website',
    url: 'https://elitechub.com/resources',
  }
};

export default async function ResourcesIndexPage() {
  const supabase = getSupabaseServerClient();
  
  // Fetch published resources
  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const hasResources = resources && resources.length > 0;

  return (
    <PageLayout>
      {/* ── HERO / HEADER ── */}
      <div style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '7rem 2rem 5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white',
            lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.02em',
          }}>
            Resources <span style={{ color: '#3b82f6' }}>Library</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#cbd5e1',
            maxWidth: '680px', margin: '0 auto', lineHeight: 1.7,
          }}>
            Explore research resources, guides, reports, educational materials, and other useful documents from Elitech Hub.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ background: '#f8fafc', minHeight: '60vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {hasResources ? (
            <div className={styles.grid}>
              {resources.map((resource: any) => {
                const publishDate = resource.publication_date 
                  ? new Date(resource.publication_date) 
                  : new Date(resource.created_at);
                
                return (
                  <Link href={`/resources/${resource.slug}`} key={resource.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.badge}>{resource.topic || 'Resource'}</span>
                      <span className={styles.typeBadge}>
                        <FileText size={12} /> {resource.resource_type || 'Document'}
                      </span>
                    </div>
                    
                    <h3 className={styles.title}>{resource.title}</h3>
                    
                    {resource.description && (
                      <p className={styles.description}>
                        {resource.description.length > 150 
                          ? resource.description.substring(0, 150) + '...' 
                          : resource.description}
                      </p>
                    )}
                    
                    <div className={styles.meta}>
                      {resource.author && (
                        <div className={styles.metaItem}>
                          <User size={14} />
                          <span>{resource.author}</span>
                        </div>
                      )}
                      <div className={styles.metaItem}>
                        <Calendar size={14} />
                        <span>{publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <span className={styles.cta}>View Resource &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <BookOpen size={48} />
              </div>
              <h2>Building Our Library</h2>
              <p>We are currently preparing high-quality guides, reports, and research materials. Check back soon for new resources.</p>
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
}
