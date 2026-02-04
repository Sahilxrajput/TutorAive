import React from 'react'
import { motion } from 'framer-motion'

interface RevealProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const RevealText = ({ children, delay = 0, className = "" }: RevealProps) => (
    <div className={`relative overflow-hidden py-4 perspective-1200 ${className}`}>
        <motion.div
            initial={{
                y: "100%",
                opacity: 0,
                rotateX: 20,
                transformOrigin: "50% 0%"
            }}
            animate={{
                y: 0,
                opacity: 1,
                rotateX: 0
            }}
            transition={{
                duration: 1.2,
                delay: delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="will-change-transform"
        >
            {children}
        </motion.div>
    </div>
);

export default RevealText;