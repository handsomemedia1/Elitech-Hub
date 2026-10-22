'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MilestoneItem {
  id: string;
  stage: '30' | '60' | '90';
  title: string;
  description: string;
  deliverable: string;
  chapterLink?: string;
}

const ROADMAP_ITEMS: MilestoneItem[] = [
  // Days 1–30: Understand
  {
    id: 'm_30_1',
    stage: '30',
    title: 'Audit Transferable Skills & Starting Resources',
    description: 'Complete the 7-question self-inquiry audit to understand your natural problem preferences and cognitive energy.',
    deliverable: 'Completed Exercise 01 Starting-Skills Inventory in your dedicated notebook.',
    chapterLink: '/before-cybersecurity/guide/what-are-you-bringing-with-you',
  },
  {
    id: 'm_30_2',
    stage: '30',
    title: 'Audit Host Computer Specs & RAM Virtualization Budget',
    description: 'Inspect physical RAM, soldered vs. SODIMM slots, and host idle memory to determine your virtual machine headroom.',
    deliverable: 'Completed Exercise 02 Hardware & Virtualization Lab Worksheet.',
    chapterLink: '/before-cybersecurity/guide/the-computer-you-dont-see',
  },
  {
    id: 'm_30_3',
    stage: '30',
    title: 'Map and Diagram Your Local Home Network',
    description: 'Run native terminal commands (ipconfig / ip a, netstat) to map your machine IP, default gateway, subnet mask, and local router.',
    deliverable: '1-page verified network diagram of your home environment.',
    chapterLink: '/before-cybersecurity/guide/learn-the-language-of-computers',
  },
  {
    id: 'm_30_4',
    stage: '30',
    title: 'Establish Personal Operational Security Baseline',
    description: 'Harden your personal attack surface before attempting to advise organizations or configure firewalls.',
    deliverable: 'Completed Exercise 06 5-Point Personal Security Baseline (Password Manager, App MFA, Disk Encryption).',
    chapterLink: '/before-cybersecurity/guide/protect-yourself-before-you-protect-others',
  },

  // Days 31–60: Explore
  {
    id: 'm_60_1',
    stage: '60',
    title: 'Inspect Network Telemetry & Active Sockets',
    description: 'Capture local packets with Wireshark or inspect active listening sockets mapped to their Process IDs (PID).',
    deliverable: 'Completed Exercise 03 Local Network Observation write-up.',
    chapterLink: '/before-cybersecurity/guide/to-defend-understand',
  },
  {
    id: 'm_60_2',
    stage: '60',
    title: 'Guided Server Log & Telemetry Interpretation',
    description: 'Inspect synthetic authentication logs (SSH/Web) to identify timestamps, failed usernames, source IPs, and attack stages.',
    deliverable: 'Completed Exercise 04 Synthetic SSH Log Analysis worksheet.',
    chapterLink: '/before-cybersecurity/guide/to-defend-understand',
  },
  {
    id: 'm_60_3',
    stage: '60',
    title: 'Lab Troubleshooting & Failure Protocol',
    description: 'Diagnose why two virtual machines cannot communicate using the disciplined 4-step diagnostic protocol.',
    deliverable: 'Documented resolution in your lab journal following Exercise 05.',
    chapterLink: '/before-cybersecurity/guide/learn-beyond-cybersecurity',
  },
  {
    id: 'm_60_4',
    stage: '60',
    title: 'Career Direction Comparative Audit',
    description: 'Research 3 real job postings for two candidate security roles and compare their daily realities against your skills inventory.',
    deliverable: 'Written comparison of two candidate career paths (Exercise 08).',
    chapterLink: '/before-cybersecurity/guide/find-your-starting-point',
  },

  // Days 61–90: Choose & Build
  {
    id: 'm_90_1',
    stage: '90',
    title: 'Commit to One Starting Direction for 90 Days',
    description: 'Choose your primary specialization runway (e.g., SOC Analysis, Cloud Defense, or Application Security) and avoid scattered dabbling.',
    deliverable: 'Signed 90-day learning contract outlining weekly study hours and targeted concepts.',
    chapterLink: '/before-cybersecurity/guide/find-your-starting-point',
  },
  {
    id: 'm_90_2',
    stage: '90',
    title: 'Build & Document an Evidence-Based Portfolio Project',
    description: 'Execute a small home lab project and write a public technical report following the 8-stage documentation standard.',
    deliverable: '1 published GitHub/blog portfolio report (Exercise 07) documenting initial failure, diagnosis, and verified fix.',
    chapterLink: '/before-cybersecurity/guide/build-evidence-not-just-a-portfolio',
  },
  {
    id: 'm_90_3',
    stage: '90',
    title: 'Peer Verification & Community Review',
    description: 'Share your completed lab report with a mentor or study group, and apply the verification cycle to reproduce another peer\'s lab.',
    deliverable: 'Constructive feedback received and incorporated into your lab documentation.',
    chapterLink: '/before-cybersecurity/guide/dont-travel-alone',
  },
];

