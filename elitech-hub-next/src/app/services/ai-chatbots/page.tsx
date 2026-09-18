import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import layoutStyles from '@/components/PageLayout.module.css';
import styles from './ai-chatbots.module.css';
import { Brain, Bot, Code, Database, Globe, MessageSquare, TrendingUp, Users, ArrowRight, ArrowLeft, Shield, CheckCircle2, ChevronDown, Zap, Network } from 'lucide-react';
import { PricingTiers } from '@/components/PricingTiers';

export const metadata = {
  title: 'AI Chatbot & Agentic AI Development Nigeria | Custom LLM Apps | Elitech Hub',
  description: 'Elitech Hub builds custom AI chatbots and agentic AI applications for Nigerian businesses. Powered by GPT-4, Claude, and Gemini. Customer support bots, sales agents, document analyzers, and more.',
  keywords: [
    'AI chatbot development',
    'agentic AI applications',
    'custom AI solutions',
    'conversational AI',
    'GPT-4 chatbot',
    'LLM application development',
    'AI customer support bot',
    'WhatsApp chatbot',
    'business AI automation',
    'Elitech Hub AI services',
  ],
  alternates: {
    canonical: 'https://elitechub.com/services/ai-chatbots',
  },
  openGraph: {
    url: 'https://elitechub.com/services/ai-chatbots',
    title: 'AI Chatbot & Agentic AI Development Nigeria | Custom LLM Apps | Elitech Hub',
    description: 'Elitech Hub builds custom AI chatbots and agentic AI applications for Nigerian businesses. Powered by GPT-4, Claude, and Gemini.',
  }
};

