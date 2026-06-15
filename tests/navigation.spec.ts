import { test, expect } from '@playwright/test';

test('Navigation to Vehicles page works', async ({ page }) => {
  await page.goto('/');

  // Click on "Vehicles" link in the nav
  await page.click('nav a:has-text("Vehicles")');
  
  // Verify URL changed
  await expect(page).toHaveURL(/.*\/vehicles/);
  
  // Verify page title
  await expect(page).toHaveTitle(/Vehicle Database/i);
});
