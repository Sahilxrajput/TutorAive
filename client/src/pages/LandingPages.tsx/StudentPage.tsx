import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Rocket, Gamepad2, MessageSquare, NotebookPen, Users, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevealText from '@/components/animation/revealText';
import FloatingBadge from '@/components/animation/FloatingBadge';



const StudentPage = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    type FloatingBadgeItem = {
        styleName: string;
        icon: LucideIcon;
        title: string;
        subTitle: string;
        iconColor: "green" | "purple" | "yellow" | "blue";
        dir?: 'postive' | 'negative'
    };

    const studentFloatingBadges: FloatingBadgeItem[] = [
        {
            styleName: "-left-8 bottom-1/4 z-50",
            icon: Gamepad2,
            title: "Engagement",
            subTitle: "Gamified",
            iconColor: "green",
            dir: 'negative'
        },
        {
            styleName: "right-10 top-12 z-20",
            icon: MessageSquare,
            title: "Quick Posts",
            subTitle: "Share Thoughts",
            iconColor: "purple",
        },
        {
            styleName: "right-10 bottom-10 z-50",
            icon: NotebookPen,
            title: "Smart Notes",
            subTitle: "Auto-Saved",
            iconColor: "yellow",
            dir: 'negative'
        },
        {
            styleName: "-left-4 top-1/3 z-10",
            icon: Users,
            title: "Community",
            subTitle: "Study Together",
            iconColor: "blue",
        },
    ];

    const studentPerks = [
        "One-Click Join System",
        "Interactive live classes",
        "Real-time doubt solving",
        "Structured learning paths",
        "Learn at your own pace",
        "Smart notes & summaries",
        "Community-driven learning",
        "Skill & exam focused content"
    ];

    return (
        <div className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-500/30 overflow-hidden relative">

            {/* Background Glow - Positioned differently for the student side */}
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none z-10" />

            <div className="max-w-7xl mx-auto px-8 pt-32 pb-20 flex flex-col lg:flex-row-reverse items-center gap-16">

                {/* RIGHT CONTENT (Text) */}
                <div className="w-full lg:w-1/2 z-10">
                    <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-indigo-500 font-bold tracking-[0.3em] text-xs uppercase mb-6 block font-oswald"
                    >
                        Learner Experience
                    </motion.span>

                    <div className="mb-8">
                        <RevealText delay={0.2}>
                            <h1 className="text-5xl md:text-7xl font-bold text-white font-cinzel leading-tight">
                                LEARN WITH
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text font-cinzel text-transparent bg-gradient-to-r from-white to-indigo-400">
                                CLARITY.
                            </h1>
                        </RevealText>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10"
                    >
                        Learning should feel clear and motivating. Access interactive sessions and the support you need to truly understand concepts, not just memorize them.
                    </motion.p>

                    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        {studentPerks.map((perk, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                    <Rocket size={12} className="text-indigo-400" />
                                </div>
                                <span className="text-sm font-medium tracking-wide text-neutral-300 font-oswald uppercase">{perk}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/home")}
                        className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all flex items-center gap-3 group shadow-2xl font-oswald tracking-widest text-sm"
                    >
                        START LEARNING <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* LEFT CONTENT (Visual with 3D Pop-out) */}
                <div className="w-full lg:w-1/2 relative flex justify-center pt-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full max-w-md aspect-[4/5]"
                    >
                        {/* Box Frame */}
                        <div className="absolute inset-0 rounded-[4rem] border border-white/10 bg-neutral-900/50 backdrop-blur-sm shadow-3xl z-10" />

                        {/* Pop-out Student Image */}
                        <motion.img
                            initial={{ y: 40, scale: 0.95 }}
                            animate={{ y: -60, scale: 1.1 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            src="/hero.png"
                            alt="Student"
                            className="absolute inset-x-0 bottom-0 w-full h-[120%] object-contain z-30 drop-shadow-[0_35px_60px_rgba(99,102,241,0.3)] -mb-6"
                            style={{
                                maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                            }}
                        />

                        {/* Inner Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent rounded-[4rem] z-20 pointer-events-none" />

                    </motion.div>

                    {studentFloatingBadges.map((badge, i) => (
                        <FloatingBadge key={i} {...badge} />
                    ))}

                    {/* Decorative Background Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-indigo-500/5 rounded-full -z-10" />
                </div>
            </div>
        </div>
    );
};

export default StudentPage;