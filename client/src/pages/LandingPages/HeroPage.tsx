import { type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    Monitor,
    Rocket,
    UserCheck,
    FileText,
    MessageCircleQuestion,
    UploadCloud,
    ClipboardCheck,
    MessagesSquare,
    Sparkles
} from 'lucide-react';
import FeatureCard from '@/components/landing/FeatureCard';
import RevealText from '@/components/animation/revealText';
import SectionHeading from '@/components/landing/SectionHeading';
import FloatingBadge from '@/components/animation/FloatingBadge';
import GradientHeading  from '@/components/GradientHeading';

interface Props {
    setActiveTab: Dispatch<SetStateAction<string>>
    activeTab: string
}

export default function HeroPage({ activeTab, setActiveTab }: Props) {
    const navigate = useNavigate();

    const teacherFeatures = [
        {
            icon: Zap,
            title: "Quick Class Setup",
            description:
                "Create classes fast and invite students via link or code. No complicated setup, no time wasted before teaching.",
            delay: 1,
        },
        {
            icon: UserCheck,
            title: "Auto Attendance",
            description:
                "Students are marked present automatically when they join the class. Attendance tracking without roll calls.",
            delay: 2,
        },
        {
            icon: BarChart3,
            title: "Live Polls & Reports",
            description:
                "Run live polls during class and instantly see responses. Get clear participation insights without extra effort.",
            delay: 3,
        },
        {
            icon: FileText,
            title: "Notes & Resources Sharing",
            description:
                "Upload and share class notes and materials in one place so students always have access.",
            delay: 4,
        },
        {
            icon: MessageCircleQuestion,
            title: "Live Q&A Sessions",
            description:
                "Let students ask questions in real time and manage discussions without breaking the flow of teaching.",
            delay: 5,
        },
        {
            icon: UploadCloud,
            title: "Assignments Upload & Tracking",
            description:
                "Create assignments, collect submissions, and track progress without juggling multiple tools.",
            delay: 6,
        },
    ];

    const studentFeatures = [
        {
            icon: Monitor,
            title: "Join From Any Device",
            description:
                "Attend classes from mobile, tablet, or laptop using a browser. No app installs, no setup headaches.",
            delay: 1,
        },
        {
            icon: MessageCircleQuestion,
            title: "Live Q&A & Chat",
            description:
                "Ask questions during class and interact in real time without interrupting the session.",
            delay: 2,
        },
        {
            icon: BarChart3,
            title: "Live Poll Participation",
            description:
                "Respond to live polls and see instant results, keeping you engaged throughout the class.",
            delay: 3,
        },
        {
            icon: FileText,
            title: "Access Notes & Materials",
            description:
                "View and download notes and shared resources anytime, so nothing important gets missed.",
            delay: 4,
        },
        {
            icon: ClipboardCheck,
            title: "Assignments Submission",
            description:
                "Submit assignments directly on the platform and keep track of what’s pending or completed.",
            delay: 5,
        },
        {
            icon: MessagesSquare,
            title: "Tweet-Style Community",
            description:
                "Share thoughts, questions, and updates in a tweet-style community space and learn from peers beyond the classroom.",
            delay: 6,
        },
    ];

    return (
        <div id='hero-scetion'  className="min-h-screen text-foreground bg-background overflow-x-hidden selection:bg-primary/30 pt-12">

            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary blur-[160px] rounded-full -z-10"
                />

                <div className="text-center z-10 space-y-12 max-w-7xl mx-auto">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] md:text-xs uppercase tracking-[0.5em] font-oswald mb-6"
                        >
                            <Sparkles size={14} className="animate-pulse" /> The Future of Collaboration
                        </motion.div>

                        <div className="flex flex-col gap-2">
                            <RevealText delay={0.2}>
                                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] font-montserrat text-foreground">
                                    MAKE LEARNING
                                </h1>
                            </RevealText>
                            <RevealText delay={0.4}>
                                <GradientHeading className="text-6xl md:text-9xl leading-[0.85]">
                                    FEEL ALIVE.
                                </GradientHeading>
                            </RevealText>
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="max-w-3xl mx-auto text-lg md:text-2xl text-muted-foreground font-inter font-light leading-relaxed px-4"
                    >
                        Ditch the static lectures. <GradientHeading className="font-medium font-cinzel italic">TutorAive</GradientHeading> transforms silent digital rooms into vibrant, interactive classrooms that move at the speed of thought.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-wrap justify-center gap-6 pt-6"
                    >
                        <button
                            className="px-12 py-5 bg-foreground text-background dark:bg-primary dark:text-white rounded-2xl font-bold hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 group shadow-2xl shadow-primary/20 font-oswald tracking-[0.2em] text-xs uppercase"
                            onClick={() => navigate('/home')}
                        >
                            Start Teaching <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                        <button
                            className="px-12 py-5 border border-border bg-background/50 backdrop-blur-sm hover:bg-muted text-foreground rounded-2xl font-bold transition-all font-oswald tracking-[0.2em] text-xs uppercase"
                            onClick={() => navigate('/home')}
                        >
                            Join as Student
                        </button>
                    </motion.div>
                </div>

                <FloatingBadge styleName='right-[8%] top-[25%]' icon={CheckCircle2} title='Attendance' subTitle='100% Automated' iconColor="blue" />
                <FloatingBadge styleName='left-[8%] bottom-[20%]' icon={Rocket} title='Engagement' subTitle='Live Insights' iconColor="green" />
            </section>

            <section id="features" className="py-40 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-24 space-y-12">
                    <div className="text-center space-y-4">
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: "0.2em" }}
                            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
                            className="text-primary font-bold text-[10px] uppercase font-oswald"    
                        >
                            Explore Capabilities
                        </motion.span>
                        <h2 className="text-5xl md:text-7xl font-bold font-cinzel tracking-tight text-foreground">
                            CHOOSE YOUR <span className="text-primary italic font-montserrat">EXPERIENCE.</span>
                        </h2>
                    </div>

                    <div className="p-1.5 bg-muted/40 backdrop-blur-xl rounded-[2rem] flex border border-border relative overflow-hidden">
                        {['teacher', 'student'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative z-10 px-12 py-4 rounded-xl text-xs font-bold uppercase transition-all duration-500 font-oswald tracking-widest ${activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {tab} Portal
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-xl shadow-primary/30"
                                        transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                    >
                        <div className="lg:col-span-2">
                            <SectionHeading
                                subtitle={activeTab === 'teacher' ? "Educator Suite" : "Learner Experience"}
                                title={activeTab === 'teacher' ? "Be a Teacher, Not a Clerk." : "Your Learning Adventure Awaits."}
                                centered={false}
                            />
                        </div>
                        <div className="hidden lg:block"></div>

                        {(activeTab === 'teacher' ? teacherFeatures : studentFeatures).map((feature, index) => (
                            <FeatureCard key={`${activeTab}-${index}`} {...feature} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </section>
        </div>
    );
}