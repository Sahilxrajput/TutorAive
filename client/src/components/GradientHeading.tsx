import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode; 
    className?: string;
}

export default function GradientHeading({ children, className = "" }: Props) {
    return (
        <motion.h1
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
            }}
            className={cn("relative inline-block pb-2 font-cinzel font-bold tracking-tighter bg-gradient-to-r from-primary via-foreground to-dark bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(38,217,217,0.1)]",
                className
            )}
        >
            {children}
        </motion.h1>
    );
}