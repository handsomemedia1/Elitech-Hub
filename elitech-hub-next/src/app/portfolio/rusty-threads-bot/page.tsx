import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Bot, Zap, MessageSquare, Terminal } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Rusty Threads Bot | Elitech Hub Portfolio',
  description: 'A case study on Rusty Threads Bot, a high-performance Discord community management bot built in Rust.',
};

export default function RustyThreadsCaseStudy() {
  return (
    <PageLayout>
      <div style={{ background: '#f8fafc', padding: '4rem 5%', minHeight: '100vh', color: '#0f172a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <AnimateOnScroll>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ background: 'linear-gradient(135deg, #78350f, #451a03)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Bot size={16} /> AUTOMATION BOT
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Rusty Threads Bot</h1>
                <p style={{ fontSize: '1.1rem', color: '#fcd34d', maxWidth: '600px', margin: '0 auto' }}>
                  A blazingly fast Discord community management bot built entirely in Rust.
                </p>
              </div>

              <div style={{ padding: '3rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>The Challenge</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      Our cybersecurity community on Discord was growing rapidly. Existing Python and Node.js bots were consuming too much memory and hitting API rate limits during high-traffic events. We needed a highly concurrent, memory-safe, and blazingly fast solution to handle moderation and automation.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Our Solution</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      Using our expertise in <Link href="/services/ai-chatbots" style={{ color: '#f59e0b', textDecoration: 'underline' }}>custom AI chatbot development</Link>, we re-wrote our entire bot infrastructure from scratch using Rust and the Serenity framework. The new bot architecture handles thousands of concurrent events with an incredibly tiny memory footprint, utilizing asynchronous programming to avoid any blocking operations during moderation tasks.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>Key Features</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      'Sub-millisecond Response Times',
                      'Automated Spam Mitigation',
                      'Thread Management & Archiving',
                      'Role-based Auto-assignment',
                      'Custom Moderation Dashboards',
                      'Memory-Safe Concurrency'
                    ].map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <CheckCircle2 size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#334155', fontWeight: 500 }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Tech Stack</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    {[
                      { icon: <Terminal size={18} />, name: 'Rust' },
                      { icon: <MessageSquare size={18} />, name: 'Serenity (Discord API)' },
                      { icon: <Zap size={18} />, name: 'Tokio (Async Runtime)' },
                    ].map((tech, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', color: '#475569', fontWeight: 600 }}>
                        <span style={{ color: '#f59e0b' }}>{tech.icon}</span> {tech.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </PageLayout>
  );
}
