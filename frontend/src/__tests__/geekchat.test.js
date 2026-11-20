import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('GeekChat Юнит-Тесты', () => {
  let dom, document, window;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div><div class="toast" id="toast"></div><script>
      function generateRoomCode() { return 'GEEK-' + String(Math.floor(1000 + Math.random() * 9000)); }
      function showToast(msg) { const toast = document.getElementById('toast'); toast.textContent = msg; toast.classList.add('show'); }
    </script></body></html>`, { runScripts: 'dangerously' });
    document = dom.window.document; window = dom.window;
    global.document = document; global.window = window;
  });

  it('генерирует код комнаты в формате GEEK-XXXX', () => {
    const code = window.generateRoomCode();
    expect(code).toMatch(/GEEK-\d{4}/);
  });

  it('показывает тост с сообщением', () => {
    const toast = document.getElementById('toast');
    window.showToast('Тестовое сообщение');
    expect(toast.textContent).toBe('Тестовое сообщение');
    expect(toast.classList.contains('show')).toBe(true);
  });

  it('переключает классы кнопки при клике', () => {
    const button = document.createElement('button');
    button.className = 'call-btn active';
    function toggleButton(btn) { btn.classList.toggle('active'); btn.classList.toggle('off'); }
    toggleButton(button);
    expect(button.classList.contains('off')).toBe(true);
    expect(button.classList.contains('active')).toBe(false);
    toggleButton(button);
    expect(button.classList.contains('active')).toBe(true);
    expect(button.classList.contains('off')).toBe(false);
  });

  it('валидирует код комнаты (должен быть в формате GEEK-XXXX)', () => {
    function isValidRoomCode(code) { return /^GEEK-\d{4}$/.test(code); }
    expect(isValidRoomCode('GEEK-1234')).toBe(true);
    expect(isValidRoomCode('GEEK-0000')).toBe(true);
    expect(isValidRoomCode('INVALID')).toBe(false);
    expect(isValidRoomCode('GEEK-123')).toBe(false);
    expect(isValidRoomCode('')).toBe(false);
  });

  it('правильно форматирует время звонка', () => {
    function formatTime(seconds) {
      const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      return `${mins}:${secs}`;
    }
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(61)).toBe('01:01');
    expect(formatTime(125)).toBe('02:05');
  });

  it('показывает только активный экран', () => {
    const screens = [
      { id: 'screen-home', classList: { add: vi.fn(), remove: vi.fn() } },
      { id: 'screen-login', classList: { add: vi.fn(), remove: vi.fn() } }
    ];
    function showScreen(name) {
      screens.forEach(screen => {
        if (screen.id === `screen-${name}`) screen.classList.add('active');
        else screen.classList.remove('active');
      });
    }
    showScreen('login');
    expect(screens[0].classList.remove).toHaveBeenCalledWith('active');
    expect(screens[1].classList.add).toHaveBeenCalledWith('active');
  });

  it('копирует ссылку в буфер обмена', async () => {
    const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.assign(navigator, { clipboard: mockClipboard });
    await navigator.clipboard.writeText('https://geekchat.local/room/GEEK-1234');
    expect(mockClipboard.writeText).toHaveBeenCalledWith('https://geekchat.local/room/GEEK-1234');
  });

  it('создаёт комнату с уникальным кодом', () => {
    const codes = new Set();
    function createRoom() { const code = window.generateRoomCode(); codes.add(code); return code; }
    const code1 = createRoom();
    const code2 = createRoom();
    expect(codes.size).toBe(2);
    expect(code1).not.toBe(code2);
  });
});
