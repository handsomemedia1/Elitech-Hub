'use client';

import React, { useState } from 'react';
import styles from './security-check.module.css';
import { Shield, Mail, Globe, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function SecurityCheckPage() {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);

    try {
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'health_check_start',
          domain: domain
        });
      }

      const res = await fetch('/api/security-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to perform security check.');
      }

      setReport(data.report);
      
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'health_check_complete',
          domain: data.report.domain
        });
        (window as any).dataLayer.push({
          event: 'generate_lead',
          source: 'security-check'
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Shield className={styles.heroIcon} size={64} />
          <h1 className={styles.title}>Free Passive Security Posture Check</h1>
          <p className={styles.subtitle}>
            Analyze your domain's basic security posture, including transport security, web security headers, and email authentication (SPF/DMARC) without any active exploitation.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          {!report ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="domain">Domain Name</label>
                <div className={styles.inputWrapper}>
                  <Globe className={styles.inputIcon} size={20} />
                  <input
                    id="domain"
                    type="text"
                    className={styles.input}
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Work Email</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className={styles.spinner} size={20} />
                    Analyzing...
                  </>
                ) : (
                  'Run Security Check'
                )}
              </button>
            </form>
          ) : (
            <div className={styles.report}>
              <h2 className={styles.reportTitle}>Security Posture Report for {report.domain}</h2>
              
              <div className={styles.reportGrid}>
                <div className={styles.reportCard}>
                  <h3 className={styles.reportCardTitle}>Transport Security</h3>
                  <div className={`${styles.statusBadge} ${report.overallTransport === 'Good' ? styles.statusGood : styles.statusWarning}`}>
                    {report.overallTransport === 'Good' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {report.overallTransport}
                  </div>
                  <p className={styles.detailText}>HSTS: {report.hsts ? 'Enabled' : 'Missing'}</p>
                </div>

                <div className={styles.reportCard}>
                  <h3 className={styles.reportCardTitle}>Web Security</h3>
                  <div className={`${styles.statusBadge} ${report.overallWeb === 'Good' ? styles.statusGood : styles.statusWarning}`}>
                    {report.overallWeb === 'Good' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {report.overallWeb}
                  </div>
                  <p className={styles.detailText}>CSP: {report.csp ? 'Present' : 'Missing'}</p>
                  <p className={styles.detailText}>X-Content-Type-Options: {report.xContentTypeOptions ? 'Present' : 'Missing'}</p>
                </div>

                <div className={styles.reportCard}>
                  <h3 className={styles.reportCardTitle}>Email Security</h3>
                  <div className={`${styles.statusBadge} ${report.overallEmail === 'Good' ? styles.statusGood : styles.statusWarning}`}>
                    {report.overallEmail === 'Good' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {report.overallEmail}
                  </div>
                  <p className={styles.detailText}>SPF: {report.spf ? 'Configured' : 'Missing'}</p>
                  <p className={styles.detailText}>DMARC: {report.dmarc ? 'Configured' : 'Missing'}</p>
                </div>
              </div>

              <button onClick={() => setReport(null)} className={styles.resetBtn}>
                Check Another Domain
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
