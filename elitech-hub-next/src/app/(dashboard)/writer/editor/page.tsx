"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Image as ImageIcon,
  Check,
  X,
  Plus,
  AlertCircle,
  Upload,
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo,
  Clock, BookOpen, Hash, Calendar, Link2, AlignLeft
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLinkExt from '@tiptap/extension-link';
import styles from './editor.module.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Quill is removed for React 19 compatibility
// We will use native HTML components or Tiptap if requested

export default function WriterEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cybersecurity', checked: false },
    { id: 2, name: 'Tech News', checked: false },
    { id: 3, name: 'Tutorials', checked: false },
    { id: 4, name: 'Industry Updates', checked: false }
  ]);
  const [newCatInput, setNewCatInput] = useState('');

  // Refs for hidden file inputs
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authorName, setAuthorName] = useState('Writer');
  // Track whether post data has been loaded so we can push it into the editor
  const [postLoaded, setPostLoaded] = useState<string | false>(false);
  // New fields
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false); // true once user manually edits slug
  const [publishDate, setPublishDate] = useState('');
  const [postStatus, setPostStatus] = useState<'draft' | 'pending' | 'published'>('draft');
  const [tocVisible, setTocVisible] = useState(true);

  // Load draft if ID is in URL, and check role
  useEffect(() => {
    // Use stored name/role from localStorage as immediate source (set at login time)
    const storedName = localStorage.getItem('elitech_user_name');
    const storedRole = localStorage.getItem('elitech_user_role');
    const storedToken = localStorage.getItem('elitech_token');

    if (storedName && storedName !== 'Writer' && storedName !== 'Admin') {
      setAuthorName(storedName);
    }
    if (storedRole) {
      setIsAdmin(storedRole === 'admin');
    }

    // Also verify from API if token is available
    if (storedToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(res => res.json()).then(data => {
        if (data.user) {
          setIsAdmin(data.user.role === 'admin');
          if (data.user.name) {
            setAuthorName(data.user.name);
            // Keep localStorage in sync
            localStorage.setItem('elitech_user_name', data.user.name);
            localStorage.setItem('elitech_user_role', data.user.role);
          }
        }
      }).catch(() => {/* silent fail, already using localStorage values */});
    }

    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      setPostId(id);
      supabase.from('blog_posts').select('*').eq('id', id).single().then(({ data, error }) => {
        if (data && !error) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setDescription(data.excerpt || '');
          setFeaturedImage(data.thumbnail || '');
          if (data.tags) setTags(data.tags);
          if (data.category) {
            setCategories(cats => cats.map(c => ({
              ...c,
              checked: c.name === data.category
            })));
          }
          if (data.author) {
            setAuthorName(data.author);
          }
          if (data.slug) { setSlug(data.slug); setSlugEdited(true); }
          if (data.published_at) setPublishDate(data.published_at.substring(0, 16));
          if (data.status) setPostStatus(data.status);
          // Signal that post data is ready so the editor can sync
          setPostLoaded(data.content || '');
        }
      });
    }
  }, []);

  // Tiptap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        // Allow width/height/style attributes so images can be resized
        HTMLAttributes: {
          class: 'editor-image',
        },
        allowBase64: false,
      }),
      TiptapLinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-prose',
      },
    },
  });

  // When post data arrives asynchronously, push it into the already-mounted editor
  useEffect(() => {
    if (editor && postLoaded !== false) {
      editor.commands.setContent(postLoaded as string, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, postLoaded]);

  // Upload image to Supabase and insert into editor
  const handleInlineImageUpload = async (file: File) => {
    if (!editor) return;
    setUploadingInline(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    try {
      const { error } = await supabase.storage.from('public-images').upload(filePath, file);
      if (error) { alert('Upload failed: ' + error.message); return; }
      const { data } = supabase.storage.from('public-images').getPublicUrl(filePath);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch (e) {
      alert('Error uploading image');
    } finally {
      setUploadingInline(false);
    }
  };

  // Upload featured image to Supabase
  const handleFeaturedImageUpload = async (file: File) => {
    setUploadingFeatured(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `featured-${Date.now()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    try {
      const { error } = await supabase.storage.from('public-images').upload(filePath, file);
      if (error) { alert('Upload failed: ' + error.message); return; }
      const { data } = supabase.storage.from('public-images').getPublicUrl(filePath);
      setFeaturedImage(data.publicUrl);
    } catch (e) {
      alert('Error uploading image');
    } finally {
      setUploadingFeatured(false);
    }
  };

  // Editor modes configured above


  // Content processing for SEO calculations
  const plainTextContext = content.replace(/<[^>]+>/g, '');
  const wordCount = plainTextContext.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-generate slug from title unless user manually edited it
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, slugEdited]);

  // Extract headings from content for Table of Contents
  const tocHeadings = useMemo(() => {
    const matches = [...content.matchAll(/<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi)];
    return matches.map(m => ({
      level: parseInt(m[1]),
      text: m[2].replace(/<[^>]+>/g, '').trim(),
    }));
  }, [content]);

  const seoChecklist = useMemo(() => {
    return [
      {
        id: 'title-length',
        label: 'Title Length (40-60 chars)',
        pass: title.length >= 40 && title.length <= 60,
        warn: title.length > 0 && (title.length < 40 || title.length > 60),
        value: `${title.length} chars`
      },
      {
        id: 'desc-length',
        label: 'Meta Description (120-155 chars)',
        pass: description.length >= 120 && description.length <= 155,
        warn: description.length > 0 && (description.length < 120 || description.length > 155),
        value: `${description.length} chars`
      },
      {
        id: 'word-count',
        label: 'Content Length (> 300 words)',
        pass: wordCount >= 300,
        warn: wordCount > 0 && wordCount < 300,
        value: `${wordCount} words`
      },
      {
        id: 'featured-image',
        label: 'Featured Image Set',
        pass: featuredImage.length > 0,
        warn: false,
        value: featuredImage ? 'Yes' : 'No'
      },
      {
        id: 'tags-set',
        label: 'Tags Added (min 2)',
        pass: tags.length >= 2,
        warn: tags.length === 1,
        value: `${tags.length} tags`
      }
    ];
  }, [title, description, wordCount, featuredImage, tags]);

  const seoScore = useMemo(() => {
    const passed = seoChecklist.filter(item => item.pass).length;
    return Math.round((passed / seoChecklist.length) * 100);
  }, [seoChecklist]);

  // Circle Gauge styling based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const scoreColor = getScoreColor(seoScore);
  const circleCircumference = 2 * Math.PI * 50; // radius 50
  const strokeDashoffset = circleCircumference - (seoScore / 100) * circleCircumference;

  // Handlers
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddCategory = () => {
    if (newCatInput.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCatInput.trim(), checked: true }]);
      setNewCatInput('');
    }
  };

  const toggleCategory = (id: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const [saving, setSaving] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState('');

  const generateSlug = (t: string) =>
    t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const savePost = async (status: 'draft' | 'pending' | 'published') => {
    if (!title.trim()) { alert('Please add a title before saving.'); return; }
    setSaving(true);
    setSaveMsg('');
    setPostStatus(status);
    const selectedCategories = categories.filter(c => c.checked).map(c => c.name);
    const finalSlug = slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      title,
      slug: finalSlug,
      content,
      excerpt: description,
      thumbnail: featuredImage || null,
      tags,
      category: selectedCategories[0] || 'Uncategorized',
      status: status === 'published' ? 'published' : status,
      published: status === 'published',
      published_at: status === 'published'
        ? (publishDate ? new Date(publishDate).toISOString() : new Date().toISOString())
        : null,
      word_count: wordCount,
      author: authorName
    };
    try {
      if (postId) {
        // Update existing post
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', postId);
        if (error) throw error;
      } else {
        // Insert new post
        const { data, error } = await supabase.from('blog_posts').insert([payload]).select('id').single();
        if (error) throw error;
        if (data) setPostId(data.id);
      }
      setSaveMsg(status === 'draft' ? '✓ Draft saved!' : '✓ Submitted for review!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      alert('Save failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/writer" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>Create New Post</h1>
            <p>Drafting in HTML/Quill Mode</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          {saveMsg && <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: 500 }}>{saveMsg}</span>}
          <button className={styles.draftBtn} onClick={() => savePost('draft')} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          {isAdmin ? (
            <button className={styles.publishBtn} onClick={() => savePost('published')} disabled={saving}>
              <Send size={18} /> Publish Immediately
            </button>
          ) : (
            <button className={styles.publishBtn} onClick={() => savePost('pending')} disabled={saving}>
              <Send size={18} /> Submit for Review
            </button>
          )}
        </div>
      </header>

      <div className={styles.editorLayout}>
        <div className={styles.mainColumn}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              className={styles.titleInput} 
              placeholder="Post Title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className={styles.quillContainer}>
            <div className={styles.editorTabs}>
              <button 
                className={`${styles.tabBtn} ${editorMode === 'wysiwyg' ? styles.tabActive : ''}`}
                onClick={() => setEditorMode('wysiwyg')}
              >
                Visual Editor
              </button>
              <button 
                className={`${styles.tabBtn} ${editorMode === 'markdown' ? styles.tabActive : ''}`}
                onClick={() => setEditorMode('markdown')}
              >
                Markdown Editor
              </button>
            </div>
            {editorMode === 'wysiwyg' ? (
              <div style={{ height: 'calc(100% - 46px)', display: 'flex', flexDirection: 'column' }}>
                {editor && (
                  <div className={styles.tiptapToolbar}>
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.toolbarBtnActive : ''}`} title="Bold"><Bold size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.toolbarBtnActive : ''}`} title="Italic"><Italic size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`${styles.toolbarBtn} ${editor.isActive('strike') ? styles.toolbarBtnActive : ''}`} title="Strike"><Strikethrough size={16} /></button>
                    
                    <div style={{ width: '1px', background: '#1e293b', margin: '0 4px' }}></div>
                    
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 1 }) ? styles.toolbarBtnActive : ''}`} title="Heading 1"><Heading1 size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 2 }) ? styles.toolbarBtnActive : ''}`} title="Heading 2"><Heading2 size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${styles.toolbarBtn} ${editor.isActive('heading', { level: 3 }) ? styles.toolbarBtnActive : ''}`} title="Heading 3"><Heading3 size={16} /></button>
                    
                    <div style={{ width: '1px', background: '#1e293b', margin: '0 4px' }}></div>
                    
                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${styles.toolbarBtn} ${editor.isActive('bulletList') ? styles.toolbarBtnActive : ''}`} title="Bullet List"><List size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${styles.toolbarBtn} ${editor.isActive('orderedList') ? styles.toolbarBtnActive : ''}`} title="Ordered List"><ListOrdered size={16} /></button>
                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${styles.toolbarBtn} ${editor.isActive('blockquote') ? styles.toolbarBtnActive : ''}`} title="Quote"><Quote size={16} /></button>
                    
                    <div style={{ width: '1px', background: '#1e293b', margin: '0 4px' }}></div>
                    
                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={styles.toolbarBtn} title="Undo"><Undo size={16} /></button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={styles.toolbarBtn} title="Redo"><Redo size={16} /></button>

                    <div style={{ width: '1px', background: '#1e293b', margin: '0 4px' }}></div>

                    {/* Inline Image Upload */}
                    <input
                      ref={inlineImageInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleInlineImageUpload(f); e.target.value = ''; }}
                    />
                    <button
                      onClick={() => inlineImageInputRef.current?.click()}
                      className={styles.toolbarBtn}
                      title="Insert Image"
                      disabled={uploadingInline}
                      style={{ gap: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      {uploadingInline ? <span style={{ fontSize: '0.7rem' }}>...</span> : <ImageIcon size={16} />}
                    </button>

                    {/* Insert Link */}
                    <button
                      onClick={() => {
                        const url = window.prompt('Enter URL:');
                        if (url) {
                          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        }
                      }}
                      className={`${styles.toolbarBtn} ${editor.isActive('link') ? styles.toolbarBtnActive : ''}`}
                      title="Insert Link"
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>🔗</span>
                    </button>

                    {/* Resize selected image */}
                    <button
                      onClick={() => {
                        const width = window.prompt('Set image width (e.g. 400px, 50%, 100%):');
                        if (width) {
                          // Find the selected image node and update its width style
                          const { state } = editor;
                          const { from } = state.selection;
                          const node = state.doc.nodeAt(from);
                          if (node && node.type.name === 'image') {
                            editor.chain().focus().updateAttributes('image', { style: `width:${width};max-width:100%;` }).run();
                          } else {
                            alert('Please click on an image first, then click Resize.');
                          }
                        }
                      }}
                      className={styles.toolbarBtn}
                      title="Resize Selected Image"
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>⟺</span>
                    </button>
                  </div>
                )}
                <div className={styles.tiptapEditor}>
                  <EditorContent editor={editor} />
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', height: 'calc(100% - 42px)', overflowY: 'auto', backgroundColor: '#0f172a' }}>
                <textarea 
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontFamily: 'monospace' }}
                  placeholder="# Markdown Content Here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <aside className={styles.sidebarColumn}>
          {/* SEO Gauge Panel */}
          <div className={styles.settingsCard}>
            <h3>SEO Optimizer</h3>
            
            <div className={styles.seoScoreCircle}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle 
                  cx="60" cy="60" r="50" 
                  fill="none" 
                  stroke={scoreColor} 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out' }}
                />
              </svg>
              <div className={styles.scoreValue} style={{ color: scoreColor }}>
                {seoScore}
              </div>
            </div>

            <ul className={styles.seoCriteria}>
              {seoChecklist.map(item => (
                <li key={item.id}>
                  <div className={`${styles.statusIcon} ${item.pass ? styles.pass : item.warn ? styles.warn : styles.fail}`}>
                    {item.pass ? <Check size={14} /> : item.warn ? <AlertCircle size={14} /> : <X size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '1.5rem 0' }} />

          {/* ── READING STATS ── */}
          <div className={styles.settingsCard}>
            <h3><BookOpen size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />Reading Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>{wordCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Words</div>
              </div>
              <div style={{ background: '#1e293b', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{readingTime}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Min Read</div>
              </div>
            </div>
            {/* Status badge */}
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status:</span>
              <span style={{
                padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                background: postStatus === 'published' ? '#10b981' : postStatus === 'pending' ? '#f59e0b' : '#334155',
                color: '#fff'
              }}>
                {postStatus === 'published' ? '● Published' : postStatus === 'pending' ? '⏳ Pending' : '✎ Draft'}
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '1.5rem 0' }} />

          {/* ── PUBLISH SETTINGS ── */}
          <div className={styles.settingsCard}>
            <h3><Calendar size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />Publish Settings</h3>

            <div className={styles.fieldGroup}>
              <label>Author Name</label>
              <input
                type="text"
                className={styles.input}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author Name"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Publish Date <span style={{ color: '#475569', fontWeight: 400 }}>(optional — defaults to now)</span></label>
              <input
                type="datetime-local"
                className={styles.input}
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '1.5rem 0' }} />

          {/* ── URL SLUG ── */}
          <div className={styles.settingsCard}>
            <h3><Link2 size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />URL Slug</h3>
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.4rem' }}>
                elitechub.com/blog/<strong style={{ color: '#94a3b8' }}>{slug || 'your-post-slug'}</strong>
              </div>
              <input
                type="text"
                className={styles.input}
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-'));
                  setSlugEdited(true);
                }}
                placeholder="your-post-slug"
              />
              {slugEdited && (
                <button
                  type="button"
                  style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => { setSlugEdited(false); }}
                >
                  ↺ Auto-generate from title
                </button>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '1.5rem 0' }} />

          {/* ── TABLE OF CONTENTS ── */}
          {tocHeadings.length > 0 && (
            <div className={styles.settingsCard}>
              <h3
                style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => setTocVisible(v => !v)}
              >
                <AlignLeft size={15} />Table of Contents
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#475569' }}>{tocVisible ? '▲' : '▼'}</span>
              </h3>
              {tocVisible && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {tocHeadings.map((h, i) => (
                    <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px`, display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <Hash size={11} style={{ color: '#475569', marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>{h.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tocHeadings.length > 0 && <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '1.5rem 0' }} />}

          {/* ── META & SOCIAL (existing) ── */}
          <div className={styles.settingsCard}>
            <h3>Post Settings</h3>

            <div className={styles.fieldGroup}>
              <label>Meta Description</label>
              <textarea 
                className={styles.textarea} 
                rows={3} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary for search engines..."
              ></textarea>
            </div>

            <div className={styles.fieldGroup}>
              <label>Categories</label>
              <div className={styles.categoriesPanel}>
                {categories.map(cat => (
                  <label key={cat.id}>
                    <input 
                      type="checkbox" 
                      checked={cat.checked} 
                      onChange={() => toggleCategory(cat.id)} 
                    /> 
                    {cat.name}
                  </label>
                ))}
              </div>
              <div className={styles.addCatRow}>
                <input 
                  type="text" 
                  placeholder="New category..." 
                  value={newCatInput}
                  onChange={e => setNewCatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                />
                <button type="button" className={styles.btnSm} onClick={handleAddCategory}>Add</button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Tags</label>
              <div className={styles.tagsContainer}>
                {tags.map(t => (
                  <span key={t} className={styles.tagPill}>
                    {t} <X size={12} className={styles.removeTag} onClick={() => removeTag(t)} />
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Add tag and press Enter..." 
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Featured Image</label>
              {/* Hidden file input */}
              <input
                ref={featuredImageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFeaturedImageUpload(f); e.target.value = ''; }}
              />
              <button
                type="button"
                onClick={() => featuredImageInputRef.current?.click()}
                disabled={uploadingFeatured}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '10px 12px', marginBottom: '8px',
                  background: '#1e293b', border: '1px dashed #334155',
                  color: uploadingFeatured ? '#64748b' : '#cbd5e1',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem'
                }}
              >
                <Upload size={16} />
                {uploadingFeatured ? 'Uploading...' : 'Upload Image from Device'}
              </button>
              <div className={styles.imageInputWrapper}>
                <ImageIcon size={16} className={styles.inputIcon} />
                <input 
                  type="text" 
                  className={styles.inputWithIcon} 
                  placeholder="Or paste URL here..." 
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>
              {featuredImage && (
                <div className={styles.imagePreview}>
                  <button type="button" onClick={() => setFeaturedImage('')} className={styles.removeImageBtn} title="Remove image">
                    <X size={14} />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredImage} alt="Featured" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '2rem 0' }} />

          {/* Live Previews */}
          <div className={styles.settingsCard}>
            <h3>Search Engine Preview</h3>
            <div className={styles.googlePreview}>
              <div className={styles.gpTitle}>{title || 'Post Title Will Appear Here'} | Elitech Hub</div>
              <div className={styles.gpUrl}>https://elitechub.com/blog/{slug || 'your-post-slug'}</div>
              <div className={styles.gpDesc}>
                {description || 'Your meta description will appear here. Write a compelling summary of 120-155 characters to improve your click-through rate in search results.'}
              </div>
            </div>

            <h3 style={{ marginTop: '1rem' }}>Social Media Preview</h3>
            <div className={styles.socialPreviewCard}>
              <div className={styles.spImage}>
                {featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featuredImage} alt="Social Card" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className={styles.spContent}>
                <div className={styles.spUrl}>ELITECHUB.COM</div>
                <div className={styles.spTitle}>{title || 'Post Title'}</div>
                <div className={styles.spDesc}>
                  {description ? (description.length > 80 ? description.substring(0, 80) + '...' : description) : 'Post description preview...'}
                </div>
              </div>
            </div>
          </div>
          
        </aside>
      </div>
    </div>
  );
}
