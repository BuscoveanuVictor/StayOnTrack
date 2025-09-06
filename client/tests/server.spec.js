import { test, expect } from '@playwright/test';

test('server',  async ({ page }) => {
  await page.goto('http://localhost/api/test');
  await expect(page.locator('text=API is working')).toBeVisible();
});