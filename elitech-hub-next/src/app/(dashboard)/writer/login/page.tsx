"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, Mail, Lock, User } from 'lucide-react';
import styles from '../../admin/login/login.module.css';

export default function WriterLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isLogin) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        // Store session info for role-based UI and API auth
        localStorage.setItem('elitech_token', data.token);
        localStorage.setItem('elitech_user_role', data.user?.role || 'writer');
        localStorage.setItem('elitech_user_name', data.user?.name || 'Writer');
        localStorage.setItem('elitech_user_email', data.user?.email || email);
        
        router.push('/writer');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch('/api/auth/writer/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        setSuccess(data.message || 'Application submitted successfully! Awaiting admin approval.');
        
        // Reset form but don't force login state instantly so they see the success message
        setName('');
        setEmail('');
        setPassword('');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoIcon}>
            <PenTool size={24} />
          </div>
          <h2>{isLogin ? 'Writer Portal' : 'Apply to Write'}</h2>
          <p>{isLogin ? 'Sign in to manage your articles' : 'Join Elitech-Hub and share your insights'}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && (
            <div style={{ padding: '1rem', background: 'rgba(0, 255, 65, 0.1)', border: '1px solid rgba(0, 255, 65, 0.3)', color: '#00ff41', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
              {success}
            </div>
          )}
          
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="writer@elitechub.com" 
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
                minLength={8}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (isLogin ? 'Authenticating...' : 'Submitting...') : (isLogin ? 'Sign In' : 'Apply Now')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {isLogin ? "Don't have an account? " : "Already applied? "}
            <span style={{ color: '#ff2a55', fontWeight: 600 }}>
              {isLogin ? 'Apply here' : 'Sign in'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
