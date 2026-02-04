import { MessageSquare, Star, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

const Mission = () => {
    return (
        <section id="mission" className="py-24 relative overflow-hidden bg-background">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <SectionHeading
                        subtitle="The Mission"
                        title="Online Learning Doesn't Have to be Lonely"
                    />

                    <p className="text-xl text-muted-foreground font-inter font-light mb-10 leading-relaxed max-w-xl">
                        Most online classes still feel one-sided. Cameras off, mics muted, and real interaction missing. Our mission is to turn passive sessions into <span className="text-foreground font-medium italic">active classrooms</span> where students participate and teachers actually get feedback.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Stat 1 */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-2xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                            >
                                <div className="text-5xl font-bold text-primary mb-2 font-oswald tracking-tight">2.5X</div>
                                <div className="text-[10px] text-foreground uppercase tracking-[0.2em] font-bold font-oswald mb-2">Higher Scoring</div>
                                <p className="text-sm text-muted-foreground leading-snug">For students who get involved online vs. sitting quietly.</p>
                            </motion.div>
                        </div>

                        {/* Stat 2 */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-2xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <div className="text-5xl font-bold text-foreground mb-2 font-oswald tracking-tight uppercase">Zero</div>
                                <div className="text-[10px] text-foreground uppercase tracking-[0.2em] font-bold font-oswald mb-2">Manual Headcounts</div>
                                <p className="text-sm text-muted-foreground leading-snug">Attendance runs itself, letting you focus on the people.</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT GRAPHIC: CLASSROOM CONNECTION */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full aspect-square max-w-[500px] bg-card dark:bg-neutral-900/40 backdrop-blur-xl border border-border dark:border-white/5 rounded-[4rem] flex items-center justify-center p-12 shadow-2xl shadow-primary/5"
                    >
                        {/* Floating Status Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 right-12 bg-success/10 text-success px-4 py-2 rounded-full border border-success/20 flex items-center gap-2 text-[10px] font-bold font-oswald uppercase tracking-widest shadow-lg backdrop-blur-md"
                        >
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            Live Interaction
                        </motion.div>

                        <div className="text-center space-y-6">
                            <div className="flex justify-center -space-x-4 mb-8">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="w-20 h-20 bg-dark rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20 z-30"
                                >
                                    <Users size={32} className="text-white" strokeWidth={1.5} />
                                </motion.div>

                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                    className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg z-20 mt-8"
                                >
                                    <Star size={24} className="text-yellow-500 fill-yellow-500" />
                                </motion.div>

                                <motion.div
                                    animate={{ x: [0, 5, 0], y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                    className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-md z-10"
                                >
                                    <MessageSquare size={24} className="text-primary" />
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-3xl font-bold text-foreground font-cinzel tracking-tight">Classroom Connection</h4>
                                <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed font-inter font-light">
                                    Transforming screen time into a valuable learning experience through real-time participation.
                                </p>
                            </div>

                            {/* Features list inside card */}
                            <div className="pt-4 flex flex-wrap justify-center gap-3">
                                {['WebRTC Video', 'Live Chat', 'Live poll'].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-muted rounded-lg text-[9px] font-bold font-oswald uppercase tracking-wider text-muted-foreground border border-border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Mission