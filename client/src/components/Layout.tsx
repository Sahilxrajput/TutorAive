import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import MobileNavBar from "./MobileNavbar";
import { useHideSidebar } from "@/hooks/useHideSidebar";

const Layout = () => {
    const { hideSidebar, isMobile } = useHideSidebar();
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden transition-colors duration-500">
            {!hideSidebar && (
                isMobile ? <MobileNavBar /> : <Navbar />
            )}

            <main className="flex-1 overflow-y-auto bg-muted/30">
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
