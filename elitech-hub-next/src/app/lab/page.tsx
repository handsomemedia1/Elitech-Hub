import { getSupabaseServerClient } from '@/lib/supabase';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import styles from './lab.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { 
  Microscope, FlaskConical, FileText, Users, Eye, Crosshair, 
  Bug, Server, Code, GitBranch, BookOpen, ChevronRight, 
  Terminal, ShieldCheck, CheckCircle2, ShieldAlert, FileCode2,
  Workflow, CheckSquare, Mail
} from 'lucide-react';
import CountUp from '@/components/CountUp';

export const metadata = {
  title: 'Cybersecurity R&D Lab | Threat Intelligence & Tactical Operations | Elitech Hub',
  description:
    'Explore the Elitech Hub Cybersecurity Lab. We conduct active research and development in detection engineering, threat analysis, defensive infrastructure, and secure development for Nigerian businesses.',
  keywords: [
    'cybersecurity lab Nigeria',
    'threat intelligence Nigeria',
    'detection engineering lab Nigeria',
    'cybersecurity R&D Lagos',
    'defensive infrastructure Nigeria',
    'secure development Nigeria',
    'tactical cyber operations Africa',
    'cyber threat analysis Nigeria',
  ],
  openGraph: {
    title: 'Cybersecurity R&D Lab | Threat Intelligence & Tactical Operations',
    description: 'Explore the Elitech Hub Cybersecurity Lab. We conduct active research and development in detection engineering, threat analysis, defensive infrastructure, and secure development.',
    url: 'https://elitechub.com/lab',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cybersecurity R&D Lab | Elitech Hub Nigeria', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/lab' },
};


