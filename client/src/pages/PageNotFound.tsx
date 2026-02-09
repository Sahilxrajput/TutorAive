import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import {
    Home,
    ChevronLeft,
    Terminal,
    WifiOff,
    Zap,
    ShieldAlert,
    Orbit,
} from "lucide-react";


const PageNotFound = () => {
    const [glitch, setGlitch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 150);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center font-inter relative overflow-hidden p-6 transition-colors duration-700 bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-white">

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_50%,#e2e8f0,transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,transparent)] opacity-80 dark:opacity-50" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 bg-red-500/[0.05] dark:bg-red-500/[0.03]" />

            <div className="absolute inset-0 pointer-events-none font-mono text-[10px] overflow-hidden leading-none select-none transition-opacity duration-700 opacity-[0.04] dark:opacity-[0.02]">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                        {Math.random().toString(2).substring(2, 100)}
                    </div>
                ))}
            </div>

            <div className="max-w-xl w-full relative z-10 text-center space-y-12">

                <div className="relative inline-block">
                    <motion.h1
                        animate={glitch ? {
                            x: [0, -5, 5, -2, 0],
                            textShadow: [
                                "0 0 0px var(--glitch-base)",
                                "2px 0 0px var(--glitch-red)",
                                "-2px 0 0px var(--glitch-blue)",
                                "0 0 0px var(--glitch-base)"
                            ]
                        } : {}}
                        className="text-[120px] sm:text-[180px] font-bold font-cinzel leading-none tracking-tighter select-none transition-colors duration-700 text-black/5 dark:text-white/5"
                    >
                        404
                    </motion.h1>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-700 border-red-500/10 bg-white dark:border-red-500/20 dark:bg-red-500/5 shadow-[0_10px_40px_rgba(239,68,68,0.05)] dark:shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                            <ShieldAlert size={48} className="text-red-500 animate-pulse sm:w-16 sm:h-16" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 text-red-500/60"
                    >
                        <WifiOff size={14} />
                        <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Signal Interrupted</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl font-bold font-cinzel uppercase tracking-tight transition-colors duration-700 text-slate-900 dark:text-white">
                        Sector <span className="text-red-500 italic">Not Found.</span>
                    </h2>

                    <p className="text-xs sm:text-sm font-inter max-w-md mx-auto leading-relaxed transition-colors duration-700 text-slate-500 dark:text-slate-400">
                        The coordinates you provided do not correspond to any known knowledge sector in the Frontier mesh network. Synchronization failed.
                    </p>
                </div>

                {/* Telemetry Readout */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y max-w-sm mx-auto transition-all duration-700 border-black/5 dark:border-white/5 opacity-80 dark:opacity-40">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest text-muted-foreground">Error ID</span>
                        <span className="text-[10px] font-mono text-slate-900 dark:text-white">ERR_CX_404</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest text-muted-foreground">Status</span>
                        <span className="text-[10px] font-mono text-slate-900 dark:text-white">DE-SYNCED</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl border transition-all duration-300 border-black/5 bg-black/5 hover:bg-black/10 text-slate-600 hover:text-slate-900 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white"
                    >
                        <ChevronLeft size={16} />
                        <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.2em]">Previous Sector</span>
                    </button>

                    <button
                        onClick={() => navigate('/home')}
                        className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-white font-oswald text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Home size={16} />
                        <span>Return to Base</span>
                        <Zap size={14} className="group-hover:fill-current" />
                    </button>
                </div>

                {/* System Footer */}
                <footer className="pt-12 flex justify-center items-center gap-8 transition-opacity duration-700 opacity-40 dark:opacity-20">
                    <div className="flex items-center gap-2">
                        <Terminal size={12} />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">TutorAive OS v4.2</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Orbit size={12} className="animate-spin-slow" />
                        <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">BHU-CS-NODE</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PageNotFound;