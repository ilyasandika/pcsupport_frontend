import {Sidebar} from "./components/sidebar.tsx";
import {Header} from "./components/header.tsx";
import {Outlet} from "react-router";


export const Layout = () => {

    return (
	<div className="min-h-screen bg-gray-50 flex">
	    <Sidebar />
	    <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
		<Header />
		<main className="p-8">
		    <Outlet/>
		</main>
	    </div>
	</div>
    )
}