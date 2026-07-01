import '@testing-library/jest-dom';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock localStorage before tests run
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Define localStorage on globalThis for test environment
if (typeof globalThis !== 'undefined') {
  (globalThis as typeof globalThis & { localStorage: Storage }).localStorage = localStorageMock as Storage;
}

// Setup before each test
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
