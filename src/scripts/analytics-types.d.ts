export {};
declare global {
  interface Window {
    pepcodexAnalytics?: {
      setConsent(value: boolean): void;
      readConsent(): { essential: boolean; analytics: boolean; timestamp: number } | null;
      track(name: string, params?: Record<string, unknown>): boolean;
    };
  }
}
