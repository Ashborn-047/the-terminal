# Dependency Audit

## Executive Summary
This document outlines the findings of the dependency audit performed against the `package.json` file. Several critical and high-severity vulnerabilities were discovered that pose significant security risks, particularly if the platform scales to support multi-tenant or server-side execution environments.

## 6.1 — High Severity Vulnerabilities (CVEs)

The following packages require immediate updates (`npm audit fix`):

### 1. [P0] `lodash` (<=4.17.23)
- **Vulnerability**: Prototype Pollution via `_.unset` and `_.omit`, and Code Injection via `_.template`.
- **Impact**: Prototype pollution can lead to Denial of Service or Remote Code Execution if user-supplied data reaches these lodash functions. Given the terminal processes arbitrary user string inputs, this is a highly critical vector.

### 2. [P0] `tar` (<=7.5.10)
- **Vulnerability**: Hardlink and Symlink Path Traversal via Drive-Relative Linkpath.
- **Impact**: While the terminal uses a simulated VFS, if the Node backend or any build scripts use this package to extract archives, an attacker could write files outside the intended directory.

### 3. [P0] `undici` (7.0.0 - 7.23.0)
- **Vulnerability**: Multiple severe issues including HTTP Request/Response Smuggling, Unbounded Memory Consumption leading to DoS, and CRLF Injection.
- **Impact**: Used heavily by networking libraries (like `jsdom` during testing, or potentially by SpacetimeDB clients). DoS vectors via memory exhaustion are highly critical for browser stability and backend connection pooling.

## 6.2 — Moderate Severity Vulnerabilities

### 4. [P1] `vite` (6.0.0 - 6.4.0)
- **Vulnerability**: Server file system path traversal bypasses and HTML file scope issues.
- **Impact**: While largely a development-time tool, if the Vite dev server is exposed or used in a pseudo-production capacity (e.g., live preview environments), attackers could read sensitive source code files. Update to `6.4.1` required.

### 5. [P1] `yaml` (1.0.0 - 1.10.2)
- **Vulnerability**: Stack Overflow via deeply nested YAML collections.
- **Impact**: If the application ever parses user-provided YAML (e.g., for custom lab configurations or CI/CD simulation), an attacker can crash the parsing thread.

## 6.3 — Dependency Modernization Strategy

- **SpacetimeDB SDK**: The package `@clockworklabs/spacetimedb-sdk@2.0.0` is deprecated. Import paths must be migrated to the modern `spacetimedb` package to receive future security patches.
- **Audit Automation**: Integrate `npm audit --audit-level=high` into the CI/CD pipeline (`.github/workflows`) to fail the build if high-severity CVEs are introduced.