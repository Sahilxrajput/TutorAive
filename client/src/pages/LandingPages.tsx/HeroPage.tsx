import {  type Dispatch, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Zap,
    BarChart3,
    Gamepad2,
    Layout,
    MessageSquare,
    Award,
    ArrowRight,
    CheckCircle2,
    Monitor,
    Rocket,
    ShieldCheck,
    Star
} from 'lucide-react';
import LandingNavbar from '@/components/landing/Navbar';
import FeatureCard from '@/components/landing/FeatureCard';
import RevealText from '@/components/animation/revealText';
import SectionHeading from '@/components/landing/SectionHeading';
import FloatingBadge from '@/components/animation/FloatingBadge';


interface Props {
    setActiveTab: Dispatch<SetStateAction<'teacher' | 'student'>>
    activeTab: 'teacher' | 'student'
}


export default function Features({ activeTab, setActiveTab }: Props) {

    const teacherFeatures = [
        {
            icon: Zap,
            title: "Quick Setup",
            description:
                "Build and schedule your classes in a flash. Add students by roster, email, or shareable link with a few clicks.",
            delay: 1,
        },
        {
            icon: ShieldCheck,
            title: "One-Click Attendance",
            description:
                "The moment students join, they're marked present. No more manual roll-call or missing names.",
            delay: 2,
        },
        {
            icon: BarChart3,
            title: "Auto-Grading & Lists",
            description:
                "Assign quizzes or polls and see instant reports. Our system logs scores and participation automatically.",
            delay: 3,
        },
        {
            icon: Layout,
            title: "Digital Whiteboards",
            description:
                "Swap bland slides for interactive whiteboards where anyone can scribble, draw, and work problems together.",
            delay: 4,
        },
        {
            icon: Users,
            title: "Breakout Sessions",
            description:
                "Launch small-group activities or debates. Split into teams with a tap and pull everyone back when ready.",
            delay: 5,
        },
        {
            icon: Rocket,
            title: "Smarter Planning",
            description:
                "Identify trends over time. See which lessons flew and which flopped to continuously improve your classes.",
            delay: 6,
        },
    ];

    const studentFeatures = [
        {
            icon: Monitor,
            title: "No Tech Headaches",
            description:
                "Works on phones, tablets, or laptops—no special apps needed. If you can use a web browser, you're set.",
            delay: 1,
        },
        {
            icon: MessageSquare,
            title: "Chats & Emojis",
            description:
                "Ask questions by chat or raise a virtual hand. Emojis and quick polls make classes feel like games.",
            delay: 2,
        },
        {
            icon: Gamepad2,
            title: "Quizzes & Games",
            description:
                "Win badges and climb leaderboards on the spot. Trivia and trivia make sure you actually get the lesson.",
            delay: 3,
        },
        {
            icon: Award,
            title: "Personal Dashboard",
            description:
                "Track your journey like game stats. Earn achievements like 'Marathon Learner' for your progress.",
            delay: 4,
        },
        {
            icon: Star,
            title: "Feedback & Hints",
            description:
                "Get helpful hints if you miss a question and instant links to review topics where you need to brush up.",
            delay: 5,
        },
        {
            icon: Rocket,
            title: "Goal Setting",
            description:
                "Mark your target—like acing algebra or learning 50 new words—and watch your progress bar climb.",
            delay: 6,
        },
    ];

    return (
        <div className="min-h-screen bg-black text-neutral-200 selection:bg-indigo-500/30 overflow-x-hidden">

            <LandingNavbar />

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
                            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-none" style={{ fontFamily: 'var(--font-cinzel)' }}>
                                MAKE LEARNING
                            </h1>
                        </RevealText>
                        <RevealText delay={0.4}>
                            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600" style={{ fontFamily: 'var(--font-cinzel)' }}>
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
                        Ditch the paperwork. Ignite the energy. The platform that turns silent Zoom rooms into vibrant, interactive digital classrooms.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-wrap justify-center gap-6 pt-4"
                    >
                        <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 hover:scale-105 transition-all flex items-center gap-2 group shadow-2xl shadow-indigo-500/20">
                            Start Teaching <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all">
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
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold uppercase transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                                style={{ fontFamily: 'var(--font-oswald)' }}
                            >
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