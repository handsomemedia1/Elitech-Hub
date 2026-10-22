// ============================================================
// Before Cybersecurity — Centralized Pricing Configuration
// Single source of truth for product pricing & provider capabilities
// ============================================================

export interface ProductPrice {
  amount: number;
  currency: string;
  symbol: string;
  formatted: string;
}

export interface PaymentProviderStatus {
  id: 'paystack' | 'flutterwave' | 'lemonsqueezy';
  name: string;
  headline: string;
  description: string;
  status: 'active' | 'prepared' | 'beta';
  supportedCurrencies: string[];
}

export const BC_PRICING_CONFIG: {
  productSlug: string;
  productName: string;
  version: string;
  baseNgn: number;
  currencies: Record<string, ProductPrice>;
  providers: PaymentProviderStatus[];
} = {
  productSlug: 'before-cybersecurity',
  productName: 'Before Cybersecurity — Complete Interactive System',
  version: '1.0',
  baseNgn: 25000,
  currencies: {
    NGN: {
      amount: 25000,
      currency: 'NGN',
      symbol: '₦',
      formatted: '₦25,000',
    },
    USD: {
      amount: 29,
      currency: 'USD',
      symbol: '$',
      formatted: '$29',
    },
    GBP: {
      amount: 24,
      currency: 'GBP',
      symbol: '£',
      formatted: '£24',
    },
    EUR: {
      amount: 27,
      currency: 'EUR',
      symbol: '€',
      formatted: '€27',
    },
    CAD: {
      amount: 39,
      currency: 'CAD',
      symbol: 'C$',
      formatted: 'C$39',
    },
  },
  providers: [
    {
      id: 'paystack',
      name: 'Paystack',
      headline: 'Instant card, bank transfer, and USSD payments',
      description: 'Primary recommended checkout for Nigerian and African bank cards, USSD, and instant transfers.',
      status: 'active',
      supportedCurrencies: ['NGN', 'USD', 'GHS', 'ZAR', 'KES'],
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      headline: 'Pan-African & Multi-Currency Card Gateway',
      description: 'Prepared payment gateway supporting African mobile money, debit cards, and multi-currency bank accounts.',
      status: 'prepared',
      supportedCurrencies: ['NGN', 'USD', 'GBP', 'EUR'],
    },
    {
      id: 'lemonsqueezy',
      name: 'Lemon Squeezy',
      headline: 'Global Merchant of Record & International Checkout',
      description: 'Prepared checkout provider for international cards, Apple Pay, Google Pay, and localized sales tax compliance.',
      status: 'prepared',
      supportedCurrencies: ['USD', 'GBP', 'EUR', 'CAD'],
    },
  ],
};

export function getPriceForCurrency(currencyCode: string): ProductPrice {
  const code = (currencyCode || 'NGN').toUpperCase();
  return BC_PRICING_CONFIG.currencies[code] || BC_PRICING_CONFIG.currencies.USD;
}
