import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cybersecurity Diagnostic Assessment',
  description:
    'Evaluate your starting point, assess your technical background, and discover your natural cybersecurity archetype.',
  alternates: {
    canonical: 'https://www.elitechub.com/before-cybersecurity/assessment',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BeforeCybersecurityAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