export default function RoadmapPage() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | '30' | '60' | '90'>('all');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bc_roadmap_checked');
      if (stored) {
        setCheckedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleCheck = (id: string) => {
    let updated: string[];
    if (checkedIds.includes(id)) {
      updated = checkedIds.filter((item) => item !== id);
    } else {
      updated = [...checkedIds, id];
    }
    setCheckedIds(updated);
    try {
      localStorage.setItem('bc_roadmap_checked', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const filteredItems = activeTab === 'all' ? ROADMAP_ITEMS : ROADMAP_ITEMS.filter((i) => i.stage === activeTab);
  const totalItems = ROADMAP_ITEMS.length;
  const completedCount = checkedIds.length;
  const progressPct = Math.round((completedCount / totalItems) * 100);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(195, 21, 28, 0.1)',
          border: '1px solid rgba(195, 21, 28, 0.25)',
          color: '#FF5A60',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.75rem',
        }}>
          Deliverable Blueprint
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Your 30, 60 and 90-Day Roadmap
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem', maxWidth: '780px', lineHeight: '1.6' }}>
          From Chapter 28: A structured milestone framework grounded on tangible lab deliverables. We do not promise 90-day mastery—we give you a realistic, verifiable starting momentum.
        </p>
      </div>

      {/* Progress & Milestone Overview Card */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #202026',
        borderRadius: '12px',
        padding: '1.75rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            ROADMAP DELIVERABLES COMPLETED
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
            {completedCount} of {totalItems} Milestones ({progressPct}%)
          </div>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Stages' },
            { id: '30', label: 'Days 1–30' },
            { id: '60', label: 'Days 31–60' },
            { id: '90', label: 'Days 61–90' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                backgroundColor: activeTab === tab.id ? '#C3151C' : '#16161B',
                border: `1px solid ${activeTab === tab.id ? '#C3151C' : '#272730'}`,
                color: activeTab === tab.id ? '#fff' : '#A1A1AA',
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredItems.map((item) => {
          const isDone = checkedIds.includes(item.id);
          const stageBadge =
            item.stage === '30'
              ? { label: 'DAYS 1–30: UNDERSTAND', color: '#3B82F6' }
              : item.stage === '60'
              ? { label: 'DAYS 31–60: EXPLORE', color: '#EAB308' }
              : { label: 'DAYS 61–90: BUILD', color: '#10B981' };

          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                backgroundColor: isDone ? 'rgba(16, 185, 129, 0.05)' : '#0E0E12',
                border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : '#1F1F24'}`,
                borderRadius: '10px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
              }}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => {}} // Controlled via card click
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#10B981',
                  marginTop: '4px',
                  cursor: 'pointer',
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: stageBadge.color,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}>
                    {stageBadge.label}
                  </span>
                  {item.chapterLink && (
                    <Link
                      href={item.chapterLink}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.75rem', color: '#C3151C', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Read Chapter →
                    </Link>
                  )}
                </div>

                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: isDone ? '#9CA3AF' : '#FFFFFF',
                  textDecoration: isDone ? 'line-through' : 'none',
                  marginBottom: '0.35rem',
                }}>
                  {item.title}
                </div>

                <div style={{ fontSize: '0.9rem', color: '#8E8E93', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                  {item.description}
                </div>

                <div style={{
                  backgroundColor: '#121217',
                  border: '1px solid #1E1E24',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.85rem',
                  color: '#D4D4D8',
                }}>
                  <strong style={{ color: '#C3151C' }}>Deliverable:</strong> {item.deliverable}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
