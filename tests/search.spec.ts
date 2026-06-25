import { test, expect } from '@playwright/test';

test('Search modal opens and executes search', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.locator('input[type="text"][placeholder*="Search vehicles"]');
  
  // Retry clicking until the modal becomes visible to handle hydration flakiness
  await expect(async () => {
    if (!(await searchInput.isVisible())) {
      await page.click('button[aria-label="Search"]');
    }
    await expect(searchInput).toBeVisible({ timeout: 1000 });
  }).toPass();
  
  // Type query and submit
  await searchInput.fill('Tesla');
  await searchInput.press('Enter');
  
  // Should navigate to search results
  await expect(page).toHaveURL(/.*\/search\?q=Tesla/);
});
