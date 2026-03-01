/**
 * Logger utility — per error_handling_logging.md §4.1
 * Structured logging with levels. In dev: console. In prod: could forward to Sentry.
 */
const MAX_LOGS = 100;

const persistLog = (level: string, ...args: unknown[]) => {
    try {
        const logs = JSON.parse(localStorage.getItem('the-terminal-logs') || '[]');
        logs.push({
            timestamp: new Date().toISOString(),
            level,
            message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
        });
        if (logs.length > MAX_LOGS) logs.shift();
        localStorage.setItem('the-terminal-logs', JSON.stringify(logs));
    } catch (e) {
        // Silently fail if localStorage is full or unavailable
    }
};

export const logger = {
    debug: (...args: unknown[]) => {
        // @ts-ignore - Vite environment check
        if (import.meta.env?.DEV) console.debug('[DEBUG]', ...args);
        persistLog('DEBUG', ...args);
    },
    info: (...args: unknown[]) => {
        console.info('[INFO]', ...args);
        persistLog('INFO', ...args);
    },
    warn: (...args: unknown[]) => {
        console.warn('[WARN]', ...args);
        persistLog('WARN', ...args);
    },
    error: (...args: unknown[]) => {
        console.error('[ERROR]', ...args);
        persistLog('ERROR', ...args);
    },
};
