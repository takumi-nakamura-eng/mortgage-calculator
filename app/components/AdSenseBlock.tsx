'use client';

import { useEffect, useRef } from 'react';
import { trackAdClick, trackAdImpression } from '@/lib/analytics/events';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

export default function AdSenseBlock({
  slot,
  format = 'auto',
  className,
  pageType = 'unknown',
  label = 'スポンサーリンク',
}: {
  slot?: string;
  format?: AdFormat;
  className?: string;
  pageType?: string;
  label?: string;
}) {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedImpressionRef = useRef(false);

  useEffect(() => {
    if (!enabled || !client || !slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // no-op on ad-blocked environments
    }
  }, [enabled, client, slot]);

  useEffect(() => {
    if (!enabled || !slotRef.current || !slot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!hasTrackedImpressionRef.current && entry.isIntersecting) {
            hasTrackedImpressionRef.current = true;
            trackAdImpression({ slot, pageType });
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(slotRef.current);
    return () => observer.disconnect();
  }, [enabled, pageType, slot]);

  if (!enabled || !client || !slot) return null;

  return (
    <aside
      ref={slotRef}
      className={`ad-slot ${className ?? ''}`.trim()}
      aria-label={label}
      onClickCapture={() => trackAdClick({ slot, pageType })}
    >
      <p className="ad-slot__label">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 280 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
