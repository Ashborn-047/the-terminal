/**
 * analytics.ts — §8 Analytics
 * Simple utility to simulate event tracking for onboarding and lab completion.
 */

type AnalyticsEvent =
    | 'onboarding_started'
    | 'onboarding_step_1_complete'
    | 'onboarding_step_2_complete'
    | 'onboarding_step_3_complete'
    | 'onboarding_completed'
    | 'lab_started'
    | 'lab_completed'
    | 'achievement_unlocked';

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
    // In a real app, this would send data to Mixpanel, PostHog, or SpacetimeDB
    const timestamp = new Date().toISOString();
    console.log(`[ANALYTICS] ${timestamp} - ${event}`, properties || '');

    // Potential for future SpacetimeDB integration here:
    // if (connected) callReducer('track_event', { event, properties, timestamp });
};
