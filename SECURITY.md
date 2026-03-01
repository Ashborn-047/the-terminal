# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in **The Terminal**, please report it responsibly.

### How to Report
- Email: [Create an issue with the "security" label](https://github.com/Ashborn-047/the-terminal/issues/new?labels=security)
- Please include a description of the vulnerability and steps to reproduce.

### Response Time
- We aim to acknowledge reports within **48 hours**
- We aim to publish fixes within **7 days** for critical issues

## Security Architecture

### Client-Side Security
The Terminal is a **client-side only** application. All code runs in the browser.

- **No real OS access**: The Virtual File System (VFS) is entirely simulated in-memory
- **Sandboxed commands**: Commands like `ping`, `curl`, `ssh` return simulated output — no real network requests
- **Input validation**: Username validation (3-20 chars, alphanumeric + underscore), command parsing with sanitization
- **No credential storage**: No passwords or tokens are stored; localStorage is used only for progress data
- **Content Security**: No `eval()` or dynamic code execution in command processing

### Command Sandboxing
All commands execute within an isolated VFS context:
- File operations only affect the virtual filesystem
- Network commands simulate responses without real HTTP/ICMP requests
- `sudo` elevates to a virtual `root` user (no system-level privilege escalation)
- Process commands (`ps`, `top`, `kill`) show simulated output

### Data Privacy
- All user data (progress, XP, achievements) stored in **localStorage only**
- No data transmitted to external servers (until backend is implemented)
- No analytics or tracking scripts
- No cookies

## Dependencies

| Package | Purpose | Risk Level |
|---------|---------|------------|
| React 18 | UI framework | Low |
| Vite | Build tool | Low |
| Zustand | State management | Low |
| React Router | Client routing | Low |
| Lucide React | Icons | Low |
| UUID | ID generation | Low |

## Future Security (When Backend Added)
When SpacetimeDB backend is implemented:
- WebSocket Secure (WSS) connections
- SpacetimeDB Identity-based authentication
- Reducer-level authorization checks
- Rate limiting on reducer calls
- Server-side input validation
- Audit logging for sensitive operations

## Best Practices for Contributors
1. Never use `eval()` or `Function()` constructors
2. Always validate/sanitize user input before processing
3. Use TypeScript strict mode for type safety
4. Keep dependencies up to date (`npm audit`)
5. Review command implementations for injection vulnerabilities
