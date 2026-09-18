import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import styles from './about.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import Image from 'next/image';
import CountUp from '@/components/CountUp';
import { Shield, Brain, Network, Award, Lock, ChevronRight, Mail, Phone, ExternalLink, ShieldCheck, Users, Target, Building2, CheckCircle2, ArrowRight, Database } from 'lucide-react';
import { LinkedinLogo, PhosphorGlobe, PhosphorGraduationCap } from '@/components/PhosphorIcons';

export const metadata: Metadata = {
  title: "About Elitech Hub | Nigeria's Cybersecurity Training Leader | Lagos & Ibadan",
  description: "Driving Innovation Through AI, Cybersecurity, Research Excellence and Business Transformation.",
  keywords: ['about Elitech Hub', 'SMEDAN certified cybersecurity', 'CAC registered cybersecurity training', 'Elitech Hub founder', 'Elijah Adeyeye', 'cybersecurity training Nigeria', 'cybersecurity school Lagos'],
  openGraph: {
    title: "About Elitech Hub | Nigeria's Cybersecurity Training Leader",
    description: "Driving Innovation Through AI, Cybersecurity, Research Excellence and Business Transformation.",
    url: 'https://elitechub.com/about',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'About Elitech Hub' },
  alternates: { canonical: 'https://elitechub.com/about' },
};

