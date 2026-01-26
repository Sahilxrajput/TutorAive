import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import MobileNavBar from "./MobileNavbar";
import { useHideSidebar } from "@/hooks/useHideSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const Layout = () => {
    const { hideSidebar } = useHideSidebar();
    const isMobile = useIsMobile();
    const location = useLocation();
    useRealtimeNotifications() // update on realtime

    return (
        <div className="flex h-screen overflow-hidden transition-colors duration-500">
            {!hideSidebar && (
                isMobile ? <MobileNavBar /> : <SideBar />
            )}

            <main className="flex-1 overflow-y-auto bg- bg-[#FEFEF7]">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
