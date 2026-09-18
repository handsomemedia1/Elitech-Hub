"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Brand */}
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <Image src="/images/logo.png" alt="Elitech Hub" width={44} height={44} style={{ objectFit: "contain" }} />
            <span>Elitech<span className={styles.accentRed}>Hub</span></span>
          </div>
          <p className={styles.footerDesc}>
            Nigeria&apos;s premier AI‑powered cybersecurity training platform. Internship
            experience · SMEDAN certified · RC: 8693883. Serving students from Ibadan to
            London, New York &amp; beyond.
          </p>
          <div className={styles.footerSocials}>
            <a href="https://www.linkedin.com/company/elitech-hub" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="LinkedIn">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="https://www.youtube.com/@elitechub" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="YouTube">
              <i className="fab fa-youtube" />
            </a>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connect with Founder</h5>
            <div className={styles.footerSocials}>
              <a href="https://www.threads.com/@thehandsomekvng" target="_blank" rel="noopener noreferrer" className={styles.social} aria-label="Threads">
                <i className="fab fa-threads" />
              </a>
              <a href="mailto:elijah@elitechub.com" className={styles.social} aria-label="Email">
                <i className="fas fa-envelope" />
              </a>
            </div>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className={styles.footerColTitle}>Programs</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/programs"><i className="fas fa-graduation-cap" /><span>6‑Week Bootcamp</span></Link></li>
            <li><Link href="/programs"><i className="fas fa-user-shield" /><span>16‑Week Professional</span></Link></li>
            <li><Link href="/programs"><i className="fas fa-building" /><span>Corporate Training</span></Link></li>
            <li><Link href="/apply"><i className="fas fa-rocket" /><span>Apply Now</span></Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className={styles.footerColTitle}>Company</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/about"><i className="fas fa-info-circle" /><span>About Us</span></Link></li>
            <li><Link href="/research"><i className="fas fa-flask" /><span>Research</span></Link></li>
            <li><Link href="/resources"><i className="fas fa-file-alt" /><span>Resources</span></Link></li>
            <li><Link href="/lab"><i className="fas fa-microscope" /><span>Security Lab</span></Link></li>
            <li><Link href="/security-check"><i className="fas fa-shield-alt" /><span>Security Check</span></Link></li>
            <li><Link href="/blog"><i className="fas fa-blog" /><span>Blog</span></Link></li>
            <li><Link href="/faq"><i className="fas fa-question-circle" /><span>FAQ</span></Link></li>
            <li><Link href="/contact"><i className="fas fa-phone" /><span>Contact</span></Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.footerColTitle}>Get In Touch</h4>
          <a href="https://maps.google.com/?q=Ibadan,Nigeria" target="_blank" rel="noopener noreferrer" className={styles.footerContact}><i className="fas fa-map-marker-alt" /> Ibadan, Nigeria</a>
          <a href="https://wa.me/2347081968062" className={styles.footerContact}><i className="fab fa-whatsapp" /> +234 708 196 8062</a>
          <a href="mailto:info@elitechub.com" className={styles.footerContact}><i className="fas fa-envelope" /> info@elitechub.com</a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} <span>Elitech Hub Limited</span>. All rights reserved. RC: 8693883 | SMEDAN Certified</p>
        <div className={styles.footerBottomLinks}>
          <Link href="/policies">Privacy Policy</Link>
          <Link href="/policies#terms">Terms of Service</Link>
          <Link href="/policies#cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
