"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScrollNavbar.module.css";

export default function ScrollNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide the public navbar on all dashboard/admin/writer/researcher routes
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/writer') || pathname.startsWith('/researcher');
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Don't render the public navbar on dashboard routes
  if (isDashboard) return null;

  const navLinks = [
    { href: "/", label: "Home" },
    {
      label: "Programs",
      dropdown: [
        { href: "/programs", label: "View All Programs" },
        { href: "/programs/cybersecurity-bootcamp", label: "6-Week Bootcamp" },
        { href: "/programs/professional", label: "16-Week Professional" },
        { href: "/programs/corporate-training", label: "Corporate Training" },
        { href: "/ai-training", label: "AI Cybersecurity" },
      ]
    },
    {
      label: "Services",
      dropdown: [
        { href: "/services", label: "View All Services" },
        { href: "/services/web-development", label: "Web Development" },
        { href: "/services/ai-chatbots", label: "AI Chatbots" },
        { href: "/services/penetration-testing", label: "Penetration Testing" },
        { href: "/services/custom-scripts", label: "Custom Scripts" },
      ]
    },
    {
      label: "Resources",
      dropdown: [
        { href: "/resources", label: "Resources Library" },
        { href: "/laptops", label: "Laptops Catalog" },
        { href: "/about", label: "About Us" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/blog", label: "Blog" },
        { href: "/testimonials", label: "Testimonials" },
        { href: "/research", label: "Research" },
        { href: "/research/behavioral-cybersecurity", label: "Behavioral Research" },
        { href: "/lab", label: "Security Lab" },
        { href: "/security-check", label: "Security Check" },
        { href: "/faq", label: "FAQ" },
      ]
    },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.brand}>
            <Image 
              src="/images/logo.png" 
              alt="Elitech Hub Logo" 
              width={40} 
              height={40} 
              style={{ objectFit: 'contain' }}
              priority
            />
            Elitech<span>Hub</span>
          </Link>

          {/* Desktop links */}
          <div className={styles.desktopLinks}>
            {navLinks.map((item) => {
              if (item.dropdown) {
                return (
                  <div 
                    key={item.label}
                    className={styles.navDropdown}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span className={styles.navLink}>
                      {item.label} <span className={styles.chevron}>▾</span>
                    </span>
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div 
                          className={styles.dropdownMenu}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.dropdown.map(dropItem => (
                            <Link 
                              key={dropItem.href}
                              href={dropItem.href}
                              className={`${styles.dropdownItem} ${pathname === dropItem.href ? styles.activeDropdownItem : ""}`}
                            >
                              {dropItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
                >
                  {item.label}
                  {pathname === item.href && <span className={styles.activeDot} />}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className={styles.navActions}>
            <Link href="/apply" className={styles.applyBtn}>
              Apply Now
            </Link>
            <button
              className={styles.menuToggle}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
          <div className={styles.mobileMenuInner}>
            {navLinks.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className={styles.mobileDropdownGroup}>
                    <div className={styles.mobileDropdownLabel}>{item.label}</div>
                    <div className={styles.mobileDropdownItems}>
                      {item.dropdown.map(dropItem => (
                        <Link
                          key={dropItem.href}
                          href={dropItem.href}
                          className={`${styles.mobileLink} ${pathname === dropItem.href ? styles.mobileLinkActive : ""}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {dropItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`${styles.mobileLink} ${pathname === item.href ? styles.mobileLinkActive : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/apply" className={styles.mobileApplyBtn} onClick={() => setMobileOpen(false)}>
              Apply Now →
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
