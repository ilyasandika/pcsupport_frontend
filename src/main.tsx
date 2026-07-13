import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "./route.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {LoadingProvider} from "@/context/LoadingContext.tsx";




createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <LoadingProvider>
          <AuthProvider>
              <ThemeProvider>
                  <RouterProvider router={router} />
              </ThemeProvider>
          </AuthProvider>
      </LoadingProvider>

  </StrictMode>,
)
