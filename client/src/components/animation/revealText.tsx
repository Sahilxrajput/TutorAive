import React from 'react'
import { motion } from 'framer-motion'

const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <div className="overflow-hidden">
        <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.33, 1, 0.68, 1]
            }}
        >
            {children}
        </motion.div>
    </div>
);

export default RevealText