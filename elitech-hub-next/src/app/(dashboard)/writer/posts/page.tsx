"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FileText, PlusCircle, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import styles from './posts.module.css';

export default function PostsManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.header}>
        <div>
          <h1>My Articles</h1>
          <p>Manage all your written content</p>
        </div>
        <Link href="/writer/editor" className={styles.primaryBtn}>
          <PlusCircle size={18} />
          <span>New Article</span>
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.filterBtn}>
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>No articles found</h3>
            <p>Try adjusting your search or create a new article.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className={styles.postTitleInfo}>
                      <span className={styles.titleText}>{post.title}</span>
                      {post.category && <span className={styles.categoryBadge}>{post.category}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${post.published ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.viewsCell}>
                    {/* Mock views for now */}
                    {post.published ? '1.2k' : '-'}
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/writer/editor?id=${post.id}`} className={styles.actionBtn}>
                        <Edit2 size={16} />
                      </Link>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(post.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
