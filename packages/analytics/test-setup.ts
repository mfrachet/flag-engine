// Global test setup
import { beforeEach, vi } from 'vitest'

// Mock process.env
Object.defineProperty(process, 'env', {
  value: {
    API_ENDPOINT: 'https://test-api.example.com'
  }
})

// Reset DOM and globals before each test
beforeEach(() => {
  // Reset DOM
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  
  // Reset window location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://example.com/',
      pathname: '/',
      search: '',
      hash: ''
    },
    writable: true
  })
  
  // Reset document.referrer
  Object.defineProperty(document, 'referrer', {
    value: '',
    writable: true
  })
  
  // Reset history API
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState
  
  history.pushState = originalPushState
  history.replaceState = originalReplaceState
  
  // Reset fetch
  global.fetch = vi.fn()
  
  // Reset btoa
  global.btoa = vi.fn().mockImplementation((str) => Buffer.from(str).toString('base64'))
})