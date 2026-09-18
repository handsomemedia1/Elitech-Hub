import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Domain Security & Mail Check | Elitech Hub',
  description: 'Analyze your domain name security posture, verify email authentication (SPF, DKIM, DMARC), and check web security headers instantly with our free passive security scanner.',
  keywords: 'domain name check, email security check, SPF DMARC checker, passive security scan, web security headers, Elitech Hub security',
  alternates: {
    canonical: 'https://elitechub.com/security-check',
  },
  openGraph: {
    title: 'Free Domain Security & Mail Check | Elitech Hub',
    description: 'Analyze your domain name security posture, verify email authentication (SPF, DKIM, DMARC), and check web security headers instantly with our free passive security scanner.',
    url: 'https://elitechub.com/security-check',
    type: 'website',
  }
};

export default function SecurityCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
