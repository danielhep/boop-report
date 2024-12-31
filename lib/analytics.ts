export function trackEvent(eventName: string, eventData?: Record<string, string | number | boolean>) {
    if (typeof window !== 'undefined' && typeof window.umami !== 'undefined') {
        window.umami.track(eventName, eventData);
    }
}

// Declare the umami type for TypeScript
declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
        };
    }
} 