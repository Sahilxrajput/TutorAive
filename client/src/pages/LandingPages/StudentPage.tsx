import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Rocket, Gamepad2, MessageSquare, NotebookPen, Users, Sparkles, MessageCircleQuestionMark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevealText from '@/components/animation/revealText';
import FloatingBadge from '@/components/animation/FloatingBadge';
import GradientHeading from '@/components/GradientHeading';

const StudentPage = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const studentFloatingBadges = [
        { styleName: "-left-12 bottom-1/4 z-50", icon: Gamepad2, title: "Engagement", subTitle: "Gamified", iconColor: "green" as const },
        { styleName: "right-0 top-12 z-20", icon: MessageSquare, title: "Quick Posts", subTitle: "Share Thoughts", iconColor: "purple" as const },
        { styleName: "right-4 bottom-20 z-50", icon: NotebookPen, title: "Smart Notes", subTitle: "Auto-Saved", iconColor: "yellow" as const },
        { styleName: "-left-8 top-1/4 z-10", icon: Users, title: "Community", subTitle: "Study Group", iconColor: "blue" as const },
        { styleName: "-right-12 top-1/3 z-10", icon: MessageCircleQuestionMark, title: "QnA", subTitle: "Live QnA", iconColor: "primary" as const },
    ];

    const perks = [
        "One-Click Join",
        "Live Doubt Solving",
        "Gamified Progress",
        "Auto-Saved Notes",
        "Peer Study Groups",
        "Exam Focus Mode",
        "Load-Free Browser",
        "Interactive Quizzes"
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden relative">

            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[140px] rounded-full -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-24 flex flex-col lg:flex-row-reverse items-center gap-24">

                <div className="w-full lg:w-1/2 z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold font-oswald uppercase tracking-[0.3em] w-fit mb-8"
                    >
                        <Sparkles size={12} /> Learner Experience
                    </motion.div>

                    <div className="mb-8">
                        <RevealText delay={0.2}>
                            <h1 className="text-6xl md:text-7xl font-bold text-foreground font-montserrat">
                                LEARN WITH
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <GradientHeading className="text-6xl md:text-8xl leading-none italic">
                                CLARITY.
                            </GradientHeading>
                        </RevealText>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-lg mb-12 font-inter"
                    >
                        Learning shouldn't be a chore. Access interactive sessions and the support you need to <span className="text-foreground italic font-medium">master concepts</span>, not just memorize them.
                    </motion.p>

                    <div ref={ref} className="grid grid-cols-2 gap-y-4 gap-x-8 mb-14">
                        {perks.map((perk, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.05 * index }}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <Rocket size={12} className="text-primary group-hover:text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground dark:text-neutral-400 font-oswald tracking-[0.1em] uppercase group-hover:text-foreground transition-colors">
                                    {perk}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, x: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/home")}
                        className="px-12 py-5 bg-foreground text-background dark:bg-indigo-600 dark:text-white rounded-2xl font-bold flex items-center gap-4 group shadow-2xl shadow-indigo-500/20 font-oswald tracking-[0.2em] text-xs transition-all duration-500"
                    >
                        START YOUR JOURNEY
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </motion.button>
                </div>

                <div className="w-full lg:w-1/2 relative flex justify-center py-20">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-dashed border-indigo-500/10 rounded-[6rem] -z-10 animate-[spin_80s_linear_infinite]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 w-full max-w-md aspect-[4/5]"
                    >
                        <div className="absolute inset-0 rounded-[4rem] border border-border dark:border-white/10 bg-card/60 dark:bg-neutral-900/50 backdrop-blur-2xl shadow-2xl z-10" />

                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 z-50 bg-indigo-500/10 text-indigo-500 px-5 py-2 rounded-xl border border-indigo-500/20 text-[9px] font-bold font-oswald uppercase tracking-widest shadow-xl backdrop-blur-md"
                        >
                            Study Mode Active
                        </motion.div>

                        <motion.img
                            initial={{ y: 80, scale: 0.8 }}
                            animate={{ y: -60, scale: 1.15 }}
                            transition={{
                                duration: 1.5,
                                ease: [0.19, 1, 0.22, 1],
                                delay: 0.2
                            }}
                            src="/hero.png"
                            alt="Student"
                            className="absolute inset-0 w-full h-full object-contain z-30 drop-shadow-[0_40px_80px_rgba(99,102,241,0.3)]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-card/90 dark:from-neutral-950/90 via-transparent to-transparent rounded-[4rem] z-20 pointer-events-none" />
                    </motion.div>

                    {studentFloatingBadges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 1 + (i * 0.15), type: "spring", stiffness: 120 }}
                        >
                            <FloatingBadge {...badge} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentPage;