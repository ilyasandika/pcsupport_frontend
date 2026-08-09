import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "./route.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {LoadingProvider} from "@/context/LoadingContext.tsx";
import {NotificationDialogProvider} from "@/context/NotificationDialogContext.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>

          <NotificationDialogProvider>
              <LoadingProvider>
                  <AuthProvider>
                      <ThemeProvider>
                          <TooltipProvider>
                            <RouterProvider router={router} />
                          </TooltipProvider>
                      </ThemeProvider>
                  </AuthProvider>
              </LoadingProvider>
          </NotificationDialogProvider>
      </QueryClientProvider>
  </StrictMode>,
)
