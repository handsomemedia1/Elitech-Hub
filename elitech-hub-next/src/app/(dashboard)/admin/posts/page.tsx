"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Search, Edit2, Trash2, Check, X, Eye } from 'lucide-react';
import styles from '../users/users.module.css';
import Link from 'next/link';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, published, draft

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setPosts(data);
    setLoading(false);
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus, published: newStatus === 'published' } : p));
    
    await supabase.from('blog_posts').update({ 
      status: newStatus,
      published: newStatus === 'published' 
    }).eq('id', id);
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete post: "${title}"?`)) return;
    
    setPosts(posts.filter(p => p.id !== id));
    await supabase.from('blog_posts').delete().eq('id', id);
  };

  const filteredPosts = posts.filter(p => filter === 'all' || p.status === filter);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Blog Posts Management</h1>
          <p className={styles.subtitle}>Review, approve, and manage all blog content</p>
        </div>
        <Link href="/writer/editor" className={styles.primaryBtn}>
          <FileText size={18} /> Write New Post
        </Link>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search articles..." className={styles.searchInput} />
        </div>
        <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="pending">Pending Review</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No posts found.</td>
              </tr>
            ) : filteredPosts.map(post => (
              <tr key={post.id}>
                <td className={styles.tdName}>
                  {post.title || 'Untitled'}
                </td>
                <td>{post.author || 'Unknown'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    post.status === 'published' ? styles.statusActive : 
                    post.status === 'pending' ? styles.statusInactive : ''
                  }`} style={post.status === 'draft' ? { backgroundColor: '#e2e8f0', color: '#475569' } : {}}>
                    {post.status === 'published' ? 'Published' : post.status === 'pending' ? 'Pending' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actionBtns}>
                    {post.status === 'pending' && (
                      <>
                        <button className={styles.iconBtn} title="Approve & Publish" onClick={() => handleUpdateStatus(post.id, 'published')} style={{ color: '#10B981' }}><Check size={16} /></button>
                        <button className={styles.iconBtn} title="Reject to Draft" onClick={() => handleUpdateStatus(post.id, 'draft')} style={{ color: '#EF4444' }}><X size={16} /></button>
                      </>
                    )}
                    <Link href={`/writer/editor?id=${post.id}`} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Delete" onClick={() => handleDeletePost(post.id, post.title)}><Trash2 size={16} /></button>
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
