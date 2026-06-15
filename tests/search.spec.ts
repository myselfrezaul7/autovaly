import { test, expect } from '@playwright/test';

test('Search modal opens and executes search', async ({ page }) => {
  await page.goto('/');

  // Click search trigger (glass icon)
  await page.click('button[aria-label="Search"]');
  
  // Modal should be visible
  const searchInput = page.locator('input[type="text"][placeholder*="Search vehicles"]');
  await expect(searchInput).toBeVisible();
  
  // Type query and submit
  await searchInput.fill('Tesla');
  await searchInput.press('Enter');
  
  // Should navigate to search results
  await expect(page).toHaveURL(/.*\/search\?q=Tesla/);
});
