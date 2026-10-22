import type { Metadata } from 'next';
import BeforeCybersecurityAppShell from './AppShell';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BeforeCybersecurityAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BeforeCybersecurityAppShell>{children}</BeforeCybersecurityAppShell>;
}
