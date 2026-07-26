import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon, TicketIcon, PackageIcon, UserRoundCog, Users, Settings
} from "lucide-react"
import {BukitAsamFull, BukitAsamMinimize} from "@/components/logo.tsx";
import type {ComponentProps} from "react";
import {useAuth} from "@/context/AuthContext.tsx";

const settingsItems =[
  {title: "Templates", url: "/settings/templates", show: true},
  {title: "Locations", url: "/settings/locations", show: true},
]



// const menuItems = [
//     { id: 'dashboard', path: '',  label: 'Dashboard', icon: LayoutDashboard, show: true },
//     { id: 'tickets', path: 'tickets',  label: 'Tickets', icon: Ticket, show: true },
//     { id: 'assets', path: 'assets',  label: 'Assets', icon: Package, show: isAdmin() },
//     { id: 'users', path: 'users',  label: 'Users', icon: UserRoundCog, show: isAdmin() },
//     {id: 'employees', path: 'employees', label: 'Employees', icon: Users, show: isAdmin() },
//     { id: 'settings', path: 'settings',  label: 'Settings', icon: Settings, show: isAdmin() },
// ];


export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {

  const { isAdmin } = useAuth();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {title: "Dashboard",  url: "/", icon: (<LayoutDashboardIcon />), show: true},
      {title: "Tickets",  url: "/tickets", icon: (<TicketIcon />), show: true},
      {title: "Assets",  url: "/assets", icon: (<PackageIcon />), show: isAdmin()},
      {title: "Users",  url: "/users", icon: (<UserRoundCog />), show: isAdmin()},
      {title: "Employees",  url: "/employees", icon: (<Users />), show: isAdmin()},
      {title: "Settings",  url: "/settings", icon: (<Settings />), show: isAdmin(), items: settingsItems},
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-center justify-center p-4">

        {/* LOGO FULL: Sembunyikan saat sidebar collapse */}
        <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
          <BukitAsamFull size={32}/>
        </div>

        {/* LOGO KECIL (OPSIONAL): Tampilkan hanya saat sidebar collapse */}
        {/* Jika kamu punya komponen versi ikon saja, aktifkan baris di bawah ini */}
        <div className="hidden group-data-[collapsible=icon]:flex">
            <BukitAsamMinimize size={24} />
        </div>

      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
