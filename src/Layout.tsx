import {Sidebar} from "./components/sidebar.tsx";
import {Header} from "./components/header.tsx";
import {Outlet, useNavigation} from "react-router";


export const Layout = () => {

    const navigation = useNavigation()
    const isNavigating = navigation.state === 'loading';

    return (
	<div className="min-h-screen bg-gray-50 flex">
	    <Sidebar />
	    <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto lg:ml-60">
		<Header />
		<main className="p-8 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-4xl xl:max-w-280 2xl:max-w-300 3xl:max-w-380 mx-auto">
		    {isNavigating && <AssetTableSkeleton/>}
		    {!isNavigating && <Outlet/>}
		</main>
	    </div>
	</div>
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