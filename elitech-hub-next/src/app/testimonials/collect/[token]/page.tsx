import React from 'react';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase-server';
import PageLayout from '@/components/PageLayout';
import { MessageCircle, Shield, CheckCircle } from 'lucide-react';
import TestimonialClientForm from './TestimonialClientForm';

export const metadata = {
  title: 'Share Your Experience | Elitech Hub',
  robots: {
    index: false,
    follow: false
  }
};

const RELATIONSHIP_TYPES = [
  'Client', 'Student', 'Research Collaborator', 'Professor / Academic', 
  'Mentor', 'Colleague', 'Employer', 'Project Collaborator', 
  'Training Participant', 'Community Member', 'Other'
];

export default async function TestimonialCollectPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  
  if (!token) {
    notFound();
  }

  const supabase = createServiceClient();
  const { data: request, error } = await supabase
    .from('testimonial_collection_requests')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !request) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <Shield size={48} className="text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Invalid Link</h1>
          <p className="text-gray-400">This testimonial request link is invalid or has expired.</p>
        </div>
      </PageLayout>
    );
  }

  if (request.status !== 'active') {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle size={48} className="text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Already Submitted</h1>
          <p className="text-gray-400">Thank you! This testimonial link has already been used.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section style={{ padding: '5rem 1rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <MessageCircle size={48} style={{ color: '#3b82f6' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', marginTop: 0 }}>Share Your Experience</h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            You have been invited to share your experience working, learning, researching, or collaborating with Elijah Adeyeye and Elitech Hub.
          </p>
        </div>

        <div style={{ background: '#111317', border: '1px solid #1e293b', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <TestimonialClientForm 
            token={token} 
            defaultName={request.recipient_name} 
            defaultEmail={request.recipient_email || ''} 
            defaultRelationship={request.relationship_type || ''}
            relationshipTypes={RELATIONSHIP_TYPES}
          />
        </div>
      </section>
    </PageLayout>
  );
}
