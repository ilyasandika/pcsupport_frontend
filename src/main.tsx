import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import {Layout} from "./Layout.tsx";
import {DashboardPage} from "./features/dashboard/pages/dashboard.page.tsx";
import {TicketPage} from "./features/ticket/pages/ticket.page.tsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardPage/>
            },
            {
                path: 'tickets',
                element: <TicketPage/>
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
