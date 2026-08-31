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
import { BukitAsamFull, BukitAsamMinimize } from "@/components/logo.tsx";
import type { ComponentProps } from "react";
import { useAuth } from "@/context/AuthContext.tsx";

const settingsItems = [
  { title: "Asset Categories", url: "/settings/categories", show: true },
  { title: "Vendors", url: "/settings/vendors", show: true },
  { title: "Projects", url: "/settings/projects", show: true },
  { title: "Templates", url: "/settings/templates", show: true },
  { title: "Locations", url: "/settings/locations", show: true },
  { title: "SLA Policies", url: "/settings/sla-policies", show: true },
]

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { isAdmin, isSupervisor, isHelpdesk } = useAuth();

  const data = {
    navMain: [
      { title: "Dashboard", url: "/", icon: (<LayoutDashboardIcon />), show: true },
      { title: "Tickets", url: "/tickets", icon: (<TicketIcon />), show: true },
      // {title: "External Tickets",  url: "/external-tickets", icon: (<TicketIcon />), show: true},
      { title: "Assets", url: "/assets", icon: (<PackageIcon />), show: isAdmin() || isSupervisor() || isHelpdesk() },
      { title: "Users", url: "/users", icon: (<UserRoundCog />), show: isAdmin() || isSupervisor() || isHelpdesk() },
      { title: "Employees", url: "/employees", icon: (<Users />), show: isAdmin() || isSupervisor() || isHelpdesk() },
      { title: "Settings", url: "/settings", icon: (<Settings />), show: isAdmin(), items: settingsItems },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props} variant={"floating"} className="bg-secondary" >
      <SidebarHeader className="items-center justify-center p-4 my-4 ">

        <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
          <BukitAsamFull size={28} />
        </div>

        <div className="hidden group-data-[collapsible=icon]:flex">
          <BukitAsamMinimize size={24} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
