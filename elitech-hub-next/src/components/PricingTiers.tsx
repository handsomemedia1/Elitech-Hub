'use client';
import React from 'react';
import { usePricing } from '@/context/PricingContext';
import { CheckCircle2 } from 'lucide-react';
import styles from './PricingTiers.module.css';

export interface PricingTierProps {
  id?: string;
  title: string;
  priceNgn: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export function PricingTiers({ tiers }: { tiers: PricingTierProps[] }) {
  const { formatPrice: contextFormatPrice, loading } = usePricing();

  const getDisplayPrice = (tier: PricingTierProps) => {
    // If we have an ID and pricing has loaded, try to use dynamic pricing
    if (!loading && tier.id) {
      const dynamicPrice = contextFormatPrice(tier.id);
      if (dynamicPrice !== '...') return dynamicPrice;
    }
    // Fallback to static NGN price
    return `₦${new Intl.NumberFormat('en-US').format(tier.priceNgn)}`;
  };

  return (
    <div className={styles.pricingGrid} id="pricing">
      {tiers.map((tier, idx) => (
        <div key={idx} className={`${styles.tierCard} ${tier.isPopular ? styles.popular : ''}`}>
          {tier.isPopular && <div className={styles.popularBadge}>Most Popular</div>}
          <h3 className={styles.tierTitle}>{tier.title}</h3>
          <p className={styles.tierDesc}>{tier.description}</p>
          <div className={styles.price}>{getDisplayPrice(tier)}</div>
          <ul className={styles.featuresList}>
            {tier.features.map((feature, fIdx) => (
              <li key={fIdx}>
                <CheckCircle2 size={20} className={styles.checkIcon} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a href="/contact" className={`premium-button ${styles.btn}`}>Get Started</a>
        </div>
      ))}
    </div>
  );
}
