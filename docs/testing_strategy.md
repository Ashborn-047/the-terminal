# Testing Strategy Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

This document outlines the testing strategy for **The Terminal**. A comprehensive testing approach ensures reliability, prevents regressions, and maintains code quality as the project grows. We cover **unit tests**, **integration tests**, **end‑to‑end (E2E) tests**, and **performance tests**, along with tooling, coverage goals, and CI integration.

---

## 2. Testing Levels

| **Level**          | **Scope**                                | **Tools**                          |
|---------------------|------------------------------------------|-------------------------------------|
| **Unit Tests**      | Individual functions, classes, commands  | Jest, React Testing Library (for hooks) |
| **Integration Tests** | Interactions between modules (VFS + commands, lab engine + SpacetimeDB) | Jest, Supertest (for reducers), custom test harness |
| **End‑to‑End Tests** | Full user flows in the browser           | Playwright / Cypress                |
| **Performance Tests** | Command execution speed, VFS operations | Jest benchmark, Lighthouse           |

---

## 3. Unit Testing

### 3.1 Command Unit Tests

Each command implementation should have its own test file. Tests cover:
- Correct output for various arguments and options.
- Error handling (invalid options, missing files, permission denied).
- Edge cases (empty directories, special characters in filenames).

**Example: `ls` command test (Jest)**

```typescript
// lib/commands/impl/__tests__/ls.test.ts

import { VFS } from '../../../vfs/VFS';
import { ls } from '../ls';

describe('ls command', () => {
  let vfs: VFS;
  let stdout: string[];
  let stderr: string[];

  beforeEach(() => {
    vfs = new VFS();
    stdout = [];
    stderr = [];
  });

  const runLs = (args: string[]) => {
    return ls({
      vfs,
      args: ['ls', ...args],
      stdout: (out) => stdout.push(out),
      stderr: (err) => stderr.push(err),
      env: {},
      user: 'guest',
      group: 'guest',
    });
  };

  test('lists files in current directory', () => {
    vfs.createFile('/home/file1.txt', 'content');
    vfs.createFile('/home/file2.txt', 'content');
    vfs.setCurrentDirectory('/home');

    const exitCode = runLs([]);

    expect(exitCode).toBe(0);
    expect(stdout.join(' ')).toContain('file1.txt');
    expect(stdout.join(' ')).toContain('file2.txt');
    expect(stderr).toEqual([]);
  });

  test('handles -a flag to show hidden files', () => {
    vfs.createFile('/home/.hidden', 'secret');
    vfs.createFile('/home/visible', 'data');
    vfs.setCurrentDirectory('/home');

    runLs([]);
    expect(stdout.join(' ')).not.toContain('.hidden');

    stdout = [];
    runLs(['-a']);
    expect(stdout.join(' ')).toContain('.hidden');
    expect(stdout.join(' ')).toContain('visible');
  });

  test('returns error for nonexistent path', () => {
    vfs.setCurrentDirectory('/home');
    const exitCode = runLs(['/nonexistent']);

    expect(exitCode).toBe(1);
    expect(stderr[0]).toMatch(/No such file or directory/);
  });
});
```

### 3.2 VFS Unit Tests

Test all VFS methods in isolation.

```typescript
// lib/vfs/__tests__/VFS.test.ts

import { VFS } from '../VFS';

describe('VFS', () => {
  let vfs: VFS;

  beforeEach(() => {
    vfs = new VFS();
  });

  test('creates a file', () => {
    expect(vfs.createFile('/home/test.txt', 'hello')).toBe(true);
    expect(vfs.exists('/home/test.txt')).toBe(true);
    expect(vfs.readFile('/home/test.txt')).toBe('hello');
  });

  test('prevents creating file in nonexistent directory', () => {
    expect(vfs.createFile('/no/such/file.txt')).toBe(false);
  });

  test('mkdir creates directory', () => {
    expect(vfs.mkdir('/newdir')).toBe(true);
    expect(vfs.isDirectory('/newdir')).toBe(true);
  });

  test('mkdir -p creates parent directories', () => {
    expect(vfs.mkdir('/a/b/c', true)).toBe(true);
    expect(vfs.isDirectory('/a/b/c')).toBe(true);
  });

  test('permission checks', () => {
    vfs.createFile('/file', 'data');
    vfs.chmod('/file', '600');
    vfs.setCurrentUser('guest');
    vfs.setCurrentGroup('guest');

    // guest cannot read file with permissions 600 (owner only)
    expect(vfs.readFile('/file')).toBeNull();
  });
});
```

