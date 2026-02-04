import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
    type LucideIcon,
    ClipboardList,
    BarChart3,
    MessageCircleQuestion,
    NotebookPen,
    CheckSquare,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevealText from '@/components/animation/revealText';
import FloatingBadge from '@/components/animation/FloatingBadge';
import GradientHeading  from '@/components/GradientHeading';

const TeacherPage = () => {
    const navigate = useNavigate();
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    type FloatingBadgeItem = {
        styleName: string;
        icon: LucideIcon;
        title: string;
        subTitle: string;
        iconColor: "blue" | "green" | "yellow" | "purple" | "indigo";
        dir?: 'postive' | 'negative'
    };

    const teacherFloatingBadges: FloatingBadgeItem[] = [
        {
            styleName: "-left-6 top-1/4 z-10",
            icon: ClipboardList,
            title: "Assignments",
            subTitle: "Upload & Review",
            iconColor: "blue",
        },
        {
            styleName: "right-10 top-12 z-10",
            icon: BarChart3,
            title: "Live Polls",
            subTitle: "Instant Results",
            iconColor: "green",
        },
        {
            styleName: "-left-4 top-1/2 z-10",
            icon: MessageCircleQuestion,
            title: "Live Q&A",
            subTitle: "Doubt Clearing",
            iconColor: "purple",
        },
        {
            styleName: "right-8 bottom-16 z-10",
            icon: NotebookPen,
            title: "Class Notes",
            subTitle: "Share Notes",
            iconColor: "yellow",
        },
        {
            styleName: "left-10 bottom-10 z-10",
            icon: CheckSquare,
            title: "Attendance",
            subTitle: "Auto Marked",
            iconColor: "indigo",
        },
    ];

    const perks = [
        "Quick class setup",
        "Auto attendance",
        "Real-time Polls",
        "Easy Assignments",
        "Centralized Notes",
        "Engagement Insights",
        "No App Installs",
        "Live Interaction",
    ];

    return (
        <div id='teachers' className="min-h-screen bg-background overflow-hidden relative font-sans selection:bg-primary/30">

            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-20">

                <div className="w-full lg:w-1/2 z-10">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.4em" }}
                        className="text-primary font-bold text-[10px] uppercase mb-6 block font-oswald"
                    >
                        Educator Portal
                    </motion.span>

                    <div className="mb-8">
                        <RevealText delay={0.2}>
                            <h1 className="text-6xl md:text-[4rem] font-bold text-foreground font-cinzel">
                                TEACH WHAT
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <GradientHeading className="text-6xl md:text-8xl leading-none italic font-montserrat font-medium">
                                YOU LOVE.
                            </GradientHeading>
                        </RevealText>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-lg mb-12 font-inter"
                    >
                        Ditch the paperwork and just teach. Our platform is your new classroom sidekick—set up classes in seconds and let the tech handle the <span className="text-foreground italic">grunt work.</span>
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
                                    <CheckCircle2 size={12} className="text-primary group-hover:text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground dark:text-neutral-400 font-oswald tracking-[0.1em] uppercase group-hover:text-foreground transition-colors">
                                    {perk}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/home")}
                        className="px-12 py-5 bg-foreground text-background dark:bg-primary dark:text-white rounded-2xl font-bold flex items-center gap-4 group shadow-xl shadow-primary/10 font-oswald tracking-[0.2em] text-xs transition-all duration-300"
                    >
                        BECOME AN INSTRUCTOR
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </motion.button>
                </div>

                <div className="w-full lg:w-1/2 relative flex justify-center py-20">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-dashed border-primary/20 rounded-[5rem] -z-10 animate-[spin_60s_linear_infinite]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 w-full max-w-md aspect-[4/5]"
                    >
                        <div className="absolute inset-0 rounded-[4rem] border border-border dark:border-white/10 bg-card/50 dark:bg-neutral-900/50 backdrop-blur-md shadow-2xl z-10 shadow-primary/5" />

                        <motion.img
                            initial={{ y: 60, scale: 0.9 }}
                            animate={{ y: -60, scale: 1.15 }}
                            transition={{
                                duration: 1.5,
                                ease: [0.16, 1, 0.3, 1], 
                                delay: 0.3
                            }}
                            src="/girl.png"
                            alt="Teacher"
                            className="absolute inset-0 w-full h-full object-contain z-30 drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_30px_60px_rgba(13,148,136,0.3)]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 dark:from-neutral-950/80 via-transparent to-transparent rounded-[4rem] z-20 pointer-events-none" />
                    </motion.div>

                    {teacherFloatingBadges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.8 + (i * 0.1), type: "spring", stiffness: 100 }}
                        >
                            <FloatingBadge {...badge} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherPage;