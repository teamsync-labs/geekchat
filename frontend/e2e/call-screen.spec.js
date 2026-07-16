import { test, expect } from '@playwright/test';

test('страница загружается', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Alex Kim', { exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('[data-testid="timer"]')).toBeVisible();
});

test('кнопка микрофона работает', async ({ page }) => {
  await page.goto('/');
  const micButton = page.locator('[data-testid="mic-button"]');
  await expect(micButton).toBeVisible();
  await micButton.click();
  // Ищем иконку ТОЛЬКО внутри кнопки
  await expect(micButton.locator('[data-testid="mic-off-icon"]')).toBeVisible();
});

test('кнопка видео работает', async ({ page }) => {
  await page.goto('/');
  const videoButton = page.locator('[data-testid="video-button"]');
  await expect(videoButton).toBeVisible();
  await videoButton.click();
  // Ищем иконку ТОЛЬКО внутри кнопки
  await expect(videoButton.locator('[data-testid="video-off-icon"]')).toBeVisible();
});

test('завершение звонка', async ({ page }) => {
  await page.goto('/');
  const endButton = page.locator('[data-testid="end-call-button"]');
  await endButton.click();
  await expect(page.locator('[data-testid="end-call-modal-title"]')).toBeVisible();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByText('Звонок завершён', { exact: true })).toBeVisible();
});
