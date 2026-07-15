import { test, expect } from '@playwright/test';

test.describe('ResearchCall — экран звонка', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('страница загружается, видны имя участника и таймер', async ({ page }) => {
    // Проверяем имя участника
    await expect(page.getByText('Alex Kim')).toBeVisible();
    
    // Проверяем таймер (начинается с 00:00)
    await expect(page.getByTestId('timer')).toHaveText('00:00');
    
    // Проверяем, что экран загрузился
    await expect(page.getByText('02 ACTIVE CALL + RESEARCH WORKSPACE')).toBeVisible();
  });

  test('mute и video переключают состояние кнопок', async ({ page }) => {
    // Находим кнопки
    const micButton = page.getByTestId('mic-button');
    const videoButton = page.getByTestId('video-button');
    
    // Проверяем, что кнопки есть
    await expect(micButton).toBeVisible();
    await expect(videoButton).toBeVisible();
    
    // Нажимаем на микрофон — должна появиться иконка MicOff
    await micButton.click();
    await expect(page.getByTestId('mic-off-icon')).toBeVisible();
    
    // Нажимаем на камеру — должна появиться иконка VideoOff
    await videoButton.click();
    await expect(page.getByTestId('video-off-icon')).toBeVisible();
    
    // Нажимаем ещё раз — иконки должны исчезнуть
    await micButton.click();
    await expect(page.getByTestId('mic-off-icon')).not.toBeVisible();
    
    await videoButton.click();
    await expect(page.getByTestId('video-off-icon')).not.toBeVisible();
  });

  test('«Завершить звонок» → подтверждение → экран «Звонок завершён»', async ({ page }) => {
    // Нажимаем на кнопку завершения
    const endButton = page.getByTestId('end-call-button');
    await endButton.click();
    
    // Проверяем, что появилась модалка
    await expect(page.getByTestId('end-call-modal-title')).toBeVisible();
    
    // Нажимаем "Завершить"
    await page.getByText('Завершить').click();
    
    // Проверяем, что появился экран "Звонок завершён"
    await expect(page.getByText('Звонок завершён')).toBeVisible();
    
    // Проверяем, что таймер остановился
    const timer = page.getByTestId('timer');
    // Таймер должен показывать время до завершения (1-2 секунды)
    await expect(timer).not.toHaveText('00:00');
  });
});
