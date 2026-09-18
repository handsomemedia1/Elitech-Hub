/**
 * loading.tsx — Next.js App Router Streaming UI
 *
 * This file is a Next.js-EXCLUSIVE feature. When the page is loading via
 * React Suspense streaming, Next.js automatically shows this component
 * instead of a blank screen. You CANNOT do this in plain HTML.
 *
 * The page shell, metadata, and layout are streamed first, then the
 * full page content replaces this skeleton seamlessly without a flash.
 */

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#070d1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '2rem',
      zIndex: 9999,
      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
        Elitech<span style={{ color: '#c3151c' }}>Hub</span>
      </div>

      {/* Terminal window skeleton */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        borderRadius: '1rem',
        width: '340px',
        overflow: 'hidden',
      }}>
        {/* Terminal header */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c3151c' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            root@elitech:~# init.sh
          </span>
        </div>

        {/* Terminal body — lines shimmer in */}
        <div style={{ padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {[
            { label: '[BOOT]', text: 'Initializing secure kernel...', color: '#94a3b8', delay: '0s' },
            { label: '[CRYPTO]', text: 'AES-256: ENABLED', color: '#6ee7b7', delay: '0.3s' },
            { label: '[NET]', text: 'Ports 443, 22, 80... SECURE', color: '#6ee7b7', delay: '0.6s' },
            { label: '[IDS]', text: 'Intrusion detection: ACTIVE', color: '#67e8f9', delay: '0.9s' },
            { label: '[AUTH]', text: 'Certificate verified ✓', color: '#6ee7b7', delay: '1.2s' },
            { label: '[SYS]', text: 'Loading Elitech Hub...', color: '#c3151c', delay: '1.5s' },
          ].map(({ label, text, color, delay }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                opacity: 0,
                animation: `fadeTermLine 0.4s ease forwards`,
                animationDelay: delay,
              }}
            >
              <span style={{ color: '#c3151c', fontWeight: 700, flexShrink: 0 }}>{label}</span>
              <span style={{ color }}>{text}</span>
            </div>
          ))}

          {/* Blinking cursor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ color: '#c3151c', fontWeight: 700 }}>[SYS]</span>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: '#00ff41',
                animation: 'blink 1s step-end infinite',
                animationDelay: '1.8s',
                opacity: 0,
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #c3151c, #67e8f9)',
              borderRadius: '2px',
              animation: 'loadBar 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            ACCESS GRANTED
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeTermLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes loadBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
