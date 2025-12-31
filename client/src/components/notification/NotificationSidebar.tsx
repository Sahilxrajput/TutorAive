import { Bell, ChevronUp, User2 } from "lucide-react"
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarHeader } from "../ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export function NotificationSideBar() {
    return (
        <Bell />
        // <SidebarProvider>
        //     <Sidebar>
        //         <SidebarHeader />
        //         <SidebarContent />
        //         <SidebarFooter>
        //             <SidebarMenu>
        //                 <SidebarMenuItem>
        //                     <DropdownMenu>
        //                         <DropdownMenuTrigger asChild>
        //                             <SidebarMenuButton>
        //                                 <User2 /> Username
        //                                 <ChevronUp className="ml-auto" />
        //                             </SidebarMenuButton>
        //                         </DropdownMenuTrigger>
        //                         <DropdownMenuContent
        //                             side="top"
        //                             className="w-[--radix-popper-anchor-width]"
        //                         >
        //                             <DropdownMenuItem>
        //                                 <span>Account</span>
        //                             </DropdownMenuItem>
        //                             <DropdownMenuItem>
        //                                 <span>Billing</span>
        //                             </DropdownMenuItem>
        //                             <DropdownMenuItem>
        //                                 <span>Sign out</span>
        //                             </DropdownMenuItem>
        //                         </DropdownMenuContent>
        //                     </DropdownMenu>
        //                 </SidebarMenuItem>
        //             </SidebarMenu>
        //         </SidebarFooter>
        //     </Sidebar>
        // </SidebarProvider>
    )
}