export default function AIChatbotsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://elitechub.com/" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://elitechub.com/services" },
          { "@type": "ListItem", "position": 3, "name": "AI Chatbots & Agentic AI", "item": "https://elitechub.com/services/ai-chatbots" }
        ]
      },
      {
        "@type": "Service",
        "name": "AI Chatbot & Agentic AI Application Development Nigeria",
        "serviceType": "AI Application Development",
        "provider": {
          "@type": "Organization",
          "name": "Elitech Hub"
        },
        "areaServed": "Nigeria",
        "description": "Custom AI chatbots and agentic AI applications powered by advanced LLMs."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What kinds of AI chatbots do you build?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We build diverse AI solutions including customer support bots, sales & lead generation agents, internal knowledge bots, and document analyzers."
            }
          },
          {
            "@type": "Question",
            "name": "Can you build a WhatsApp chatbot for my business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we integrate intelligent AI agents directly into WhatsApp Business to automate customer interactions where your users already are."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to build an AI chatbot?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A standard AI chatbot can be developed in 2-4 weeks. Complex agentic AI applications with custom knowledge bases may take 4-8 weeks."
            }
          },
          {
            "@type": "Question",
            "name": "What AI models do you use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We leverage state-of-the-art models including GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, and custom Retrieval-Augmented Generation (RAG) models based on your specific needs."
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
              <Brain className={styles.badgeIcon} />
              <span>AGENTIC AI</span>
            </div>
            <h1 className={styles.heroTitle}>Custom AI Chatbots & Intelligent Automation</h1>
            <p className={styles.heroSubtitle}>
              Transform your business operations with context-aware, autonomous AI agents
              that understand your unique Nigerian business landscape.
            </p>
            
            {/* Fake Demo Chat UI */}
            <div className={styles.demoChatContainer}>
              <div className={styles.demoChat}>
                <div className={`${styles.chatMessage} ${styles.userMessage}`}>
                  Hi, I need help scaling our logistics operations in Lagos.
                </div>
                <div className={`${styles.chatMessage} ${styles.botMessage} ${styles.animatedMessage1}`}>
                  <Bot size={16} className={styles.inlineBotIcon} />
                  Hello! I can definitely help with that. Based on Elitech Hub's data, we can deploy an AI agent to optimize your supply chain tracking in real-time. Would you like to see a demo?
                </div>
                <div className={`${styles.chatMessage} ${styles.userMessage} ${styles.animatedMessage2}`}>
                  Yes, that sounds perfect.
                </div>
                <div className={`${styles.chatMessage} ${styles.botMessage} ${styles.animatedMessage3}`}>
                  <Bot size={16} className={styles.inlineBotIcon} />
                  Excellent. Preparing your custom demo dashboard now...
                </div>
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
                <MessageSquare className={styles.cardIcon} />
                <h3>Customer Support Bot</h3>
                <p>24/7 instant support resolving common queries and routing complex issues.</p>
              </div>
              <div className={styles.card}>
                <TrendingUp className={styles.cardIcon} />
                <h3>Sales & Lead Gen Agent</h3>
                <p>Engage visitors, qualify leads, and schedule meetings autonomously.</p>
              </div>
              <div className={styles.card}>
                <Code className={styles.cardIcon} />
                <h3>Document Analyzer</h3>
                <p>Extract data and insights from PDFs, invoices, and legal documents.</p>
              </div>
              <div className={styles.card}>
                <MessageSquare className={styles.cardIcon} />
                <h3>WhatsApp Business Bot</h3>
                <p>Connect with customers directly on their preferred messaging platform.</p>
              </div>
              <div className={styles.card}>
                <Users className={styles.cardIcon} />
                <h3>Internal Knowledge Bot</h3>
                <p>Empower your team with instant answers from company wikis and docs.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Pricing Section */}
        <section className={styles.pricingSection} id="pricing">
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Agentic AI Pricing</h2>
            <p className={styles.sectionSubtitle}>Intelligent automation solutions tailored to your scale.</p>
            <PricingTiers tiers={[
              {
                id: "chatbot-basic",
                title: "Basic Support Bot",
                priceNgn: 300000,
                description: "AI chatbot to handle 24/7 customer support and FAQs.",
                features: [
                  "Trained on your business data",
                  "Website Widget Integration",
                  "Automated FAQ Responses",
                  "Basic Analytics Dashboard"
                ]
              },
              {
                id: "chatbot-standard",
                title: "Agentic CRM Bot",
                priceNgn: 500000,
                description: "Autonomous bot that captures leads and schedules meetings via WhatsApp.",
                features: [
                  "WhatsApp Business Integration",
                  "Lead Qualification & Capture",
                  "Calendar Scheduling Auto-Pilot",
                  "Multi-lingual Support"
                ],
                isPopular: true
              },
              {
                id: "chatbot-premium",
                title: "Custom Autonomous Agent",
                priceNgn: 800000,
                description: "Full RAG pipeline with LangChain and custom API tool integrations.",
                features: [
                  "Custom Vector Database (RAG)",
                  "Backend API Integrations",
                  "Complex Multi-Step Reasoning",
                  "Custom Dashboard & Logs"
                ]
              }
            ]} />
          </AnimateOnScroll>
        </section>

        {/* How It Works */}
        <section className={styles.processSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h4>Discovery & Use Case</h4>
                <p>Identifying the highest-impact processes to automate.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h4>AI Model Selection</h4>
                <p>Choosing the right LLM and architecture for your needs.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h4>Build & Train</h4>
                <p>Developing the agent and training it on your custom data.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <h4>Deploy & Monitor</h4>
                <p>Launching securely and continuously improving performance.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Powered By */}
        <section className={styles.poweredBySection}>
          <AnimateOnScroll direction="fade">
            <h2 className={styles.sectionTitle}>Powered By</h2>
            <div className={styles.modelChips}>
              <span className={styles.modelChip}>GPT-4o</span>
              <span className={styles.modelChip}>Claude 3.5</span>
              <span className={styles.modelChip}>Gemini 1.5</span>
              <span className={styles.modelChip}>Llama 3</span>
              <span className={styles.modelChip}>Custom RAG</span>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Why Elitech Hub for AI */}
        <section className={styles.whyUsSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.sectionTitle}>Why Elitech Hub for AI?</h2>
            <div className={styles.whyUsPoints}>
              <div className={styles.whyUsPoint}>
                <Shield className={styles.whyUsIcon} />
                <h4>Security-Conscious AI</h4>
                <p>Enterprise-grade security preventing data leaks and ensuring prompt injection protection.</p>
              </div>
              <div className={styles.whyUsPoint}>
                <Network className={styles.whyUsIcon} />
                <h4>Local Business Context</h4>
                <p>Models tailored to understand the nuances of the Nigerian market and business landscape.</p>
              </div>
              <div className={styles.whyUsPoint}>
                <Zap className={styles.whyUsIcon} />
                <h4>Ongoing Fine-Tuning</h4>
                <p>We don't just launch; we continuously monitor, refine, and improve the AI's accuracy.</p>
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
                  What kinds of AI chatbots do you build?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  We build diverse AI solutions including customer support bots, sales & lead generation agents, internal knowledge bots, and document analyzers.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Can you build a WhatsApp chatbot for my business?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  Yes, we integrate intelligent AI agents directly into WhatsApp Business to automate customer interactions where your users already are.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  How long does it take to build an AI chatbot?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  A standard AI chatbot can be developed in 2-4 weeks. Complex agentic AI applications with custom knowledge bases may take 4-8 weeks.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  What AI models do you use?
                  <ChevronDown className={styles.faqIcon} />
                </summary>
                <p className={styles.faqContent}>
                  We leverage state-of-the-art models including GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, and custom Retrieval-Augmented Generation (RAG) models based on your specific needs.
                </p>
              </details>
            </div>
          </AnimateOnScroll>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <AnimateOnScroll direction="up">
            <h2 className={styles.ctaTitle}>Let's Build Your AI Agent</h2>
            <div className={styles.ctaButtons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/contact" className="premium-button">
                Schedule a Consultation <ArrowRight size={20} />
              </Link>
              <Link href="/portfolio" className="premium-button-outline">
                View Use Cases
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
