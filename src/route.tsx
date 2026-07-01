import {createBrowserRouter} from "react-router";
import {Layout} from "./Layout.tsx";
import {DashboardPage} from "./features/dashboard/pages/dashboard.page.tsx";
import {TicketPage} from "./features/ticket/pages/ticket.page.tsx";
import {AssetPage} from "./features/asset/pages/asset.page.tsx";
import {assetLoader} from "./features/asset/loader/asset.loader.ts";
import {ticketDetailLoader, ticketLoader} from "./features/ticket/loader/ticket.loader.ts";
import {UserPage} from "./features/user/pages/user.page.tsx";
import {userLoader} from "./features/user/loader/user.loader.tsx";
import {dashboardLoader} from "./features/dashboard/loader/dashboard.loader.tsx";
import {EmployeePage} from "./features/employee/pages/employee.page.tsx";
import {employeeLoader} from "./features/employee/loader/employee.loader.tsx";
import {EmployeeDetailPage} from "./features/employee/pages/employee-detail.page.tsx";
import {employeeDetailLoader} from "./features/employee/loader/employee-detail.loader.tsx";
import {LoginPage} from "./features/auth/pages/login.page.tsx";
import {TicketDetailPage} from "./features/ticket/pages/ticket-detail.page.tsx";

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
		children: [
		    {
			index: true,
			element: <TicketPage/>,
			loader: ticketLoader,
		    },
		    {
			path: ':id',
			element: <TicketDetailPage/>,
			loader: (args) => ticketDetailLoader(args),
		    }
		]
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
	    },
	    {
		path: 'employees',
		children: [
		    {
			index: true,
			element: <EmployeePage/>,
			loader: employeeLoader,
		    },
		    {
			path: ':id',
			element: <EmployeeDetailPage/>,
			loader: (args) => employeeDetailLoader(args),
		    }
		]
	    },
	]
    },
    {
	path: '/login',
	element: <LoginPage/>
    }
])