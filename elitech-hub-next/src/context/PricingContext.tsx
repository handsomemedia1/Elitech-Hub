'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// The internal business pricing region
export type PricingRegion = 'NG' | 'US' | 'UK' | 'EU' | 'KW' | 'AU' | 'INTL';

type PriceInfo = {
  course_id: string;
  currency_code: string;
  symbol: string;
  amount: number;
};

type PricingContextType = {
  detectedCountry: string;
  selectedMarket: string;
  pricingRegion: PricingRegion;
  currency: string;
  symbol: string;
  prices: Record<string, PriceInfo>;
  loading: boolean;
  formatPrice: (courseId: string) => string;
  getPriceInfo: (courseId: string) => PriceInfo | null;
  changeMarket: (newMarket: string) => void;
};

// Fallback pricing configuration (Nigeria-First Default)
const fallbackPrices: Record<string, PriceInfo> = {
  'bootcamp': { course_id: 'bootcamp', currency_code: 'NGN', symbol: '₦', amount: 75000 },
  'professional': { course_id: 'professional', currency_code: 'NGN', symbol: '₦', amount: 200000 },
  'ai_training': { course_id: 'ai_training', currency_code: 'NGN', symbol: '₦', amount: 75000 },
  'web-basic': { course_id: 'web-basic', currency_code: 'NGN', symbol: '₦', amount: 250000 },
  'web-dynamic': { course_id: 'web-dynamic', currency_code: 'NGN', symbol: '₦', amount: 350000 },
  'web-business': { course_id: 'web-business', currency_code: 'NGN', symbol: '₦', amount: 400000 },
  'web-ecommerce': { course_id: 'web-ecommerce', currency_code: 'NGN', symbol: '₦', amount: 700000 },
  'chatbot-basic': { course_id: 'chatbot-basic', currency_code: 'NGN', symbol: '₦', amount: 300000 },
  'chatbot-standard': { course_id: 'chatbot-standard', currency_code: 'NGN', symbol: '₦', amount: 500000 },
  'chatbot-premium': { course_id: 'chatbot-premium', currency_code: 'NGN', symbol: '₦', amount: 800000 },
  'script-basic': { course_id: 'script-basic', currency_code: 'NGN', symbol: '₦', amount: 300000 },
  'script-standard': { course_id: 'script-standard', currency_code: 'NGN', symbol: '₦', amount: 500000 },
  'script-premium': { course_id: 'script-premium', currency_code: 'NGN', symbol: '₦', amount: 800000 },
  'pentest-basic': { course_id: 'pentest-basic', currency_code: 'NGN', symbol: '₦', amount: 300000 },
  'pentest-standard': { course_id: 'pentest-standard', currency_code: 'NGN', symbol: '₦', amount: 500000 },
  'pentest-premium': { course_id: 'pentest-premium', currency_code: 'NGN', symbol: '₦', amount: 800000 },
};

const PricingContext = createContext<PricingContextType>({
  detectedCountry: 'NG',
  selectedMarket: 'NG',
  pricingRegion: 'NG',
  currency: 'NGN',
  symbol: '₦',
  prices: fallbackPrices,
  loading: true,
  formatPrice: () => '...',
  getPriceInfo: () => null,
  changeMarket: () => {},
});

