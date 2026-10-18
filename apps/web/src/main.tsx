import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './app'
import { watchUsbDisconnect } from './features/device'
import { loadGames } from './features/games'

const queryClient = new QueryClient()
void loadGames(queryClient)
watchUsbDisconnect()

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
