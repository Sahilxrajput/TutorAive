import { Link, useLocation } from "react-router-dom";
import {
    Baby,
    BookOpen,
    Twitch,
    Compass,
    LucideOctagon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { NotificationSidebar } from "./notification/NotificationSidebar";

interface Indicator {
    top: number;
    height: number;
    opacity: number;
}

const navItems = [
    { to: "/", icon: LucideOctagon },
    { to: "/classrooms", icon: Compass },
    { to: "/notes", icon: BookOpen },
    { to: "/community", icon: Twitch },
];

const Sidebar = () => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const activeElRef = useRef<HTMLElement | null>(null);


    const [indicator, setIndicator] = useState<Indicator>({
        top: 0,
        height: 0,
        opacity: 0,
    });

    const moveIndicator = (el: HTMLElement) => {
        const { height } = el.getBoundingClientRect();
        setIndicator({
            top: el.offsetTop,
            height,
            opacity: 1,
        });
    };

    // Sync indicator with active route
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
        <aside className="h-screen w-16 border-r-2 flex flex-col items-center justify-between text-[#1F0322] py-4 relative">
                {/* Nav items */}
                <div
                    ref={containerRef}
                    onPointerLeave={() => {
                        if (activeElRef.current) {
                            moveIndicator(activeElRef.current);
                        }
                    }}
                    className="relative w-full flex flex-col items-center gap-6"
                >
                    <Cursor indicator={indicator} />

                    {navItems.map(({ to, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            data-path={to}
                            onPointerEnter={(e) =>
                                moveIndicator(e.currentTarget)
                            }
                            className="relative z-10 h-10 w-10 py-6 flex items-center justify-center hover:text-[#DA4167] transition-colors ease-in-out duration-500 "
                        >
                            <Icon size={24} />
                        </Link>
                    ))}
                </div>

            {/* Bottom section */}
            <div className="flex flex-col items-center gap-4">
                <NotificationSidebar />
                <Link
                    to="/profile"
                    className="h-10 w-10 flex items-center justify-center"
                >
                    <Baby />
                </Link>
            </div>
        </aside>
    );
};

const Cursor = ({ indicator }: { indicator: Indicator }) => (
    <motion.div
        className="absolute w-full aspect-square rounded-lg bg-primary/30 border-primary border-2 z-0"
        animate={indicator}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
    />
);

export default Sidebar;
