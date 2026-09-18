import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './web-development.module.css';
import { Globe, CheckCircle2, ChevronDown, ArrowRight, ArrowLeft, Code, Zap, Shield, Star, Layout, Smartphone, Search, TrendingUp, Lock } from 'lucide-react';
import { PricingTiers, PricingTierProps } from '@/components/PricingTiers';

export const metadata = {
  title: 'Secure Digital Infrastructure & Web Development | Elitech Hub',
  description: 'Elitech Hub builds premium custom websites, web applications, and secure digital infrastructure for businesses. Fast, secure-by-design, Next.js, and Supabase.',
  keywords: [
    'secure digital infrastructure',
    'custom website development',
    'web development company',
    'business website design',
    'ecommerce website development',
    'custom web application',
    'secure website development',
    'RBAC web apps',
    'Next.js development Nigeria',
    'Supabase developers'
  ],
  alternates: {
    canonical: 'https://elitechub.com/services/web-development',
  },
  openGraph: {
    url: 'https://elitechub.com/services/web-development',
    title: 'Secure Digital Infrastructure & Web Development | Elitech Hub',
    description: 'Elitech Hub builds premium custom websites, web applications, and secure digital infrastructure for businesses. Fast, secure-by-design, Next.js, and Supabase.',
  }
};

