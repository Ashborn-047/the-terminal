# Security Policy

## Supported Versions

The Terminal project actively supports security patches for the following major versions:

| Version | Supported          |
| ------- | ------------------ |
| v1.x    | :white_check_mark: |
| v0.x    | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within The Terminal (e.g., cross-site scripting vulnerabilities in the terminal emulator, unsafe local storage access, or unauthenticated SpacetimeDB interactions), please follow these steps:

1. **Do not open a public issue.** This gives malicious actors an opportunity to exploit the bug before we can patch it.
2. Please email `security@linux-terminal.academy` (placeholder) with a detailed description of the issue.
3. We will respond within 48 hours to acknowledge the report and provide an estimated timeline for the fix.

## Implementation Principles

The educational Terminal simulator relies on several specific security boundaries:

- **Browser Context Isolation:** The Virtual File System (VFS) is strictly limited to the browser's `localStorage` and memory. It *must never* attempt to interact with the host operating system's true filesystem.
- **Input Sanitization:** User commands submitted to the terminal component are stripped of malicious HTML tags. React naturally escapes injections in the terminal output display. 
- **SpacetimeDB Validation:** Future Rust backend modules (`spacetime-module`) must implement strict authentication checks. The client assumes the server is authoritative and does not trust data sent via the SpacetimeDB WebSocket without verification.
