/**
 * Logger utility — per error_handling_logging.md §4.1
 * Structured logging with levels. In dev: console. In prod: could forward to Sentry.
 */
const isDev = import.meta.env.DEV;

export const logger = {
    debug: (...args: unknown[]) => isDev && console.debug('[DEBUG]', ...args),
    info: (...args: unknown[]) => console.info('[INFO]', ...args),
    warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
    error: (...args: unknown[]) => {
        console.error('[ERROR]', ...args);
        // In production, forward to Sentry/external service
    },
};
