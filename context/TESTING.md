# 🎭 Explora Testing Guide

## Overview

This guide outlines our testing approach for Explora, focusing on practical, maintainable tests that help us ship with confidence. As a solo developer project, we prioritize high-impact tests that catch real issues.

## 🎯 Testing Philosophy

- **Start Simple:** Focus on critical user paths first
- **Practical Coverage:** Test what matters to users
- **Quick Feedback:** Fast-running tests that help, not hinder
- **Visual Verification:** Use screenshots for UI changes
- **Real Browser Testing:** Catch actual user-facing issues

## 🛠️ Testing Stack

- **Framework:** Playwright
- **Approach:** End-to-end testing
- **Browsers:** Chromium (primary), Firefox & WebKit (secondary)
- **CI Integration:** GitHub Actions (upcoming)

## 📁 Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth/              # Authentication flows
│   ├── locations/         # Location browsing & details
│   ├── trips/             # Trip creation & management
│   └── navigation/        # App navigation
├── components/            # Component-specific tests
└── utils/                # Test utilities & helpers
```

## 🚀 Getting Started

1. **Setup:**
   ```bash
   # Install dependencies
   npm install

   # Run tests
   npm test              # Run all tests
   npm run test:ui      # Open test UI
   npm run test:debug   # Debug mode
   ```

2. **Writing Your First Test:**
   ```typescript
   // tests/e2e/navigation/basic-navigation.spec.ts
   import { test, expect } from '@playwright/test';

   test('user can navigate to main sections', async ({ page }) => {
     await page.goto('/');
     
     // Check navigation elements
     await expect(page.getByRole('navigation')).toBeVisible();
     
     // Click through main sections
     await page.click('text=Trips');
     await expect(page).toHaveURL(/.*trips/);
   });
   ```

## 🎯 What to Test

### Priority 1: Critical Paths
- ✅ User authentication (sign in/out)
- ✅ Location browsing & search
- ✅ Trip creation & saving
- ✅ Basic navigation

### Priority 2: Key Features
- ✅ Location details view
- ✅ Favorites system
- ✅ Map interactions
- ✅ User settings

### Priority 3: Edge Cases
- ⏳ Offline functionality
- ⏳ Error states
- ⏳ Loading states
- ⏳ Form validation

## 📝 Testing Guidelines

1. **Keep Tests Simple:**
   ```typescript
   // ✅ Good: Clear, focused test
   test('shows location details', async ({ page }) => {
     await page.goto('/locations/123');
     await expect(page.getByRole('heading')).toBeVisible();
     await expect(page.getByText('Description')).toBeVisible();
   });
   ```

2. **Test User Flows:**
   ```typescript
   // ✅ Good: Tests real user behavior
   test('can add location to favorites', async ({ page }) => {
     await page.goto('/locations/123');
     await page.click('[aria-label="Add to favorites"]');
     await expect(page.getByText('Added to favorites')).toBeVisible();
   });
   ```

3. **Visual Testing:**
   ```typescript
   // ✅ Good: Visual regression test
   test('location card appears correctly', async ({ page }) => {
     await page.goto('/locations');
     await expect(page.getByTestId('location-card')).toHaveScreenshot();
   });
   ```

## 🐛 Debugging Tests

1. **Use Test UI:**
   ```bash
   npm run test:ui
   ```

2. **Debug Mode:**
   ```bash
   npm run test:debug
   ```

3. **View Test Report:**
   ```bash
   npx playwright show-report
   ```

## 🎨 Best Practices

1. **Organize Tests Logically:**
   - Group related tests in folders
   - Use clear, descriptive file names
   - Keep test files focused

2. **Use Page Objects:**
   ```typescript
   // tests/utils/pages/HomePage.ts
   export class HomePage {
     constructor(private page: Page) {}
     
     async navigate() {
       await this.page.goto('/');
     }
     
     async searchLocations(query: string) {
       await this.page.fill('[aria-label="Search locations"]', query);
     }
   }
   ```

3. **Handle Authentication:**
   ```typescript
   // tests/utils/auth.ts
   export async function loginUser(page: Page) {
     // Login implementation
   }
   ```

## 🚀 CI/CD Integration (Future)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

## 📈 Measuring Success

- ✅ All critical paths have tests
- ✅ Tests run in under 5 minutes
- ✅ Visual regression catches UI changes
- ✅ CI pipeline prevents breaking changes

## 🆘 Common Issues & Solutions

1. **Test Flakiness:**
   - Add proper wait conditions
   - Use test isolation
   - Clear state between tests

2. **Slow Tests:**
   - Run tests in parallel
   - Minimize unnecessary navigation
   - Use test fixtures

3. **Debugging Tips:**
   - Use `page.pause()`
   - Check screenshots
   - Review test videos

Remember: Tests should give you confidence to ship, not slow you down. Focus on the most important flows first and expand coverage gradually.
