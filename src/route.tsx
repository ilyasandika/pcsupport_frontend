import {createBrowserRouter} from "react-router";
import {Layout} from "./Layout.tsx";
import {DashboardPage} from "./features/dashboard/pages/dashboard.page.tsx";
import {TicketPage} from "./features/ticket/pages/ticket.page.tsx";
import {AssetPage} from "./features/asset/pages/asset.page.tsx";
import {assetDetailLoader, assetFormLoader, assetLoader} from "./features/asset/loader/asset.loader.ts";
import {
    ticketFormLoader,
    ticketDetailLoader,
    ticketLoader
} from "./features/ticket/loader/ticket.loader.ts";
import {UserPage} from "./features/user/pages/user.page.tsx";
import {userDetailLoader, userFormLoader, userLoader} from "./features/user/loader/user.loader.tsx";
import {dashboardLoader} from "./features/dashboard/loader/dashboard.loader.tsx";
import {EmployeePage} from "./features/employee/pages/employee.page.tsx";
import {employeeLoader} from "./features/employee/loader/employee.loader.tsx";
import {EmployeeDetailPage} from "./features/employee/pages/employee-detail.page.tsx";
import {employeeDetailLoader} from "./features/employee/loader/employee-detail.loader.tsx";
import {LoginPage} from "./features/auth/pages/login.page.tsx";
import {TicketDetailPage} from "./features/ticket/pages/ticket-detail.page.tsx";
import {AssetDetailPage} from "./features/asset/pages/asset-detail.page.tsx";
import {UserDetailPage} from "./features/user/pages/user-detail.page.tsx";
import {TicketFormPage} from "@/features/ticket/pages/ticket-form.page.tsx";
import {UserFormPage} from "@/features/user/pages/user-form.page.tsx";
import {RequireAdmin, RequireAuth} from "@/components/guards/protected-route.tsx";
import {SettingPage} from "@/features/settings/page/setting.page.tsx";
import {settingLoader} from "@/features/settings/loader/setting.loader.tsx";
import {AssetFormPage} from "@/features/asset/pages/asset-form.page.tsx";
import {ErrorPage} from "@/components/pages/error.page.tsx";
import {ExternalTicketPage} from "@/features/external-tickets/pages/external-ticket.page.tsx";
import {externalTicketLoader} from "@/features/external-tickets/loader/external-ticket.loader.ts";
import {ExternalTicketFormPage} from "@/features/external-tickets/pages/external-ticket-form.page.tsx";

export const router = createBrowserRouter([
    {
	element: <RequireAuth/>,
	errorElement: <ErrorPage/>,
	children: [
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
				path: 'create',
				element: <TicketFormPage/>,
				loader: ticketFormLoader
			    },
			    {
				path: ':id/update',
				element: <TicketFormPage/>,
				loader: (args) => ticketFormLoader(args),
			    },
			    {
				path: ':id',
				element: <TicketDetailPage/>,
				loader: (args) => ticketDetailLoader(args),
			    },
			]
		    },
		    {
			path: 'external-tickets',
			children: [
			    {
				index: true,
				element: <ExternalTicketPage/>,
				loader: externalTicketLoader,
			    },
			    {
				path: "create",
				element: <ExternalTicketFormPage/>,
			    }
			]
		    },
		    {
			path: 'users',
			children: [
			    {
				element: <RequireAdmin/>,
				children: [
				    {
					index: true,
					element: <UserPage/>,
					loader: userLoader,
				    },
				]
			    },
			    {
				path: 'create',
				element: <UserFormPage/>,
				loader: userFormLoader
			    },
			    {
				path: ':id',
				element: <UserDetailPage/>,
				loader: (args) => userDetailLoader(args),
			    },
			    {
				path: ':id/update',
				element: <UserFormPage/>,
				loader: (args) => userFormLoader(args),
			    }
			]
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
		    {
			path: 'assets',
			children: [
			    {
				element: <RequireAdmin/>,
				children: [
				    {
					index: true,
					element: <AssetPage/>,
					loader: assetLoader
				    },
				    {
					path: ':id',
					element: <AssetDetailPage/>,
					loader: (args) => assetDetailLoader(args),
				    },
				    {
					path: 'create',
					element: <AssetFormPage/>,
					loader: assetFormLoader
				    },
				    {
					path: ':id/update',
					element: <AssetFormPage/>,
					loader:  (args) => assetFormLoader(args),
				    }
				],
			    }
			]
		    },
		    {
			path: 'settings',
			children: [
			    {
				element: <RequireAdmin/>,
				children: [
				    {
					index: true,
					element: <SettingPage/>,
					loader: settingLoader,
				    }
				]
			    },
			]
		    },
		]
	    },
	]
    },
    {
	path: '/login',
	element: <LoginPage/>
    }
])