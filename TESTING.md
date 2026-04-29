# Testing Guide

This project includes unit tests for the navbar JavaScript code using Jest.

## Installation

Install npm dependencies:

```bash
npm install
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are organized in `__tests__/navbar.test.js` and cover:

### 1. **Navbar Color Changes**
- ✅ Black colors when opening mobile menu
- ✅ White colors when closing menu at top of page
- ✅ Clear inline styles when closing after scrolling

### 2. **Toggler Icon**
- ✅ Change to X icon when menu expands
- ✅ Change to burger icon when menu collapses
- ✅ Reset to burger when closing on desktop

### 3. **Navbar Shrink (Scroll)**
- ✅ Add `navbar-shrink` class when scrolled
- ✅ Remove class when scrolling back to top
- ✅ Don't change when mobile menu is open
- ✅ Clear inline styles when scrolled

### 4. **Mobile to Desktop Transition**
- ✅ Close menu automatically on resize
- ✅ Reset colors correctly
- ✅ Reset icon to burger
- ✅ Reset icon when returning to mobile after desktop

### 5. **Close Menu at Different Scroll Positions**
- ✅ Update navbar-shrink when closing with scroll down
- ✅ Keep white colors when closing at top
- ✅ Handle scroll up after closing

### 6. **Solid Navbar (No Hero Image)**
- ✅ Don't apply shrink behavior
- ✅ Don't update colors on onHide

### 7. **Dropdown Behavior**
- ✅ Remove data-bs-toggle on desktop
- ✅ Add data-bs-toggle on mobile
- ✅ Stop propagation on desktop

### 8. **Back to Top Button**
- ✅ Show after scroll threshold
- ✅ Hide before scroll threshold

## Regression Cases Prevented

These tests prevent bugs found during development:

1. **Bug**: Open menu visible when switching from mobile to desktop
   - **Test**: `should close menu when resizing from mobile to desktop`

2. **Bug**: X icon persists when returning to mobile after resize
   - **Test**: `should reset icon to burger when closing menu on resize`

3. **Bug**: X icon persists after mobile → desktop → mobile transition
   - **Test**: `should reset icon to burger when returning to mobile after desktop`

4. **Bug**: Incorrect colors when scrolling with closed menu
   - **Test**: `should clear inline styles when scrolled`

5. **Bug**: Navbar doesn't update when closing menu after scroll
   - **Test**: `should update navbar-shrink and colors when closing menu with scroll down`

6. **Bug**: Scrolling with open menu causes style conflicts
   - **Test**: `should not change navbar-shrink when mobile menu is open`

## Code Coverage

The goal is to maintain >90% coverage in:
- Statements
- Branches
- Functions
- Lines

See full report in `coverage/index.html` after running:
```bash
npm run test:coverage
```

## CI/CD

To integrate these tests in your pipeline:

```yaml
# Example for GitHub Actions
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Dependencies and Security

The project uses the following updated versions:

- **Jest**: ^30.0.0 (latest version, no vulnerabilities)
- **jest-environment-jsdom**: ^30.0.0
- **@testing-library/dom**: ^10.4.0
- **@testing-library/jest-dom**: ^6.6.3

All dependencies are kept up to date to avoid:
- Deprecated packages (inflight, old glob, whatwg-encoding, abab, domexception)
- Known security vulnerabilities

To check security status:
```bash
npm audit
```

To update dependencies:
```bash
npm update
npm audit fix
```
