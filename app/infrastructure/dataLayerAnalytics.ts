import type { AnalyticsEvent, AnalyticsTracker } from '~/domain/form/ports'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * Pushes events to window.dataLayer, the queue Google Tag Manager reads, so a
 * real GTM container could forward them to GA4 without code changes. Also logs
 * them in development to make the A/B test easy to follow.
 */
export class DataLayerAnalytics implements AnalyticsTracker {
  track(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return
    const { name, ...params } = event
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({ event: name, ...params })
    if (import.meta.dev) console.info(`[analytics] ${name}`, params)
  }
}
