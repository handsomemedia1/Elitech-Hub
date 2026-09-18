import ThankYouClient from './ThankYouClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/thank-you' }
};

export default function Page() {
  return <ThankYouClient />;
}
