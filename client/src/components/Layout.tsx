import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

const GlobalSideBar = lazy(() => import("./GlobalSideBar"));
const MobileNavBar = lazy(() => import("./MobileNavbar"));
import { useHideSidebar } from "@/hooks/useHideSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
    const { hideSidebar } = useHideSidebar();
    const isMobile = useIsMobile();

    return (
        <div className="flex h-screen overflow-hidden transition-colors duration-500">
            {!hideSidebar && (
                <Suspense fallback={null}>
                    {isMobile ? <MobileNavBar /> : <GlobalSideBar />}
                </Suspense>
            )}


            <main className="flex-1 overflow-y-auto bg-background">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
