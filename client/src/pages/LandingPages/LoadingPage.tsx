import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Globe, Zap } from 'lucide-react';

const LoadingPage = () => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statusMessages = [
        "Initializing TutorAive Core...",
        "Synchronizing Digital Environment...",
        "Verifying WebRTC Handshakes...",
        "Loading Student Command Center...",
        "Igniting Energy Cells...",
        "Preparing the Frontier..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(oldProgress + diff, 100);
            });
        }, 350);

        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statusMessages.length);
        }, 1800);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-background dark:bg-black flex flex-col items-center justify-center overflow-hidden">

            {/* Ambient Dynamic Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-primary blur-[150px] rounded-full -z-10 opacity-20"
            />

            <div className="relative flex flex-col items-center w-full max-w-sm px-8">

                {/* Central Power Cell */}
                <div className="relative mb-16">
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(var(--primary), 0.2)",
                                "0 0 60px rgba(var(--primary), 0.5)",
                                "0 0 20px rgba(var(--primary), 0.2)"
                            ],
                            rotateY: [0, 180, 360]
                        }}
                        transition={{
                            boxShadow: { duration: 2, repeat: Infinity },
                            rotateY: { duration: 4, repeat: Infinity, ease: "linear" }
                        }}
                        className="w-24 h-24 bg-card dark:bg-neutral-900 border border-primary/20 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl"
                    >
                        <div className="w-12 h-12 relative">
                            <img src="/logo.png" alt="TutorAive Logo" className="w-full h-full object-contain" />
                            {/* Small internal energy spark */}
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute -top-1 -right-1 text-primary"
                            >
                                <Zap size={14} fill="currentColor" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Orbital Handshake Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-25px] border border-primary/10 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-50px] border border-primary/5 rounded-full border-dashed"
                    />
                </div>

                {/* Branding Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-cinzel text-foreground dark:text-white tracking-[0.25em] uppercase">
                        TUTORAIVE
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                        <span className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-[0.4em]">
                            Establishing Connection
                        </span>
                    </div>
                </div>

                {/* Technical Progress Bar */}
                <div className="w-full space-y-5">
                    <div className="flex justify-between items-end px-1">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statusIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-[10px] font-bold font-oswald text-primary uppercase tracking-widest italic"
                            >
                                {statusMessages[statusIndex]}
                            </motion.p>
                        </AnimatePresence>
                        <span className="text-2xl font-bold font-cinzel text-foreground dark:text-white">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="h-[3px] w-full bg-primary/10 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)]"
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "circOut" }}
                        />
                    </div>
                </div>

                {/* System Specs Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-12 flex items-center gap-10 text-muted-foreground/30"
                >
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck size={20} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">TLS 1.3</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-primary/40">
                        <Cpu size={20} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">SFU Core</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Globe size={20} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Global P2P</span>
                    </div>
                </motion.div>
            </div>

            {/* Matrix-style Dot Grid */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
    );
};

export default LoadingPage;