"use client";

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';

export function ArticleFeedback({ slug }: { slug: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleVote = async (isHelpful: boolean) => {
    if (status !== 'idle') return;
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/articles/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, is_helpful: isHelpful }),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', margin: '2rem 0' }}>
        <CheckCircle size={20} />
        <span>Thank you for your feedback! This helps us improve our cybersecurity resources.</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderRadius: '1rem', margin: '3rem 0', textAlign: 'center' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: 'white', fontSize: '1.2rem' }}>Was this article helpful?</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button 
          onClick={() => handleVote(true)}
          disabled={status === 'submitting'}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--color-border)',
            cursor: 'pointer', transition: 'all 0.2s',
            opacity: status === 'submitting' ? 0.5 : 1
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <ThumbsUp size={18} /> Yes
        </button>
        <button 
          onClick={() => handleVote(false)}
          disabled={status === 'submitting'}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--color-border)',
            cursor: 'pointer', transition: 'all 0.2s',
            opacity: status === 'submitting' ? 0.5 : 1
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <ThumbsDown size={18} /> No
        </button>
      </div>
      {status === 'error' && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>Something went wrong. Please try again later.</p>}
    </div>
  );
}
