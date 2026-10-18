import { Store } from '@tanstack/store'

export type Theme = 'dark' | 'light'

export const brandStore = new Store<{ theme: Theme }>({ theme: 'dark' })

brandStore.subscribe(() => {
  const { theme } = brandStore.state
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0b1222' : '#f1f4f7')
})

export function toggleTheme() {
  brandStore.setState((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark',
  }))
}
