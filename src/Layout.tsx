import {Outlet, useNavigation} from "react-router";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar.tsx";


export const Layout = () => {

    const navigation = useNavigation()
    const isNavigating = navigation.state === 'loading';

    return (
	<SidebarProvider>
		<AppSidebar />
		<SidebarInset className="p-6 overflow-y-auto bg-secondary">
		    <SidebarTrigger className="mb-3 block md:hidden" />
			<main className="">
			    {isNavigating && <AssetTableSkeleton/>}
			    {!isNavigating && <Outlet/>}
			</main>
		</SidebarInset>
	</SidebarProvider>
    )
}

export const AssetTableSkeleton = () => {
    return (
	<div className="w-full animate-pulse space-y-4">
	    {/* Judul Halaman Skeleton */}
	    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

	    {/* Tabel Skeleton */}
	    <div className=" rounded-lg overflow-hidden">
		<div className="bg-gray-100 h-10 w-full mb-2"></div> {/* Header Tabel */}
		<div className="space-y-3 p-4">
		    {[...Array(5)].map((_, i) => (
			<div key={i} className="flex space-x-4">
			    <div className="h-6 bg-gray-200 rounded w-12"></div>
			    <div className="h-6 bg-gray-200 rounded flex-1"></div>
			    <div className="h-6 bg-gray-200 rounded w-24"></div>
			</div>
		    ))}
		</div>
	    </div>
	</div>
    );
};