"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import styles from '../(dashboard)/admin/login/login.module.css'; // Reuse login styles

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentCode = searchParams.get('code'); // Allow pre-filling a payment token/code

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, paymentCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer} style={{ backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.95) 100%), url('/assets/images/contact-hero.png')" }}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={24} />
          </div>
          <h2>Join Elitech Hub</h2>
          <p>Create your student account</p>
        </div>

        {success ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Registration Successful!</h3>
            <p>You can now log in to the student portal.</p>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className={styles.loginForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="student@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              Already have an account? <Link href="/login" style={{ color: '#ff2a55', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
