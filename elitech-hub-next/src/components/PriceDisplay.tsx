'use client';

import React from 'react';
import { usePricing } from '@/context/PricingContext';

type PriceDisplayProps = {
  courseId: 'bootcamp' | 'professional' | 'ai_training';
  fallback?: string;
};

export default function PriceDisplay({ courseId, fallback }: PriceDisplayProps) {
  const { formatPrice, loading, prices } = usePricing();

  if (loading && Object.keys(prices).length === 0) {
    return <span>{fallback || '...'}</span>;
  }

  return <span>{formatPrice(courseId)}</span>;
}
