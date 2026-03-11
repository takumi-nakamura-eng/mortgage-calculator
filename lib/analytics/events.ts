'use client';

import { sendGAEvent } from '@next/third-parties/google';

type RelatedDestinationType = 'article' | 'tool';

function safeSend(eventName: string, params: Record<string, string | number>) {
  try {
    sendGAEvent('event', eventName, params);
  } catch {
    // no-op when GA script is unavailable
  }
}

function isAdsenseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
}

export function trackToolCalculate(payload: {
  toolId: string;
  category: string;
}) {
  safeSend('tool_calculate', {
    tool_id: payload.toolId,
    category: payload.category,
  });
}

export function trackPdfExport(payload: {
  toolId: string;
  toolName: string;
}) {
  safeSend('pdf_export', {
    tool_id: payload.toolId,
    tool_name: payload.toolName,
  });
}

export function trackArticleOpen(payload: {
  slug: string;
  category: string;
}) {
  safeSend('article_open', {
    article_slug: payload.slug,
    category: payload.category,
  });
}

export function trackRelatedClick(payload: {
  source: string;
  destinationType: RelatedDestinationType;
  destinationId: string;
}) {
  safeSend('related_click', {
    source: payload.source,
    destination_type: payload.destinationType,
    destination_id: payload.destinationId,
  });
}

export function trackAdImpression(payload: { slot: string; pageType: string }) {
  if (!isAdsenseEnabled()) return;
  safeSend('ad_impression', {
    slot: payload.slot,
    page_type: payload.pageType,
  });
}

export function trackAdClick(payload: { slot: string; pageType: string }) {
  if (!isAdsenseEnabled()) return;
  safeSend('ad_click', {
    slot: payload.slot,
    page_type: payload.pageType,
  });
}

export function trackScroll75(payload: { pageType: string; slug: string }) {
  safeSend('scroll_75', {
    page_type: payload.pageType,
    slug: payload.slug,
  });
}

export function trackOutboundClick(payload: {
  url: string;
  source: string;
}) {
  safeSend('outbound_click', {
    url: payload.url,
    source: payload.source,
  });
}
