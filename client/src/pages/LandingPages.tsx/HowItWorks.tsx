import { motion } from 'framer-motion';
import { Zap, BarChart3, Play, Monitor, UserCheck, MessageCircleQuestion, FileText } from 'lucide-react';
import RevealText from '@/components/animation/revealText';
import CTACard from '@/components/landing/CTACard';
import StepCard from '@/components/landing/StepCard';
import StudentPage from './StudentPage';
import TeacherPage from './Teacher';



const teacherSteps = [
    {
        number: "01",
        icon: Zap,
        title: "Set Up the Class",
        description:
            "Create a class in minutes, schedule sessions, and share the join link with students. No complex configuration or setup overhead.",
        delay: 0.2,
    },
    {
        number: "02",
        icon: UserCheck,
        title: "Teach & Engage Live",
        description:
            "Students join instantly through the browser. Attendance is logged automatically while live polls, Q&A, and chat keep the class interactive.",
        delay: 0.4,
    },
    {
        number: "03",
        icon: BarChart3,
        title: "Review & Improve",
        description:
            "See engagement insights from polls and participation. Understand what worked, identify gaps, and refine your next session.",
        delay: 0.6,
    },
];
;

const studentSteps = [
    {
        number: "01",
        icon: Monitor,
        title: "Join the Class",
        description:
            "Enter your classroom through a single link using any device. No downloads, no setup, just open and learn.",
        delay: 0.2,
    },
    {
        number: "02",
        icon: MessageCircleQuestion,
        title: "Participate Live",
        description:
            "Ask questions, respond to live polls, and interact during sessions instead of passively watching.",
        delay: 0.4,
    },
    {
        number: "03",
        icon: FileText,
        title: "Learn Beyond the Session",
        description:
            "Access shared notes, submit assignments, and stay connected through the community even after class ends.",
        delay: 0.6,
    },
];


const HowItWorks = ({ activeTab = 'student' }: { activeTab: string }) => {
    // const teacherSteps = [
    //     {
    //         number: "01",
    //         icon: Zap,
    //         title: "Ignite the Room",
    //         description: "Set up your virtual workspace in under 60 seconds. Import your roster, schedule your live sessions, and deploy interactive assets with a single tap.",
    //         delay: 0.2
    //     },
    //     {
    //         number: "02",
    //         icon: Users,
    //         title: "Real-Time Sync",
    //         description: "Students join instantly—no apps required. Attendance is logged automatically while live polls, QnA, and chats turn passive observers into active participants.",
    //         delay: 0.4
    //     },
    //     {
    //         number: "03",
    //         icon: BarChart3,
    //         title: "Data-Driven Scale",
    //         description: "Get instant analytics on engagement and performance. Identify who needs help and who is excelling, allowing you to iterate and improve every single lesson.",
    //         delay: 0.6
    //     }
    // ];

    // const studentSteps = [
    //     {
    //         number: "01",
    //         icon: Monitor,
    //         title: "Enter the Arena",
    //         description: "Join your classroom instantly through a single link. No downloads or complex setups—if you have a browser, you have a classroom.",
    //         delay: 0.2
    //     },
    //     {
    //         number: "02",
    //         icon: Gamepad2,
    //         title: "Active Play",
    //         description: "Don't just watch—interact. Use live reactions, participate in breakout games, and draw on shared whiteboards to solve problems in real-time.",
    //         delay: 0.4
    //     },
    //     {
    //         number: "03",
    //         icon: Rocket,
    //         title: "Master Your Path",
    //         description: "Track your personal growth like game stats. Earn badges for participation, review smart summaries of every lesson, and reach your learning goals faster.",
    //         delay: 0.6
    //     }
    // ];

    const steps = activeTab === 'student' ? studentSteps : teacherSteps;

    return (
        <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full z-50" />

            <div className="max-w-7xl mx-auto px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-indigo-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block font-oswald"
                        >
                            The {activeTab === 'student' ? 'Student' : 'Digital'} Workflow
                        </motion.span>
                        <RevealText>
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight font-cinzel ">
                                HOW {activeTab === 'student' ? 'YOU LEARN' : 'LEARNING'} <br />
                                <span className="text-indigo-500 italic">COMES ALIVE.</span>
                            </h2>
                        </RevealText>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="hidden lg:flex items-center gap-4 bg-neutral-900/50 border border-white/5 p-4 rounded-3xl backdrop-blur-md"
                    >
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-ripple-blue">
                            <Play size={18} fill="white" className="ml-1" />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest font-oswald">Watch Demo</p>
                            <p className="text-sm font-bold text-white">2 Min Walkthrough</p>
                        </div>
                    </motion.div>
                </div>

                {/* Step Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                    {/* Connecting Dashed Line (Desktop Only) */}
                    <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-white/10 z-0 hidden lg:block" />

                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>

                {activeTab === 'student' ? <StudentPage /> : <TeacherPage />}
                <CTACard activeTab={activeTab} />
            </div>
        </section>
    );
};

export default HowItWorks;