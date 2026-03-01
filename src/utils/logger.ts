/**
 * Logger utility — per error_handling_logging.md §4.1, §4.3
 * Structured logging with levels.
 */

const MAX_LOGS = 100;
const SESSION_ID = Math.random().toString(36).substring(2, 10);

interface LogEntry {
    timestamp: string;
    level: string;
    sessionId: string;
    message: string;
    data?: any;
}

const persistLog = (level: string, args: unknown[]) => {
    try {
        const logs: LogEntry[] = JSON.parse(localStorage.getItem('the-terminal-logs') || '[]');

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            sessionId: SESSION_ID,
            message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
        };

        logs.push(entry);
        if (logs.length > MAX_LOGS) logs.shift();
        localStorage.setItem('the-terminal-logs', JSON.stringify(logs));
    } catch (e) {
        // Silently fail if localStorage is full or unavailable
    }
};

export const logger = {
    debug: (...args: unknown[]) => {
        // @ts-ignore - Vite environment check
        if (import.meta.env?.DEV) console.debug(`[DEBUG] [SID:${SESSION_ID}]`, ...args);
        persistLog('DEBUG', args);
    },
    info: (...args: unknown[]) => {
        console.info(`[INFO] [SID:${SESSION_ID}]`, ...args);
        persistLog('INFO', args);
    },
    warn: (...args: unknown[]) => {
        console.warn(`[WARN] [SID:${SESSION_ID}]`, ...args);
        persistLog('WARN', args);
    },
    error: (...args: unknown[]) => {
        console.error(`[ERROR] [SID:${SESSION_ID}]`, ...args);
        persistLog('ERROR', args);
    },
    security: (action: string, ...args: unknown[]) => {
        console.warn(`[SECURITY] [SID:${SESSION_ID}] [ACTION:${action}]`, ...args);
        persistLog('SECURITY', [action, ...args]);
    }
};

// Initial log to verify system is up
logger.info('Logging system initialized. Session started.');
