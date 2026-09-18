import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Tag, BookOpen, Layers, ShieldCheck, Crosshair, Terminal, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './lab-detail.module.css';
import { ClientTracker } from '@/components/ClientTracker';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient();
  const { data: lab } = await supabase
    .from('labs')
    .select('title, short_description, slug, cover_image')
    .eq('slug', params.slug)
    .single();

  if (!lab) {
    return {
      title: 'Lab Not Found | Elitech Hub',
    };
  }

  return {
    title: `${lab.title} | Elitech Hub Lab`,
    description: lab.short_description || 'Cybersecurity Lab Research by Elitech Hub',
    alternates: {
      canonical: `https://elitechub.com/lab/${lab.slug}`,
    },
    openGraph: {
      title: `${lab.title} | Elitech Hub Lab`,
      description: lab.short_description,
      url: `https://elitechub.com/lab/${lab.slug}`,
      siteName: 'Elitech Hub',
      images: lab.cover_image ? [{ url: lab.cover_image }] : [],
      type: 'article',
    },
  };
}

export default async function LabDetailPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient();
  
  // Note: Only published labs are returned due to RLS for public users
  const { data: lab, error } = await supabase
    .from('labs')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !lab) {
    notFound();
  }

  // Helper to safely render JSON arrays as strings or parse them
  const renderArray = (arr: any) => {
    if (!arr) return null;
    if (Array.isArray(arr)) return arr;
    try {
      return JSON.parse(arr);
    } catch {
      return [arr];
    }
  };

  const toolsList = renderArray(lab.tools);
  const mitreMapping = typeof lab.mitre_mappings === 'string' ? JSON.parse(lab.mitre_mappings) : lab.mitre_mappings;

  return (
    <PageLayout>
      <ClientTracker event="lab_view" params={{ lab_slug: lab.slug, title: lab.title }} />
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/lab" className={styles.backLink}>
            <ChevronLeft size={16} /> Back to Labs
          </Link>
        </div>

        <header className={styles.header}>
          <div className={styles.meta}>
            {lab.category && (
              <span className={styles.category}><Tag size={14} /> {lab.category}</span>
            )}
            <span className={styles.difficulty}><Layers size={14} /> {lab.difficulty || 'Intermediate'}</span>
            <span className={styles.date}>
              <Calendar size={14} /> {new Date(lab.published_at || lab.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className={styles.title}>{lab.title}</h1>
          {lab.short_description && (
             <div className={styles.quickAnswer}>
                <strong>Quick Summary:</strong> {lab.short_description}
             </div>
          )}
          {lab.author && (
            <div className={styles.author}>
              <User size={14} /> Research by {lab.author}
            </div>
          )}
        </header>

        <div className={styles.contentGrid}>
          <main className={styles.mainContent}>
            {lab.full_description && (
              <section className={styles.section}>
                <h2><BookOpen size={20} /> Overview & Key Takeaways</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lab.full_description}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.objectives && (
              <section className={styles.section}>
                <h2><Crosshair size={20} /> Objectives</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.objectives}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.methodology && (
              <section className={styles.section}>
                <h2>Methodology</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.methodology}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.instructions && (
              <section className={styles.section}>
                <h2>Instructions / Walkthrough</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lab.instructions}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.findings && (
              <section className={styles.section}>
                <h2>Findings</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.findings}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.evidence && (
              <section className={styles.section}>
                <h2>Validation / Evidence</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.evidence}</ReactMarkdown>
                </div>
              </section>
            )}

            {lab.limitations && (
              <section className={styles.section}>
                <h2>Limitations</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.limitations}</ReactMarkdown>
                </div>
              </section>
            )}

            {(lab.code_artifacts || lab.yara_rules || lab.sigma_rules) && (
              <section className={styles.section}>
                <h2><Terminal size={20} /> Technical Artifacts</h2>
                
                {lab.yara_rules && (
                  <div className={styles.artifactBox}>
                    <h3>YARA Rules</h3>
                    <pre><code>{lab.yara_rules}</code></pre>
                  </div>
                )}
                
                {lab.sigma_rules && (
                  <div className={styles.artifactBox}>
                    <h3>Sigma Rules</h3>
                    <pre><code>{lab.sigma_rules}</code></pre>
                  </div>
                )}

                {lab.code_artifacts && (
                  <div className={styles.artifactBox}>
                    <h3>Code Snippets</h3>
                    <div className={styles.markdownBody}>
                      <ReactMarkdown>{lab.code_artifacts}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </section>
            )}
            
            {lab.references_list && (
              <section className={styles.section}>
                <h2>References</h2>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.references_list}</ReactMarkdown>
                </div>
              </section>
            )}
          </main>

          <aside className={styles.sidebar}>
            {lab.prerequisites && (
              <div className={styles.sidebarWidget}>
                <h3>Prerequisites</h3>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.prerequisites}</ReactMarkdown>
                </div>
              </div>
            )}

            {lab.environment && (
              <div className={styles.sidebarWidget}>
                <h3>Environment Setup</h3>
                <div className={styles.markdownBody}>
                  <ReactMarkdown>{lab.environment}</ReactMarkdown>
                </div>
              </div>
            )}

            {toolsList && toolsList.length > 0 && (
              <div className={styles.sidebarWidget}>
                <h3>Tools Used</h3>
                <ul className={styles.toolList}>
                  {toolsList.map((tool: string, idx: number) => (
                    <li key={idx}><Code size={14} /> {tool}</li>
                  ))}
                </ul>
              </div>
            )}

            {mitreMapping && (
              <div className={styles.sidebarWidget}>
                <h3>MITRE ATT&CK® Mappings</h3>
                <pre className={styles.mitreBox}>
                  {JSON.stringify(mitreMapping, null, 2)}
                </pre>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
