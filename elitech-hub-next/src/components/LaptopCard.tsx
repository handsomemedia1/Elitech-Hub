import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, HardDrive, Monitor, Battery } from 'lucide-react';
import { Laptop } from '@/types/laptop';

export function LaptopCard({ laptop }: { laptop: Laptop }) {
  const primaryImage = laptop.laptop_images?.find(img => img.is_primary)?.image_url 
    || laptop.laptop_images?.[0]?.image_url 
    || '/assets/images/placeholder.jpg';

  // Format price
  const priceFormatted = new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: laptop.currency || 'NGN',
    maximumFractionDigits: 0
  }).format(laptop.price);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid var(--color-border)',
      borderRadius: '1rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }} className="laptop-card-hover">
      
      {/* Image container */}
      <div style={{ position: 'relative', height: '220px', background: '#0a0a0a' }}>
        <img 
          src={primaryImage} 
          alt={laptop.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {laptop.availability !== 'available' && (
          <div style={{
            position: 'absolute',
            top: '1rem', right: '1rem',
            background: laptop.availability === 'sold' ? '#ef4444' : '#f59e0b',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {laptop.availability}
          </div>
        )}
        <div style={{
          position: 'absolute',
          bottom: '1rem', left: '1rem',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {laptop.condition === 'uk-used' ? 'UK Used' : 'Brand New'}
        </div>
      </div>

      {/* Content container */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          {laptop.brand}
        </div>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: 'white', lineHeight: 1.3 }}>
          {laptop.model}
        </h3>

        {/* Key specs grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.75rem', 
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)' 
        }}>
          {laptop.cpu && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu size={14} color="var(--color-primary)"/> <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{laptop.cpu}</span></div>}
          {laptop.ram_gb && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HardDrive size={14} color="var(--color-primary)"/> {laptop.ram_gb}GB RAM</div>}
          {laptop.storage_gb && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HardDrive size={14} color="var(--color-primary)"/> {laptop.storage_gb}GB {laptop.storage_type}</div>}
          {laptop.display_size && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Monitor size={14} color="var(--color-primary)"/> <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{laptop.display_size}</span></div>}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Price</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{priceFormatted}</div>
          </div>
          <Link href={`/laptops/${laptop.slug}`} className="premium-button-small" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
