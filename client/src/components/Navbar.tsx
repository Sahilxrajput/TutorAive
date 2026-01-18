import { Link, useLocation } from "react-router-dom";
import {
    Baby,
    BookOpen,
    MessageCircle,
    Twitch,
    Compass,
    LucideOctagon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { NotificationSidebar } from "./notification/NotificationSidebar";
import useHideOnScroll from "@/hooks/useHideOnScroll";

interface Indicator {
    left: number;
    width: number;
    opacity: number;
}

const navItems = [
    { to: "/notes", icon: BookOpen },
    { to: "/classrooms", icon: Compass },
    { to: "/chats", icon: MessageCircle },
    { to: "/community", icon: Twitch },
];

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const hidden = useHideOnScroll();

    const [indicator, setIndicator] = useState<Indicator>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const moveIndicator = (el: HTMLElement) => {
        const { width } = el.getBoundingClientRect();
        setIndicator({
            left: el.offsetLeft,
            width,
            opacity: 1,
        });
    };

    // Sync indicator with active route on load / refresh
    useEffect(() => {
        if (!containerRef.current) return;

        const activeEl = containerRef.current.querySelector(
            `[data-path='${location.pathname}']`
        ) as HTMLElement | null;

        if (activeEl) moveIndicator(activeEl);
    }, [location.pathname]);

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: hidden ? "-100%" : "0%" }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
            }}
            className=" fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 pointer-event-none:">
            {/* Logo */}
            <Link
                to="/"
                className="relative flex items-center rounded-full p-2 border border-white/20 text-amber-800 bg-white/10 backdrop-blur-xl shadow-xl shadow-black/10 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
            >
                <LucideOctagon />
            </Link>

            {/* Center Nav */}
            <motion.div
                className="relative flex items-center gap-6 rounded-full px-4 py-1 border border-amber-800 bg-white/10 backdrop-blur-xl shadow-xl shadow-black/10 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
                onPointerLeave={() => {
                    setIndicator((prev) => ({ ...prev, opacity: 0 }));
                }}
                ref={containerRef}
            >
                <Cursor indicator={indicator} />

                {navItems.map(({ to, icon: Icon }) => (
                    <Link
                        key={to}
                        to={to}
                        data-path={to}
                        onPointerEnter={(e) => moveIndicator(e.currentTarget)}
                        className="relative z-10 flex h-10 w-10 items-center justify-center hover:text-white text-amber-800 transition-colors duration-200 ease-out "
                    >
                        <Icon size={20} />
                    </Link>
                ))}
            </motion.div>

            {/* Right Actions */}
            <div
                className="relative flex items-center gap-6 rounded-full px-4 py-1 border border-amber-800 text-amber-800 bg-white/10 backdrop-blur-xl shadow-xl shadow-black/10 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
            >
                <NotificationSidebar />

                {!user ? (
                    <Link
                        to="/signin"
                        className="flex h-10 w-10 items-center justify-center"
                    >
                        <Baby />
                    </Link>
                ) : (
                    <Link to="/profile">
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    </Link>
                )}
            </div>
        </motion.nav >
    );
};

const Cursor = ({ indicator }: { indicator: Indicator }) => (
    <motion.div
        className="absolute h-10 rounded-full bg-primary z-0"
        animate={indicator}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
);

export default Navbar;
