import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function NotFound() {
  return (
    <PageLayout>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: '#0f172a',
        color: '#f8fafc'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '1.5rem',
          borderRadius: '50%',
          marginBottom: '2rem'
        }}>
          <AlertTriangle size={64} color="#ef4444" />
        </div>
        
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 900,
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #3b82f6, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700 }}>
          Page Not Found
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          The page you are looking for has either been moved, deleted, or never existed in the first place.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" style={{
            padding: '1rem 2rem',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}>
            Return Home
          </Link>
          <Link href="/programs" style={{
            padding: '1rem 2rem',
            background: 'transparent',
            border: '1px solid #334155',
            color: '#f8fafc',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}>
            View Programs
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
