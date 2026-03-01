import { logger } from './logger';

/**
 * A simulated Sentry-like utility for error tracking.
 * This aligns with Doc 11 §8.2, providing a foundation for real Sentry integration
 * while using our persistent logger as a fallback.
 */
class SentrySimulator {
    private dsn: string | undefined;

    init(options: { dsn?: string; tracesSampleRate?: number }) {
        this.dsn = options.dsn;
        logger.info('Sentry initialized (simulated)', { dsn: this.dsn });
    }

    captureException(error: Error | string, context: Record<string, unknown> = {}) {
        const message = error instanceof Error ? error.message : error;
        const stack = error instanceof Error ? error.stack : undefined;

        // In a real app, this would send to Sentry.
        // For now, we route it to our SECURITY audit log and regular error log.
        logger.error(`[SENTRY_EXCEPTION] ${message}`, {
            stack,
            ...context,
            sentry_simulated: true
        });

        // If it's a critical error, we also log it as a security event for visibility in dashboard
        if (context.critical) {
            logger.security('CRITICAL_EXCEPTION', { message, ...context });
        }
    }

    captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
        logger.info(`[SENTRY_MESSAGE] ${message}`, { level });
    }
}

export const Sentry = new SentrySimulator();
