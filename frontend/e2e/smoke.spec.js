import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });

  test('navigation: Home -> Auth', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('auth-screen')).toBeVisible();
  });

  test('navigation: Auth -> Home (back)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-btn').click();
    await page.getByTestId('auth-back-btn').click();
    await expect(page.getByTestId('home-screen')).toBeVisible();
  });
});