### 3.3 Lab Engine Unit Tests

Test verification logic, hint system, and progress tracking.

```typescript
// lib/lab/__tests__/verification.test.ts

import { verifyDIYLab } from '../verification';
import { VFS } from '../../vfs/VFS';
import { loadLab } from '../loader';

describe('DIY lab verification', () => {
  let vfs: VFS;

  beforeEach(() => {
    vfs = new VFS();
  });

  test('verifies directory exists condition', () => {
    const lab = loadLab('hpc-env-setup-1');
    const condition = lab.verification.conditions[0]; // directory_exists

    // Initially fails
    let result = verifyDIYLab(lab, vfs);
    expect(result.success).toBe(false);
    expect(result.failedConditions).toContain('Create the simulation/data directory');

    // Create directory
    vfs.mkdir('/home/guest/simulation/data', true);
    result = verifyDIYLab(lab, vfs);
    expect(result.failedConditions).not.toContain('Create the simulation/data directory');
  });
});
```

### 3.4 Hook Unit Tests

Test custom hooks using React Testing Library.

```typescript
// hooks/__tests__/useTerminal.test.ts

import { renderHook, act } from '@testing-library/react';
import { useTerminal } from '../useTerminal';
import { VFS } from '../../lib/vfs/VFS';

jest.mock('../../lib/commands/executor', () => ({
  execute: jest.fn(),
}));

describe('useTerminal', () => {
  test('executes command and updates history', async () => {
    const vfs = new VFS();
    const { result } = renderHook(() => useTerminal(vfs));

    await act(async () => {
      result.current.setInput('ls');
      // simulate Enter key
      result.current.handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any);
    });

    // Assert that history includes input line
    expect(result.current.history).toContainEqual(
      expect.objectContaining({ type: 'input', content: 'ls' })
    );
    // executor mock would return output, but we need to mock it properly
  });
});
```

---

## 4. Integration Testing

### 4.1 Command + VFS Integration

Test commands that modify the VFS.

```typescript
// lib/commands/__tests__/integration.test.ts

import { execute } from '../executor';
import { registry } from '../index';
import { VFS } from '../../vfs/VFS';

describe('command integration', () => {
  let vfs: VFS;

  beforeEach(() => {
    vfs = new VFS();
    vfs.setCurrentDirectory('/');
  });

  test('mkdir then cd then pwd', async () => {
    await execute('mkdir testdir', vfs, registry);
    await execute('cd testdir', vfs, registry);
    const result = await execute('pwd', vfs, registry);
    expect(result.stdout.trim()).toBe('/testdir');
  });

  test('pipe and grep', async () => {
    vfs.createFile('/data.txt', 'apple\nbanana\ncherry');
    const result = await execute('cat /data.txt | grep a', vfs, registry);
    expect(result.stdout).toBe('apple\n');
  });
});
```

### 4.2 SpacetimeDB Reducer Integration

Test reducers by simulating client calls. We can use SpacetimeDB's in‑memory test instance.

```typescript
// spacetime/__tests__/reducers.test.ts

import { describe, it, beforeAll, expect } from 'vitest';
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';

describe('SpacetimeDB reducers', () => {
  let client: SpacetimeDBClient;

  beforeAll(async () => {
    client = new SpacetimeDBClient('ws://localhost:3000', 'test');
    await client.connect();
    // Optionally clear database before each test
  });

  it('registers a new user', async () => {
    const result = await client.reducers.registerUser('testuser');
    expect(result).toBeUndefined(); // no error

    // Query user table
    const users = await client.db.user.filter({ username: 'testuser' }).collect();
    expect(users.length).toBe(1);
    expect(users[0].level).toBe(1);
  });
});
```

### 4.3 Lab Engine + VFS + SpacetimeDB Integration

Test a complete lab flow from start to completion, including state sync.

---

## 5. End‑to‑End Testing

We use **Playwright** to simulate real user interactions in the browser.

### 5.1 Critical Flows

- User registration / login (SpacetimeDB identity)
- Starting a guided lab and completing steps
- Starting a DIY lab and verifying completion
- Using chat
- Navigating between pages

**Example: Lab completion E2E test**

