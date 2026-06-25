import { test, expect } from '@playwright/test';

test('Navigation to Vehicles page works', async ({ page }) => {
  await page.goto('/');

  // Retry clicking the link until the URL changes to handle hydration flakiness
  await expect(async () => {
    if (!page.url().includes('/vehicles')) {
      await page.click('nav a:has-text("Vehicles")');
    }
    await expect(page).toHaveURL(/.*\/vehicles/, { timeout: 1000 });
  }).toPass();
  
  // Verify page title
  await expect(page).toHaveTitle(/Vehicle Database/i);
});
