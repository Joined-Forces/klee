/// <reference types="jest" />

// Mock browser APIs that aren't available in Node.js
global.Path2D = jest.fn().mockImplementation((path) => ({ path }));
