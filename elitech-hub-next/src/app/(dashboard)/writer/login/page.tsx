"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, Mail, Lock } from 'lucide-react';
import styles from '../../admin/login/login.module.css';

export default function WriterLogin() {
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
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoIcon}>
            <PenTool size={24} />
          </div>
          <h2>Writer Portal</h2>
          <p>Sign in to manage your articles</p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
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
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
