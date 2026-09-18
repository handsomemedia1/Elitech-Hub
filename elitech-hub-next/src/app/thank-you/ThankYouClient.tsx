'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './thank-you.module.css';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  
  const [reference, setReference] = useState('');
  const [itemType, setItemType] = useState('course');
  const [itemName, setItemName] = useState('Cybersecurity Course');
  const [userEmail, setUserEmail] = useState('Check your email');

  useEffect(() => {
    const generateReference = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'EH-';
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      code += '-';
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      return code;
    };

    setReference(searchParams.get('reference') || generateReference());
    setItemType(searchParams.get('type') || 'course');
    setItemName(searchParams.get('name') || 'Cybersecurity Course');

    try {
      const user = JSON.parse(localStorage.getItem('elitech_user') || '{}');
      if (user.email) {
        setUserEmail(user.email);
      }
    } catch (e) {}
  }, [searchParams]);



  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>
        <i className="fas fa-check"></i>
      </div>

      <h1 className={styles.title}>Application Received! 🎉</h1>
      <p className={styles.subtitle}>Thank you for applying. Our admissions team will review your application and get back to you shortly.</p>

      <div className={styles.referenceBox}>
        <h3>Your Reference Code</h3>
        <div className={styles.referenceCode}>{reference}</div>
        <p className={styles.referenceNote}>Save this code! You&apos;ll need it to access the members area.</p>
      </div>

      <div className={styles.purchaseDetails}>
        <h4>APPLICATION DETAILS</h4>
        <div className={styles.detailRow}>
          <span>Item</span>
          <span>{itemName}</span>
        </div>
        <div className={styles.detailRow}>
          <span>Email</span>
          <span>{userEmail}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {itemType === 'course' && (
          <Link href="/dashboard" className={styles.btnPrimary}>
            <i className="fas fa-play"></i> Start Learning
          </Link>
        )}
        {itemType === 'service' && (
          <Link href="/members" className={styles.btnSecondary}>
            <i className="fas fa-key"></i> Enter Members Area
          </Link>
        )}
        {itemType === 'ebook' && (
          <Link href="/ebooks" className={styles.btnSecondary}>
            <i className="fas fa-download"></i> Download E-Book
          </Link>
        )}
      </div>

      <p className={styles.helpText}>
        Need help? <a href="https://wa.me/2347081968062" target="_blank" rel="noopener noreferrer">Contact us on WhatsApp</a>
      </p>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className={styles.pageWrapper}>
      <Suspense fallback={<div className={styles.loadingFallback}>Loading...</div>}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
