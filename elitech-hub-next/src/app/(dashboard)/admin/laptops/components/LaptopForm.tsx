"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, UploadCloud, X, ArrowLeft } from 'lucide-react';
import styles from '../../users/users.module.css'; // Reuse basic styles
import Link from 'next/link';
import { Laptop } from '@/types/laptop';

export default function LaptopForm({ initialData, isEdit = false }: { initialData?: Partial<Laptop>, isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Laptop>>(initialData || {
    brand: '',
    model: '',
    name: '',
    price: 0,
    currency: 'NGN',
    condition: 'new',
    availability: 'available',
    published: false,
    use_cases: [],
  });
  const [images, setImages] = useState<any[]>(initialData?.laptop_images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true);
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      
      const res = await fetch('/api/admin/laptops/upload', {
        method: 'POST',
        body: data,
      });
      
      const json = await res.json();
      if (json.success) {
        setImages(prev => [...prev, { image_url: json.publicUrl, is_primary: prev.length === 0, sort_order: prev.length }]);
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, name: `${formData.brand} ${formData.model}`, laptop_images: images };
    
    try {
      const url = isEdit ? `/api/admin/laptops/${formData.id}` : '/api/admin/laptops';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (json.success || json.data) {
        router.push('/admin/laptops');
        router.refresh();
      } else {
        alert(json.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
    setLoading(false);
  };

  // Basic inline styles for the form
  const formGroup = { marginBottom: '1.5rem' };
  const label = { display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 500, fontSize: '0.9rem' };
  const input = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b', background: '#0f172a', color: 'white' };
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#070d1a', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', margin: 0 }}>{isEdit ? 'Edit Laptop' : 'Add New Laptop'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/laptops" style={{ display: 'flex', alignItems: 'center', color: '#cbd5e1', textDecoration: 'none', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save Laptop'}
          </button>
        </div>
      </div>

      <div style={grid}>
        {/* Core Info */}
        <div>
          <div style={formGroup}>
            <label style={label}>Brand</label>
            <input required style={input} name="brand" value={formData.brand || ''} onChange={handleChange} placeholder="e.g. Dell, HP, Apple" />
          </div>
          <div style={formGroup}>
            <label style={label}>Model</label>
            <input required style={input} name="model" value={formData.model || ''} onChange={handleChange} placeholder="e.g. XPS 13 9310" />
          </div>
          <div style={{...grid, gap: '1rem'}}>
            <div style={formGroup}>
              <label style={label}>Price</label>
              <input required type="number" style={input} name="price" value={formData.price || 0} onChange={handleChange} />
            </div>
            <div style={formGroup}>
              <label style={label}>Currency</label>
              <select style={input} name="currency" value={formData.currency || 'NGN'} onChange={handleChange}>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div style={{...grid, gap: '1rem'}}>
            <div style={formGroup}>
              <label style={label}>Condition</label>
              <select style={input} name="condition" value={formData.condition || 'new'} onChange={handleChange}>
                <option value="new">New</option>
                <option value="uk-used">UK Used</option>
              </select>
            </div>
            <div style={formGroup}>
              <label style={label}>Availability</label>
              <select style={input} name="availability" value={formData.availability || 'available'} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <div style={formGroup}>
            <label style={{...label, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input type="checkbox" name="published" checked={!!formData.published} onChange={handleChange} />
              Publish immediately
            </label>
          </div>
        </div>

        {/* Specs */}
        <div>
          <div style={formGroup}>
            <label style={label}>CPU</label>
            <input style={input} name="cpu" value={formData.cpu || ''} onChange={handleChange} placeholder="e.g. Intel Core i7-1165G7" />
          </div>
          <div style={{...grid, gap: '1rem'}}>
            <div style={formGroup}>
              <label style={label}>RAM (GB)</label>
              <input type="number" style={input} name="ram_gb" value={formData.ram_gb || 0} onChange={handleChange} />
            </div>
            <div style={formGroup}>
              <label style={label}>Storage (GB)</label>
              <input type="number" style={input} name="storage_gb" value={formData.storage_gb || 0} onChange={handleChange} />
            </div>
          </div>
          <div style={formGroup}>
            <label style={label}>GPU</label>
            <input style={input} name="gpu" value={formData.gpu || ''} onChange={handleChange} placeholder="e.g. NVIDIA RTX 3050" />
          </div>
          <div style={formGroup}>
            <label style={label}>Display</label>
            <input style={input} name="display_size" value={formData.display_size || ''} onChange={handleChange} placeholder="e.g. 15.6 inch FHD" />
          </div>
        </div>
      </div>

      <hr style={{ borderColor: '#1e293b', margin: '2rem 0' }} />
      
      <div style={grid}>
        <div>
          <div style={formGroup}>
            <label style={label}>Short Description (Catalog)</label>
            <textarea style={{...input, height: '80px'}} name="short_description" value={formData.short_description || ''} onChange={handleChange} />
          </div>
          <div style={formGroup}>
            <label style={label}>Full Description / Suitability Notes</label>
            <textarea style={{...input, height: '150px'}} name="description" value={formData.description || ''} onChange={handleChange} />
          </div>
          <div style={formGroup}>
            <label style={label}>Use Cases (comma separated)</label>
            <input style={input} placeholder="e.g. Cybersecurity, Programming, Student" value={(formData.use_cases || []).join(', ')} onChange={(e) => handleArrayChange(e, 'use_cases')} />
          </div>
        </div>
        
        {/* Images */}
        <div>
          <label style={label}>Laptop Images</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', border: img.is_primary ? '2px solid #ff2a55' : '1px solid #1e293b', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '1' }}>
                <img src={img.image_url} alt="laptop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer' }}><X size={14}/></button>
                {!img.is_primary && (
                  <button type="button" onClick={() => setPrimaryImage(i)} style={{ position: 'absolute', bottom: '0.25rem', left: '0.25rem', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }}>Make Primary</button>
                )}
              </div>
            ))}
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ border: '2px dashed #1e293b', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', aspectRatio: '1', color: '#64748b' }}>
              <UploadCloud size={24} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.8rem' }}>Upload</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
        </div>
      </div>
    </form>
  );
}
