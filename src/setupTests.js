// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock do FileReader para testes de upload
class MockFileReader {
  onloadend = null;
  result = null;

  readAsDataURL(file) {
    this.result = `data:${file.type};base64,test`;
    if (this.onloadend) {
      this.onloadend();
    }
  }
}

global.FileReader = MockFileReader;

// Mock do URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

// Mock do URL.revokeObjectURL
global.URL.revokeObjectURL = jest.fn();

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
