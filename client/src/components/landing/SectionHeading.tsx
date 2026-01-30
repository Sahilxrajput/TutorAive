import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
    subtitle: string,
    title: string,
    centered?: boolean,
}

const SectionHeading = ({ subtitle, title, centered = false }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className={`mb-16 ${centered ? 'text-center' : ''}`}>
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-indigo-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block"
            >
                {subtitle}
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white max-w-2xl leading-tight"
                style={{ fontFamily: 'var(--font-cinzel)' }}
            >
                {title}
            </motion.h2>
        </div>
    );
};

export default SectionHeading