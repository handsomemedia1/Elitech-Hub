"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Search, Edit2, Trash2, X } from 'lucide-react';
import styles from './users.module.css';
import AdminModal from '@/components/AdminModal';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', has_access: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app we would call an API route to hash password and insert
      // For now we'll do a basic insert (Note: password won't be hashed if done client-side like this,
      // it should ideally hit /api/auth/signup)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newUser.email, 
          password: newUser.password, 
          name: newUser.name, 
          country: 'NG'
        })
      });

      const data = await res.json();
      if (res.ok) {
        // If we want to set role or access we'd have to update it after creation
        await supabase.from('users').update({ role: newUser.role, has_access: newUser.has_access }).eq('id', data.user.id);
        
        setShowAddModal(false);
        setNewUser({ name: '', email: '', password: '', role: 'student', has_access: true });
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      alert('Error creating user');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('users').delete().eq('id', id);
    setUsers(users.filter(u => u.id !== id));
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage student enrollments and platform users</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowAddModal(true)}>
          <Users size={18} /> Add New User
        </button>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className={styles.searchInput} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect}>
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className={styles.tdName}>
                    <div className={styles.avatar}>{user.name?.charAt(0) || '?'}</div>
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td><span className={styles.badge}>{user.role}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.has_access ? styles.statusActive : styles.statusInactive}`}>
                      {user.has_access ? 'Active / Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AdminModal onClose={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ background: 'var(--color-bg-panel)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', margin: 0 }}>Add New User</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Full Name</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Email Address</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Temporary Password</label>
                <input required type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', color: 'white' }}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="writer">Writer</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={newUser.has_access} onChange={e => setNewUser({...newUser, has_access: e.target.checked})} style={{ marginRight: '0.5rem' }} />
                  Has Course Access (Paid)
                </label>
              </div>
              <button type="submit" disabled={saving} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </AdminModal>
      )}
    </div>
  );
}