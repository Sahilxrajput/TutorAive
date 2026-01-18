import { Outlet } from 'react-router-dom'
import { motion } from "framer-motion";
import Navbar from './Navbar';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavBar from './MobileNavbar';

const Layout = () => {
    const { isFullScreen } = useFullscreen();
    const isMobile = useIsMobile();

    return (
        <div className="flex min-h-screen transition-colors flex-col duration-500">
            {/* Desktop sidebar */}
            {!isFullScreen && !isMobile && <Navbar />}

            {/* Mobile sidebar (overlay) */}
            {!isFullScreen && isMobile && (
                <MobileNavBar />
            )}
            <main className="flex-1 bg-muted/30" >
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

    )
}

export default Layout
