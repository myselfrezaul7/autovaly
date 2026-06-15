import { test, expect } from '@playwright/test';

test('Theme toggle switches between dark and light', async ({ page }) => {
  await page.goto('/');

  // Find the theme toggle button (moon/sun icon). It's typically in the TopBar or Navbar.
  const themeButton = page.locator('button[aria-label="Toggle Theme"]');
  
  // Verify initial state (dark by default usually)
  const html = page.locator('html');
  await expect(html).toHaveClass(/dark|light/);
  
  const initialClass = await html.getAttribute('class');
  const isDark = initialClass?.includes('dark');
  
  // Click the toggle
  await themeButton.click();
  
  // Verify state changed
  if (isDark) {
    await expect(html).toHaveClass(/light/);
  } else {
    await expect(html).toHaveClass(/dark/);
  }
});
