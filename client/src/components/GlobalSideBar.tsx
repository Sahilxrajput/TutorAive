import { useState, useEffect, useRef } from "react";
import {
    BookOpen,
    Twitch,
    Compass,
    Bell,
    Home
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import defaultAvatar from '@/./assets/image/avatar.png'
import useAuth from "@/hooks/useAuth";
import { NotificationSidebar } from "./notification/NotificationSidebar";

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
            stiffness: 400,
            damping: 35
        }}
    >
        {/* The "Electric" Glow Line */}
        <div className="absolute left-0 top-1/4 h-1/2 w-[2px] bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
    </motion.div>
);

const GlobalSideBar = () => {
    const [NotificationOpen, setNotificationOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activeElRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();
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

    // Sync indicator with active route on load and state change
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

    return (<>
        <aside className="hidden md:flex h-screen w-20 bg-black border-r border-white/5 flex-col items-center justify-between py-8 relative z-[100] backdrop-blur-xl">

            <Avatar className="flex flex-col items-center justify-center">
                <AvatarImage className="object-contain w-16 rounded-full" src="./logo.png" alt="Logo" />
                <AvatarFallback className="text-indigo-400 font-bold text-xs">
                    SR
                </AvatarFallback>
                <span className="text-[10px] font-bold font-oswald leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 tracking-widest uppercase">TutorAive</span>
            </Avatar>

            {/* Main Navigation */}
            <nav
                ref={containerRef}
                onPointerLeave={() => {
                    if (activeElRef.current) {
                        moveIndicator(activeElRef.current);
                    }
                }}
                className="relative w-full flex flex-col items-center gap-4 px-2"
            >
                <Cursor indicator={indicator} />

                {navItems.map(({ id, icon: Icon, label }) => {
                    const isActive = location.pathname === id;
                    return (
                        <div
                            key={id}
                            data-path={id}
                            onPointerEnter={(e) => moveIndicator(e.currentTarget)}
                            onClick={() => navigate(id)}
                            className={`relative z-10 h-14 w-14 flex items-center justify-center rounded-xl transition-all duration-300 group cursor-pointer ${isActive ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-200'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                            {/* Tooltip */}
                            <div className="absolute left-20 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-2xl">
                                <span className="text-[10px] font-bold font-oswald text-white uppercase tracking-widest">{label}</span>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-6">
                <button className={cn("text-neutral-600 hover:text-indigo-400 transition-colors relative", NotificationOpen && "text-indigo-400")}
                    onClick={() => setNotificationOpen((prev) => !prev)}>
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-black shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </button>

                <Avatar 
                onClick={()=> navigate("/dashboard")}
                className={cn("rounded-2xl cursor-pointer border transition-all duration-500",
                    location.pathname === "/dashboard"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/5 hover:border-white/20"
                )}>
                    <AvatarImage className="object-contain w-8 rounded-full" src={user?.profilePicture || defaultAvatar} alt="User" />
                    <AvatarFallback className="text-indigo-400 font-bold text-xs">
                        SR
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Background Glow Pulse */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
        </aside>
        <NotificationSidebar open={NotificationOpen} setOpen={setNotificationOpen} />
    </>
    );
};

export default GlobalSideBar