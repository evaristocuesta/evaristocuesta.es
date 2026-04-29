module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'wwwroot/js/**/*.js',
    '!wwwroot/js/**/*.test.js',
    '!wwwroot/js/**/*.backup.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  modulePathIgnorePatterns: [
    '<rootDir>/bin/',
    '<rootDir>/obj/',
    '<rootDir>/node_modules/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/bin/',
    '/obj/'
  ]
};
