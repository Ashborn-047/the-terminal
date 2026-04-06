# Error Handling & Logging Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

Robust error handling and logging are essential for a smooth user experience, quick debugging, and long‑term maintainability. This document covers:

- **Client‑side error handling** (React error boundaries, graceful degradation)
- **Server‑side error handling** (SpacetimeDB reducer errors, validation)
- **Logging strategy** (client logs, server logs, structured logging)
- **Monitoring and alerting** (Sentry, Prometheus, log aggregation)
- **User‑facing error messages** (clear, actionable, non‑technical where possible)

---

## 2. Client‑Side Error Handling

### 2.1 React Error Boundaries

Wrap major sections of the application with error boundaries to prevent a single component crash from taking down the whole UI.

```tsx
// components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry or logging service
    console.error('Uncaught error:', error, errorInfo);
    // You could also send to an external logging endpoint
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border-2 border-brutal-red bg-brutal-dark text-brutal-white">
          <h2 className="font-heading text-xl">Something went wrong</h2>
          <p className="mt-2">Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 border-2 border-brutal-white px-4 py-2"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage:**
```tsx
<ErrorBoundary>
  <Terminal />
</ErrorBoundary>
```

Place boundaries around:
- The terminal itself
- Chat component
- Lab instructions panel
- Dashboard widgets

### 2.2 Handling SpacetimeDB Connection Errors

SpacetimeDB connection may drop or fail. We provide a connection status indicator and automatic reconnection.

```tsx
// hooks/useSpacetimeConnection.ts

import { useEffect, useState } from 'react';
import { client } from '../lib/spacetime/client';

export function useSpacetimeConnection() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');

  useEffect(() => {
    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onError = (err: any) => {
      console.error('SpacetimeDB error', err);
      setStatus('error');
    };

    client.on('connect', onConnect);
    client.on('disconnect', onDisconnect);
    client.on('error', onError);

    client.connect();

    return () => {
      client.off('connect', onConnect);
      client.off('disconnect', onDisconnect);
      client.off('error', onError);
      client.disconnect();
    };
  }, []);

  return status;
}
```

Show a banner when disconnected:
```tsx
{status !== 'connected' && (
  <div className="bg-brutal-yellow text-brutal-black p-2 text-center">
    ⚠️ Connection lost. Attempting to reconnect...
  </div>
)}
```

### 2.3 Command Execution Errors

When a command fails, we show the error in the terminal (stderr) but also optionally log to console.

```typescript
// In executeCommand
try {
  const result = await execute(input, vfs, registry);
  if (result.stderr) {
    // Already shown in terminal; no extra action needed
  }
} catch (err) {
  // Unexpected error (e.g., parser crash)
  console.error('Command execution failed', err);
  addToHistory({ type: 'error', content: 'Internal error. Please try again.' });
}
```

### 2.4 Reducer Call Errors

When calling a SpacetimeDB reducer, we catch errors and show a user-friendly toast.

```typescript
// lib/spacetime/reducerWrapper.ts

export async function callReducer<T>(name: string, ...args: any[]): Promise<T> {
  try {
    const result = await client.reducers[name](...args);
    return result;
  } catch (err) {
    console.error(`Reducer ${name} failed`, err);
    // Show toast notification
    showToast({
      title: 'Error',
      message: err.message || 'Something went wrong',
      type: 'error',
    });
    throw err; // re-throw if caller needs to handle
  }
}
```

### 2.5 API and Network Errors

For any external API calls (none currently, but future), use try/catch and show appropriate messages.

---

## 3. Server‑Side Error Handling (SpacetimeDB Reducers)

### 3.1 Reducer Error Patterns

Reducers should validate inputs and return `Result` types (or throw) appropriately.

```rust
#[spacetimedb(reducer)]
pub fn register_user(ctx: &ReducerContext, username: String) -> Result<(), String> {
    // Validate
    if username.len() < 3 {
        return Err("Username must be at least 3 characters".to_string());
    }
    if ctx.db.user().username().find(&username).is_some() {
        return Err("Username already taken".to_string());
    }
    
    // Insert
    ctx.db.user().insert(User {
        identity: ctx.sender,
        username,
        level: 1,
        xp: 0,
        streak: 0,
        // ...
    });
    
    Ok(())
}
```

### 3.2 Panic Handling

If a reducer panics, SpacetimeDB will catch it and return an error to the client. However, we should avoid panics by using `Result` and proper error handling.

### 3.3 Logging from Reducers

SpacetimeDB reducers can log using the `log` crate. These logs are captured in the server's stdout.

```rust
use log::{info, warn, error};

