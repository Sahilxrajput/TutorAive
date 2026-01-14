import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.tsx'
import { Toaster } from 'sonner'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SocketProvider } from './context/socketProvider.tsx'


const queryClient = new QueryClient()
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 3,
//       gcTime: 300_000, // 5 min @remind
//       staleTime: 1000 * 10, // 10sec
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//       refetchOnReconnect: false,
//     },
//   },
// })

createRoot(document.getElementById('root')!).render(
  <StrictMode>  
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position='top-center'
              richColors
              closeButton
            />
          </BrowserRouter>
          {/* <ReactQueryDevtools /> */}
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
