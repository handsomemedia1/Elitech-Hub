'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, ArrowRight, FlaskConical } from 'lucide-react';
import styles from './ResearchBanner.module.css';

type BannerState = 'hidden' | 'expanded' | 'minimized';

export default function ResearchBanner() {
  const pathname = usePathname();
  const [bannerState, setBannerState] = useState<BannerState>('hidden');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client
    if (!mounted) return;

    // Suppress on private dashboards and application routes
    const isSuppressedRoute = 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/writer') || 
      pathname.startsWith('/researcher') ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname.startsWith('/apply');

    if (isSuppressedRoute) {
      setBannerState('hidden');
      return;
    }

    // Check if user manually dismissed it completely
    const isDismissed = localStorage.getItem('elitech_research_banner_dismissed');
    if (isDismissed === 'true') {
      setBannerState('hidden');
      return;
    }

    // Check if user previously interacted to minimize
    const isMinimized = localStorage.getItem('elitech_research_banner_minimized');
    if (isMinimized === 'true') {
      setBannerState('minimized');
      return;
    }

    // Normal behavior: wait 5s to expand (keeps the page usable), then 25s to minimize
    const expandTimer = setTimeout(() => {
      setBannerState('expanded');
      
      // Auto-minimize after 25 seconds of being expanded
      const minimizeTimer = setTimeout(() => {
        setBannerState(prev => {
          if (prev === 'expanded') {
            return 'minimized';
          }
          return prev;
        });
      }, 25000);
      
      return () => clearTimeout(minimizeTimer);
    }, 5000);

    return () => clearTimeout(expandTimer);
  }, [pathname, mounted]);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBannerState('minimized');
    localStorage.setItem('elitech_research_banner_minimized', 'true');
    trackEvent('banner_manual_close');
  };

  const handleExpand = () => {
    setBannerState('expanded');
    trackEvent('banner_manual_expand');
  };

  const trackEvent = (eventName: string) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        source: 'research_banner'
      });
    }
  };

  const handleCTAClick = () => {
    trackEvent('banner_cta_click');
    setBannerState('minimized'); // Minimize after click
  };

  if (!mounted || bannerState === 'hidden') return null;

  return (
    <>
      {/* Expanded Banner */}
      <div 
        className={`${styles.expandedBanner} ${bannerState === 'expanded' ? styles.visible : styles.invisible}`}
        aria-hidden={bannerState !== 'expanded'}
      >
        <div className={styles.bannerContent}>
          <div className={styles.iconWrapper}>
            <FlaskConical size={24} className={styles.icon} />
          </div>
          
          <div className={styles.textWrapper}>
            <h3 className={styles.title}>Research Membership Coming January 2027</h3>
            <p className={styles.desc}>
              Join the upcoming Elitech Hub Research Membership for researchers building, sharing and collaborating on serious research.{' '}
              <span className={styles.highlight}>Limited to 30 accepted researchers for the founding cohort.</span>
            </p>
          </div>

          <div className={styles.actionWrapper}>
            <Link 
              href="/research/membership" 
              className={styles.cta}
              onClick={handleCTAClick}
              tabIndex={bannerState === 'expanded' ? 0 : -1}
            >
              Apply for the Founding Cohort
            </Link>
            <button 
              className={styles.closeBtn} 
              onClick={handleMinimize} 
              aria-label="Minimize announcement"
              tabIndex={bannerState === 'expanded' ? 0 : -1}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Minimized Indicator */}
      <button 
        className={`${styles.minimizedTab} ${bannerState === 'minimized' ? styles.visible : styles.invisible}`}
        onClick={handleExpand}
        aria-label="Expand Research Membership Announcement"
        aria-hidden={bannerState !== 'minimized'}
        tabIndex={bannerState === 'minimized' ? 0 : -1}
      >
        <FlaskConical size={14} className={styles.tabIcon} />
        <span className={styles.tabText}>Research Membership</span>
        <ArrowRight size={14} />
      </button>
    </>
  );
}