export const usePricing = () => useContext(PricingContext);

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [detectedCountry, setDetectedCountry] = useState('Unknown');
  const [selectedMarket, setSelectedMarket] = useState('Unknown');
  const [pricingRegion, setPricingRegion] = useState<PricingRegion>('NG');
  const [currency, setCurrency] = useState('NGN');
  const [symbol, setSymbol] = useState('₦');
  const [prices, setPrices] = useState<Record<string, PriceInfo>>(fallbackPrices);
  const [loading, setLoading] = useState(true);

  // Map any country code to our internal PricingRegion
  const determinePricingRegion = (countryCode: string): PricingRegion => {
    const code = countryCode.toUpperCase();
    if (code === 'NG') return 'NG';
    if (code === 'US') return 'US';
    if (code === 'GB' || code === 'UK') return 'UK';
    if (code === 'KW') return 'KW';
    if (code === 'AU') return 'AU';
    // EU Countries (simplified list for example)
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PT'];
    if (euCountries.includes(code)) return 'EU';
    
    return 'INTL'; // Unsupported regions fallback to INTL
  };

  // Map PricingRegion to the currency code used in the database
  const regionToCurrency = (region: PricingRegion): string => {
    switch (region) {
      case 'NG': return 'NGN';
      case 'US': return 'USD';
      case 'UK': return 'GBP';
      case 'EU': return 'EUR';
      case 'KW': return 'KWD';
      case 'AU': return 'AUD';
      case 'INTL': return 'USD'; // INTL fallback uses USD
      default: return 'NGN';
    }
  };

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  };

  const fetchPricesForRegion = async (region: PricingRegion) => {
    setLoading(true);
    let targetCurrency = regionToCurrency(region);
    
    try {
      let { data: priceData, error } = await supabase
        .from('course_prices')
        .select('*')
        .eq('currency', targetCurrency);

      if (error || !priceData || priceData.length === 0) {
        console.warn(`Missing data for ${targetCurrency}. Falling back to USD.`);
        // Fallback to USD if the requested currency doesn't exist
        const usdData = await supabase.from('course_prices').select('*').eq('currency', 'USD');
        if (usdData.data && usdData.data.length > 0) {
          priceData = usdData.data;
          targetCurrency = 'USD';
        } else {
          console.warn(`Missing USD data. Absolute fallback to NGN.`);
          // Absolute fallback
          const ngnData = await supabase.from('course_prices').select('*').eq('currency', 'NGN');
          priceData = ngnData.data || [];
          targetCurrency = 'NGN';
        }
      }

      const priceMap: Record<string, PriceInfo> = {};
      const symbols: Record<string, string> = { NGN: '₦', USD: '$', EUR: '€', GBP: '£', KWD: 'KD', AUD: 'A$' };
      let currentSymbol = symbols[targetCurrency] || targetCurrency + ' ';

      if (priceData && priceData.length > 0) {
        priceData.forEach((p) => {
          priceMap[p.course_id] = {
            course_id: p.course_id,
            currency_code: p.currency,
            symbol: currentSymbol,
            amount: p.amount
          };
        });
        setPrices(priceMap);
        setSymbol(currentSymbol);
        setCurrency(targetCurrency);
      } else {
        setPrices(fallbackPrices);
        setSymbol('₦');
        setCurrency('NGN');
      }
    } catch (err) {
      console.error('Pricing fetch error:', err);
      // Safe fallback on exception
      setPrices(fallbackPrices);
      setSymbol('₦');
      setCurrency('NGN');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function initPricing() {
      // 1. Explicit user market selection (Absolute Authority)
      const savedMarket = localStorage.getItem('elitech_market');
      
      // 2. Verified server/edge country signal (Injected via Middleware cookie)
      const edgeCountry = getCookie('detected_country');
      
      // We do NOT use timezone or navigator.language as authoritative signals here.
      
      let finalCountry = 'Unknown';
      let finalMarket = 'Unknown';
      
      if (edgeCountry) {
        finalCountry = edgeCountry.toUpperCase();
      } else {
        // 4. Optional weak browser hint (ipapi fallback ONLY if edge fails)
        try {
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            const data = await res.json();
            if (data.country_code) {
              finalCountry = data.country_code;
            }
          }
        } catch (e) {
          console.warn('Geolocation detection failed');
        }
      }
      
      setDetectedCountry(finalCountry);
      
      // If user has a saved preference, use it. Otherwise, default to detected.
      if (savedMarket) {
        finalMarket = savedMarket;
      } else {
        // 5. Defined safe fallback (NG) if detection entirely fails
        finalMarket = finalCountry !== 'Unknown' ? finalCountry : 'NG';
      }
      
      setSelectedMarket(finalMarket);
      
      const region = determinePricingRegion(finalMarket);
      setPricingRegion(region);
      
      await fetchPricesForRegion(region);
    }

    initPricing();
  }, []);

  const changeMarket = async (newMarket: string) => {
    localStorage.setItem('elitech_market', newMarket);
    setSelectedMarket(newMarket);
    const region = determinePricingRegion(newMarket);
    setPricingRegion(region);
    await fetchPricesForRegion(region);
  };

  const getPriceInfo = (courseId: string) => {
    return prices[courseId] || fallbackPrices[courseId] || null;
  };

  const formatPrice = (courseId: string) => {
    if (loading && Object.keys(prices).length === 0) return '...';
    
    const info = getPriceInfo(courseId);
    if (!info) return '...';
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: Number.isInteger(info.amount) ? 0 : 2,
      maximumFractionDigits: 2
    }).format(info.amount);
    
    return `${info.symbol}${formattedAmount}`;
  };

  return (
    <PricingContext.Provider value={{ 
      detectedCountry, 
      selectedMarket, 
      pricingRegion, 
      currency, 
      symbol, 
      prices, 
      loading, 
      formatPrice, 
      getPriceInfo, 
      changeMarket 
    }}>
      {children}
    </PricingContext.Provider>
  );
}
