/**
 * Tianji analytics event tracking.
 * Tracks user interactions beyond basic pageviews.
 * Tianji script at: https://numbers.trumpstein.me/tracker.js
 */

declare global {
  interface Window {
    tianji?: {
      track: (eventName: string, eventData?: Record<string, string | number>) => void;
    };
  }
}

export function trackEvent(name: string, data?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.tianji?.track) {
    window.tianji.track(name, data);
  }
}

// Pre-defined events for common interactions
export const analytics = {
  // Navigation
  navClick: (item: string) => trackEvent("nav_click", { item }),

  // Catalog
  entryView: (entryNumber: number, title: string) => trackEvent("entry_view", { entry: entryNumber, title: title.slice(0, 50) }),
  catalogSearch: (query: string) => trackEvent("catalog_search", { query: query.slice(0, 100) }),
  catalogFilter: (category: string) => trackEvent("catalog_filter", { category }),
  catalogPage: (page: number) => trackEvent("catalog_page", { page }),

  // Insights dashboard
  insightsSection: (section: string, view: string) => trackEvent("insights_nav", { section, view }),
  chartZoom: (chart: string) => trackEvent("chart_zoom", { chart }),
  chartCommentary: (chart: string) => trackEvent("chart_commentary", { chart }),

  // Trumpstein chatbot
  chatOpen: () => trackEvent("chat_open"),
  chatMessage: (messageLength: number) => trackEvent("chat_message", { length: messageLength }),
  chatEntryClick: (entryNumber: number) => trackEvent("chat_entry_click", { entry: entryNumber }),

  // Engagement
  sourceClick: (entryNumber: number, source: string) => trackEvent("source_click", { entry: entryNumber, source: source.slice(0, 80) }),
  shareClick: (platform: string, entryNumber: number) => trackEvent("share", { platform, entry: entryNumber }),
  donateClick: () => trackEvent("donate_click"),

  // Scroll depth
  scrollDepth: (percent: number, page: string) => trackEvent("scroll_depth", { percent, page }),

  // Trumpstein page
  activateChip: () => trackEvent("activate_chip"),

  // Time on page (fire on unload)
  timeOnPage: (seconds: number, page: string) => trackEvent("time_on_page", { seconds, page }),
};
