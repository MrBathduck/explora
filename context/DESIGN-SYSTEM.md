# 🎨 Explora Design System & UI Testing Guide

## 🎯 Design Philosophy

Our design follows these core principles:
- **Simple & Intuitive:** Easy to understand and use
- **Mobile-First:** Designed for phones, scales up to desktop
- **Consistent:** Predictable patterns across the app
- **Accessible:** Usable by everyone
- **Performance:** Fast loading, smooth interactions

## 🎨 Style Guide

### Colors
```css
:root {
  /* Primary Colors */
  --color-primary: #2563eb;     /* Blue for actions */
  --color-secondary: #059669;   /* Green for success */
  --color-accent: #db2777;      /* Pink for highlights */
  
  /* Neutrals */
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-gray-light: #f3f4f6;
  --color-gray-medium: #9ca3af;
  --color-gray-dark: #4b5563;
  
  /* Feedback Colors */
  --color-success: #059669;
  --color-error: #dc2626;
  --color-warning: #d97706;
  --color-info: #3b82f6;
}
```

### Typography
```css
:root {
  /* Font Families */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-headings: 'Inter', system-ui, sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}
```

### Spacing
```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

## 🧪 UI Testing with Playwright

### 1. Visual Regression Testing

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Component Visual Tests', () => {
  test('LocationCard maintains visual consistency', async ({ page }) => {
    await page.goto('/locations');
    
    // Take screenshot of the component
    await expect(page.getByTestId('location-card')).toHaveScreenshot('location-card.png', {
      mask: [page.getByTestId('dynamic-content')]
    });
  });

  test('color scheme is consistent', async ({ page }) => {
    await page.goto('/style-guide');
    await expect(page).toHaveScreenshot('colors.png');
  });
});
```

### 2. Accessibility Testing

```typescript
// tests/a11y/basic.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('main navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Trips' })).toBeFocused();
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    // You can integrate with axe-core or other a11y tools
    await page.goto('/');
    // Run accessibility checks
  });
});
```

### 3. Responsive Design Testing

```typescript
// tests/responsive/layout.spec.ts
import { test, expect } from '@playwright/test';

// Define common viewport sizes
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe('Responsive Layout Tests', () => {
  for (const [device, viewport] of Object.entries(viewports)) {
    test(`layout looks correct on ${device}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page).toHaveScreenshot(`homepage-${device}.png`);
    });
  }
});
```

## 🧱 Component Library

### Base Components

1. **Buttons**
```tsx
// src/components/common/Button.tsx
export const variants = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  outline: 'border-2 border-primary text-primary',
};

export const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};
```

Testing Button Variants:
```typescript
test('button variants render correctly', async ({ page }) => {
  await page.goto('/components/buttons');
  
  for (const variant of Object.keys(variants)) {
    await expect(
      page.getByTestId(`button-${variant}`)
    ).toHaveScreenshot(`button-${variant}.png`);
  }
});
```

2. **Cards**
```tsx
// src/components/common/Card.tsx
export const Card = {
  base: 'rounded-lg shadow-md bg-white p-4',
  hover: 'hover:shadow-lg transition-shadow',
  interactive: 'cursor-pointer hover:scale-105 transition-transform',
};
```

3. **Typography**
```tsx
// src/components/common/Text.tsx
export const Typography = {
  h1: 'text-3xl font-bold text-gray-900',
  h2: 'text-2xl font-semibold text-gray-800',
  body: 'text-base text-gray-600',
  caption: 'text-sm text-gray-500',
};
```

## 📱 Mobile-First Approach

### Testing Mobile Interactions

```typescript
// tests/mobile/interactions.spec.ts
test.describe('Mobile Interactions', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('location card is swipeable on mobile', async ({ page }) => {
    await page.goto('/locations');
    
    // Test swipe gesture
    await page.getByTestId('location-card').dragTo(
      page.getByTestId('favorites-area')
    );
    
    await expect(page.getByText('Added to favorites')).toBeVisible();
  });

  test('navigation menu is accessible via hamburger', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel('Open menu').click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

## 🎭 Playwright Testing Utilities

```typescript
// tests/utils/design-helpers.ts
export async function checkComponentTheme(page, component, theme = 'light') {
  const colors = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    const styles = window.getComputedStyle(el);
    return {
      background: styles.backgroundColor,
      text: styles.color,
      border: styles.borderColor,
    };
  }, component);
  
  // Verify colors match theme
  expect(colors).toMatchSnapshot(`${component}-${theme}-theme.json`);
}

export async function checkResponsiveLayout(page, breakpoints) {
  for (const [name, size] of Object.entries(breakpoints)) {
    await page.setViewportSize(size);
    await expect(page).toHaveScreenshot(`layout-${name}.png`);
  }
}
```

## 📋 Design Testing Checklist

Before each PR:
- [ ] Run visual regression tests
- [ ] Check responsive layouts
- [ ] Verify accessibility standards
- [ ] Test color contrast
- [ ] Verify component spacing
- [ ] Check dark/light theme transitions
- [ ] Test mobile interactions
- [ ] Validate typography scales

## 🔄 Continuous Integration

```yaml
# .github/workflows/design-tests.yml
name: Design Tests
on: [pull_request]
jobs:
  visual-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run visual tests
        run: npm run test:visual
      - name: Upload visual diffs
        if: failure()
        uses: actions/upload-artifact@v2
        with:
          name: visual-differences
          path: test-results
```

Remember:
- Run visual tests on key components
- Update snapshots when design changes are intentional
- Review visual diffs carefully in PRs
- Test across different viewport sizes
- Maintain accessibility standards