export default function WebDevelopmentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://elitechub.com/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://elitechub.com/services" },
          { "@type": "ListItem", "position": 3, "name": "Web Development", "item": "https://elitechub.com/services/web-development" }
        ]
      },
      {
        "@type": "Service",
        "name": "Secure Digital Infrastructure & Web Development",
        "serviceType": "Web Development",
        "provider": {
          "@type": "Organization",
          "name": "Elitech Hub",
          "url": "https://elitechub.com"
        },
        "areaServed": ["Lagos", "Ibadan", "Abuja", "Nigeria", "Global"],
        "description": "Premium custom websites and secure digital infrastructure built for performance, security, and scalability using Next.js and Supabase."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does website development cost for a Nigerian business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The cost of website development varies depending on the complexity, features, and requirements of your project. We offer transparent pricing tiers starting at ₦250,000 for secure landing pages, scaling up to ₦700,000+ for complex full-stack web applications with RBAC."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to build a website?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A standard business website typically takes 2-4 weeks from discovery to launch. Complex secure web applications or enterprise digital infrastructure platforms may take 6-12 weeks depending on the scope."
            }
          },
          {
            "@type": "Question",
            "name": "What do you mean by Secure Digital Infrastructure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "As a cybersecurity firm, we don't just build websites; we build secure-by-design digital infrastructure. This means integrating Role-Based Access Control (RBAC), end-to-end encryption, input sanitization, and enterprise-grade authentication using technologies like Next.js, TypeScript, and Supabase."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide hosting and maintenance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we handle the deployment via Vercel or your preferred infrastructure, ensuring zero-downtime deployments. We also offer ongoing maintenance packages to keep your software secure, updated, and performing optimally."
            }
          },
          {
            "@type": "Question",
            "name": "Is the website SEO optimised?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. We build all our websites with technical SEO best practices in mind from day one. Using Next.js Server-Side Rendering (SSR) and advanced caching, we ensure your site is fast, mobile-friendly, and easily discoverable by search engines."
            }
          },
          {
            "@type": "Question",
            "name": "Do you build ecommerce sites?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we build robust, secure, and scalable ecommerce websites that provide excellent user experiences and integrate seamlessly with local (Paystack, Flutterwave) and international payment gateways."
            }
          }
        ]
      }
    ]
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className={styles.pageContainer}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/services" className="back-link">
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </nav>

        {/* Hero Section */}
        <section className={styles.heroSection} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/programs-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <AnimateOnScroll direction="up">
            <div className={styles.badge}>
              <Shield className={styles.badgeIcon} />
              <span>SECURE BY DESIGN</span>
            </div>
            <h1 className={styles.heroTitle}>Secure Digital Infrastructure & Web Development</h1>
            <p className={styles.heroSubtitle}>
              We craft fast, secure, and SEO-ready web applications that drive results. Built with enterprise-grade tech: Next.js, TypeScript, and Supabase.
            </p>
            <div className={styles.metaIcons}>
              <div className={styles.metaItem}>
                <Shield className={styles.metaIcon} />
                <span>Secure by Design</span>
              </div>
              <div className={styles.metaItem}>
                <Search className={styles.metaIcon} />
                <span>SEO Optimised</span>
              </div>
              <div className={styles.metaItem}>
                <Lock className={styles.metaIcon} />
                <span>RBAC & Auth</span>
              </div>
              <div className={styles.metaItem}>
                <Zap className={styles.metaIcon} />
                <span>Fast Delivery</span>
              </div>
            </div>
            
            <div className={styles.ctaGroup}>
              <Link href="/portfolio" className="premium-button">
                View Portfolio <ArrowRight size={20} />
              </Link>
              <Link href="#pricing" className="premium-button secondary">
                View Prices
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* What We Build */}
        <section className={styles.whatWeBuildSection}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>What We Build</h2>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <Code className={styles.cardIcon} />
                <h3>Custom Web Applications</h3>
                <p>Complex, secure, and interactive web apps tailored to your business logic.</p>
                <ul className={styles.cardFeatures}>
                  <li><CheckCircle2 size={16} /> Role-Based Access Control (RBAC)</li>
                  <li><CheckCircle2 size={16} /> API integrations</li>
                  <li><CheckCircle2 size={16} /> Next.js & TypeScript</li>
                </ul>
              </div>
              <div className={styles.card}>
                <Shield className={styles.cardIcon} />
                <h3>Secure Digital Infrastructure</h3>
                <p>Backend systems and databases built to withstand modern cyber threats.</p>
                <ul className={styles.cardFeatures}>
                  <li><CheckCircle2 size={16} /> Supabase / PostgreSQL</li>
                  <li><CheckCircle2 size={16} /> Data Encryption</li>
                  <li><CheckCircle2 size={16} /> Enterprise Auth</li>
                </ul>
              </div>
              <div className={styles.card}>
                <Layout className={styles.cardIcon} />
                <h3>Corporate Websites</h3>
                <p>Professional, SEO-optimised online presence for corporate brands.</p>
                <ul className={styles.cardFeatures}>
                  <li><CheckCircle2 size={16} /> Fast SSR delivery</li>
                  <li><CheckCircle2 size={16} /> Lead generation forms</li>
                  <li><CheckCircle2 size={16} /> Mobile-responsive</li>
                </ul>
              </div>
              <div className={styles.card}>
                <Globe className={styles.cardIcon} />
                <h3>E-commerce Stores</h3>
                <p>Secure online stores optimized for sales and conversions.</p>
                <ul className={styles.cardFeatures}>
                  <li><CheckCircle2 size={16} /> Payment gateway setup</li>
                  <li><CheckCircle2 size={16} /> Inventory management</li>
                  <li><CheckCircle2 size={16} /> Secure checkout</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Pricing Section */}
        <section className={styles.pricingSection} id="pricing">
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Transparent Pricing</h2>
            <p className={styles.sectionSubtitle}>Simple, predictable pricing with no hidden fees.</p>
            <PricingTiers tiers={[
              {
                id: "web-basic",
                title: "Basic Web Security",
                priceNgn: 250000,
                description: "One page website with custom security alone.",
                features: [
                  "1-Page Custom Design",
                  "Custom Security Hardening",
                  "Mobile Responsive",
                  "Fast Loading Speeds"
                ]
              },
              {
                id: "web-dynamic",
                title: "Dynamic One Page",
                priceNgn: 350000,
                description: "One page website dynamic.",
                features: [
                  "Dynamic 1-Page Design",
                  "Custom Security Hardening",
                  "Mobile Responsive",
                  "Basic Interactivity"
                ]
              },
              {
                id: "web-business",
                title: "Standard Business Site",
                priceNgn: 400000,
                description: "One to three page website, with WhatsApp CRM, SEO, and custom security for frontend.",
                features: [
                  "1 to 3 Pages Custom Frontend",
                  "WhatsApp CRM Integration",
                  "On-Page SEO Optimization",
                  "Custom Security Hardening"
                ],
                isPopular: true
              },
              {
                id: "web-ecommerce",
                title: "Premium Fullstack Site",
                priceNgn: 700000,
                description: "Dynamic digital infrastructure with database and backend.",
                features: [
                  "Supabase Backend & Database",
                  "RBAC & Enterprise Auth",
                  "Advanced Security & APIs",
                  "WhatsApp CRM & Full SEO"
                ]
              }
            ]} />
          </AnimateOnScroll>
        </section>

        {/* Tech Stack */}
        <section className={styles.techStackSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Our Tech Stack</h2>
            <div className={styles.chipsContainer}>
              <span className={styles.chip}>Next.js</span>
              <span className={styles.chip}>React</span>
              <span className={styles.chip}>TypeScript</span>
              <span className={styles.chip}>Node.js</span>
              <span className={styles.chip}>Supabase</span>
              <span className={styles.chip}>PostgreSQL</span>
              <span className={styles.chip}>Vercel</span>
              <span className={styles.chip}>Tailwind</span>
              <span className={styles.chip}>RBAC</span>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Why Security-First */}
        <section className={styles.securitySection}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Why Security-First?</h2>
            <p className={styles.securityIntro}>
              Our cybersecurity background means security is built into your digital infrastructure from day 1, not bolted on as an afterthought.
            </p>
            <div className={styles.securityPoints}>
              <div className={styles.securityPoint}>
                <Lock className={styles.securityIcon} />
                <h4>Role-Based Access Control (RBAC)</h4>
                <p>Strict access policies ensuring users only see data they are authorized to view.</p>
              </div>
              <div className={styles.securityPoint}>
                <Code className={styles.securityIcon} />
                <h4>Input Validation & XSS Protection</h4>
                <p>Sanitizing all user inputs to prevent malicious script injections.</p>
              </div>
              <div className={styles.securityPoint}>
                <Shield className={styles.securityIcon} />
                <h4>Data Security & Encryption</h4>
                <p>Encrypting data at rest and in transit via Supabase and HTTPS protocols.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Case Studies / See Our Work */}
        <section className={styles.processSection} style={{ background: '#f8fafc', padding: '4rem 5%', textAlign: 'center' }}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle} style={{ color: '#0f172a' }}>See Our Security-First Work</h2>
            <p className={styles.sectionSubtitle} style={{ color: '#475569', marginBottom: '2rem' }}>
              Explore how we've helped organizations build secure, high-performance web applications.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <Link href="/portfolio/cyberoutreach-agent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '12px', color: '#0f172a', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <Globe size={18} color="#3b82f6" /> CyberOutreach Platform
              </Link>
              <Link href="/portfolio/elitech-admin-bot" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '12px', color: '#0f172a', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <Code size={18} color="#10b981" /> Elitech Admin System
              </Link>
              <Link href="/portfolio/rusty-threads-bot" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '12px', color: '#0f172a', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <Zap size={18} color="#f59e0b" /> Rusty Threads Bot
              </Link>
            </div>
            <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontWeight: 700, textDecoration: 'none' }}>
              View all case studies <ArrowRight size={16} />
            </Link>
          </AnimateOnScroll>
        </section>

        {/* Our Process */}
        <section className={styles.processSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Our Process</h2>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Discovery & Architecture</h4>
                <p>We analyze your business needs and design a scalable database and system architecture.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>Design & Prototype</h4>
                <p>Creating wireframes and UI/UX designs for your approval.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>Secure Development</h4>
                <p>Building the solution with Next.js, Supabase, and rigorous security testing.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h4>Launch & Maintenance</h4>
                <p>Deploying the app and providing continuous updates and SEO optimizations.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqContainer}>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  How much does website development cost for a Nigerian business?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  The cost of website development varies depending on the complexity, features, and requirements of your project. We offer transparent pricing tiers starting at ₦250,000 for secure landing pages, scaling up to ₦700,000+ for complex full-stack web applications with RBAC.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  How long does it take to build a website?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  A standard business website typically takes 2-4 weeks from discovery to launch. Complex secure web applications or enterprise digital infrastructure platforms may take 6-12 weeks depending on the scope.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  What do you mean by Secure Digital Infrastructure?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  As a cybersecurity firm, we don't just build websites; we build secure-by-design digital infrastructure. This means integrating Role-Based Access Control (RBAC), end-to-end encryption, input sanitization, and enterprise-grade authentication using technologies like Next.js, TypeScript, and Supabase.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Do you provide hosting and maintenance?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  Yes, we handle the deployment via Vercel or your preferred infrastructure, ensuring zero-downtime deployments. We also offer ongoing maintenance packages to keep your software secure, updated, and performing optimally.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Is the website SEO optimised?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  Absolutely. We build all our websites with technical SEO best practices in mind from day one. Using Next.js Server-Side Rendering (SSR) and advanced caching, we ensure your site is fast, mobile-friendly, and easily discoverable by search engines.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Do you build ecommerce sites?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  Yes, we build robust, secure, and scalable ecommerce websites that provide excellent user experiences and integrate seamlessly with local (Paystack, Flutterwave) and international payment gateways.
                </p>
              </details>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/faq" style={{ color: 'var(--brand-primary)', textDecoration: 'underline' }}>View Full FAQ</Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.ctaTitle}>Ready to Build Your Secure Digital Infrastructure?</h2>
            <div className={styles.ctaButtons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/contact" className="premium-button">
                Get a Free Quote <ArrowRight size={20} />
              </Link>
              <Link href="/portfolio" className="premium-button-outline">
                View Our Portfolio
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
