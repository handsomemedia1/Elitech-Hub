import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessment Diagnostic Results',
  description:
    'Review your personal diagnostic score, archetype breakdown, and initial cybersecurity orientation profile.',
  alternates: {
    canonical: 'https://www.elitechub.com/before-cybersecurity/results',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BeforeCybersecurityResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
