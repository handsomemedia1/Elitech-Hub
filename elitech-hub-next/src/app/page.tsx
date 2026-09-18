import HomePage from './HomePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

export default function Page() {
  return <HomePage />;
}
