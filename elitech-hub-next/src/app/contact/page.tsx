import PageLayout from '@/components/PageLayout';
import ContactForm from './ContactForm';
import styles from './contact.module.css';
import layoutStyles from '@/components/PageLayout.module.css';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { MapPin, MessageCircle, Mail, Send, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Elitech Hub | Cybersecurity Training Enquiries | Lagos & Ibadan Nigeria',
  description: 'Let\'s Build Secure, Intelligent and Scalable Digital Solutions Together.',
  keywords: ['contact Elitech Hub', 'cybersecurity training enquiry Nigeria', 'enroll cybersecurity Nigeria', 'Elitech Hub WhatsApp', 'cybersecurity school contact Lagos', 'cybersecurity Ibadan contact', 'pentesting Nigeria contact'],
  openGraph: {
    title: 'Contact Elitech Hub | Get in Touch',
    description: 'Let\'s Build Secure, Intelligent and Scalable Digital Solutions Together.',
    url: 'https://elitechub.com/contact',
    siteName: 'Elitech Hub',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: { canonical: 'https://elitechub.com/contact' },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Elitech Hub",
    "description": "Contact information and inquiry form for Elitech Hub tech programs.",
    "publisher": {
      "@type": "Organization",
      "name": "Elitech Hub"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Elitech Hub",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ibadan",
        "addressCountry": "NG"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+234-708-196-8062",
          "contactType": "customer service",
          "email": "info@elitechub.com",
          "hoursAvailable": "Mo-Sa 09:00-18:00"
        }
      ]
    }
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Page Hero Section */}
      <section className={layoutStyles.pageHero} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.4) 0%, rgba(26, 26, 26, 0.75) 100%), url('/assets/images/contact-hero.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="glow-bg" />
        <AnimateOnScroll direction="fade">
          <span className={layoutStyles.pageHeroLabel}>Get In Touch</span>
          <h1 className={layoutStyles.pageHeroTitle}>Let&apos;s Start a <span className="text-gradient-primary">Conversation</span></h1>
          <p className={layoutStyles.pageHeroSub}>
            Have questions about our programs? Ready to enroll? We&apos;d love to hear from you. Our team is always ready to assist.
          </p>
        </AnimateOnScroll>
      </section>

      <div className={styles.contactContainer}>
        {/* Contact Grid */}
        <div className={styles.grid}>
          {/* Left: Info Cards */}
          <div className={styles.infoCards}>
            <AnimateOnScroll direction="left" delay={100}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}><MapPin size={24} /></div>
                <div className={styles.cardContent}>
                  <h3>Location</h3>
                  <p>Ibadan, Nigeria</p>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>100% virtual classes available globally</p>
                </div>
              </div>
            </AnimateOnScroll>
            
            <AnimateOnScroll direction="left" delay={200}>
              <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                  <MessageCircle size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h3>WhatsApp</h3>
                  <a href="https://wa.me/2347081968062" target="_blank" rel="noopener noreferrer">
                    +234 708 196 8062
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={300}>
              <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Mail size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Email</h3>
                  <a href="mailto:info@elitechub.com">info@elitechub.com</a>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={400}>
              <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>
                  <Send size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Telegram</h3>
                  <a href="https://t.me/Elitechub" target="_blank" rel="noopener noreferrer">
                    @Elitechub
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={500}>
              <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                  <Clock size={24} />
                </div>
                <div className={styles.cardContent}>
                  <h3>Working Hours</h3>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM (WAT)</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Contact Form */}
          <AnimateOnScroll direction="up" delay={200}>
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', height: '100%' }}>
              <ContactForm />
            </div>
          </AnimateOnScroll>
        </div>

        {/* Map / Find Us Section */}
        <AnimateOnScroll direction="fade">
          <section className={styles.mapSection}>
            <h2>Find Us</h2>
            <p>We operate from Ibadan, Nigeria, serving students globally through our robust virtual learning platform.</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310243552!2d3.7350720448107954!3d7.377524956895315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398d0e9c6b3f3d%3A0x4c7c35a0b5a5e7a0!2sIbadan%2C%20Oyo!5e0!3m2!1sen!2sng!4v1721865600000!5m2!1sen!2sng"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: '12px', marginTop: '1rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Elitech Hub Location - Ibadan, Nigeria"
            />
          </section>
        </AnimateOnScroll>

        {/* FAQ Quick Links */}
        <section className={styles.faqSection}>
          <AnimateOnScroll direction="up">
            <h2>Common Questions</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <h4>Do you offer physical classes?</h4>
                <p>Currently, all our programs are 100% virtual, allowing you to learn from anywhere in the world at your own pace with live instructor-led sessions.</p>
              </div>
              <div className={styles.faqCard}>
                <h4>What are the payment options?</h4>
                <p>We accept bank transfers, mobile money, and major credit cards. Installment plans are available for our comprehensive 16-Week Professional programs.</p>
              </div>
              <div className={styles.faqCard}>
                <h4>Do I need prior experience?</h4>
                <p>Not at all! Our programs are expertly designed to take you from absolute beginner to competent professional, with thorough foundational modules.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      </div>
    </PageLayout>
  );
}
