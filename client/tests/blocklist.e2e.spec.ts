import { test, expect, request } from '@playwright/test';

const WEB_SERVER_URL = process.env.WEB_SERVER_URL || 'http://localhost';

async function programmaticLogin(context) {
  const resp = await context.request.post(`${WEB_SERVER_URL}/api/auth/test-login`, {
    data: { email: 'e2e.user@example.com' }
  });
  expect(resp.ok()).toBeTruthy();
}

test('BlockList add domain persists after refresh', async ({ page, context }) => {
  await programmaticLogin(context);

  await page.goto(`${WEB_SERVER_URL}/block-list`);

  const addBtn = page.getByRole('button', { name: '+ Add blocked site' });
  await addBtn.click();

  const input = page.getByPlaceholder('Enter domain to block');
  await input.fill('example.com');

  const blockBtn = page.getByRole('button', { name: 'Block domain' });
  await blockBtn.click();

  await expect(page.getByText('example.com')).toBeVisible();

  await page.reload();
  await expect(page.getByText('example.com')).toBeVisible();
});
