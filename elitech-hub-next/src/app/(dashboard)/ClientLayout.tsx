"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Users, PenTool, MessageSquare, 
  Settings, LogOut, Menu, X, FileText, FlaskConical, Award, DollarSign, Mail, Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './dashboard.module.css';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'LMS Manager', icon: BookOpen },
  { href: '/admin/users', label: 'Students', icon: Users },
  { href: '/admin/applications', label: 'CRM & Leads', icon: MessageSquare },
  { href: '/admin/laptops', label: 'Laptops Inventory', icon: Laptop },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/membership', label: 'Memberships', icon: FlaskConical },
  { href: '/admin/writers', label: 'Writers Panel', icon: PenTool },
  { href: '/admin/posts', label: 'Blog Posts', icon: FileText },
  { href: '/writer', label: 'Writer Portal', icon: LayoutDashboard },
  { href: '/writer/editor', label: 'Write Blog', icon: FileText },
  { href: '/admin/lab', label: 'Research Lab', icon: FlaskConical },
  { href: '/admin/resources', label: 'Resources Library', icon: BookOpen },
  { href: '/admin/letterhead', label: 'Letterhead Gen', icon: Mail },
  { href: '/admin/pricing', label: 'Pricing Engine', icon: DollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const WRITER_LINKS = [
  { href: '/writer', label: 'Overview', icon: LayoutDashboard },
  { href: '/writer/posts', label: 'My Articles', icon: FileText },
  { href: '/writer/editor', label: 'Write New', icon: PenTool },
];

const RESEARCHER_LINKS = [
  { href: '/researcher', label: 'Overview', icon: LayoutDashboard },
  { href: '/researcher/profile', label: 'My Profile', icon: Users },
  { href: '/researcher/submissions', label: 'My Research', icon: BookOpen },
  { href: '/researcher/submit', label: 'Submit Paper', icon: FileText },
];

export default function DashboardLayout({ children, initialUserName = '' }: { children: React.ReactNode, initialUserName?: string }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedInName, setLoggedInName] = useState(initialUserName);

  const router = useRouter();

  const isAdmin = pathname.startsWith('/admin');
  const isResearcher = pathname.startsWith('/researcher');
  
  const links = isAdmin ? ADMIN_LINKS : isResearcher ? RESEARCHER_LINKS : WRITER_LINKS;
  const roleName = isAdmin ? 'Admin' : isResearcher ? 'Researcher' : 'Writer';
  const displayName = loggedInName || roleName;

  // For /admin/login, /writer/login, or /researcher/login don't show the dashboard shell
  if (pathname === '/admin/login' || pathname === '/writer/login' || pathname === '/researcher/login') {
    return <div className={styles.authWrapper}>{children}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className={styles.sidebarOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Elitech <span>{roleName}</span></h2>
          <button className={styles.closeSidebarBtn} onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className={styles.topbarRight}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {displayName[0]?.toUpperCase() || roleName[0]}
              </div>
              <span className={styles.userName}>{displayName} Portal</span>
            </div>
          </div>
        </header>

        <div className={styles.contentInner}>
          {children}
        </div>
      </main>
    </div>
  );
}
