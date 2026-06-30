import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "./route.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";




createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <ThemeProvider>
              <RouterProvider router={router} />
          </ThemeProvider>
      </AuthProvider>
  </StrictMode>,
)
