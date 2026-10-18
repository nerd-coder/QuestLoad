import { Store } from '@tanstack/store'

export type View = 'installer' | 'extractor'
export type Theme = 'dark' | 'light'

// index.html reads the same key before first paint, so the page never flashes.
const THEME_KEY = 'questload-theme'

export const shellStore = new Store<{ view: View; theme: Theme }>({
  view: 'installer',
  theme: localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark',
})

export function showView(view: View) {
  shellStore.setState((state) => ({ ...state, view }))
}

export function toggleTheme() {
  const theme = shellStore.state.theme === 'dark' ? 'light' : 'dark'
  shellStore.setState((state) => ({ ...state, theme }))
  localStorage.setItem(THEME_KEY, theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0b1222' : '#f1f4f7')
}
