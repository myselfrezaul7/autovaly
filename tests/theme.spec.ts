import { test, expect } from '@playwright/test';

test('Theme toggle switches between dark and light', async ({ page }) => {
  await page.goto('/');

  const themeButton = page.locator('button[aria-label="Toggle Theme"]');
  const html = page.locator('html');
  await expect(html).toHaveClass(/dark|light/);
  
  const initialClass = await html.getAttribute('class');
  const isDark = initialClass?.includes('dark');
  
  const targetClass = isDark ? /light/ : /dark/;
  await expect(async () => {
    const currentClass = await html.getAttribute('class') || '';
    if (currentClass.includes(isDark ? 'dark' : 'light')) {
      await themeButton.click();
    }
    await expect(html).toHaveClass(targetClass, { timeout: 1000 });
  }).toPass();
});
