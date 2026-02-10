import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';


const SectorLoading = () => {
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-[9999]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative flex flex-col items-center">

                <div className="relative mb-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-[-20px] border border-primary/30 rounded-[2.5rem]"
                    />

                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 4,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 bg-card border border-border rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl shadow-primary/10 backdrop-blur-xl"
                    >
                        <Layers className="w-8 h-8 text-primary" />

                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute inset-[-10px]"
                        >
                            <Sparkles className="w-4 h-4 text-primary/60 absolute top-0 right-0" />
                        </motion.div>
                    </motion.div>
                </div>

                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-1">
                            Sector Syncing
                        </h2>
                        <div className="flex gap-1">
                            {[0, 1, 2].map((dot) => (
                                <motion.div
                                    key={dot}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: dot * 0.2 }}
                                    className="w-1 h-1 bg-primary rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>

                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                        Establishing Secure Node
                    </p>
                </div>
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
        </div>
    );
};

export default SectorLoading;