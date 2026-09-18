import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './guidelines.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/researcher-guidelines' },
  title: 'Researcher Guidelines - Elitech Hub',
  description: 'Guidelines for researchers submitting papers to Elitech Hub\'s research platform. Learn about submission requirements, review process, and publication standards.',
};

export default function ResearcherGuidelinesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <AnimateOnScroll>
        <div className={layoutStyles.pageHero} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className={layoutStyles.pageTitle} style={{ color: 'white' }}>
            <span style={{ fontSize: '1.2em', marginRight: '0.5rem' }}>📖</span> Researcher Guidelines
          </h1>
          <p className={layoutStyles.pageSubtitle} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Everything you need to know about submitting and publishing research papers on Elitech Hub
          </p>
        </div>
      </AnimateOnScroll>

      <section className={layoutStyles.section}>
        <div className={styles.guidelinesContainer}>
          
          {/* Getting Started */}
          <AnimateOnScroll>
            <div className={styles.guidelineSection}>
              <h2 className={styles.sectionTitle}>
                <span>🚀</span> Getting Started
              </h2>
              <p className={styles.text}>
                Welcome to the Elitech Hub Research Platform! We're excited to have you contribute to our growing body of cybersecurity, AI, and technology research.
              </p>

              <div className={`${styles.highlightBox} ${styles.success}`}>
                <strong style={{ color: 'white' }}>New to the platform?</strong> Start by creating your researcher account. Registration is free and takes less than 2 minutes.
              </div>

              <h3 className={styles.subTitle}>Account Requirements</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}>Valid email address (institutional email preferred but not required)</li>
                <li className={styles.listItem}>Full name as it should appear on publications</li>
                <li className={styles.listItem}>Affiliation (university, company, or independent)</li>
                <li className={styles.listItem}>ORCID (optional but recommended for citation tracking)</li>
                <li className={styles.listItem}>Primary research area selection</li>
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Accepted Categories */}
          <AnimateOnScroll>
            <div className={styles.guidelineSection}>
              <h2 className={styles.sectionTitle}>
                <span>🏷️</span> Research Categories
              </h2>
              <p className={styles.text}>
                We accept research papers in the following categories:
              </p>

              <div className={styles.categoriesGrid}>
                <div className={styles.categoryBadge}><span>🛡️</span> Cybersecurity</div>
                <div className={styles.categoryBadge}><span>🧠</span> Cyberpsychology</div>
                <div className={styles.categoryBadge}><span>🔒</span> Security Engineering</div>
                <div className={styles.categoryBadge}><span>🤖</span> Artificial Intelligence</div>
                <div className={styles.categoryBadge}><span>📈</span> Machine Learning</div>
                <div className={styles.categoryBadge}><span>💾</span> Data Science</div>
                <div className={styles.categoryBadge}><span>🕸️</span> Network Security</div>
                <div className={styles.categoryBadge}><span>🔍</span> Digital Forensics</div>
                <div className={styles.categoryBadge}><span>🔑</span> Cryptography</div>
                <div className={styles.categoryBadge}><span>💻</span> Software Engineering</div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Submission Requirements */}
          <AnimateOnScroll>
            <div className={styles.guidelineSection}>
              <h2 className={styles.sectionTitle}>
                <span>📄</span> Submission Requirements
              </h2>

              <h3 className={styles.subTitle}>Paper Format</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}><strong>File Type:</strong> PDF format (required)</li>
                <li className={styles.listItem}><strong>Language:</strong> English</li>
                <li className={styles.listItem}><strong>Length:</strong> 4 to 12 pages (excluding references)</li>
                <li className={styles.listItem}><strong>Style:</strong> IEEE or APA format</li>
              </ul>

              <h3 className={styles.subTitle}>Required Components</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}><strong>Abstract:</strong> 150-250 words summarizing the research</li>
                <li className={styles.listItem}><strong>Keywords:</strong> 3-5 relevant keywords</li>
                <li className={styles.listItem}><strong>Introduction:</strong> Background, problem statement, and objectives</li>
                <li className={styles.listItem}><strong>Methodology:</strong> Detailed explanation of research methods</li>
                <li className={styles.listItem}><strong>Results:</strong> Clear presentation of findings (with high-quality figures/tables)</li>
                <li className={styles.listItem}><strong>Conclusion:</strong> Summary of impact and future work</li>
                <li className={styles.listItem}><strong>References:</strong> Properly formatted citations</li>
              </ul>

              <div className={`${styles.highlightBox} ${styles.warning}`}>
                <strong style={{ color: 'white' }}>Important:</strong> All submissions must be original work. We use advanced plagiarism detection tools. Plagiarism will result in immediate rejection and potential account suspension.
              </div>
            </div>
          </AnimateOnScroll>

          {/* Review Process */}
          <AnimateOnScroll>
            <div className={styles.guidelineSection}>
              <h2 className={styles.sectionTitle}>
                <span>⚙️</span> Review Process
              </h2>
              <p className={styles.text}>
                We maintain a rigorous but fast review process to ensure high-quality research is published promptly.
              </p>

              <div className={styles.processSteps}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Initial Screening (1-2 days)</h4>
                    <p>Automated checks for formatting, plagiarism, and scope alignment.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Peer Review (7-14 days)</h4>
                    <p>Double-blind review by two subject matter experts.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Decision</h4>
                    <p>Accepted, Accepted with Minor Revisions, Revise & Resubmit, or Rejected.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepContent}>
                    <h4>Publication (2-3 days)</h4>
                    <p>Final formatting and publication on the Elitech Hub Research Portal.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Ethics */}
          <AnimateOnScroll>
            <div className={styles.guidelineSection}>
              <h2 className={styles.sectionTitle}>
                <span>⚖️</span> Ethics & Responsible Disclosure
              </h2>
              <p className={styles.text}>
                Research involving vulnerabilities, exploits, or human subjects must adhere to strict ethical guidelines.
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>If your research uncovers new vulnerabilities, you must follow standard Responsible Disclosure procedures before publishing.</li>
                <li className={styles.listItem}>Do not include active exploits, malicious payloads, or sensitive PII in your submissions.</li>
                <li className={styles.listItem}>Provide anonymized datasets where applicable.</li>
              </ul>
              <div className={styles.highlightBox}>
                <strong style={{ color: 'white' }}>Need clarification?</strong> Read our full <Link href="/security" style={{ color: '#7C3AED' }}>Security & Trust</Link> policy.
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className={styles.ctaSection}>
              <h2 className={styles.ctaTitle}>Ready to Submit?</h2>
              <p className={styles.ctaText}>
                Join our community of researchers and share your findings with the world.
              </p>
              <Link href="mailto:research@elitechub.com" className="btn btn-primary" style={{ background: '#7C3AED' }}>
                <span style={{ marginRight: '0.5rem' }}>✉️</span> Email Your Submission
              </Link>
            </div>
          </AnimateOnScroll>

        </div>
      </section>
    </PageLayout>
  );
}
