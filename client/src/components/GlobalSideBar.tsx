import { useState, useEffect, useRef } from "react";
import { BookOpen, Twitch, Compass, Bell, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import defaultAvatar from '@/assets/image/avatar.png'
import useAuth from "@/hooks/useAuth";
import { NotificationSidebar } from "./notification/NotificationSidebar";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";

interface Indicator {
    top: number;
    height: number;
    opacity: number;
}

const navItems = [
    { id: "/home", icon: Home, label: "Home" },
    { id: "/classrooms", icon: Compass, label: "Explore" },
    { id: "/notes", icon: BookOpen, label: "Notes" },
    { id: "/community", icon: Twitch, label: "Feed" },
];

const Cursor = ({ indicator }: { indicator: Indicator }) => (
    <motion.div
        className="absolute left-0 w-full rounded-xl bg-gradient-to-r from-indigo-600/10 to-transparent border-l-2 border-indigo-500/50"
        animate={{
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.opacity
        }}
        transition={{
            type: "spring",
            stiffness: 350,
            damping: 30
        }}
    >
        {/* The "Electric" Glow Line */}
        <div className="absolute left-0 top-1/4 h-1/2 w-[3px] bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)] rounded-full" />
    </motion.div>
);

export default function GlobalSideBar() {
    const [NotificationOpen, setNotificationOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activeElRef = useRef<HTMLElement | null>(null);
    const location = useLocation();
    const { user } = useAuth();

    const [indicator, setIndicator] = useState({
        top: 0,
        height: 0,
        opacity: 0,
    });

    const moveIndicator = (el: HTMLElement) => {
        if (!el) return;
        const { height } = el.getBoundingClientRect();
        setIndicator({
            top: el.offsetTop,
            height,
            opacity: 1,
        });
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const activeEl = containerRef.current.querySelector(
            `[data-path='${location.pathname}']`
        ) as HTMLElement | null;

        if (activeEl) {
            activeElRef.current = activeEl;
            moveIndicator(activeEl);
        }
    }, [location.pathname]);

    return (
        <>
            <aside className="hidden md:flex h-screen w-20 bg-background/80 dark:bg-black/40 border-r border-border dark:border-white/5 flex-col items-center justify-between py-8 relative z-[100] backdrop-blur-2xl transition-colors duration-500">

                <NavLink className="flex flex-col items-center gap-2 group cursor-pointer" to={"/"}>
                    <Logo />
                    <span className="text-[8px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.3em] group-hover:text-primary transition-colors">TutorAive</span>
                </NavLink>
                <ThemeToggle />

                <nav
                    ref={containerRef}
                    onPointerLeave={() => activeElRef.current && moveIndicator(activeElRef.current)}
                    className="relative w-full flex flex-col items-center gap-6 px-3"
                >
                    <Cursor indicator={indicator} />

                    {navItems.map(({ id, icon: Icon, label }) => {
                        const isActive = location.pathname === id;
                        return (
                            <NavLink
                                to={id}
                                key={id}
                                data-path={id}
                                onPointerEnter={(e) => moveIndicator(e.currentTarget)}
                                className={cn(
                                    "relative z-10 h-12 w-12 flex items-center justify-center rounded-2xl transition-all duration-300 group cursor-pointer",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                                {/* Floating Tooltip */}
                                <div className="absolute left-24 px-3 py-2 bg-popover/90 backdrop-blur-md border border-border rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-2xl">
                                    <span className="text-[10px] font-bold font-oswald text-popover-foreground uppercase tracking-widest whitespace-nowrap">{label}</span>
                                </div>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="flex flex-col items-center gap-8">
                    <button
                        className={cn(
                            "p-3 rounded-2xl transition-all relative group",
                            NotificationOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                        onClick={() => setNotificationOpen((prev) => !prev)}
                    >
                        <Bell size={20} strokeWidth={2} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
                    </button>

                    <NavLink
                        to={"dashboard"}
                        className={cn(
                            "relative w-12 h-12 rounded-full cursor-pointer border overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95",
                            location.pathname === "/dashboard"
                                ? "border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                                : "border-border dark:border-white/10"
                        )}
                    >
                        <Avatar className="w-full h-full">
                            <AvatarImage className="object-cover w-full h-full" src={user?.profilePicture || defaultAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs flex items-center justify-center w-full h-full">
                                {user?.userName?.substring(0, 2).toUpperCase() || "SR"}
                            </AvatarFallback>
                        </Avatar>
                    </NavLink>
                </div>

                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/30 to-transparent pointer-events-none opacity-50" />
            </aside>
            <NotificationSidebar open={NotificationOpen} setOpen={setNotificationOpen} />
        </>
    );
};
