import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout.tsx";
import { DashboardPage } from "./features/dashboard/pages/dashboard.page.tsx";
import { TicketPage } from "./features/ticket/pages/ticket.page.tsx";
import { AssetPage } from "./features/asset/pages/asset.page.tsx";
import { assetDetailLoader, assetFormLoader, assetLoader } from "./features/asset/loader/asset.loader.ts";
import {
	ticketFormLoader,
	ticketDetailLoader,
} from "./features/ticket/loader/ticket.loader.ts";
import { UserPage } from "./features/user/pages/user.page.tsx";
import { userDetailLoader, userFormLoader, userLoader } from "./features/user/loader/user.loader.tsx";
import { dashboardLoader } from "./features/dashboard/loader/dashboard.loader.tsx";
import { EmployeePage } from "./features/employee/pages/employee.page.tsx";
import { employeeFormLoader, employeeLoader } from "./features/employee/loader/employee.loader.tsx";
import { EmployeeDetailPage } from "./features/employee/pages/employee-detail.page.tsx";
import { employeeDetailLoader } from "./features/employee/loader/employee-detail.loader.tsx";
import { EmployeeFormPage } from "./features/employee/pages/employee-form.page.tsx";

import { LoginPage } from "./features/auth/pages/login.page.tsx";
import { TicketDetailPage } from "./features/ticket/pages/ticket-detail.page.tsx";
import { AssetDetailPage } from "./features/asset/pages/asset-detail.page.tsx";
import { UserDetailPage } from "./features/user/pages/user-detail.page.tsx";
import { TicketFormPage } from "@/features/ticket/pages/ticket-form.page.tsx";
import { UserFormPage } from "@/features/user/pages/user-form.page.tsx";
import { RequireAdmin, RequireAuth, RequireRole } from "@/components/guards/protected-route.tsx";
import { SettingPage } from "@/features/settings/page/setting.page.tsx";
import { settingLoader } from "@/features/settings/loader/setting.loader.tsx";
import { AssetFormPage } from "@/features/asset/pages/asset-form.page.tsx";
import { ErrorPage } from "@/components/pages/error.page.tsx";
import { ExternalTicketPage } from "@/features/external-tickets/pages/external-ticket.page.tsx";
import { externalTicketFormLoader, externalTicketLoader } from "@/features/external-tickets/loader/external-ticket.loader.ts";
import { ExternalTicketFormPage } from "@/features/external-tickets/pages/external-ticket-form.page.tsx";
import { TemplatePage } from "@/features/templates/pages/template.page.tsx";
import { TemplatePreviewPage } from "@/features/templates/pages/template-preview.page.tsx";
import { templateLoader } from "@/features/templates/loader/template.loader.ts";
import { LocationPage } from "@/features/locations/pages/location.page.tsx";
import { locationLoader } from "@/features/locations/loader/location.loader.ts";
import { SlaPage } from "@/features/sla/pages/sla.page.tsx";
import { slaLoader } from "@/features/sla/loader/sla.loader.ts";
import { VendorPage } from "@/features/vendors/pages/vendor.page.tsx";
import { vendorLoader } from "@/features/vendors/loader/vendor.loader.ts";
import { ProjectPage } from "@/features/projects/pages/project.page.tsx";
import { projectLoader } from "@/features/projects/loader/project.loader.ts";
import { AssetCategoryPage } from "@/features/asset/pages/asset-category.page.tsx";
import { assetCategoryPageLoader } from "@/features/asset/loader/asset-category.loader.ts";

export const router = createBrowserRouter([
	{
		element: <RequireAuth />,
		errorElement: <ErrorPage />,
		children: [

			{
				path: '/',
				element: <Layout />,
				children: [
					{
						index: true,
						element: <DashboardPage />,
						loader: dashboardLoader,
					},
					{
						path: 'dashboard',
						element: <DashboardPage />,
						loader: dashboardLoader,
					},
					{
						path: 'tickets',
						children: [
							{
								index: true,
								element: <TicketPage />,
							},
							{
								path: 'create',
								element: <TicketFormPage />,
								loader: ticketFormLoader
							},
							{
								path: ':id/update',
								element: <TicketFormPage />,
								loader: (args) => ticketFormLoader(args),
							},
							{
								path: ':id',
								element: <TicketDetailPage />,
								loader: (args) => ticketDetailLoader(args),
							},
						]
					},
					{
						path: 'external-tickets',
						children: [
							{
								index: true,
								element: <ExternalTicketPage />,
								loader: externalTicketLoader,
							},
							{
								path: "create",
								element: <ExternalTicketFormPage />,
								loader: externalTicketFormLoader,
							},
							{
								path: ":id/update",
								element: <ExternalTicketFormPage />,
								loader: (args) => externalTicketFormLoader(args),
							}
						]
					},
					{
						path: 'users',
						children: [
							{
								element: <RequireRole allowed={['admin']} />,
								children: [

									{
										path: ':id/update',
										element: <UserFormPage />,
										loader: (args) => userFormLoader(args),
									},
									{
										path: 'create',
										element: <UserFormPage />,
										loader: userFormLoader
									},
								],
							},
							{
								element: <RequireRole allowed={['admin', 'supervisor']} />,
								children: [
									{
										index: true,
										element: <UserPage />,
										loader: userLoader,
									}
								]
							},
							{
								path: ':id',
								element: <UserDetailPage />,
								loader: (args) => userDetailLoader(args),
							},

						]
					},
					{
						path: 'employees',
						children: [
							{
								index: true,
								element: <EmployeePage />,
								loader: employeeLoader,
							},
							{
								path: 'create',
								element: <EmployeeFormPage />,
								loader: employeeFormLoader,
							},
							{
								path: ':id/update',
								element: <EmployeeFormPage />,
								loader: (args) => employeeFormLoader(args),
							},
							{
								path: ':id',
								element: <EmployeeDetailPage />,
								loader: (args) => employeeDetailLoader(args),
							}
						]
					},
					{
						path: 'assets',
						children: [
							{
								element: <RequireAdmin />,
								children: [
									{
										index: true,
										element: <AssetPage />,
										loader: assetLoader
									},
									{
										path: ':id',
										element: <AssetDetailPage />,
										loader: (args) => assetDetailLoader(args),
									},
									{
										path: 'create',
										element: <AssetFormPage />,
										loader: assetFormLoader
									},
									{
										path: ':id/update',
										element: <AssetFormPage />,
										loader: (args) => assetFormLoader(args),
									}
								],
							}
						]
					},
					{
						path: 'settings',
						children: [
							{
								element: <RequireAdmin />,
								children: [
									{
										index: true,
										element: <SettingPage />,
										loader: settingLoader,
									},
									{
										path: 'categories',
										element: <AssetCategoryPage />,
										loader: assetCategoryPageLoader,
									},
									{
										path: 'vendors',
										element: <VendorPage />,
										loader: vendorLoader,
									},
									{
										path: 'projects',
										element: <ProjectPage />,
										loader: projectLoader,
									},
									{
										path: 'templates/:id/preview',
										element: <TemplatePreviewPage />,
									},
									{
										path: 'templates',
										element: <TemplatePage />,
										loader: templateLoader,
									},
									{
										path: 'locations',
										element: <LocationPage />,
										loader: locationLoader,
									},
									{
										path: 'sla-policies',
										element: <SlaPage />,
										loader: slaLoader,
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
		element: <LoginPage />
	},

])