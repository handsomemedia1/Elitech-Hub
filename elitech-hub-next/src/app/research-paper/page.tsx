import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './research-paper.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Research Publications & Academic Papers | Elitech Hub',
  description: 'Read the latest academic research papers, threat analyses, and cybersecurity journals published by Elitech Hub and our global research fellows.',
  keywords: 'cybersecurity research papers, academic journals, threat analysis publications, Elitech Hub research, peer-reviewed security papers',
  alternates: { canonical: 'https://elitechub.com/research-paper' },
  openGraph: {
    title: 'Research Publications & Academic Papers | Elitech Hub',
    description: 'Read the latest academic research papers, threat analyses, and cybersecurity journals published by Elitech Hub and our global research fellows.',
    url: 'https://elitechub.com/research-paper',
    type: 'website',
  }
};

export default function ResearchPaperPage() {
  return (
    <PageLayout>
      <div className={styles.pageBody}>
        {/* Header */}
        <header className={styles.paperHeader}>
          <div className={styles.paperContainer}>
            <span className={styles.paperCategory}>Cybersecurity Research</span>
            <h1 className={styles.paperTitle}>
              Zero-Trust Architecture in African Financial Institutions: A Comparative Analysis
            </h1>
            
            <div className={styles.paperAuthors}>
              <div className={styles.authorCard}>
                <div className={styles.authorAvatar}>EA</div>
                <div className={styles.authorInfo}>
                  <h4>Elijah Adeyeye</h4>
                  <span>Elitech Hub</span>
                </div>
              </div>
            </div>

            <div className={styles.paperMeta}>
              <div className={styles.metaItem}>
                <i className="fas fa-calendar"></i> Published: Jan 15, 2026
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-book"></i> Elitech Hub Research Repository
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-fingerprint"></i> DOI: 10.1234/eh.2026.001
              </div>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className={styles.paperActions}>
          <div className={styles.paperContainer}>
            <div className={styles.actionBar}>
              <div className={styles.actionButtons}>
                <button className={styles.btnPrimary}>
                  <i className="fas fa-file-pdf"></i> Download PDF
                </button>
                <button className={styles.btnSecondary}>
                  <i className="fas fa-quote-right"></i> Cite
                </button>
              </div>
              <div className={styles.statsBar}>
                <div className={styles.statItem}>
                  <i className="fas fa-eye"></i> 1,204 Views
                </div>
                <div className={styles.statItem}>
                  <i className="fas fa-download"></i> 342 Downloads
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.paperContainer} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <main className={styles.paperContent}>
            
            <section className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>Abstract</h2>
              <p className={styles.abstractText}>
                The rapid digital transformation of the African financial sector has introduced unprecedented cybersecurity challenges. This paper examines the implementation of Zero-Trust Architecture (ZTA) across five major African financial institutions. We analyze the technical hurdles, cultural resistance, and cost implications associated with transitioning from traditional perimeter-based security models. Our findings indicate that while ZTA significantly reduces the impact of insider threats and lateral movement, the initial deployment requires substantial investment in identity management and continuous monitoring solutions. We propose a phased implementation framework tailored to the specific regulatory and infrastructural constraints of the African financial ecosystem.
              </p>
              
              <div className={styles.keywordsList}>
                <span className={styles.keywordTag}>Zero-Trust</span>
                <span className={styles.keywordTag}>Cybersecurity</span>
                <span className={styles.keywordTag}>Financial Institutions</span>
                <span className={styles.keywordTag}>Africa</span>
                <span className={styles.keywordTag}>Network Security</span>
              </div>
            </section>

            <section className={styles.contentSection}>
              <div className={styles.paperBody}>
                <h2>1. Introduction</h2>
                <p>
                  In recent years, the perimeter-based security model has proven increasingly inadequate against sophisticated cyber threats. The assumption that internal networks are inherently safe has led to devastating data breaches when attackers bypass the outer defenses. This vulnerability is particularly acute in the financial sector, where the stakes are high and regulatory scrutiny is intense.
                </p>
                <p>
                  Zero-Trust Architecture (ZTA) paradigm shifts the focus from network perimeters to individual users, devices, and applications. By demanding continuous verification of trust, ZTA minimizes the attack surface and mitigates the risk of lateral movement. However, adopting ZTA is a complex endeavor, especially for organizations with legacy infrastructure.
                </p>
                
                <h3>1.1 Problem Statement</h3>
                <p>
                  African financial institutions face unique challenges in adopting modern security architectures, including legacy systems, budget constraints, and a shortage of specialized cybersecurity talent. This study aims to evaluate the effectiveness and feasibility of ZTA implementation in this specific context.
                </p>
              </div>
            </section>

          </main>

          <aside className={styles.paperSidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Article Details</h3>
              <p><strong>Type:</strong> Research Article</p>
              <p><strong>License:</strong> CC BY-NC 4.0</p>
              <p><strong>Pages:</strong> 12</p>
            </div>
            
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Share</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={styles.btnSecondary} style={{ padding: '0.5rem' }}><i className="fab fa-twitter"></i></button>
                <button className={styles.btnSecondary} style={{ padding: '0.5rem' }}><i className="fab fa-linkedin-in"></i></button>
                <button className={styles.btnSecondary} style={{ padding: '0.5rem' }}><i className="fas fa-link"></i></button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
