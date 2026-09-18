"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './certificate.module.css';
import Image from 'next/image';

export default function CertificatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCert() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('certificate_id', id as string)
          .single();

        if (error || !data) {
          router.push('/verify'); // Redirect to verify if invalid
        } else {
          setCertData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [id, router]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading Certificate...</p>
      </div>
    );
  }

  if (!certData) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.actions}>
        <button className={styles.printBtn} onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <div className={styles.certificateWrapper}>
        <div className={styles.certificateContainer}>
          <Image 
            src="/assets/images/certificate_template.jpg" 
            alt="Certificate Template" 
            layout="fill" 
            objectFit="contain" 
            priority
            className={styles.certImage}
          />
          <div className={styles.overlayText}>
            {/* The exact positioning depends on the image, we center it generally here */}
            <h1 className={styles.studentName}>{certData.user_name}</h1>
            <p className={styles.courseTitle}>{certData.course_title}</p>
            <div className={styles.footerData}>
              <span className={styles.date}>
                {new Date(certData.issued_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className={styles.certId}>ID: {certData.certificate_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
