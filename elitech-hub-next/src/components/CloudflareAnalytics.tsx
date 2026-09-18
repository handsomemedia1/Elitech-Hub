'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function CloudflareAnalytics() {
  const pathname = usePathname();

  // Exclude private routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/researcher') ||
    pathname.startsWith('/writer')
  ) {
    return null;
  }

  // Use env variable or fallback to the provided token
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || "411fc70a36974f2e86415d364ce0ff91";
  if (!token) {
    return null;
  }

  return (
    <Script
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
    />
  );
}
