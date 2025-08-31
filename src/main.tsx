import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/index.css'
import App from './Routes/App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
  <StrictMode>
    <App />
  </StrictMode>
  </QueryClientProvider>,
)
