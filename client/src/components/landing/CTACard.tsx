import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CTACard = ({ activeTab }: { activeTab: string }) => {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative group"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-[4rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

            <div className="relative bg-card dark:bg-neutral-950 border border-primary/10 rounded-[3.5rem] p-12 md:p-16 overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -ml-20 -mb-20" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold font-oswald uppercase tracking-[0.3em]"
                    >
                        <Sparkles size={12} /> Limitless Learning
                    </motion.div>

                    <h3 className="text-4xl md:text-6xl font-bold text-foreground mb-8 font-cinzel leading-tight tracking-tight max-w-4xl">
                        {activeTab === 'student'
                            ? <>READY TO START YOUR <span className="text-primary italic font-montserrat">ADVENTURE?</span></>
                            : <>READY TO TRANSFORM YOUR <span className="text-primary italic font-montserrat">CLASSROOM?</span></>
                        }
                    </h3>

                    <div className="flex flex-col items-center gap-8">
                        {/* Main Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group/btn px-12 py-5 bg-foreground text-background rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300 font-oswald tracking-[0.2em] text-sm flex items-center gap-3 shadow-2xl shadow-primary/20"
                            onClick={() => navigate("/home")}
                        >
                            {activeTab === 'student' ? 'JOIN A ROOM' : 'GET STARTED NOW'}
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-8">
                            {[
                                { icon: CheckCircle2, text: "NO CREDIT CARD" },
                                { icon: CheckCircle2, text: "FREE FOR EVERYONE" },
                                { icon: CheckCircle2, text: "GSoC '26 READY" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                    <badge.icon size={16} className="text-primary shadow-sm" />
                                    <span className="text-[10px] text-muted-foreground font-bold font-oswald tracking-[0.15em] uppercase">
                                        {badge.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CTACard