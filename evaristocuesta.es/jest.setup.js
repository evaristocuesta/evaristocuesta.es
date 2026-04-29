require('@testing-library/jest-dom');

// Mock Bootstrap's Collapse API
global.bootstrap = {
  Collapse: {
    getInstance: jest.fn()
  }
};
