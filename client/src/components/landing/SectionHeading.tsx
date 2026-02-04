import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
    subtitle: string,
    title: string,
    centered?: boolean,
    className?: string,
}

const SectionHeading = ({ subtitle, title, centered = false, className = "" }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div
            ref={ref}
            className={cn(
                "mb-16 flex flex-col",
                centered ? 'items-center text-center' : 'items-start text-left',
                className
            )}
        >
            <motion.span
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={isInView ? { opacity: 1, letterSpacing: "0.4em" } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-primary font-bold text-[10px] md:text-xs uppercase mb-6 block font-oswald"
            >
                {subtitle}
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "text-4xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight",
                    centered ? "max-w-4xl" : "max-w-2xl"
                )}
            >
                {title.split(' ').map((word, i) => (
                    <span key={i} className={word.includes('.') ? "text-primary italic font-montserrat font-medium" : "font-cinzel"}>
                        {word}{' '}
                    </span>
                ))}
            </motion.h2>

            {centered && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={isInView ? { width: "80px", opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-1 bg-primary mt-8 rounded-full"
                />
            )}
        </div>
    );
};

export default SectionHeading;