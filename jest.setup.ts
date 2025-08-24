// jest.setup.ts or setupTests.ts
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: () => false,
});

import '@testing-library/jest-dom';
import 'jest-environment-jsdom';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
// jest.setup.ts

// Mock scrollIntoView for Radix UI in JSDOM
window.HTMLElement.prototype.scrollIntoView = function() {};
