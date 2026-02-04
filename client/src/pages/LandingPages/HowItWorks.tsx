import { motion } from 'framer-motion';
import { Zap, BarChart3, Play, Monitor, UserCheck, MessageCircleQuestion, FileText, Sparkles } from 'lucide-react';
import RevealText from '@/components/animation/revealText';
import CTACard from '@/components/landing/CTACard';
import StepCard from '@/components/landing/StepCard';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';
import SectionHeading from '@/components/landing/SectionHeading';

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
    const steps = activeTab === 'student' ? studentSteps : teacherSteps;

    return (
        <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -z-10 opacity-60" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-6 font-oswald"
                        >
                            <Sparkles size={12} className="animate-pulse" />
                            The {activeTab === 'student' ? 'Student' : 'Digital'} Workflow
                        </motion.div>
                        <RevealText>
                            <h2 className="text-6xl md:text-[5.7rem] font-bold text-foreground font-cinzel leading-[0.9] tracking-tighter">
                                HOW {activeTab === 'student' ? 'LEARNING' : 'TEACHING'} <br />
                                <span className="text-primary italic font-montserrat font-medium">COMES ALIVE.</span>
                            </h2>
                        </RevealText>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="group flex items-center gap-5 bg-card border border-border dark:border-white/5 p-4 pr-8 rounded-[2rem] shadow-xl shadow-primary/5 backdrop-blur-md cursor-pointer hover:border-primary/30 transition-all duration-500"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-700" />
                            <div className="w-14 h-14 rounded-full bg-foreground dark:bg-primary flex items-center justify-center relative z-10 shadow-lg group-hover:bg-primary transition-colors">
                                <Play size={20} fill="currentColor" className="ml-1 text-background dark:text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest font-oswald mb-0.5">Watch Demo</p>
                            <p className="text-sm font-bold text-foreground tracking-tight">2 Min Walkthrough</p>
                        </div>
                    </motion.div>
                </div>

                <div className="relative mb-32">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] border-t border-dashed border-primary/20 z-0 hidden lg:block" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: step.delay, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <StepCard {...step} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Dynamic Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {activeTab === 'student' ? <StudentPage /> : <TeacherPage />}
                </motion.div>

                {/* Final Call to Action Section */}
                <CTACard activeTab={activeTab} />
            </div>
        </section>
    );
};

export default HowItWorks;