export default async function LabPage() {
  const supabase = getSupabaseServerClient();
  const { data: labs, error } = await supabase.from('labs').select('*').eq('status', 'published').order('published_at', { ascending: false });

  return (
    <PageLayout>
      <section className={styles.hero}>
        <AnimateOnScroll direction="fade" delay={200}>
          <div className={styles.badge}>
            <Microscope size={14} /> CYBERSECURITY LAB
          </div>
          <h1 className={styles.heroTitle}>
            Where We <span className={styles.heroHighlight}>Build, Test & Validate</span>
          </h1>
          <p className={styles.heroDesc}>
            The Elitech Hub Lab is where research meets execution. We experiment with real-world threats, develop detection logic, and validate defensive controls — grounded in evidence, not assumptions.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#67e8f9' }}>
                <FlaskConical size={28} />
              </div>
              <div>
                <div className={styles.statValue}><span className="sr-only">4</span><CountUp end={4} /></div>
                <div className={styles.statLabel}>Lab Units</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#8B5CF6' }}>
                <FileText size={28} />
              </div>
              <div>
                <div className={styles.statValue}><span className="sr-only">12+</span><CountUp end={12} suffix="+" /></div>
                <div className={styles.statLabel}>Papers</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#6ee7b7' }}>
                <Users size={28} />
              </div>
              <div>
                <div className={styles.statValue}><span className="sr-only">25</span><CountUp end={25} /></div>
                <div className={styles.statLabel}>Researchers</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#F59E0B' }}>
                <Eye size={28} />
              </div>
              <div>
                <div className={styles.statValue}><span className="sr-only">10k+</span><CountUp end={10} suffix="k+" /></div>
                <div className={styles.statLabel}>Views</div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section className={styles.section}>
        <AnimateOnScroll direction="up">
          <div className={styles.sectionHeader}>
            <h2>Lab Overview</h2>
            <p>
              The Elitech Hub Cybersecurity Lab exists to experiment, test, and validate cybersecurity defenses against real-world threats. Our work is not academic theory — it is grounded in practical application, real incident data, and reproducible methodology.
            </p>
          </div>
        </AnimateOnScroll>

        <div className={styles.pillars}>
          <AnimateOnScroll direction="up" delay={100}>
            <div className={styles.pillar}>
              <Crosshair size={24} color="#c3151c" />
              <span>Detection Engineering</span>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={200}>
            <div className={styles.pillar}>
              <Bug size={24} color="#c3151c" />
              <span>Incident Response Simulation</span>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={300}>
            <div className={styles.pillar}>
              <Server size={24} color="#c3151c" />
              <span>Secure Infrastructure Analysis</span>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll direction="fade" delay={200}>
          <div className={styles.osBanner}>
            <div className={styles.osBannerContent}>
              <h3><GitBranch size={28} color="#2185D0" /> Open Source Lab</h3>
              <p>Our research, detection rules, and infrastructure playbooks are completely open-source. Explore the raw code or help contribute to our mission natively on Codeberg.</p>
            </div>
            <div className={styles.osBannerActions}>
              <a href="https://codeberg.org/ElitechHub/detection-rules" target="_blank" rel="noopener noreferrer" className={styles.btnOsSecondary}>
                <BookOpen size={18} /> View Repository
              </a>
              <a href="https://codeberg.org/ElitechHub/detection-rules/issues" target="_blank" rel="noopener noreferrer" className={styles.btnOsPrimary}>
                <GitBranch size={18} /> Contribute
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section className={styles.section} style={{ background: 'var(--color-bg-base)' }}>
        <AnimateOnScroll direction="up">
          <div className={styles.sectionHeader}>
            <h2>Lab Focus Areas</h2>
            <p>Four active lab units, each focused on a distinct problem domain within cybersecurity defense.</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.labUnits}>
          <AnimateOnScroll direction="left" delay={100}>
            <div className={styles.labUnit} style={{ borderColor: 'rgba(195, 21, 28, 0.3)' }}>
              <div className={styles.unitIcon}>
                <Crosshair size={32} />
              </div>
              <h3>Detection Engineering Lab</h3>
              <div className={styles.unitSection}>
                <h4>What Happens Here</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Development and testing of detection logic (YARA, Sigma)</li>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Evaluation of false positives vs true positives</li>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Mapping attacker behavior to detection rules</li>
                </ul>
              </div>
              <div className={styles.unitSection}>
                <h4>Outputs</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Sample detection rules</li>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Case-based detection notes</li>
                  <li><CheckCircle2 size={16} color="#c3151c" style={{marginTop:'4px'}} /> Dashboards and logic diagrams</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={200}>
            <div className={styles.labUnit} style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <div className={styles.unitIcon} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
                <Bug size={32} />
              </div>
              <h3>Threat Analysis Lab</h3>
              <div className={styles.unitSection}>
                <h4>What Happens Here</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Analysis of real-world incidents and attack chains</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Deconstruction of malware behavior</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Mapping techniques to MITRE ATT&CK</li>
                </ul>
              </div>
              <div className={styles.unitSection}>
                <h4>Outputs</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Incident breakdowns</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Threat models</li>
                  <li><CheckCircle2 size={16} color="#3b82f6" style={{marginTop:'4px'}} /> Behavioral analysis reports</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={300}>
            <div className={styles.labUnit} style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div className={styles.unitIcon} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Server size={32} />
              </div>
              <h3>Defensive Infrastructure Lab</h3>
              <div className={styles.unitSection}>
                <h4>What Happens Here</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Testing security controls in simulated environments</li>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Evaluating endpoint, network, and cloud defenses</li>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Failure-mode analysis of common security setups</li>
                </ul>
              </div>
              <div className={styles.unitSection}>
                <h4>Outputs</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Hardening guides</li>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Configuration experiments</li>
                  <li><CheckCircle2 size={16} color="#10b981" style={{marginTop:'4px'}} /> Control effectiveness summaries</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={400}>
            <div className={styles.labUnit} style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <div className={styles.unitIcon} style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}>
                <Code size={32} />
              </div>
              <h3>Secure Development & DevSecOps Lab</h3>
              <div className={styles.unitSection}>
                <h4>What Happens Here</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Code review and vulnerability analysis</li>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Secure CI/CD experimentation</li>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Evaluation of common dev security failures</li>
                </ul>
              </div>
              <div className={styles.unitSection}>
                <h4>Outputs</h4>
                <ul>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Secure coding patterns</li>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Vulnerability case studies</li>
                  <li><CheckCircle2 size={16} color="#a855f7" style={{marginTop:'4px'}} /> Pipeline security notes</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2>Our Methodology</h2>
            <p>How we select, execute, and validate every experiment.</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.methodologySteps}>
          <AnimateOnScroll direction="up" delay={100}>
            <div className={styles.methodStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Case Selection</h3>
              <p>Cases are drawn from real incidents, simulated attack scenarios, and anonymized data from partner organizations. We prioritize threats with high relevance to the African digital landscape.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={200}>
            <div className={styles.methodStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>Experimentation</h3>
              <p>Experiments are conducted in isolated sandboxes, virtual lab environments, and test networks. We document every step, tool, and configuration used for full reproducibility.</p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll direction="up" delay={300}>
            <div className={styles.methodStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Validation</h3>
              <p>Conclusions are validated through repetition, peer review, and comparison against established frameworks such as MITRE ATT&CK. We publish only what we can defend.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className={styles.section} style={{ background: 'var(--color-bg-base)' }}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2>Lab Artifacts</h2>
            <p>Evidence of work. Published research from our active lab experiments.</p>
          </div>
        </AnimateOnScroll>

                <div className={styles.artifactsGrid}>
          {labs && labs.length > 0 ? (
            labs.map((lab: any, index: number) => (
              <AnimateOnScroll key={lab.id} direction="up" delay={100 * (index + 1)}>
                <div className={styles.artifactCard}>
                  <div className={styles.artifactHeader}>
                    <div className={`${styles.artifactIcon} ${styles.yara}`}>
                      <Crosshair size={28} />
                    </div>
                    <div className={styles.artifactMeta}>
                      <div className={`${styles.artifactCategory} ${styles.yara}`}>{lab.category || 'Research'}</div>
                      <div className={styles.artifactTitle}>{lab.title}</div>
                      <div className={styles.artifactFile}><FileCode2 size={14} /> {lab.slug}</div>
                    </div>
                  </div>
                  <div className={styles.artifactCode} style={{ maxHeight: '150px', overflow: 'hidden' }}>
                    {lab.short_description || "No description provided."}
                  </div>
                  <div className={styles.artifactFooter}>
                    <span className={`${styles.artifactTag} ${styles.high}`}>
                      <ShieldAlert size={14} /> {lab.difficulty || 'Intermediate'}
                    </span>
                    <Link href={`/lab/${lab.slug}`} className={`${styles.artifactAction} ${styles.yara}`}>
                      <FileText size={16} /> View Lab
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))
          ) : (
            <div style={{ textAlign: 'center', width: '100%', color: 'var(--color-text-secondary)' }}>
              No published labs found. Please check back later.
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/research" className="premium-button">
            View All Research <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ethicsSection}`}>
        <AnimateOnScroll direction="fade">
          <div className={styles.ethicsGrid}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.1 }}>Ethics & Responsibility</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.15rem', lineHeight: 1.6 }}>All lab work is conducted under strict ethical guidelines. We exist to defend, not exploit.</p>
            </div>
            <div className={styles.ethicsList}>
              <div className={styles.ethicsItem}>
                <CheckCircle2 color="#10b981" size={24} style={{flexShrink:0}} />
                <div>
                  <h4>Responsible Disclosure</h4>
                  <p>Vulnerabilities found are reported through proper channels before any publication.</p>
                </div>
              </div>
              <div className={styles.ethicsItem}>
                <CheckCircle2 color="#10b981" size={24} style={{flexShrink:0}} />
                <div>
                  <h4>No Live Exploits</h4>
                  <p>We never publish working exploit code or tools that could be weaponized.</p>
                </div>
              </div>
              <div className={styles.ethicsItem}>
                <CheckCircle2 color="#10b981" size={24} style={{flexShrink:0}} />
                <div>
                  <h4>Data Privacy</h4>
                  <p>No sensitive victim data is exposed. All case data is anonymized and sanitized.</p>
                </div>
              </div>
              <div className={styles.ethicsItem}>
                <CheckCircle2 color="#10b981" size={24} style={{flexShrink:0}} />
                <div>
                  <h4>Defensive Intent</h4>
                  <p>All research is conducted for educational and defensive purposes only.</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section className={styles.section}>
        <AnimateOnScroll direction="up">
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(195, 21, 28, 0.1) 0%, rgba(7, 13, 26, 0.8) 100%)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Collaborate With Our Lab</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 2rem' }}>
              Whether you're a researcher, security professional, or organization with a problem to solve — we welcome collaboration on applied cybersecurity challenges.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className="premium-button">
                <Mail size={16} /> Get in Touch
              </Link>
              <Link href="/researcher-guidelines" className="premium-button-outline">
                <Microscope size={16} /> Researcher Portal
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </PageLayout>
  );
}
