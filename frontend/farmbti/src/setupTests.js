import '@testing-library/jest-dom';
import { vi } from 'vitest';

// localStorage 모킹
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// URL 변경 방지를 위한 window.location 모킹 (필요 시)
const mockLocation = {
  assign: vi.fn(),
  replace: vi.fn()
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// 테스트 후 모킹 초기화
afterEach(() => {
  vi.resetAllMocks();
  localStorageMock.clear();
});