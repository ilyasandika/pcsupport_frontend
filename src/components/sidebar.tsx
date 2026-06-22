import {useState} from "react";
import {
    BarChart3,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Package,
    Settings,
    Ticket,
    UserRoundCog,
    Users,
    X
} from "lucide-react";
import {BukitAsam} from "./logo.tsx";
import {NavLink} from "react-router";

export const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
	{ id: 'dashboard', path: '',  label: 'Dashboard', icon: LayoutDashboard },
	{ id: 'tickets', path: 'tickets',  label: 'Tickets', icon: Ticket },
	{ id: 'assets', path: 'assets',  label: 'Assets', icon: Package },
	// { id: 'reports', path: 'reports',  label: 'Reports', icon: BarChart3 },
	{ id: 'users', path: 'users',  label: 'Users', icon: UserRoundCog },
	{id: 'employees', path: 'employees', label: 'Employees', icon: Users },
	{ id: 'documentation', path: 'documentation',  label: 'Documentation', icon: FileText },
	{ id: 'settings', path: 'settings',  label: 'Settings', icon: Settings },
	// { id: 'help', path: 'help',  label: 'Help Center', icon: HelpCircle },
    ];

    return (
	<aside className={`
        fixed inset-y-0 left-0 z-50
        w-60 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
	    {/* Sidebar Header */}
	    <div className="h-18 border-b border-gray-200 flex items-center px-6">
		<div className="flex items-center justify-between align-middle mx-auto">
		    <BukitAsam size={32}/>
		    {/* Close button for mobile */}
		    <button
			onClick={() => setIsSidebarOpen(false)}
			className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
		    >
			<X className="w-5 h-5 text-gray-600" />
		    </button>
		</div>
	    </div>

	    {/* Navigation Menu */}
	    <nav className="flex-1 p-4 space-y-1">
		{menuItems.map((item) => {
		    const Icon = item.icon;
		    return (
			<NavLink
			    key={item.id}
			    to={item.path}
			    onClick={() => {
				setIsSidebarOpen(false);
			    }}
			    className={( props =>
				`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
				${props.isActive ? 
				    'bg-ptba-primary text-white' 
				    : 'text-gray-700 hover:bg-gray-100'}
				`
				)}

			>
			    <Icon className="w-4 h-4" />
			    <span className="font-medium text-sm">{item.label}</span>
			</NavLink>
		    );
		})}
	    </nav>

	    {/* Sidebar Footer */}
	    <div className="hidden xl:block p-4 border-t border-gray-200">
		<div className="bg-blue-50 rounded-lg p-4">
		    <div className="flex items-center gap-2 mb-2">
			<div className="w-8 h-8 bg-ptba-primary rounded-full flex items-center justify-center">
			    <HelpCircle className="w-4 h-4 text-white" />
			</div>
			<span className="font-semibold text-sm text-gray-900">Need Help?</span>
		    </div>
		    <p className="text-xs text-gray-600 mb-3">Contact IT support team</p>
		    <button className="w-full bg-ptba-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-[#2a3670] transition-colors">
			Get Support
		    </button>
		</div>
	    </div>
	</aside>
    )

}