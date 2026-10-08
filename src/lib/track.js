export const track = (event, params = {}) => {
  if (typeof window === 'undefined') return;
  
  try {
    window.fbq?.('track', event, params);
    window.gtag?.('event', event, params);
  } catch (error) {
    console.warn('[Analytics] Failed to send event:', event, error);
  }
};
