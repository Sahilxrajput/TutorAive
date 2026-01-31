import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Globe } from 'lucide-react';

const LoadingPage = () => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statusMessages = [
        "Initializing TutorAive Core...",
        "Synchronizing Digital Environment...",
        "Igniting Energy Cells...",
        "Verifying WebRTC Handshakes...",
        "Loading Student command center...",
        "Preparing the Frontier..."
    ];

    useEffect(() => {
        // Progress simulation
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(oldProgress + diff, 100);
            });
        }, 400);

        // Status message rotation
        const statusTimer = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statusMessages.length);
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Background Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-indigo-600 blur-[150px] rounded-full -z-10"
            />

            <div className="relative flex flex-col items-center w-full max-w-sm px-8">

                {/* Central Power Cell */}
                <div className="relative mb-12">
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(79,70,229,0.2)",
                                "0 0 50px rgba(79,70,229,0.6)",
                                "0 0 20px rgba(79,70,229,0.2)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center relative z-10"
                    >
                        <img src="./logo.png" alt="" />
                    </motion.div>

                    {/* Orbital Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-20px] border border-white/5 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-40px] border border-white/5 rounded-full border-dashed"
                    />
                </div>

                {/* Branding */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold font-cinzel text-white tracking-[0.2em] uppercase">
                        TutorAive
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold font-oswald text-neutral-500 uppercase tracking-[0.3em]">
                            System Syncing
                        </span>
                    </div>
                </div>

                {/* Progress Visual */}
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-end">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statusIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[10px] font-bold font-oswald text-indigo-400 uppercase tracking-widest"
                            >
                                {statusMessages[statusIndex]}
                            </motion.p>
                        </AnimatePresence>
                        <span className="text-xl font-bold font-cinzel text-white">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Footer Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-[-100px] flex items-center gap-6"
                >
                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <ShieldCheck size={16} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <Cpu size={16} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Encrypted</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-20">
                        <Globe size={16} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">Global</span>
                    </div>
                </motion.div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
    );
};
export default LoadingPage;