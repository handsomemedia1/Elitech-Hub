"use client";

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Upload, Printer, CheckCircle, Search, Save } from 'lucide-react';
import styles from './certificates.module.css';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import Papa from 'papaparse';

export default function AdminCertificates() {
  const currentYear = new Date().getFullYear();
  const [certCount, setCertCount] = useState<number | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'learning',
    name: 'John Doe',
    role: 'Cybersecurity Professional Program',
    duration: 'Jan 2026 - May 2026',
    highlight: 'Mastering Ethical Hacking & Security Operations',
    date: new Date().toISOString().split('T')[0],
    sigName: 'Elijah Adeyeye',
    sigTitle: 'Founder, Elitech Hub'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    async function initCertCount() {
      const { count } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });
        
      // If there are 15 old certs, start at 16
      setCertCount((count || 0) + 1);
    }
    initCertCount();
  }, []);

  const formatCertId = (num: number) => `EH-${currentYear}-${String(num).padStart(4, '0')}`;
  const currentId = certCount ? formatCertId(certCount) : '...';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getCertConfig = (type: string, role: string, duration: string) => {
    if (type === 'appreciation') {
      return {
        title: 'Certificate of Appreciation',
        subtitle: 'In recognition of volunteer content contribution',
        body: `acknowledges volunteering as <strong>${role}</strong> for <strong>${duration}</strong>, contributing to Elitech Hub's mission`
      };
    } else if (type === 'internship') {
      return {
        title: 'Certificate of Internship',
        subtitle: 'In recognition of internship completion',
        body: `confirms internship as <strong>${role}</strong> from <strong>${duration}</strong>`
      };
    } else {
      return {
        title: 'Certificate of Learning',
        subtitle: 'In recognition of successful course completion',
        body: `confirms completion of <strong>${role}</strong> over <strong>${duration}</strong>`
      };
    }
  };

  const config = getCertConfig(formData.type, formData.role, formData.duration);

  // Capture canvas logic
  const captureCertificate = async () => {
    if (!certRef.current) return null;
    const certEl = certRef.current;
    
    // Wait for the main document's fonts
    if (document.fonts) {
      await document.fonts.ready;
    }
    
    // Temporarily remove transform to capture full resolution
    const originalTransform = certEl.style.transform;
    certEl.style.transform = 'scale(1)';
    
    const canvas = await html2canvas(certEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0d0f12',
      onclone: (clonedDoc) => {
        // Wait for fonts inside the cloned iframe to prevent text squishing
        return new Promise((resolve) => {
          if (clonedDoc.fonts) {
            clonedDoc.fonts.ready.then(resolve);
          } else {
            setTimeout(resolve, 500); // Fallback
          }
        });
      }
    });
    
    certEl.style.transform = originalTransform;
    return canvas;
  };

  const saveCertificateToDB = async (data: any, id: string) => {
    try {
      const { error } = await supabase.from('certificates').insert([
        {
          certificate_id: id,
          user_name: data.name,
          course_title: data.role,
          issued_at: new Date(data.date).toISOString()
        }
      ]);
      if (error && error.code !== '23505') { // ignore unique constraint if it already exists
        console.error('Failed to save to verification DB:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPNG = async () => {
    setLoading(true);
    try {
      const canvas = await captureCertificate();
      if (!canvas) return;
      await saveCertificateToDB(formData, currentId);
      const link = document.createElement('a');
      link.download = `${currentId}-${formData.name.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (certCount !== null) setCertCount(certCount + 1);
    } catch (err) {
      console.error(err);
      alert('Error generating PNG');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const canvas = await captureCertificate();
      if (!canvas) return;
      await saveCertificateToDB(formData, currentId);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [11, 8.5]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 11, 8.5);
      pdf.save(`${currentId}-${formData.name.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      if (certCount !== null) setCertCount(certCount + 1);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const zip = new JSZip();
          let count = certCount || 1;
          
          for (const row of results.data as any[]) {
            if (!row.name) continue;
            
            // Force state update and wait for render
            setFormData({
              type: row.type?.toLowerCase() || 'learning',
              name: row.name || '',
              role: row.role || '',
              duration: row.duration || '',
              highlight: row.highlight || '',
              date: row.date || new Date().toISOString().split('T')[0],
              sigName: formData.sigName,
              sigTitle: formData.sigTitle
            });
            
            // A small delay to let React render the DOM changes before capturing
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const currentBulkId = formatCertId(count);
            // Temporarily set the ID for the QR code to use the correct bulk ID
            // In a real app we might just render the certificate off-screen, but this is a simple port
            
            const canvas = await captureCertificate();
            if (canvas) {
              const currentData = {
                type: row.type?.toLowerCase() || 'learning',
                name: row.name || '',
                role: row.role || '',
                duration: row.duration || '',
                highlight: row.highlight || '',
                date: row.date || new Date().toISOString().split('T')[0]
              };
              await saveCertificateToDB(currentData, currentBulkId);
              const imgData = canvas.toDataURL('image/png').split(',')[1];
              zip.file(`${currentBulkId}-${row.name.replace(/[^a-z0-9]/gi, '_')}.png`, imgData, {base64: true});
              count++;
            }
          }
          
          if (count > (certCount || 0)) {
            const content = await zip.generateAsync({type: 'blob'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `ElitechHub_Certificates_${new Date().getTime()}.zip`;
            link.click();
            setCertCount(count);
          } else {
            alert('No valid rows found in CSV');
          }
        } catch (err) {
          console.error(err);
          alert('Error processing bulk upload');
        } finally {
          setBulkLoading(false);
          if (e.target) e.target.value = '';
        }
      }
    });
  };

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.header}>
        <div>
          <h1>Certificate Generator</h1>
          <p>Generate verifiable PNG/PDF certificates</p>
        </div>
      </div>

      <div className={styles.appContainer}>
        {/* Sidebar Controls */}
        <div className={styles.sidebar}>
          <div className={styles.formGroup}>
            <label>Certificate Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="appreciation">Certificate of Appreciation</option>
              <option value="learning">Certificate of Learning</option>
              <option value="internship">Certificate of Internship</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Role or Program Name</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} />
          </div>
          
          <div className={styles.formGroup}>
            <label>Duration or Date Range</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
          </div>
          
          <div className={styles.formGroup}>
            <label>Highlight Line (Optional)</label>
            <input type="text" name="highlight" value={formData.highlight} onChange={handleChange} />
            <small>Appears in green within the body.</small>
          </div>
          
          <div className={styles.formGroup}>
            <label>Issue Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
          
          <div className={styles.buttonGroup}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleDownloadPDF} disabled={loading || bulkLoading}>
              {loading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleDownloadPNG} disabled={loading || bulkLoading}>
              {loading ? 'Generating...' : <><Download size={18} /> Download PNG</>}
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => window.print()}>
              <Printer size={18} /> Print Document
            </button>
          </div>
          
          <div className={styles.buttonGroup}>
            <label className={styles.bulkUpload}>
              {bulkLoading ? (
                <div style={{fontWeight: 600}}>Generating ZIP... Please wait</div>
              ) : (
                <>
                  <Upload size={24} style={{ color: '#ff2a55', marginBottom: '8px' }} />
                  <div style={{fontWeight: 600}}>Bulk Generate Zip (CSV)</div>
                  <small>Cols: name, type, role, duration, highlight, date</small>
                  <input type="file" accept=".csv" style={{display: 'none'}} onChange={handleBulkUpload} disabled={loading || bulkLoading} />
                </>
              )}
            </label>
          </div>
        </div>

        {/* Live Preview */}
        <div className={styles.mainContent}>
          <div className={styles.scalingWrapper}>
            <div className={styles.certWrapper} id="certificate" ref={certRef}>
              <div className={styles.certInnerBorder}></div>
              <div className={styles.certContent}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Elitech Hub Logo" className={styles.certLogo} crossOrigin="anonymous" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Elitech+Hub&background=c3151c&color=fff&size=128'
                }} />
                
                <div className={styles.certHeader}>
                  <h1>{config.title}</h1>
                  <div className={styles.certSubtitle}>{config.subtitle}</div>
                </div>
                
                <div className={styles.certPresented}>This certificate is awarded to</div>
                
                <div className={styles.certNameContainer}>
                  <h2 className={styles.certName}>{formData.name || '...'}</h2>
                </div>
                
                <div className={styles.certBody}>
                  <span dangerouslySetInnerHTML={{ __html: config.body + (formData.highlight ? ',' : '.') }}></span>
                  {formData.highlight && (
                    <span className={styles.certHighlight}>
                      {formData.type === 'learning' ? 'covering ' : formData.type === 'internship' ? 'demonstrating ' : 'Special recognition: '}{formData.highlight}.
                    </span>
                  )}
                </div>
                
                <div className={styles.certFooter}>
                  <div className={styles.footerLeft}>
                    <div className={styles.verificationBlock}>
                      <div>[AUTH] Certificate verified ✓</div>
                      <div>[SIGN] {formData.sigName} ({formData.sigTitle})</div>
                      <div>[ID]&nbsp;&nbsp;&nbsp;{currentId}</div>
                    </div>
                  </div>
                  
                  <div className={styles.footerRight}>
                    <div className={styles.qrCodeContainer}>
                      <QRCodeSVG 
                        value={`https://elitechub.com/verify?id=${currentId}`} 
                        size={64} 
                        bgColor="#ffffff" 
                        fgColor="#000000" 
                        level="L" 
                      />
                    </div>
                    <div>
                      <div className={styles.dateContainer}>
                        <div className={styles.dateLine}>{formatDate(formData.date)}</div>
                      </div>
                      <div className={styles.dateLabel}>Date of Issue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
