import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SocketProvider } from './providers/socketProvider'
import { SearchProvider } from './providers/SearchProvider'
import { AuthProvider } from './providers/authProvider'


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
                <BrowserRouter>
                    <SearchProvider>
                        <SocketProvider>
                            <App />
                            <Toaster
                                position="top-center"
                                richColors
                                closeButton
                            />
                        </SocketProvider>
                    </SearchProvider>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>

)
