import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Fix for SpacetimeDB or other browser-only stuff
global.window = global.window || {};
