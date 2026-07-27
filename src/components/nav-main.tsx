import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { NavLink, useLocation } from "react-router"

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    show?: boolean
    items?: {
      title: string
      url: string
      show?: boolean
    }[]
  }[]
}) {
  const location = useLocation()

  return (
      <SidebarGroup>
        <SidebarMenu className="px-2 group-data-[collapsible=icon]:px-0">
          {items.map((item) => {

            if (item.show === false) return null;
            const isItemActive = location.pathname === item.url

            const isChildActive = item.items?.some(
                (subItem) => location.pathname === subItem.url
            )

            const visibleSubItems = item.items
                ? item.items.filter((subItem) => subItem.show !== false)
                : [];

            // KONDISI 1: Jika item memiliki sub-items (Collapsible Menu)
            if (item.items && item.items.length > 0) {
              return (
                  <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isItemActive || isChildActive}
                      className="group/collapsible"
                  >
                    <SidebarMenuItem className={""}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={isItemActive || isChildActive} className="text-sm flex gap-3">
                          {item.icon}
                          <span className="text-sm">{item.title}</span>
                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {visibleSubItems.map((subItem) => {
                            const isSubItemActive = location.pathname === subItem.url
                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                                    <NavLink to={subItem.url}>
                                      <span className="text-sm">{subItem.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
              )
            }

            return (
                <SidebarMenuItem key={item.title} className="">
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isItemActive} className="py-2.5 h-auto">
                    <NavLink to={item.url} className="text-sm flex gap-3">
                      {item.icon}
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
  )
}