#[spacetimedb(reducer)]
pub fn complete_lab(ctx: &ReducerContext, lab_id: String) -> Result<(), String> {
    info!("User {} completed lab {}", ctx.sender, lab_id);
    // ...
}
```

### 3.4 Idempotency and Retry

Some reducers (like awarding XP) should be idempotent to prevent double counting if a client retries.

---

## 4. Logging Strategy

### 4.1 Client‑Side Logging

We use a structured logging approach. In development, logs go to console. In production, we send important logs to an external service (Sentry, LogRocket, etc.).

**Log levels:**
- `debug` – verbose information (only in dev)
- `info` – normal operations (lab started, lab completed)
- `warn` – unexpected but recoverable (connection loss, retry)
- `error` – failures that need investigation

**Logging utility:**

```typescript
// utils/logger.ts

const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => isDev && console.debug('[DEBUG]', ...args),
  info: (...args: any[]) => console.info('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(args[0] instanceof Error ? args[0] : new Error(args.join(' ')));
    }
  },
};
```

### 4.2 Server‑Side Logging

SpacetimeDB logs to stdout. In a production environment, we should collect these logs and forward them to a centralized logging system (e.g., Loki, ELK, Datadog).

**Log format suggestion (JSON):**
```json
{
  "timestamp": "2025-04-08T12:00:00Z",
  "level": "info",
  "target": "module::reducer",
  "message": "User completed lab",
  "fields": {
    "identity": "...",
    "lab_id": "filesystem-1"
  }
}
```

We can achieve this by using a custom logging format in the SpacetimeDB module (by setting `RUST_LOG` environment variable and using a JSON formatter like `json_env_logger`).

### 4.3 Structured Fields

Include relevant metadata in logs:
- `user_id` (SpacetimeDB identity)
- `session_id` (if applicable)
- `lab_id`
- `command` (for command execution logs)

### 4.4 Privacy Considerations

Do not log sensitive information:
- Passwords (never sent anyway)
- Private chat messages (unless flagged for moderation)
- User IP addresses (if not necessary)

---

## 5. Monitoring & Alerting

### 5.1 Client‑Side Monitoring with Sentry

Sentry captures JavaScript errors and provides stack traces, user context, and breadcrumbs.

**Setup:**
```typescript
// main.tsx
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // adjust in production
  environment: import.meta.env.MODE,
  beforeSend(event) {
    // Filter out expected errors (e.g., user aborted navigation)
    if (event.exception?.values?.[0]?.value?.includes('AbortError')) {
      return null;
    }
    return event;
  },
});
```

**Add user context:**
```typescript
Sentry.setUser({ id: client.identity });
```

### 5.2 Server‑Side Metrics

SpacetimeDB exposes Prometheus metrics at `/metrics`. We can scrape these and set up alerts:

- `spacetimedb_connected_clients` – alert if drops to zero unexpectedly
- `spacetimedb_reducer_call_count` – monitor unusual spikes
- `spacetimedb_database_size` – track growth

**Alert examples:**
- High error rate on reducers
- Connection count > threshold (scaling needed)
- Database size > 80% capacity

### 5.3 Health Checks

Set up a simple health check endpoint (maybe a dedicated reducer) that returns 200 if the module is healthy. Use external monitoring (UptimeRobot, Better Stack) to ping the WebSocket endpoint periodically.

---

## 6. User‑Facing Error Messages

Guidelines for error messages:

- **Be clear and calm** – avoid technical jargon unless the user is expected to understand it (e.g., terminal errors are fine).
- **Suggest a fix** – if possible, tell the user what to do.
- **Avoid blaming the user** – use "we couldn't..." instead of "you made a mistake".
- **Include error codes** for support (e.g., "Error code: E1001").

**Examples:**

| **Situation** | **Message** |
|---------------|-------------|
| SpacetimeDB connection lost | "Connection lost. Reconnecting..." |
| Reducer validation error | "Username already taken. Please choose another." |
| Command not found | "Command not found. Type `help` for available commands." |
| Permission denied (VFS) | "Permission denied. You don't have access to that file." |
| Lab verification failed | "Not quite. Check the instructions and try again." |

---

## 7. Debugging Tools

### 7.1 Developer Overlay

In development, provide a small overlay that shows:
- SpacetimeDB connection status
- Current user identity
- Current VFS snapshot (maybe)
- Reducer call history

This helps during development and testing.

### 7.2 Reducer Logs in Console

When in development mode, we can log all reducer calls and responses:

```typescript
if (isDev) {
  client.on('reducerCalled', (name, args) => {
    console.log(`Reducer called: ${name}`, args);
  });
}
```

---

## 8. Implementation Checklist

- [ ] Set up ErrorBoundary components around key UI areas.
- [ ] Implement connection status hook and banner.
- [ ] Integrate Sentry with correct DSN for production.
- [ ] Create logger utility with levels and production forwarding.
- [ ] Add structured logging in reducers.
- [ ] Set up Prometheus metrics endpoint and basic alerts.
- [ ] Write user-friendly error messages for common failures.
- [ ] Test error scenarios manually (disconnect, invalid commands, etc.).

---

**This document provides a comprehensive approach to error handling and logging. All team members should follow these guidelines to ensure a robust and maintainable system.**
