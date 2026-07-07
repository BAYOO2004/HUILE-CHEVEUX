/**
 * Utility for Meta (Facebook) Pixel integration
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Default/fallback Meta Pixel ID (can be overridden by VITE_META_PIXEL_ID environment variable)
const DEFAULT_PIXEL_ID = 'YOUR_META_PIXEL_ID_HERE';

export const getMetaPixelId = (): string => {
  return import.meta.env.VITE_META_PIXEL_ID || DEFAULT_PIXEL_ID;
};

/**
 * Initializes the Meta Pixel script dynamically
 */
export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;

  const pixelId = getMetaPixelId();
  if (!pixelId || pixelId === 'YOUR_META_PIXEL_ID_HERE') {
    console.log('[Meta Pixel] No valid VITE_META_PIXEL_ID provided. Running in debug/mock mode.');
    return;
  }

  if (window.fbq) return;

  const fbq = function(...args: any[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };

  // Assign functions
  fbq.callMethod = undefined;
  fbq.queue = [] as any[];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';

  if (!window._fbq) {
    window._fbq = fbq;
  }
  window.fbq = fbq;

  // Insert base script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  // Initialize
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
  console.log(`[Meta Pixel] Initialized successfully with ID: ${pixelId}`);
};

/**
 * Tracks a custom or standard Meta Pixel event
 * @param eventName Name of the event (e.g., PageView, InitiateCheckout, Purchase)
 * @param params Optional event parameters (e.g., price, currency)
 */
export const trackMetaEvent = (eventName: string, params?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
  } else {
    console.log(`[Meta Pixel Log] Mock tracking event: ${eventName}`, params);
  }
};
