import { Store } from '@tanstack/store'

export type View = 'installer' | 'extractor'

export const shellStore = new Store<{ view: View }>({ view: 'installer' })

export function showView(view: View) {
  shellStore.setState(() => ({ view }))
}
