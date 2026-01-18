import { Outlet, useMatch } from 'react-router-dom'
import { motion } from "framer-motion";
import Navbar from './Navbar';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavBar from './MobileNavbar';
import { cn } from '@/lib/utils';

const Layout = () => {
    const { isFullScreen } = useFullscreen();
    const isMobile = useIsMobile();
    const isLiveLecture = useMatch(
        "/classrooms/:classroomId/lecture/live/:lectureId"
    );

    return (
        <div className="flex min-h-screen transition-colors flex-col duration-500">
            {/* Desktop sidebar */}
            {!isFullScreen && !isMobile && !isLiveLecture && <Navbar />}

            {/* Mobile sidebar (overlay) */}
            {!isFullScreen && isMobile && (
                <MobileNavBar />
            )}
            <main className={cn("flex-1 bg-muted/30",  !isLiveLecture &&"pt-8")} >
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
