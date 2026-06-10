import {Bell, Menu} from "lucide-react";

export const Header = ()=> {
    return (
	// px-6 py-6 sm:px-6 lg:px-8
	<header className="lg:sticky lg:top-0 z-49 w-full bg-white border-b border-gray-200 h-18 px-8 flex items-center">
	    <div className="flex items-center justify-between w-full">
		<div className="flex items-center gap-3">
		    {/* Mobile Menu Button */}
		    <button
			// onClick={() => setIsSidebarOpen(true)}
			className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
		    >
			<Menu className="w-6 h-6 text-gray-600" />
		    </button>
		    <div>
			<h2 className="text-md sm:text-lg font-bold text-gray-900">Dashboard</h2>
			<p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Welcome back, Admin User</p>
		    </div>
		</div>
		<div className="flex items-center gap-2 sm:gap-4">
		    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
			<Bell className="w-5 h-5" />
			<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
		    </button>
		    <button className="flex items-center gap-2 px-2 sm:px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
			<div className="w-8 h-8 bg-ptba-primary rounded-full flex items-center justify-center text-white text-sm">
			    AD
			</div>
			<span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin User</span>
		    </button>
		</div>
	    </div>
	</header>
    )
}