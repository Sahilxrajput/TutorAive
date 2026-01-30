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
        "Quick class setup and easy student onboarding",
        "Automatic attendance tracking",
        "Live polls and real-time Q&A during sessions",
        "Simple assignment sharing and collection",
        "Centralized notes and resource distribution",
        "Clear engagement insights from live activity",
        "Browser-based teaching with no app installs",
        "Direct interaction with students in real time",
    ];


    return (
        <div className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-500/30 overflow-hidden relative font-sans">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full z-10" />

            <div className="max-w-7xl mx-auto px-8 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16">

                {/* LEFT CONTENT */}
                <div className="w-full lg:w-1/2 z-10">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-indigo-500 font-bold tracking-[0.3em] text-xs uppercase mb-6 block font-oswald"
                    >
                        Educator Portal
                    </motion.span>

                    <div className="mb-8">
                        <RevealText delay={0.2}>
                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-cinzel">
                                TEACH WHAT
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-white font-cinzel">
                                YOU LOVE.
                            </h1>
                        </RevealText>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10"
                    >
                        Ditch the paperwork and just teach. Our platform is your new classroom sidekick—set up classes in seconds and let the tech do the grunt work.
                    </motion.p>

                    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        {perks.map((perk, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                    <CheckCircle2 size={14} className="text-indigo-400" />
                                </div>
                                <span className="text-xs font-medium  text-neutral-300 font-oswald tracking-wider uppercase">{perk}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/home")}
                        className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-3 group shadow-2xl shadow-indigo-500/20 font-oswald tracking-widest text-sm"
                    >
                        BECOME AN INSTRUCTOR <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* RIGHT CONTENT (Visual) */}
                {/* RIGHT CONTENT (Visual with Pop-out Effect) */}
                <div className="w-full lg:w-1/2 relative flex justify-center pt-20"> {/* Added pt-20 to make room for the head */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-md aspect-[4/5]"
                    >
                        {/* The "Box" Background */}
                        <div className="absolute inset-0 rounded-[4rem] border border-white/10 bg-neutral-900/50 backdrop-blur-sm shadow-3xl z-10" />

                        {/* The Pop-out Image */}
                        <motion.img
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1.1, y: -40 }} // Scale up and move up to "pop" out of the top
                            transition={{ duration: 1.2, ease: "circOut", delay: 0.2 }}
                            src="/girl.png"
                            alt="Teacher"
                            className="absolute inset-0  w-full h-full object-contain z-30 drop-shadow-[0_20px_50px_rgba(79,70,229,0.3)]"
                        />

                        {/* Gradient Overlay - Strictly inside the box */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-[4rem] z-20 pointer-events-none" />
                    </motion.div>

                    {/* Decorative Background Glow Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-indigo-500/10 rounded-[4.5rem] -z-10 animate-[spin_20s_linear_infinite]" />

                    {/* Decorative Background Elements */}
                    <div className="absolute -inset-4 border-2 border-dashed border-indigo-500/20 rounded-[4.5rem] -z-10 animate-pulse" />

                    {teacherFloatingBadges.map((badge, i) => (
                        <FloatingBadge key={i} {...badge} />
                    ))}

                </div>
            </div>

            {/* Vertical Theme Text */}
            <div className="absolute -right-32 bottom-20 rotate-90 opacity-[0.03] select-none pointer-events-none">
                <h1 className="text-[6rem] font-black font-cinzel text-white leading-none uppercase">
                    Instructor
                </h1>
            </div>
        </div>
    );
};

export default TeacherPage;