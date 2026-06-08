import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import {Layout} from "./Layout.tsx";
import {Dashboard} from "./features/dashboard/pages/Dashboard.tsx";
import {Tickets} from "lucide-react";




const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: 'tickets',
                element: <Tickets />
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
