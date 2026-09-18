"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PlusCircle, Search, Edit2, Trash2, BookOpen, Layers } from 'lucide-react';
import styles from './courses.module.css';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    // Use the schema from database-setup.sql
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(count)')
      .order('created_at', { ascending: false });

    if (data) {
      setCourses(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its modules?')) return;
    
    await supabase.from('courses').delete().eq('id', id);
    setCourses(courses.filter(c => c.id !== id));
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.header}>
        <div>
          <h1>LMS Manager</h1>
          <p>Manage your courses and learning modules.</p>
        </div>
        <Link href="/admin/courses/new" className={styles.primaryBtn}>
          <PlusCircle size={18} />
          <span>New Course</span>
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className={styles.emptyState}>
            <BookOpen size={48} className={styles.emptyIcon} />
            <h3>No courses found</h3>
            <p>You haven't created any courses yet.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course Info</th>
                <th>Price</th>
                <th>Level</th>
                <th>Modules</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>
                    <div className={styles.courseTitleInfo}>
                      <span className={styles.titleText}>{course.title}</span>
                      <span className={styles.slugBadge}>{course.slug}</span>
                    </div>
                  </td>
                  <td className={styles.priceCell}>
                    ₦{course.price?.toLocaleString() || 0}
                  </td>
                  <td>
                    <span className={styles.levelBadge}>{course.level}</span>
                  </td>
                  <td>
                    <div className={styles.moduleCount}>
                      <Layers size={16} />
                      {course.modules?.[0]?.count || 0}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/courses/${course.id}`} className={styles.actionBtn}>
                        <Edit2 size={16} />
                      </Link>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(course.id)}>
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
