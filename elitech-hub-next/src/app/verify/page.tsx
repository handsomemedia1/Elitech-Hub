'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './verify.module.css';
import Image from 'next/image';

function VerifyContent() {
  const searchParams = useSearchParams();
  const certId = searchParams.get('id');
  
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'missing_id'>('loading');
  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    async function checkCertificate() {
      if (!certId) {
        setStatus('missing_id');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('certificate_id', certId)
          .single();

        if (error || !data) {
          setStatus('invalid');
        } else {
          setCertData(data);
          setStatus('valid');
        }
      } catch (err) {
        setStatus('invalid');
      }
    }

    checkCertificate();
  }, [certId]);

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.logoContainer}>
        <img src="/images/logo.png" alt="Elitech Hub" className={styles.logo} />
      </div>

      {status === 'loading' && (
        <div className={styles.stateBlock}>
          <i className="fas fa-circle-notch fa-spin status-icon" style={{ fontSize: '4rem', color: '#64748b', marginBottom: '20px' }}></i>
          <h1 className={styles.stateTitle}>VERIFYING<span className={styles.cursor}></span></h1>
          <p style={{ color: '#64748b', marginTop: '10px' }}>Querying certificate database...</p>
        </div>
      )}

      {status === 'valid' && certData && (
        <div className={styles.stateBlock}>
          <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#00ff41', marginBottom: '20px' }}></i>
          <h1 className={styles.stateTitle} style={{ color: '#00ff41' }}>CERTIFICATE VALID</h1>
          
          <div className={styles.certDetails}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Certificate ID</div>
              <div className={styles.detailValue} style={{ color: '#00ff41' }}>{certData.certificate_id}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Recipient</div>
              <div className={styles.detailValue}>{certData.user_name}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Program</div>
              <div className={styles.detailValue}>{certData.course_title}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Issue Date</div>
              <div className={styles.detailValue}>
                {new Date(certData.issued_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Issuer</div>
              <div className={styles.detailValue}>Elitech Hub</div>
            </div>
          </div>
        </div>
      )}

      {status === 'invalid' && (
        <div className={styles.stateBlock}>
          <i className="fas fa-times-circle" style={{ fontSize: '4rem', color: '#c3151c', marginBottom: '20px' }}></i>
          <h1 className={styles.stateTitle} style={{ color: '#c3151c' }}>INVALID RECORD</h1>
          <p className={styles.errorMessage}>
            We could not find a matching certificate in our secure database. 
            This certificate may be forged or the ID is incorrect.
          </p>
        </div>
      )}

      {status === 'missing_id' && (
        <div className={styles.stateBlock}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '20px' }}></i>
          <h1 className={styles.stateTitle} style={{ color: '#f59e0b' }}>NO ID PROVIDED</h1>
          <p className={styles.errorMessage}>
            No Certificate ID provided in the URL.<br/>Please scan the QR code directly.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loadingFallback}>Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
