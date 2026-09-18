import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, Zap, Globe, Server } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'CyberOutreach Agent | Elitech Hub Portfolio',
  description: 'A case study on how we built the CyberOutreach platform using Next.js and advanced AI integration.',
};

export default function CyberOutreachCaseStudy() {
  return (
    <PageLayout>
      <div style={{ background: '#f8fafc', padding: '4rem 5%', minHeight: '100vh', color: '#0f172a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <AnimateOnScroll>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Globe size={16} /> WEB APPLICATION
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>CyberOutreach Platform</h1>
                <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
                  An AI-driven cybersecurity awareness platform built for scale, speed, and security.
                </p>
              </div>

              <div style={{ padding: '3rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>The Challenge</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      Organizations needed a way to continuously train and test their employees against sophisticated phishing attacks without the overhead of manual campaign management. The system required high availability, strict data privacy controls, and real-time AI generation of tailored phishing scenarios.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Our Solution</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      Through our <Link href="/services/web-development" style={{ color: '#3b82f6', textDecoration: 'underline' }}>custom web development services</Link>, we developed a fully automated SaaS platform leveraging Next.js for a lightning-fast frontend, coupled with a highly secure Supabase backend. The platform integrates LLMs to generate context-aware phishing simulations, deployed within isolated, secure sandboxes to prevent data leakage.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>Key Features</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      'Real-time AI Scenario Generation',
                      'Automated Campaign Scheduling',
                      'Detailed Analytics Dashboard',
                      'Role-based Access Control (RBAC)',
                      'End-to-End Encryption',
                      'Interactive Training Modules'
                    ].map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#334155', fontWeight: 500 }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Tech Stack</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    {[
                      { icon: <Globe size={18} />, name: 'Next.js 14' },
                      { icon: <Zap size={18} />, name: 'React Server Components' },
                      { icon: <Server size={18} />, name: 'Supabase & PostgreSQL' },
                      { icon: <Shield size={18} />, name: 'Tailwind CSS' },
                    ].map((tech, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', color: '#475569', fontWeight: 600 }}>
                        <span style={{ color: '#3b82f6' }}>{tech.icon}</span> {tech.name}
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
