import { Outlet } from 'react-router-dom'
import { motion } from "framer-motion";
import Sidebar from './Sidebar';

const Layout = () => {
    return (


        <div className="flex min-h-screen transition-colors duration-500">
            <Sidebar />

            <main className="flex-1 ml-[75px] border-black border-l-2">
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
