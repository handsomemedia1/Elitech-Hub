'use client';

import { useActionState } from 'react';
import { submitApplication } from './actions';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
};

/** Shared input style applied via inline style prop */
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-bg-raised)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border-light)',
  borderRadius: '8px',
  padding: '0.65rem 0.9rem',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: '0.4rem',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  marginBottom: '1.25rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid var(--color-border)',
};

export default function ApplicationFormPage() {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);

  if (state.success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '560px',
            width: '100%',
            padding: '3rem 2.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'var(--color-success-dim)',
              border: '1px solid var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--color-success)',
            }}
          >
            <CheckCircle size={28} />
          </div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Application Received
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Thank you for applying to the Elitech Hub Research Membership. We will review your
            application and be in touch before the January 2027 launch.
          </p>
          <Link href="/research/membership" className="premium-button">
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-main)',
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Back link */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/research/membership" className="back-link">
            <ArrowLeft size={16} />
            Back to Membership Overview
          </Link>
        </div>

        {/* Form card */}
        <div
          className="glass-panel"
          style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}
        >
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Research Membership Application
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            Please provide your details below to apply for the inaugural January 2027 cohort.
            The cohort is strictly limited to 30 researchers.
          </p>

          {/* Error banner */}
          {state.message && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem 1.25rem',
                background: 'rgba(195, 21, 28, 0.1)',
                border: '1px solid var(--color-error)',
                borderRadius: '8px',
                color: 'var(--color-accent-bright)',
                fontSize: '0.95rem',
              }}
            >
              {state.message}
            </div>
          )}

          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* ── Personal Information ── */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={sectionHeadingStyle}>Personal Information</legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <label htmlFor="full_name" style={labelStyle}>Full Name *</label>
                  <input type="text" id="full_name" name="full_name" required style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="email" style={labelStyle}>Email Address *</label>
                  <input type="email" id="email" name="email" required style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="country" style={labelStyle}>Country of Residence</label>
                  <input type="text" id="country" name="country" style={inputStyle} />
                </div>
              </div>
            </fieldset>

            {/* ── Professional Background ── */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={sectionHeadingStyle}>Professional Background</legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <label htmlFor="professional_title" style={labelStyle}>Professional Title / Role</label>
                  <input
                    type="text"
                    id="professional_title"
                    name="professional_title"
                    placeholder="e.g. Principal Researcher, Postdoc"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="institution" style={labelStyle}>Institution / Organization</label>
                  <input type="text" id="institution" name="institution" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="department" style={labelStyle}>Department</label>
                  <input type="text" id="department" name="department" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="specialization" style={labelStyle}>Primary Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    placeholder="e.g. Behavioral Cybersecurity"
                    style={inputStyle}
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Online Profiles ── */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={sectionHeadingStyle}>Online Profiles</legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div>
                  <label htmlFor="orcid" style={labelStyle}>ORCID</label>
                  <input
                    type="text"
                    id="orcid"
                    name="orcid"
                    placeholder="0000-0000-0000-0000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="google_scholar_url" style={labelStyle}>Google Scholar URL</label>
                  <input type="url" id="google_scholar_url" name="google_scholar_url" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="linkedin_url" style={labelStyle}>LinkedIn URL</label>
                  <input type="url" id="linkedin_url" name="linkedin_url" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="website_url" style={labelStyle}>Personal Website URL</label>
                  <input type="url" id="website_url" name="website_url" style={inputStyle} />
                </div>
              </div>
            </fieldset>

            {/* ── Research Details ── */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={sectionHeadingStyle}>Research Details</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="research_interests" style={labelStyle}>
                    Research Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    id="research_interests"
                    name="research_interests"
                    placeholder="e.g. Usable Security, Social Engineering, Phishing"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="research_background" style={labelStyle}>Research Background Summary</label>
                  <textarea
                    id="research_background"
                    name="research_background"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label htmlFor="publications" style={labelStyle}>Key Publications (Top 3–5)</label>
                  <textarea
                    id="publications"
                    name="publications"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label htmlFor="current_projects" style={labelStyle}>Current Projects</label>
                  <textarea
                    id="current_projects"
                    name="current_projects"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Motivation & Expectations ── */}
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={sectionHeadingStyle}>Motivation &amp; Expectations</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="motivation" style={labelStyle}>
                    Why do you want to join the Elitech Hub Research Membership?
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label htmlFor="contribution" style={labelStyle}>
                    How do you plan to contribute to the cohort?
                  </label>
                  <textarea
                    id="contribution"
                    name="contribution"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label htmlFor="expectations" style={labelStyle}>
                    What are your expectations from this membership?
                  </label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Submit ── */}
            <div
              style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="submit"
                disabled={isPending}
                className="premium-button"
                style={{
                  opacity: isPending ? 0.6 : 1,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                }}
              >
                {isPending ? 'Submitting Application…' : 'Submit Application →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
