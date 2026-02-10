import { MonitorPlay, Plus, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LunchButton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className="fixed z-50 bottom-6 right-6 md:bottom-10 md:right-10"
        >
            {/* Glow Effect Layer */}
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />

            <Link
                to={"/launch-classroom"}
                className="group relative flex items-center justify-center overflow-hidden rounded-2xl md:rounded-3xl bg-primary p-0.5 shadow-2xl shadow-primary/20 active:scale-95 transition-transform"
            >
                <div className="flex items-center gap-3 bg-primary px-4 py-4 md:px-7 md:py-4 rounded-[inherit] border border-white/10">
                    <div className="relative flex items-center justify-center">
                        <MonitorPlay
                            size={24}
                            className="text-primary-foreground relative z-10 group-hover:rotate-6 transition-transform duration-300"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-white/40 rounded-full blur-md"
                        />
                    </div>

                    <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-[0.2em] mb-1">
                            Command Center
                        </span>
                        <span className="text-sm font-black text-primary-foreground uppercase tracking-widest font-oswald flex items-center gap-2">
                            Launch Classroom
                            <Sparkles size={14} className="animate-pulse" />
                        </span>
                    </div>

                    <div className="md:hidden">
                        <Plus size={20} className="text-primary-foreground" />
                    </div>
                </div>

                {/* Effect */}
                <motion.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
            </Link>
        </motion.div>)
}

export default LunchButton