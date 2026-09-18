"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

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
          <AlertCircle size={64} color="#ef4444" />
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 900,
          marginBottom: '1rem',
          color: 'white'
        }}>
          Oops! Something went wrong
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
          We encountered an unexpected error. Our team has been notified.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => reset()}
            style={{
              padding: '1rem 2rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'background 0.2s'
            }}
          >
            Try Again
          </button>
          <Link href="/" style={{
            padding: '1rem 2rem',
            background: 'transparent',
            border: '1px solid #334155',
            color: '#f8fafc',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}>
            Return Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
