"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import styles from '../(dashboard)/admin/login/login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'writer') {
        router.push('/writer');
      } else {
        router.push('/dashboard');
      }
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
          <h2>Welcome Back</h2>
          <p>Sign in to Elitech Hub</p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account? <Link href="/register" style={{ color: '#ff2a55', textDecoration: 'none', fontWeight: 500 }}>Apply Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
