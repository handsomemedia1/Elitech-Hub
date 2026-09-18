import React from 'react';
import { getServerUser } from '@/lib/auth';
import ClientLayout from './ClientLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  return <ClientLayout initialUserName={user?.name || ''}>{children}</ClientLayout>;
}
