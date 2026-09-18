import React from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, Code, Server, Database } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Elitech Admin System | Elitech Hub Portfolio',
  description: 'A case study on how we built the internal Elitech Admin System for streamlined operations and secure management.',
};

export default function AdminBotCaseStudy() {
  return (
    <PageLayout>
      <div style={{ background: '#f8fafc', padding: '4rem 5%', minHeight: '100vh', color: '#0f172a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <AnimateOnScroll>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ background: 'linear-gradient(135deg, #064e3b, #022c22)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Code size={16} /> INTERNAL TOOL
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Elitech Admin System</h1>
                <p style={{ fontSize: '1.1rem', color: '#a7f3d0', maxWidth: '600px', margin: '0 auto' }}>
                  A unified internal dashboard for managing courses, users, applications, and operations.
                </p>
              </div>

              <div style={{ padding: '3rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>The Challenge</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      As Elitech Hub grew, managing student applications, course content, writers, and payments across multiple fragmented tools became a bottleneck. The administrative team needed a single, secure source of truth to oversee all operations without compromising on data privacy.
                    </p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Our Solution</h3>
                    <p style={{ color: '#475569', lineHeight: 1.7 }}>
                      Through our <Link href="/services/web-development" style={{ color: '#10b981', textDecoration: 'underline' }}>custom web development services</Link>, we built a bespoke Next.js admin dashboard connected to our Supabase backend. The system features strict Role-Based Access Control (RBAC), allowing fine-grained permissions for writers, researchers, and super-admins, ensuring each role only sees the data they are authorized to interact with.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>Key Features</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      'Unified User Management',
                      'Course & Content Management',
                      'Strict RBAC via Supabase RLS',
                      'Payment & Invoice Tracking',
                      'Researcher Lab Review Workflow',
                      'Real-time Audit Logs'
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
                      { icon: <Code size={18} />, name: 'Next.js App Router' },
                      { icon: <Shield size={18} />, name: 'Custom JWT Auth' },
                      { icon: <Database size={18} />, name: 'Supabase' },
                      { icon: <Server size={18} />, name: 'Node.js' },
                    ].map((tech, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '2rem', color: '#475569', fontWeight: 600 }}>
                        <span style={{ color: '#10b981' }}>{tech.icon}</span> {tech.name}
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
