"use client";

import React, { useEffect, useState } from 'react';
import LaptopForm from '../../components/LaptopForm';
import { useParams } from 'next/navigation';
import { Laptop } from '@/types/laptop';

export default function EditLaptopPage() {
  const { id } = useParams();
  const [data, setData] = useState<Laptop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/laptops/${id}`)
        .then(res => res.json())
        .then(json => {
          if (json.data) setData(json.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#cbd5e1' }}>Loading laptop data...</div>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>Laptop not found.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <LaptopForm initialData={data} isEdit={true} />
    </div>
  );
}
