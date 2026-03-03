import * as Sentry from "@sentry/react";
import { logger } from './logger';

/**
 * Production-ready Sentry integration.
 * Wraps @sentry/react to provide consistent logging fallback.
 */
export const initSentry = () => {
    if (import.meta.env.PROD) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN || "https://placeholder@sentry.io/450",
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
        logger.info('Sentry initialized (production mode)');
    } else {
        logger.info('Sentry initialized (dev mode - skipping network)');
    }
};

export { Sentry };
