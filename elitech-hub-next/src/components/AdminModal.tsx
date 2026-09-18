'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * AdminModal — renders children into document.body via a React Portal,
 * completely escaping the dashboard's `position: fixed; z-index: 1000`
 * stacking context so the overlay always appears on top.
 */
export default function AdminModal({
  onClose,
  children,
}: {
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const portalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRoot.current = document.body;
  }, []);

  if (typeof window === 'undefined') return null;

  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2.5rem 1rem 4rem',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ margin: 'auto', width: '100%' }}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
