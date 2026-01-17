import { Outlet } from 'react-router-dom'
import { motion } from "framer-motion";
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useEffect, useState } from 'react';

const Layout = () => {
    const { isFullScreen } = useFullscreen();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // ignore typing
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.ctrlKey && e.key.toLowerCase() === "b") {
                e.preventDefault();
                setIsSidebarOpen(v => !v);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);



    return (
        <div className="flex min-h-screen transition-colors duration-500">
            {!isFullScreen && isSidebarOpen && <Sidebar />}
            <main className="flex-1">
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
