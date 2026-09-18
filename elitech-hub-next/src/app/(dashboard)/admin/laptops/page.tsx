"use client";

import React, { useEffect, useState } from 'react';
import { Laptop as LaptopIcon, Search, Edit2, Trash2, Check, X, Eye, Plus } from 'lucide-react';
import styles from '../users/users.module.css';
import Link from 'next/link';

export default function AdminLaptops() {
  const [laptops, setLaptops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLaptops();
  }, []);

  async function fetchLaptops() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/laptops');
      if (res.ok) {
        const { data } = await res.json();
        if (data) setLaptops(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleUpdateStatus = async (id: string, published: boolean) => {
    setLaptops(laptops.map(l => l.id === id ? { ...l, published } : l));
    
    await fetch(`/api/admin/laptops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published })
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to archive laptop: "${name}"?`)) return;
    
    setLaptops(laptops.map(l => l.id === id ? { ...l, archived: true, published: false } : l));
    await fetch(`/api/admin/laptops/${id}`, {
      method: 'DELETE'
    });
  };

  const filteredLaptops = laptops.filter(l => {
    if (l.archived) return false;
    if (filter === 'all') return true;
    if (filter === 'published') return l.published;
    if (filter === 'draft') return !l.published;
    return true;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Laptops Inventory</h1>
          <p className={styles.subtitle}>Manage laptop catalog, pricing, and availability</p>
        </div>
        <Link href="/admin/laptops/create" className={styles.primaryBtn}>
          <Plus size={18} /> Add New Laptop
        </Link>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search laptops..." className={styles.searchInput} />
        </div>
        <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Active</option>
          <option value="published">Published</option>
          <option value="draft">Drafts / Hidden</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Model</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading laptops...</td>
              </tr>
            ) : filteredLaptops.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No laptops found.</td>
              </tr>
            ) : filteredLaptops.map(laptop => (
              <tr key={laptop.id}>
                <td className={styles.tdName}>
                  <strong>{laptop.brand}</strong> {laptop.model}
                </td>
                <td>{laptop.currency} {laptop.price?.toLocaleString()}</td>
                <td style={{ textTransform: 'capitalize' }}>{laptop.condition}</td>
                <td>
                  <span className={styles.badge}>
                    {laptop.availability}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    laptop.published ? styles.statusActive : styles.statusInactive
                  }`}>
                    {laptop.published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    {laptop.published ? (
                      <button className={styles.iconBtn} title="Unpublish" onClick={() => handleUpdateStatus(laptop.id, false)} style={{ color: '#EF4444' }}><X size={16} /></button>
                    ) : (
                      <button className={styles.iconBtn} title="Publish" onClick={() => handleUpdateStatus(laptop.id, true)} style={{ color: '#10B981' }}><Check size={16} /></button>
                    )}
                    <Link href={`/admin/laptops/edit/${laptop.id}`} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Archive" onClick={() => handleDelete(laptop.id, laptop.model)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
