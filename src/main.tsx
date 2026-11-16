import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { iniciarMocks } from './compra/mocks/browser'
import { Carrinho } from './compra/componentes/Carrinho'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

iniciarMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Carrinho />
      </QueryClientProvider>
    </StrictMode>,
  )
})
