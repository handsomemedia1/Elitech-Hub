import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import PriceDisplay from '@/components/PriceDisplay';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './professional.module.css';
import { Crown, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Award, Shield, Code, Target, Briefcase, Users, UserPlus, Network, FileSearch, Star, Clock, Calendar, BookOpen, Repeat } from 'lucide-react';

export const metadata = {
  title: '16-Week Professional Cybersecurity Program Nigeria | Internship Experience | Elitech Hub',
  description: 'Nigeria\'s most comprehensive cybersecurity career transformation program. 16 weeks of intensive training, unpaid internship experience, CompTIA Security+, CEH preparation, 1-on-1 mentorship, and career support.',
  keywords: ['16 week cybersecurity program Nigeria', 'professional cybersecurity training Nigeria', 'cybersecurity career program Lagos', 'internship experience cybersecurity Nigeria', 'CompTIA Security+ training Nigeria', 'CEH certification Nigeria', 'cybersecurity mentorship Nigeria', 'cybersecurity career support Nigeria'],
  openGraph: {
    title: '16-Week Professional Cybersecurity Program Nigeria | Internship Experience | Elitech Hub',
    description: 'Nigeria\'s most comprehensive cybersecurity career transformation program. 16 weeks of intensive training, unpaid internship experience, CompTIA Security+, CEH preparation, 1-on-1 mentorship, and career support.',
    url: 'https://elitechub.com/programs/professional',
    siteName: 'Elitech Hub',
    images: [
      {
        url: 'https://elitechub.com/images/professional-og.jpg',
        width: 1200,
        height: 630,
        alt: '16-Week Professional Cybersecurity Program at Elitech Hub',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '16-Week Professional Cybersecurity Program Nigeria | Internship Experience | Elitech Hub',
    description: 'Nigeria\'s most comprehensive cybersecurity career transformation program. 16 weeks of intensive training, unpaid internship experience, CompTIA Security+, CEH preparation, 1-on-1 mentorship, and career support.',
    images: ['https://elitechub.com/images/professional-og.jpg'],
  },
  alternates: {
    canonical: 'https://elitechub.com/programs/professional',
  },
};

export default function ProfessionalProgramPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://elitechub.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Programs',
          item: 'https://elitechub.com/programs',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '16-Week Professional Program',
          item: 'https://elitechub.com/programs/professional',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: '16-Week Professional Cybersecurity Program',
      description: 'Nigeria\'s most comprehensive cybersecurity career transformation program. 16 weeks of intensive training, unpaid internship experience, CompTIA Security+, CEH preparation, 1-on-1 mentorship, and career support.',
      provider: {
        '@type': 'Organization',
        name: 'Elitech Hub',
        sameAs: 'https://elitechub.com',
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Blended',
        location: 'Lagos, Nigeria (Online & In-Person options)',
        courseSchedule: {
          '@type': 'Schedule',
          duration: 'P16W',
        },
      },
      offers: {
        '@type': 'Offer',
        price: '200000',
        priceCurrency: 'NGN',
        eligibleRegion: {
          '@type': 'Country',
          name: 'NG',
        },
        category: 'Professional Certificate',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '43',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I become a cybersecurity professional in just 16 weeks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Honestly, no. Training is an entry point. It gives you the foundational knowledge and basic practical skills required to start. True mastery requires continuous learning and practice. We bridge this gap by transitioning you into an internship to gain workflow experience.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if I don\'t know my specialization yet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'That\'s perfectly normal. Our core methodology involves learning the basics and applying them first. Over the 16 weeks, you will be exposed to different domains like ethical hacking and network security, allowing you to discover what interests you before specializing.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens after the training?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After training, you enter the 4-week internship phase. Short-term training only introduces concepts; the internship bridges your learning to professional workflow experience. While we do not guarantee employment, we equip you with real-world project portfolios, career support, and verifiable certificates to make you highly employable.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need prior IT experience for the 16-week program?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While basic computer literacy is helpful, this program is designed to take you from absolute beginner to job-ready professional. We start from the fundamentals in Week 1 before moving to advanced concepts.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the internship experience work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Upon successful completion of the 16-week training, you transition into a 4-week remote or hybrid unpaid internship with one of our partner tech companies or within Elitech Hub to gain real-world workflow experience.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I pay the fee in installments?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! We offer flexible payment plans. You can pay in a maximum of two installments to make the investment more manageable while you learn.',
          },
        },
        {
          '@type': 'Question',
          name: 'What certifications will I be prepared for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The curriculum thoroughly prepares you for CompTIA Security+, Certified Ethical Hacker (CEH), and provides foundational knowledge for OSCP.',
          },
        },
      ],
    },
  ];

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/programs" className="back-link">
            <ArrowLeft size={16} /> Back to All Programs
          </Link>
        </div>

        {/* Hero Section */}
        <section className={styles.hero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <AnimateOnScroll direction="up">
            <div className={styles.badge}>
              <Crown className={styles.badgeIcon} />
              <span>16-WEEK PROFESSIONAL</span>
            </div>
            <h1 className={styles.title}>16-Week Professional Cybersecurity Program</h1>
            <p className={styles.subtitle}>
              Training is an entry point, not the finish line. Go from beginner to an industry-ready professional with hands-on labs, 4-week internship experience to bridge your learning to professional workflow, and robust career support.
            </p>
            
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <div className={styles.statIconWrapper}>
                  <Briefcase className={styles.statIcon} />
                </div>
                <div className={styles.statInfo}>
                  <h3>Internship Experience</h3>
                  <p>Gain real-world workflow experience</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIconWrapper}>
                  <Target className={styles.statIcon} />
                </div>
                <div className={styles.statInfo}>
                  <h3>Career Support</h3>
                  <p>Resume, interview prep & employer matching</p>
                </div>
              </div>
            </div>

            <div className={styles.heroCta}>
              <Link href="/apply?program=prof16" className="premium-button">
                Apply Now <ArrowRight size={18} />
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* ── METHODOLOGY SECTION ── */}
        <section className={styles.methodologySection} style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Methodology</h2>
            <p className={styles.sectionSub} style={{ maxWidth: '800px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
              We do not believe in overnight success or false guarantees. Cybersecurity requires continuous evolution. Our process ensures you build competence through deliberate practice.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', alignItems: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              <span>Learn</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Apply</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Relearn</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Apply Again</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Specialise</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Practice</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Intern</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Certify</span> <ArrowRight size={16} className="text-gradient-primary" />
              <span>Continue Learning</span>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Pricing Card */}
        <section className={styles.pricingSection}>
          <AnimateOnScroll direction="fade">
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h2>Program Investment</h2>
                <div className={styles.priceAmount}>
                <PriceDisplay courseId="professional" fallback="₦200,000" />
              </div>
              <p className={styles.priceNote}>Flexible payment plans available (Max 2 installments)</p>
              </div>
              <ul className={styles.pricingFeatures}>
                <li><CheckCircle2 className={styles.checkIcon} /> 16 weeks of intensive practical training</li>
                <li><CheckCircle2 className={styles.checkIcon} /> 4-week post-training internship experience</li>
                <li><CheckCircle2 className={styles.checkIcon} /> 1-on-1 industry mentorship</li>
                <li><CheckCircle2 className={styles.checkIcon} /> Dedicated career support assistance</li>
                <li><CheckCircle2 className={styles.checkIcon} /> Access to premium cyber labs</li>
              </ul>
              <Link href="/apply?program=prof16" className={`premium-button ${styles.pricingBtn}`} style={{ marginTop: '2rem' }}>
                Enroll Today
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* What You'll Master */}
        <section className={styles.phasesSection}>
          <AnimateOnScroll direction="up">
            <div className={styles.sectionHeader}>
              <h2>What You&apos;ll Master</h2>
              <p>A structured, rigorous 4-phase curriculum designed to build your expertise from the ground up.</p>
            </div>
            
            <div className={styles.phaseGrid}>
              <div className={styles.phaseCard}>
                <div className={styles.phaseIndicator}>01</div>
                <h3>Weeks 1-4: Foundations & Linux Security</h3>
                <p>Master the building blocks of cybersecurity, networking fundamentals, and command-line mastery.</p>
                <ul className={styles.phaseList}>
                  <li>Networking (OSI, TCP/IP, Subnetting)</li>
                  <li>Linux & Windows OS Security</li>
                  <li>Command Line & Shell Scripting</li>
                  <li>Cybersecurity Concepts & Ethics</li>
                </ul>
              </div>

              <div className={styles.phaseCard}>
                <div className={styles.phaseIndicator}>02</div>
                <h3>Weeks 5-8: Offensive Security</h3>
                <p>Learn to think like a hacker. Discover vulnerabilities and exploit them ethically in a controlled lab.</p>
                <ul className={styles.phaseList}>
                  <li>Reconnaissance & Footprinting</li>
                  <li>Network & Web App Vulnerabilities</li>
                  <li>Metasploit & Exploit Frameworks</li>
                  <li>Wireless & Social Engineering Attacks</li>
                </ul>
              </div>

              <div className={styles.phaseCard}>
                <div className={styles.phaseIndicator}>03</div>
                <h3>Weeks 9-12: Defensive Security</h3>
                <p>Switch sides and learn how to defend networks, analyze threats, and respond to incidents.</p>
                <ul className={styles.phaseList}>
                  <li>Intrusion Detection Systems (IDS/IPS)</li>
                  <li>SIEM (Splunk, Elastic) Fundamentals</li>
                  <li>Incident Response & Forensics</li>
                  <li>Threat Intelligence & Malware Analysis</li>
                </ul>
              </div>

              <div className={styles.phaseCard}>
                <div className={styles.phaseIndicator}>04</div>
                <h3>Weeks 13-16: Career & Projects</h3>
                <p>Consolidate your knowledge with capstone projects and prepare to enter the job market.</p>
                <ul className={styles.phaseList}>
                  <li>Capstone Industry Projects</li>
                  <li>Red Team vs Blue Team Exercises</li>
                  <li>Resume Building & Interview Prep</li>
                  <li>4-Week Internship Experience</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Certifications & Career Support */}
        <section className={styles.supportSection}>
          <div className={styles.supportGrid}>
            <AnimateOnScroll direction="right">
              <div className={styles.certCard}>
                <Award className={styles.certIcon} />
                <h2>Certification Prep</h2>
                <p>Our curriculum maps directly to globally recognized certifications, giving you the edge in the job market.</p>
                <ul className={styles.certList}>
                  <li><strong>CompTIA Security+</strong> (Complete Coverage)</li>
                  <li><strong>Certified Ethical Hacker (CEH)</strong> (Complete Coverage)</li>
                  <li><strong>Offensive Security (OSCP)</strong> (Foundational Prep)</li>
                </ul>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left">
              <div className={styles.careerCard}>
                <UserPlus className={styles.careerIcon} />
                <h2>Career Support ecosystem</h2>
                <p>We don&apos;t just train you; we launch your career.</p>
                <ul className={styles.careerList}>
                  <li><CheckCircle2 className={styles.checkIcon} /> 1-on-1 Mentorship Sessions</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Resume & LinkedIn Optimization</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Technical Mock Interviews</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> 4-Week Unpaid Internship Experience</li>
                  <li><CheckCircle2 className={styles.checkIcon} /> Exclusive Alumni Network</li>
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Timeline */}
        <section className={styles.timelineSection}>
          <AnimateOnScroll direction="up">
            <div className={styles.sectionHeader}>
              <h2>Day in the Trenches</h2>
              <p>What a typical intense learning day looks like in our program.</p>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timeSlot}>Morning Session</div>
                  <h4>Theory & Concepts</h4>
                  <p>Deep dive into the core concepts, protocols, and mechanisms with our expert instructors.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timeSlot}>Mid-Day</div>
                  <h4>Guided Lab Work</h4>
                  <p>Applying the morning&apos;s theory in a secure sandbox environment with step-by-step guidance.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timeSlot}>Afternoon</div>
                  <h4>Capture The Flag (CTF) Challenges</h4>
                  <p>Independent problem solving, exploiting vulnerabilities or defending systems in gamified scenarios.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timeSlot}>Evening</div>
                  <h4>Review & Mentorship</h4>
                  <p>Daily debrief, code review, and 1-on-1 sessions to clarify doubts and plan for the next day.</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <AnimateOnScroll direction="up">
            <div className={styles.sectionHeader}>
              <h2>Frequently Asked Questions</h2>
            </div>
            
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Can I become a cybersecurity professional in just 16 weeks?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  Honestly, no. Training is an entry point. It gives you the foundational knowledge and basic practical skills required to start. True mastery requires continuous learning and practice. We bridge this gap by transitioning you into an internship to gain workflow experience.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  What if I do not know my specialization yet?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  That is perfectly normal. Our core methodology involves learning the basics and applying them first. Over the 16 weeks, you will be exposed to different domains like ethical hacking and network security, allowing you to discover what interests you before specializing.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  What happens after the training?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  After training, you enter the 4-week internship phase. Short-term training only introduces concepts; the internship bridges your learning to professional workflow experience. While we do not guarantee employment, we equip you with real-world project portfolios, career support, and verifiable certificates to make you highly employable.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Do I need prior IT experience for the 16-week program?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  While basic computer literacy is helpful, this program is designed to take you from absolute beginner to job-ready professional. We start from the fundamentals in Week 1 before moving to advanced concepts.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  How does the internship experience work?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  Upon successful completion of the 16-week training, you transition into a 4-week remote or hybrid unpaid internship with one of our partner tech companies or within Elitech Hub to gain real-world workflow experience.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>Can I pay the fee in installments? <ChevronDown size={20} /></summary>
                <div className={styles.faqAnswer}>
                  Yes, you can pay in a maximum of 2 installments. However, note that all payments made are strictly non-refundable once processed. We offer this flexibility to help you manage the cost of the program.
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  What certifications will I be prepared for?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <div className={styles.faqContent}>
                  The curriculum thoroughly prepares you for CompTIA Security+, Certified Ethical Hacker (CEH), and provides foundational knowledge for OSCP. Note that exam voucher fees are separate from the tuition.
                </div>
              </details>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/faq" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>View Full FAQ</Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Bottom CTA */}
        <section className={styles.bottomCta}>
          <AnimateOnScroll direction="fade">
            <h2>Ready to transform your career?</h2>
            <p>Join the next cohort of cybersecurity professionals. Spaces are strictly limited to ensure personalized attention.</p>
            <div className={styles.ctaButtonGroup}>
              <Link href="/apply?program=prof16" className={`${layoutStyles.btn} ${layoutStyles.btnPrimary} ${styles.primaryCta}`}>
                Apply Now <ArrowRight className={styles.btnIcon} />
              </Link>
              <Link href="/programs" className={`${layoutStyles.btn} ${layoutStyles.btnOutline} ${styles.secondaryCta}`}>
                View All Programs
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
