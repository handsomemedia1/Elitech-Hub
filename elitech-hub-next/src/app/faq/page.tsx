import PageLayout from '@/components/PageLayout';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import styles from './faq.module.css';

export const metadata = {
  title: 'Frequently Asked Questions | Elitech Hub',
  description: 'Find answers to common questions about our cybersecurity training programs, web development services, and general inquiries at Elitech Hub.',
  alternates: {
    canonical: 'https://elitechub.com/faq',
  },
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Cybersecurity Training",
      questions: [
        {
          q: 'Can I become a cybersecurity professional in a short bootcamp?',
          a: 'Honestly, no. Short-term training is an entry point. It gives you the foundational knowledge and basic practical skills required to start. True mastery requires continuous learning and practice. We bridge this gap by transitioning you into an internship to gain workflow experience.'
        },
        {
          q: 'What if I don\'t know my specialization yet?',
          a: 'That\'s perfectly normal. Our core methodology involves learning the basics and applying them first. Over the course of your program, you will be exposed to different domains like ethical hacking and network security, allowing you to discover what interests you before specializing.'
        },
        {
          q: 'What happens after the training?',
          a: 'After training, you enter the internship phase. Short-term training only introduces concepts; the internship bridges your learning to professional workflow experience. While we do not guarantee employment, we equip you with real-world project portfolios and verifiable certificates to make you highly employable.'
        },
        {
          q: 'Do I need prior IT experience?',
          a: 'No. Our programs are designed to take you from absolute beginner to job-ready professional. If you can use a computer and have internet access, you are ready to start.'
        },
        {
          q: 'When are classes held?',
          a: 'All classes run on weekends — Saturdays and Sundays — so you do not need to quit your job or pause school.'
        },
        {
          q: 'Will I get a certificate?',
          a: 'Yes. Upon completing the program and your industry project, you receive a verifiable certificate of completion from Elitech Hub.'
        }
      ]
    },
    {
      category: "Web Development & Digital Infrastructure",
      questions: [
        {
          q: 'How much does website development cost for a Nigerian business?',
          a: 'The cost varies depending on the complexity, features, and requirements of your project. We offer transparent pricing tiers starting at ₦250,000 for secure landing pages, scaling up to ₦700,000+ for complex full-stack web applications with RBAC.'
        },
        {
          q: 'How long does it take to build a website?',
          a: 'A standard business website typically takes 2-4 weeks from discovery to launch. Complex secure web applications or enterprise digital infrastructure platforms may take 6-12 weeks depending on the scope.'
        },
        {
          q: 'What do you mean by Secure Digital Infrastructure?',
          a: 'As a cybersecurity firm, we don\'t just build websites; we build secure-by-design digital infrastructure. This means integrating Role-Based Access Control (RBAC), end-to-end encryption, input sanitization, and enterprise-grade authentication using technologies like Next.js, TypeScript, and Supabase.'
        },
        {
          q: 'Do you provide hosting and maintenance?',
          a: 'Yes, we handle the deployment via Vercel or your preferred infrastructure, ensuring zero-downtime deployments. We also offer ongoing maintenance packages to keep your software secure, updated, and performing optimally.'
        },
        {
          q: 'Is the website SEO optimised?',
          a: 'Absolutely. We build all our websites with technical SEO best practices in mind from day one. Using Next.js Server-Side Rendering (SSR) and advanced caching, we ensure your site is fast, mobile-friendly, and easily discoverable by search engines.'
        }
      ]
    },
    {
      category: "General",
      questions: [
        {
          q: 'Can I pay in installments?',
          a: 'Yes, we offer flexible payment plans for our training programs. You can pay in a maximum of 2 installments. For Web Development projects, we typically structure payments around project milestones.'
        },
        {
          q: 'Where are you located?',
          a: 'We are a globally accessible platform, but our core team operates out of Nigeria. All our training programs and consultations are conducted 100% virtually.'
        },
        {
          q: 'How can I get in touch?',
          a: 'You can reach out to us via our Contact page, or directly through our official WhatsApp channels listed on the website.'
        }
      ]
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      }))
    )
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className={styles.container}>
        <AnimateOnScroll direction="up">
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Find answers to common questions about our programs, services, and how we operate.
          </p>
        </AnimateOnScroll>

        {faqs.map((category, index) => (
          <section key={index} className={styles.categorySection}>
            <AnimateOnScroll direction="fade" delay={index * 100}>
              <h2 className={styles.categoryTitle}>{category.category}</h2>
              <div className={styles.faqList}>
                {category.questions.map((item, i) => (
                  <details key={i} className={styles.faqItem}>
                    <summary className={styles.faqSummary}>
                      {item.q}
                      <ChevronDown className={styles.faqIcon} size={20} />
                    </summary>
                    <div className={styles.faqContent}>
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </AnimateOnScroll>
          </section>
        ))}

        <AnimateOnScroll direction="up">
          <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Still have questions?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We are here to help. Reach out to our team directly.</p>
            <Link href="/contact" className="premium-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </PageLayout>
  );
}
