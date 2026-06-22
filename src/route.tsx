import {createBrowserRouter} from "react-router";
import {Layout} from "./Layout.tsx";
import {DashboardPage} from "./features/dashboard/pages/dashboard.page.tsx";
import {TicketPage} from "./features/ticket/pages/ticket.page.tsx";
import {AssetPage} from "./features/asset/pages/asset.page.tsx";
import {assetLoader} from "./features/asset/loader/asset.loader.ts";
import {ticketLoader} from "./features/ticket/loader/ticket.loader.ts";
import {UserPage} from "./features/user/pages/user.page.tsx";
import {userLoader} from "./features/user/loader/user.loader.tsx";
import {dashboardLoader} from "./features/dashboard/loader/dashboard.loader.tsx";

export const router = createBrowserRouter([
    {
	path: '/',
	element: <Layout />,
	children: [
	    {
		index: true,
		element: <DashboardPage/>,
		loader: dashboardLoader,
	    },
	    {
		path: 'tickets',
		element: <TicketPage/>,
		loader: ticketLoader
	    },
	    {
		path: 'assets',
		element: <AssetPage/>,
		loader: assetLoader
	    },
	    {
		path: 'users',
		element: <UserPage/>,
		loader: userLoader,
	    }
	]
    }
])