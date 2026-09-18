"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Trash2, Plus, Layers } from 'lucide-react';
import styles from './course-editor.module.css';
import RichTextEditor from '@/components/RichTextEditor';

export default function CourseEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  
  // Course State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState('Beginner');
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchCourse();
    }
  }, [id]);

  async function fetchCourse() {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (course) {
      setTitle(course.title || '');
      setSlug(course.slug || '');
      setDescription(course.description || '');
      setPrice(course.price || 0);
      setLevel(course.level || 'Beginner');
      
      // Fetch modules for this course
      const { data: mods } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });
        
      if (mods) setModules(mods);
    }
    setFetching(false);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (isNew) {
      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = async () => {
    if (!title || !slug) {
      alert("Title and Slug are required.");
      return;
    }

    setLoading(true);
    const courseData = { title, slug, description, price, level };

    if (isNew) {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
        
      if (error) {
        alert("Error creating course: " + error.message);
      } else {
        router.push(`/admin/courses/${data.id}`);
      }
    } else {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id);
        
      if (error) {
        alert("Error updating course: " + error.message);
      } else {
        alert("Course updated successfully!");
      }
    }
    setLoading(false);
  };

  if (fetching) return <div className={styles.loadingState}>Loading course...</div>;

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/courses" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>{isNew ? 'Create New Course' : 'Edit Course'}</h1>
            <p>Manage curriculum and pricing details.</p>
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
          <Save size={18} />
          <span>{loading ? 'Saving...' : 'Save Course'}</span>
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h2>Course Details</h2>
            <div className={styles.formGroup}>
              <label>Course Title</label>
              <input 
                type="text" 
                value={title}
                onChange={handleTitleChange}
                className={styles.input}
                placeholder="e.g. 6-Week AI Cybersecurity Bootcamp"
              />
            </div>

            <div className={styles.formGroup}>
              <label>URL Slug</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </div>

          {!isNew && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Curriculum Modules</h2>
                <button className={styles.outlineBtn}>
                  <Plus size={16} /> Add Module
                </button>
              </div>
              
              {modules.length === 0 ? (
                <div className={styles.emptyModules}>
                  <Layers size={48} className={styles.emptyIcon} />
                  <p>No modules added yet.</p>
                </div>
              ) : (
                <div className={styles.moduleList}>
                  {modules.map((mod, i) => (
                    <div key={mod.id} className={styles.moduleItem}>
                      <div className={styles.moduleDragHandle}>
                        {i + 1}
                      </div>
                      <div className={styles.moduleInfo}>
                        <h4>{mod.title}</h4>
                        <p>{mod.content?.substring(0, 50)}...</p>
                      </div>
                      <button className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h2>Enrollment Settings</h2>
            
            <div className={styles.formGroup}>
              <label>Price (NGN)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Difficulty Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={styles.input}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
