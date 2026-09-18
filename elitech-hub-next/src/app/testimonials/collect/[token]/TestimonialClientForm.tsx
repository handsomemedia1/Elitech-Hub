'use client';

import React, { useState } from 'react';
import { submitTestimonial } from './actions';
import { Star, CheckCircle, Loader2 } from 'lucide-react';

export default function TestimonialClientForm({
  token,
  defaultName,
  defaultEmail,
  defaultRelationship,
  relationshipTypes
}: {
  token: string;
  defaultName: string;
  defaultEmail: string;
  defaultRelationship: string;
  relationshipTypes: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    formData.append('rating', rating.toString());
    
    const res = await submitTestimonial(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle size={64} style={{ color: '#22c55e' }} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', marginBottom: '1rem', marginTop: 0 }}>Thank you for sharing your experience.</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
          Your testimonial has been submitted for review. If approved, it may be published on this website.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Name *</label>
          <input 
            type="text" 
            name="name" 
            required 
            defaultValue={defaultName}
            style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            name="email" 
            defaultValue={defaultEmail}
            style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Professional Role / Title</label>
          <input 
            type="text" 
            name="role" 
            placeholder="e.g. Software Engineer, Student"
            style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Organization</label>
          <input 
            type="text" 
            name="organization"
            placeholder="e.g. Acme Corp, University of Lagos"
            style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>How do you know Elijah? *</label>
        <select 
          name="relationship_type" 
          defaultValue={defaultRelationship || relationshipTypes[0]}
          style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none' }}
        >
          {relationshipTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Rating</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', outline: 'none' }}
            >
              <Star 
                size={36} 
                style={{ 
                  color: star <= rating ? '#eab308' : '#334155',
                  fill: star <= rating ? '#eab308' : 'transparent',
                  transition: 'all 0.2s'
                }} 
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem' }}>Your Experience *</label>
        <textarea 
          name="quote" 
          required 
          minLength={20}
          maxLength={2000}
          rows={6}
          placeholder="Share your experience working or learning with us..."
          style={{ width: '100%', background: '#0a0c10', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        ></textarea>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>Between 20 and 2000 characters.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b' }}>
        <h4 style={{ color: 'white', fontWeight: 500, marginBottom: '0.5rem', marginTop: 0 }}>Consent</h4>
        
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" name="consent_to_publish" required style={{ marginTop: '0.2rem', width: '1.2rem', height: '1.2rem', accentColor: '#3b82f6' }} />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.4 }}>
            I give permission for this testimonial to be published on Elijah Adeyeye's website. *
          </span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" name="consent_to_use_name" defaultChecked style={{ marginTop: '0.2rem', width: '1.2rem', height: '1.2rem', accentColor: '#3b82f6' }} />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.4 }}>
            I am happy for my name and professional role to be displayed.
          </span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" name="consent_to_use_organization" defaultChecked style={{ marginTop: '0.2rem', width: '1.2rem', height: '1.2rem', accentColor: '#3b82f6' }} />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.4 }}>
            I am happy for my organization to be displayed.
          </span>
        </label>
      </div>

      <div style={{ paddingTop: '1.5rem' }}>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            background: '#3b82f6', 
            color: 'white', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            padding: '1rem', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            transition: 'background 0.2s'
          }}
        >
          {loading && <Loader2 size={20} className="animate-spin" />}
          {loading ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </div>
    </form>
  );
}
