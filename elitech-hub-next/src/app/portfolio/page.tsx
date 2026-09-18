import React from 'react';
import PageLayout from '@/components/PageLayout';
import styles from './portfolio.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';
import { ExternalLink, Lock } from 'lucide-react';

export const metadata = {
  title: 'Portfolio | Web Development, AI Chatbots & Cybersecurity Projects | Elitech Hub Nigeria',
  description:
    'View Elitech Hub\'s portfolio of premium custom websites, agentic AI applications, and cybersecurity projects built for Nigerian and international businesses. Based in Ibadan, Lagos, Nigeria.',
  keywords: [
    'web development portfolio Nigeria',
    'AI chatbot portfolio Nigeria',
    'website design portfolio Lagos',
    'Elitech Hub portfolio',
    'custom website examples Nigeria',
    'agentic AI examples Nigeria',
    'cybersecurity project portfolio',
    'website design Ibadan',
    'Next.js portfolio Nigeria',
  ],
  openGraph: {
    title: 'Portfolio | Elitech Hub Nigeria — Web Dev, AI & Cybersecurity',
    description: 'Premium websites, AI agents, and security projects built by Elitech Hub for Nigerian and global clients.',
    url: 'https://elitechub.com/portfolio',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    images: [{ url: 'https://elitechub.com/images/og-default.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Elitech Hub Portfolio — Web Dev & AI Nigeria', site: '@ElitechHub' },
  alternates: { canonical: 'https://elitechub.com/portfolio' },
};


const projects = [
  {
    id: 1,
    title: 'Mercy Ogunwale',
    tag: 'Personal Portfolio',
    description: 'A premium, dynamic portfolio website featuring a dark-theme claymorphism aesthetic and vibrant orange accents. Designed for high impact and modern typography.',
    image: '/assets/images/portfolio/mercy-ogunwale.png',
    link: 'https://comfy-tanuki-d6a142.netlify.app/',
    external: true
  },
  {
    id: 2,
    title: 'Primero Solutions',
    tag: 'Corporate Website',
    description: 'A professional business website focusing on clean corporate identity, providing clear navigation, and a strong professional presence for B2B engagement.',
    image: '/assets/images/portfolio/primero.png',
    link: 'https://primerosolutionsllc.com/',
    external: true
  },
  {
    id: 3,
    title: 'Dr. Yemi Adeyeye',
    tag: 'Professional Profile',
    description: 'An academic and professional portfolio with advanced integrations, highlighting research, publications, and professional background.',
    image: '/assets/images/portfolio/dr-yemi.png',
    link: 'https://yemiadeyeye.com/',
    external: true
  },
  {
    id: 4,
    title: 'EPIX Initiative',
    tag: 'Organization / Initiative',
    description: 'A completely optimized, mobile-responsive organization platform featuring modern UI components, smooth navigation, and dynamic content presentation.',
    image: '/assets/images/portfolio/epix.png',
    link: 'https://epix-initiative.vercel.app/',
    external: true
  },
  {
    id: 5,
    title: 'Cee Writing',
    tag: 'Service Platform',
    description: 'A streamlined, conversion-focused service platform for professional writing services, featuring sleek UI and robust order management integrations.',
    image: '/assets/images/portfolio/cee-writing.png',
    link: 'https://ceewriting.com/',
    external: true
  },
  {
    id: 6,
    title: 'HIIM',
    tag: 'Web Application',
    description: 'A modern web application built for seamless user interaction. It features highly responsive interfaces and state-of-the-art web performance optimizations.',
    image: '/assets/images/portfolio/hiim.png',
    link: 'https://hiim.vercel.app/',
    external: true
  },
  {
    id: 7,
    title: 'Elijah Adeyeye',
    tag: 'Professional Profile',
    description: 'A premium personal portfolio for a Cybersecurity Researcher, Behavioral Scientist & Founder. Features a dynamic layout highlighting research and technical expertise.',
    image: '/assets/images/portfolio/elijah-adeyeye.png',
    link: 'https://elijahadeyeye.vercel.app/',
    external: true
  },
  {
    id: 8,
    title: 'CyberOutreach Agent v2.0',
    tag: 'Agentic AI',
    description: 'An autonomous AI system for discovering prospects, generating content, and automating complex outreach workflows. Features real-time system health monitoring and action tracking.',
    image: '/assets/images/portfolio/cyberoutreach.png',
    link: '/portfolio/cyberoutreach-agent',
    external: false
  },
  {
    id: 9,
    title: 'Mama DD\'s',
    tag: 'E-Commerce / Restaurant',
    description: 'An authentic, visually rich e-commerce and restaurant website for Mama DD\'s African Cuisine, featuring an integrated menu and food ordering system.',
    image: '/assets/images/portfolio/mamadd.png',
    link: 'https://mamadd.com/',
    external: true
  },
  {
    id: 10,
    title: 'TwineCord',
    tag: 'SaaS / Platform',
    description: 'A premium Christian digital matchmaking platform built with modern web technologies. Focuses on faith-centered connections with a sleek, user-friendly interface.',
    image: '/assets/images/portfolio/twinecord.png',
    link: 'https://twinecor.netlify.app/',
    external: true
  },
  {
    id: 11,
    title: 'Elitech-Hub Admin Bot',
    tag: 'Threat Hunting / Network Scanning',
    description: 'A private, autonomous threat hunting and network scanning bot built for Elitech-Hub\'s internal security operations. Also features a custom engine for tracking writer performance metrics.',
    image: '/assets/images/portfolio/elitech-admin-bot.png',
    link: '/portfolio/elitech-admin-bot',
    external: false
  },
  {
    id: 12,
    title: 'Cee Writing Service Bot',
    tag: 'Telegram AI Assistant',
    description: 'An intelligent Telegram AI assistant serving as the frontline customer success agent. It automates client inquiries, service routing, and engagement for a global writing agency.',
    image: '/assets/images/portfolio/cee-writing-bot.png',
    link: 'https://t.me/ceewritingservice',
    external: true
  },
  {
    id: 13,
    title: 'Rusty Threads Bot',
    tag: 'Agentic AI / Rust',
    description: 'A high-performance autonomous agentic AI built in Rust. It manages complex content generation and publishing workflows across Threads and LinkedIn.',
    image: '/assets/images/portfolio/rusty-threads-bot.png',
    link: '/portfolio/rusty-threads-bot',
    external: false
  }
];



export default function PortfolioPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className={styles.heroSection} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.75) 100%), url('/assets/images/portfolio-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.container}>
          <AnimateOnScroll direction="fade" delay={100}>
            <div className={styles.heroContent}>
              <div className={styles.featuredBadge}>
                <span className={styles.pulseDot}></span>
                Featured Work
              </div>
              <h1 className={styles.heroTitle}>
                Engineering <span className={styles.textGradient}>Excellence.</span>
              </h1>
              <p className={styles.heroDescription}>
                Explore our portfolio of high-performance, secure, and visually stunning digital experiences built for visionaries.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className={styles.portfolioSection}>
        <div className={styles.container}>
          <div className={styles.portfolioGrid}>
            {projects.map((project, index) => (
              <AnimateOnScroll key={project.id} direction="up" delay={(index % 3) * 150}>
                <div className={styles.portfolioCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.portfolioImage}
                      loading="lazy"
                    />
                    <div className={styles.overlay}>
                      <a
                        href={project.link}
                        target={project.external ? '_blank' : '_self'}
                        rel={project.external ? 'noopener noreferrer' : ''}
                        className={styles.visitBtn}
                      >
                        {project.external ? <><ExternalLink size={14} /> Visit Site</> : <><ExternalLink size={14} /> View Case Study</>}
                      </a>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.tag}>{project.tag}</span>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.description}>{project.description}</p>
                    <a
                      href={project.link}
                      target={project.external ? '_blank' : '_self'}
                      rel={project.external ? 'noopener noreferrer' : ''}
                      className={styles.link}
                    >
                      {project.external ? 'View Live Project' : 'View Case Study'}
                      {project.external ? <ExternalLink size={16} /> : <ExternalLink size={16} />}
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <AnimateOnScroll direction="up">
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to build your digital presence?</h2>
              <p className={styles.ctaDescription}>
                Let's collaborate on your next <Link href="/services/web-development" style={{ color: 'inherit', textDecoration: 'underline' }}>custom web development project</Link> to create a secure, high-performing website that perfectly represents your brand.
              </p>
              <Link href="/contact" className={styles.ctaBtn}>
                Start a Project Today
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </PageLayout>
  );
}
