import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Создаём DOM-окружение для тестов
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>')
global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

window.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: vi.fn().mockReturnValue([
      { stop: vi.fn(), enabled: true, kind: 'video' },
      { stop: vi.fn(), enabled: true, kind: 'audio' },
    ]),
    getVideoTracks: vi.fn().mockReturnValue([{ enabled: true }]),
    getAudioTracks: vi.fn().mockReturnValue([{ enabled: true }]),
  }),
}
