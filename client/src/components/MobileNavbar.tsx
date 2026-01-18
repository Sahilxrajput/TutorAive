import { useState } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    House,
    Twitch,
    UserRound,
    Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
    { id: "/", icon: House },
    { id: "/classrooms", icon: Compass },
    { id: "/notes", icon: BookOpen },
    { id: "/community", icon: Twitch },
    { id: "/profile", icon: UserRound },
];

interface Indicator {
    left: number;
    width: number;
    opacity: number;
}

const MobileSideBar = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState<string>("/");
    const [indicator, setIndicator] = useState<Indicator>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const updateIndicator = (el: HTMLElement) => {
        const { width } = el.getBoundingClientRect();
        setIndicator({
            left: el.offsetLeft,
            width,
            opacity: 1,
        });
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 rounded-t-xl bg-zinc-900 border-t">
            <ul className="relative flex h-full items-center justify-around">
                <Cursor indicator={indicator} />

                {items.map(({ id, icon: Icon }) => {
                    const isActive = active === id;

                    return (
                        <li
                            key={id}
                            className="z-10 flex h-14 w-14 items-center justify-center text-zinc-400"
                            onPointerEnter={(e) => updateIndicator(e.currentTarget)}
                            onClick={(e) => {
                                setActive(id);
                                updateIndicator(e.currentTarget);
                                navigate(id);
                            }}
                        >
                            <motion.div
                                animate={{
                                    y: isActive ? -27 : 0,
                                    scale: isActive ? 1.25 : 1,
                                    color: isActive ? "#ffffff" : "#a1a1aa",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness:1000,
                                    damping: 25,
                                }}
                            >
                                <Icon size={22} />
                            </motion.div>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

const Cursor = ({ indicator }: { indicator: Indicator }) => (
    <motion.div
        className="absolute h-14 bottom-1/2 rounded-full bg-zinc-900 border-white border-4"
        animate={indicator}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
);

export default MobileSideBar;
