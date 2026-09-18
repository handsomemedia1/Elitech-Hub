"use client";
import React from 'react';
import { Printer, MapPin, Phone, Mail, Globe } from 'lucide-react';
import styles from './letterhead.module.css';

export default function LetterheadGenerator() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.headerRow} ${styles.noPrint}`}>
        <h1 className={styles.title}>Letterhead Generator</h1>
        <button onClick={handlePrint} className={styles.printBtn}>
          <Printer size={18} /> Print to PDF
        </button>
      </div>

      <div className={`${styles.a4Page} ${styles.printContainer}`}>
        {/* Beautiful Top Edge Border */}
        <div className={styles.topAccentBar} />

        <img src="/assets/images/logo.png" className={styles.watermark} alt="" />

        <div className={styles.docHeader}>
          <div className={styles.logoWrapper}>
            <img src="/assets/images/logo.png" className={styles.logo} alt="Elitech Hub Logo" />
          </div>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <MapPin size={13} className={styles.contactIcon} />
              Ibadan, Nigeria
            </div>
            <div className={styles.contactItem}>
              <Phone size={13} className={styles.contactIcon} />
              +234 708 196 8062
            </div>
            <div className={styles.contactItem}>
              <Mail size={13} className={styles.contactIcon} />
              info@elitechub.com
            </div>
            <div className={styles.contactItem}>
              <Globe size={13} className={styles.contactIcon} />
              elitechub.com
            </div>
          </div>
        </div>

        <div 
          className={styles.content} 
          contentEditable 
          suppressContentEditableWarning
        >
          <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
            [Date]
          </div>
          
          <p><strong>[Recipient Name]</strong><br />
          [Recipient Title]<br />
          [Company Name]<br />
          [Address]</p>
          <br />
          
          <p><strong>Subject: [Type the official subject of your letter here]</strong></p>
          <br />
          
          <p>Dear [Name],</p>
          <br />
          <p>Begin typing your official letter here. The typography has been deeply refined to look incredibly sharp, modern, and worthy of a leading tech company.</p>
          <p>We've added beautiful micro-details, such as the dual-tone (Dark Blue and Red) corporate bar at the very top edge of the page, sleek contact icons, and a beautifully balanced footer.</p>
          <p>When you are finished formatting this exactly as you like it, simply click the "Print to PDF" button to export a flawless, borderless digital document.</p>
          <br /><br />
          <p>Sincerely,</p>
          <br /><br /><br />
          <p><strong>[Your Name]</strong><br />
          [Your Title]<br />
          Elitech Hub</p>
        </div>

        <div className={styles.docFooter}>
          <div className={styles.footerPrimary}>
            NIGERIA'S LEADING AI, CYBERSECURITY & DIGITAL INNOVATION HUB
          </div>
          <div className={styles.footerSecondary}>
            <div><span>RC:</span> 8693883</div>
            <div>•</div>
            <div>SMEDAN Certified</div>
            <div>•</div>
            <div>www.elitechub.com</div>
          </div>
        </div>
      </div>
      
      {/* Print CSS Injection to hide dashboard elements */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide dashboard shell */
          [class*="sidebar"], [class*="header"], [class*="nav"], .${styles.noPrint} {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .${styles.printContainer}, .${styles.printContainer} * {
            visibility: visible;
          }
          .${styles.printContainer} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 20mm !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            background: white !important;
            /* This ensures browsers print background colors/gradients */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
    </div>
  );
}