```typescript
// e2e/lab.spec.ts

import { test, expect } from '@playwright/test';

test('complete guided lab', async ({ page }) => {
  await page.goto('/');
  // Assume user is already authenticated (mock identity)
  await page.click('text=Start Learning');
  await page.click('text=Filesystem Basics');
  
  // Step 1: pwd
  await page.fill('.terminal-input', 'pwd');
  await page.keyboard.press('Enter');
  await expect(page.locator('.terminal-output')).toContainText('/home/guest');
  
  // Step 2: ls
  await page.fill('.terminal-input', 'ls');
  await page.keyboard.press('Enter');
  await expect(page.locator('.terminal-output')).toContainText('Desktop');
  
  // Lab should be completed
  await expect(page.locator('.lab-completion-message')).toBeVisible();
  await expect(page.locator('.xp-gained')).toContainText('+50 XP');
});
```

### 5.2 Testing Environment

- Use a separate SpacetimeDB instance (e.g., in‑memory or dedicated test database).
- Reset state before each test run.
- Mock time for streak testing.

---

## 6. Performance Testing

### 6.1 Command Execution Benchmark

Measure how long it takes to execute a series of commands on a large VFS.

```typescript
// performance/commands.bench.ts

import { Suite } from 'benchmark';
import { VFS } from '../lib/vfs/VFS';
import { execute } from '../lib/commands/executor';
import { registry } from '../lib/commands';

const suite = new Suite();

suite.add('ls on large directory', async () => {
  const vfs = new VFS();
  for (let i = 0; i < 1000; i++) {
    vfs.createFile(`/file${i}.txt`, 'content');
  }
  vfs.setCurrentDirectory('/');
  await execute('ls', vfs, registry);
});
```

### 6.2 VFS Operation Throughput

Measure operations per second for common VFS methods.

---

## 7. Code Coverage Goals

| **Area**          | **Minimum Coverage** |
|--------------------|----------------------|
| VFS                | 90%                  |
| Commands           | 85%                  |
| Lab Engine         | 90%                  |
| SpacetimeDB reducers | 80%                |
| UI components      | 70%                  |
| Hooks              | 80%                  |

We use **Jest's `--coverage`** and integrate with CI to enforce thresholds.

---

## 8. CI Integration

All tests run automatically on every pull request via GitHub Actions (or similar).

**Workflow:**
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run coverage
```

We also run **linting** and **type checking** in CI.

---

## 9. Mocking Strategies

### 9.1 SpacetimeDB Client Mock

Create a mock client for unit tests that simulates reducer calls and subscriptions.

```typescript
// lib/spacetime/__mocks__/client.ts

export const client = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  reducers: {
    registerUser: jest.fn().mockResolvedValue({}),
    completeLab: jest.fn().mockResolvedValue({}),
  },
  db: {
    user: { subscribe: jest.fn() },
    message: { subscribe: jest.fn() },
  },
  identity: 'test-identity',
};
```

### 9.2 VFS Mock for Commands

For commands that don't rely heavily on VFS internals, we can inject a simple mock VFS.

---

## 10. Test Data Management

Store sample lab definitions and VFS snapshots in `src/test/fixtures/`.

- `labs/` – JSON lab files for testing.
- `vfs/` – serialized VFS snapshots.

---

## 11. Error Scenario Testing

Specifically test error conditions:
- Permission denied
- Command not found
- Invalid syntax
- Disk full (simulated)
- Concurrent modifications (if multiplayer)

---

## 12. Manual Testing Checklist

Before release, perform manual testing on:

- [ ] All labs (guided and DIY) complete successfully.
- [ ] Chat works across multiple browser tabs.
- [ ] Progress persists after refresh.
- [ ] Achievements unlock correctly.
- [ ] Streak increments/decrements as expected.
- [ ] Mobile/responsive layout (basic usability).

---

## 13. Tools & Commands

| **Command**               | **Purpose**                              |
|---------------------------|------------------------------------------|
| `npm run test`            | Run all unit and integration tests       |
| `npm run test:watch`      | Watch mode for development                |
| `npm run coverage`        | Generate coverage report                  |
| `npm run test:e2e`        | Run Playwright tests                      |
| `npm run test:e2e:ui`     | Open Playwright UI                         |
| `npm run benchmark`       | Run performance benchmarks                 |

---

## 14. Implementation Checklist

- [ ] Set up Jest with TypeScript and React Testing Library.
- [ ] Configure coverage thresholds.
- [ ] Set up Playwright.
- [ ] Create test fixtures.
- [ ] Write unit tests for all commands and VFS.
- [ ] Write integration tests for key flows.
- [ ] Write E2E tests for critical user journeys.
- [ ] Integrate with CI.
- [ ] Establish performance benchmarks.

---

**This document defines the testing strategy for the Linux Terminal Academy. All team members must write tests alongside feature development and ensure coverage goals are met.**
