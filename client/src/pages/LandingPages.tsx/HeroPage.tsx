import { type Dispatch, type SetStateAction } from 'react';
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
    MessagesSquare
} from 'lucide-react';
import FeatureCard from '@/components/landing/FeatureCard';
import RevealText from '@/components/animation/revealText';
import SectionHeading from '@/components/landing/SectionHeading';
import FloatingBadge from '@/components/animation/FloatingBadge';
import { useNavigate } from 'react-router-dom';


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
        <div className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Animated Background Gradients */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 blur-[120px] rounded-full -z-10"
                />

                <div className="text-center z-10 space-y-8">
                    <div className="space-y-2">
                        <RevealText delay={0.2}>
                            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-none font-cinzel">
                                MAKE LEARNING
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel">
                                FEEL ALIVE
                            </h1>
                        </RevealText>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 font-light leading-relaxed"
                    >
                        Ditch the paperwork. Ignite the energy. <span className='font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel'>TutorAive</span> turns silent Zoom rooms into vibrant, interactive digital classrooms.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-wrap justify-center gap-6 pt-4"
                    >
                        <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 hover:scale-105 transition-all flex items-center gap-2 group shadow-2xl shadow-indigo-500/20"
                            onClick={() => navigate('/home')}
                        >
                            Start Teaching <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
                            onClick={() => navigate('/home')}
                        >
                            Join as Student
                        </button>
                    </motion.div>
                </div>

                <FloatingBadge styleName='right-[10%] top-1/4' icon={CheckCircle2} title='Attendance' subTitle='100% Automated' />
                <FloatingBadge styleName='left-[10%] bottom-1/4 ' icon={Rocket} title='Engagement' subTitle='Live Insights' />
            </section>

            {/* Interactive Feature Switcher */}
            <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
                <div className="flex justify-center mb-16">
                    <div className="p-1 bg-neutral-900 rounded-full flex border border-white/5 relative">
                        {['teacher', 'student'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold uppercase transition-colors duration-300 font-oswald ${activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}                            >
                                For {tab}s
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-indigo-600 rounded-full -z-10 shadow-lg shadow-indigo-500/30"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'teacher' ? (
                        <motion.div
                            key="teacher-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="lg:col-span-2">
                                <SectionHeading subtitle="Educator Suite" title="Be a Teacher, Not a Clerk" />
                            </div>
                            <div className="hidden lg:block"></div>
                            {teacherFeatures.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}

                        </motion.div>
                    ) : (
                        <motion.div
                            key="student-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="lg:col-span-2">
                                <SectionHeading subtitle="Learner Experience" title="Your Learning Adventure Awaits" />
                            </div>
                            <div className="hidden lg:block"></div>

                            {studentFeatures.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}

                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}