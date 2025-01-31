import { test, expect } from '@playwright/test';

test('Homepage should redirect to Arabic version', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForURL('**/ar');
  expect(page.url()).toContain('/ar');
});

test('Arabic homepage should show correct content', async ({ page }) => {
  await page.goto('http://localhost:3000/ar');
  await page.waitForSelector('h1');
  const heading = await page.textContent('h1');
  expect(heading?.trim()).toBe('البحث عن العقارات');
});
