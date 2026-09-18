'use client';

import { useEffect, useRef } from 'react';

export function ClientTracker({ event, params }: { event: string, params?: Record<string, any> }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current && typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event,
        ...params
      });
      tracked.current = true;
    }
  }, [event, params]);

  return null;
}