export default function AboutPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elitechub.com' },
        { '@type': 'ListItem', position: 2, name: 'About', item: 'https://elitechub.com/about' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://elitechub.com/#organization',
      name: 'Elitech Hub',
      url: 'https://elitechub.com',
      logo: 'https://elitechub.com/images/logo.png',
      description: "Nigeria's leading cybersecurity training organisation, building Africa's next generation of digital defenders.",
      foundingDate: '2023',
      address: { '@type': 'PostalAddress', addressLocality: 'Ibadan', addressRegion: 'Oyo State', addressCountry: 'NG' },
      founder: { '@type': 'Person', name: 'Elijah Adeyeye', jobTitle: 'Founder & CEO' },
      knowsAbout: ['Cybersecurity', 'Ethical Hacking', 'AI Security', 'Web Development', 'Penetration Testing'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Elijah Adeyeye',
      jobTitle: 'Founder & CEO',
      worksFor: { '@type': 'Organization', name: 'Elitech Hub', url: 'https://elitechub.com' },
      url: 'https://elitechub.com/about',
    },
  ];

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HERO SECTION */}
      <section className={styles.hero} style={{ backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%), url('/assets/images/AboutHero%20image.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <AnimateOnScroll direction="fade" delay={200}>
          <div className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Our Story
          </div>
          <h1 className={styles.title}>
            Building Africa's <span className="text-gradient-primary">Cybersecurity</span> Future
          </h1>
          <p className={styles.subtitle}>
            We don't just teach cybersecurity; we build the next generation of digital defenders. 
            Unlike the "gurus" who promise overnight success, we provide <strong>real training, real internships, and real results.</strong>
            <br/><br/>
            Now enrolling students globally — Nigeria, UK, USA, Canada, UAE, and Kuwait.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>SMEDAN Certified</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>Verified Business</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
              <Award size={20} style={{ color: '#c3151c' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>CAC Registered</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>RC: 8693883</div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* STATS ROW */}
      <div className={styles.statsContainer}>
        <AnimateOnScroll direction="up" delay={400}>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statNum}><span className="sr-only">300+</span><CountUp end={300} suffix="+" /></div>
              <div className={styles.statLabel}>Students Trained</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum} style={{ color: 'white' }}><span className="sr-only">100%</span><CountUp end={100} suffix="%" /></div>
              <div className={styles.statLabel}>Internship Experience</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum} style={{ color: 'var(--color-verification)' }}><span className="sr-only">100%</span><CountUp end={100} suffix="%" /></div>
              <div className={styles.statLabel}>Internship Experience</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum} style={{ color: '#3b82f6' }}><span className="sr-only">10+</span><CountUp end={10} suffix="+" /></div>
              <div className={styles.statLabel}>Partner Companies</div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* MISSION & VISION */}
      <section className={styles.section}>
        <div className={styles.mvGrid}>
          {/* Mission */}
          <AnimateOnScroll direction="left">
            <div className={styles.mvCard}>
              <div className={`${styles.mvIcon} ${styles.missionIcon}`}>
                <Target size={32} />
              </div>
              <div className={styles.badge} style={{ background: 'rgba(195, 21, 28, 0.1)', color: '#c3151c', border: 'none' }}>
                Our Mission
              </div>
              <h3 className={styles.mvTitle}>Empowering Africa's Cyber Defenders</h3>
              <p className={styles.mvDesc}>
                To democratize access to world-class cybersecurity education in Africa, bridging the global talent gap while equipping individuals with practical, hands-on skills to defend digital infrastructures and build successful careers.
              </p>
              <div className={styles.mvTags}>
                <span className={styles.mvTag}><ShieldCheck size={14} /> Practical Education</span>
                <span className={styles.mvTag}><Network size={14} /> Global Standards</span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Vision */}
          <AnimateOnScroll direction="right" delay={200}>
            <div className={styles.mvCard}>
              <div className={`${styles.mvIcon} ${styles.visionIcon}`}>
                <Brain size={32} />
              </div>
              <div className={styles.badge} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none' }}>
                Our Vision
              </div>
              <h3 className={styles.mvTitle}>Africa's Cybersecurity Powerhouse</h3>
              <p className={styles.mvDesc}>
                To become the premier cybersecurity training institution in Africa, renowned for producing elite professionals who secure the digital economy and innovate solutions for global cyber challenges.
              </p>
              <div className={styles.mvTags}>
                <span className={styles.mvTag}><Award size={14} /> Premier Institution</span>
                <span className={styles.mvTag}><Lock size={14} /> Secure Africa</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className={styles.section} style={{ background: '#020408' }}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Core <span className="text-gradient">Values</span></h2>
            <p className={styles.subtitle}>The principles that guide everything we do</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.valuesGrid}>
          {[
            { icon: Award, title: "Excellence", desc: "We deliver world-class training that exceeds global standards.", color: "#f59e0b" },
            { icon: Users, title: "Community", desc: "We foster a supportive environment where everyone grows together.", color: "#3b82f6" },
            { icon: Brain, title: "Innovation", desc: "We adapt our curriculum to stay ahead of emerging cyber threats.", color: "#a855f7" },
            { icon: Shield, title: "Integrity", desc: "We instill strong ethical principles in all our students.", color: "#10b981" }
          ].map((val, i) => (
            <AnimateOnScroll key={val.title} direction="up" delay={i * 100}>
              <div className={styles.valueCard}>
                <div className={styles.valueIconWrap}>
                  <val.icon size={40} color={val.color} />
                </div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{val.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meet Our <span className="text-gradient-primary">Founder</span></h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up">
          <div className={styles.founderCard}>
            <div className={styles.founderImgWrap}>
              <Image 
                src="/assets/images/official pic.png" 
                alt="Elijah Adeyeye" 
                width={250} height={250}
                className={styles.founderImg}
              />
            </div>
            <div className={styles.founderInfo}>
              <h3 className={styles.founderName}>Elijah Adeyeye</h3>
              <div className={styles.founderRole}>Founder & Lead Instructor</div>
              
              <p className={styles.founderDesc}>
                With a unique background in <strong>Guidance and Counselling</strong> from the University of Ibadan paired with advanced certifications in <strong>Cybersecurity and Data Analysis</strong>, Elijah approaches digital security through a behavioral lens.
              </p>
              <p className={styles.founderDesc}>
                His interdisciplinary approach enables him to see connections where others don't. 
                <em> "Cybersecurity isn't just about firewalls—it's about profiling. Hackers study their victims' habits, fears, and routines."</em>
              </p>

              <div className={styles.founderQuote}>
                "The safest systems are built by psychologists who speak code."
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <a href="https://orcid.org/0009-0005-4853-7813" target="_blank" rel="noopener noreferrer" className={styles.badge} style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'inherit' }}>
                  <ExternalLink size={12} color="var(--color-accent)" /> ORCID: 0009-0005-4853-7813
                </a>
                <span className={styles.badge} style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={12} color="var(--color-accent)" /> B.Sc. Psychology
                </span>
                <span className={styles.badge} style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={12} color="var(--color-accent)" /> Cybersecurity Expert
                </span>
                <span className={styles.badge} style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Database size={12} color="var(--color-accent)" /> Data Analyst
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="mailto:Elijahadeyeye@proton.me" className="premium-button">
                  <Mail size={16} /> Email
                </a>
                <a href="https://wa.me/2347081968062" className="premium-button-outline">
                  <Phone size={16} /> WhatsApp
                </a>
                <a href="https://elijahadeyeye.vercel.app/" target="_blank" rel="noopener noreferrer" className="premium-button-outline" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  <ExternalLink size={16} /> Portfolio
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ADVISORS */}
      <section className={styles.section} style={{ background: '#020408' }}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our <span className="text-gradient">Advisors</span></h2>
            <p className={styles.subtitle}>Experienced professionals guiding our curriculum and vision.</p>
          </div>
        </AnimateOnScroll>

        <div className={styles.advisorsGrid}>
          {[
            { 
              name: "Dr. Olasunkanmi J. Kehinde", role: "Ph.D., Educational Psychology",
              location: "Norfolk State University", color: "#c3151c", img: "olasunkanmi-kehinde.png",
              desc: "Assistant Professor specializing in Psychometrics, Machine Learning, and Large-scale Assessment.",
              links: [
                { icon: Mail, url: "mailto:ojkehinde@nsu.edu", label: "Email" },
                { icon: LinkedinLogo, url: "https://www.linkedin.com/in/olasunkanmi-kehinde", label: "LinkedIn" },
                { icon: PhosphorGraduationCap, url: "https://scholar.google.com/citations", label: "Scholar" }
              ]
            },
            { 
              name: "Dr. Ayodele John Alonge", role: "Ph.D., Communication Studies",
              location: "Digital Society School, Amsterdam", color: "#3b82f6", img: "ayodele-alonge.png",
              desc: "Digital Transformation Researcher specializing in Library Science, ICT, and digital innovation.",
              links: [
                { icon: Mail, url: "mailto:ayoalonge@gmail.com", label: "Email" },
                { icon: LinkedinLogo, url: "https://www.linkedin.com/in/ayodele-john-alonge", label: "LinkedIn" },
                { icon: PhosphorGlobe, url: "https://optimisticscholar.com", label: "Website" }
              ]
            },
            { 
              name: "Yemi Adeyeye, Ph.D.", role: "Ph.D., International Forestry",
              location: "City of Windsor", color: "#10b981", img: "yemi-adeyeye.jpg",
              desc: "Natural Resource Management expert specializing in forestry, water, and agrifood systems.",
              links: [
                { icon: Mail, url: "mailto:adeyeye_yemi@yahoo.com", label: "Email" },
                { icon: LinkedinLogo, url: "https://www.linkedin.com/in/yemi-adeyeye", label: "LinkedIn" },
                { icon: PhosphorGlobe, url: "https://yemiadeyeye.com/", label: "Website" }
              ]
            }
          ].map((adv, i) => (
            <AnimateOnScroll key={adv.name} direction="up" delay={i * 150}>
              <div className={styles.advisorCard}>
                <div className={styles.advisorHeader}>
                  <div className={styles.advisorAvatar} style={{ borderColor: adv.color }}>
                    <img src={`/assets/images/${adv.img}`} alt={adv.name} />
                  </div>
                  <div>
                    <h3 className={styles.advisorName}>{adv.name}</h3>
                    <p className={styles.advisorRole} style={{ color: adv.color }}>{adv.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={14} color={adv.color} /> {adv.location}
                </p>
                <p className={styles.advisorDesc}>{adv.desc}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  {adv.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                       className={styles.advisorLink}
                       title={link.label}>
                      <link.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>
      {/* PARTNERSHIPS */}
      <section className={styles.section}>
        <AnimateOnScroll direction="fade">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Partnership <span className="text-gradient-primary">Opportunities</span></h2>
            <p className={styles.subtitle}>We're open to partnering with organizations committed to advancing cybersecurity in Africa</p>
          </div>
        </AnimateOnScroll>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
          
          <AnimateOnScroll direction="up" delay={100}>
            <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', borderStyle: 'solid' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
                <Building2 size={16} /> Partner
              </div>
              <img src="/assets/images/cee-partner.png" alt="Ceewritingservices Logo" style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.5rem' }}>
                Partnering with Elitech Hub to deliver professional writing and documentation services.
              </p>
              <Link href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                Visit Partner <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll direction="up" delay={200}>
            <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', borderStyle: 'solid' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
                <Building2 size={16} /> Partner
              </div>
              <img src="https://optimisticscholar.com/wp-content/uploads/2022/01/OptimisticScholar-logo-White-1.png" alt="Optimistic Scholar Logo" style={{ maxWidth: '200px', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.5rem' }}>
                Empowering scholars and researchers through collaborative academic initiatives.
              </p>
              <Link href="https://optimisticscholar.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                Visit Partner <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>

        </div>

        <AnimateOnScroll direction="up" delay={300}>
          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Interested in Partnering?</h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Contact us to discuss partnership opportunities and how we can work together to advance cybersecurity education in Africa.
            </p>
            <Link href="/contact" className="premium-button">
              Contact Us for Partnership <ChevronRight size={16} />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* CTA Section */}
      <section className={styles.section}>
        <AnimateOnScroll direction="up">
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(195, 21, 28, 0.1) 0%, rgba(7, 13, 26, 0.8) 100%)' }}>
            <h2 className={styles.sectionTitle}>Ready to Transform Your Career?</h2>
            <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
              Join 300+ students, 100+ graduates who have launched successful cybersecurity careers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/programs" className="premium-button">
                View Programs <ChevronRight size={16} />
              </Link>
              <a href="https://wa.me/2347081968062" className="premium-button-outline">
                <Phone size={16} /> Talk to Us
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </PageLayout>
  );
}

