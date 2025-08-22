import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  // Navigate to the homepage and wait for network to be idle
  await page.goto('/', { waitUntil: 'networkidle' });
  
  // Basic checks to ensure the page structure is correct
  const main = page.getByRole('main');
  await expect(main).toBeVisible();
  
  // Check for navigation presence
  const nav = page.getByRole('navigation');
  await expect(nav).toBeVisible();
});
