import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    BookHeartIcon,
    Bookmark,
    Clock,
    Rocket,
    Zap,
    Target,
    TrendingUp,
} from 'lucide-react'
import axios from 'axios'

import API from '@/lib/api'
import useAuth from '@/hooks/useAuth'
import LearningCard from '@/components/home/LeaningCard'
import DaySchedule from '@/components/home/DaySchedule'
import { ShortcutForHideSidebar } from '@/components/ShortcutForHideSidebar'
import TutoraiveUserCard from '@/components/home/BadgeCard'

const Home = () => {
    const { user } = useAuth()
    const [pendingAssignments, setPendingAssignments] = useState(0)
    const [scheduleLecture, setScheduleLecture] = useState(0)
    const [quote, setQuote] = useState('')

    /* ---------------- FETCH ASSIGNMENTS ---------------- */
    useEffect(() => {
        let isMounted = true;
        if (!user?._id) return

        const fetchAssignments = async () => {
            try {
                const { data } = await API.get(`/assignments/student/${user._id}`)
                if (isMounted) setPendingAssignments(data?.pending?.length ?? 0)
            } catch (err) {
                console.error("Assignment fetch error", err)
            }
        }



        fetchAssignments()
        return () => { isMounted = false }
    }, [user])

    /* ---------------- MOTIVATIONAL QUOTE ---------------- */
    useEffect(() => {
        const getQuote = async () => {
            try {
                const { data } = await axios.get('https://dummyjson.com/quotes/random')
                setQuote(data.quote)
            } catch {
                setQuote('Discipline beats motivation. Every single time.')
            }
        }
        getQuote()
    }, [])

    return (
        <main className="min-h-screen bg-background text-foreground p-6 lg:p-10 relative overflow-hidden transition-colors duration-500">
            <ShortcutForHideSidebar />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none z-10" />

            <div className="max-w-400 mx-auto flex flex-col lg:flex-row gap-8">

                <section className="flex-1 flex flex-col gap-8">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-56 md:h-72 rounded-[3rem] overflow-hidden border border-border dark:border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-card to-background dark:from-indigo-900/40 dark:via-neutral-900 dark:to-black" />

                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-[-50%] right-[-10%] w-100 h-100 bg-primary/10 blur-[100px] rounded-full"
                        />

                        <div className="relative z-10 h-full p-10 flex flex-col justify-center">
                            <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-2 font-oswald">
                                Explorer Dashboard
                            </span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl md:text-6xl font-bold font-cinzel leading-none text-foreground"
                            >
                                WELCOME BACK, <br />
                                <span className="text-primary italic">{user?.userName ?? "Explorer"}</span>
                            </motion.h1>

                            <p className="mt-4 text-muted-foreground text-sm max-w-md font-inter font-light">
                                Progress compounds quietly. Keep going.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        <LearningCard title="Pending Tasks" Icon={BookHeartIcon} number={pendingAssignments} iconColor="green" delay={0.1} />
                        <LearningCard title="Certificates" Icon={Bookmark} number={0} iconColor="indigo" delay={0.2} />
                        <LearningCard title="Scheduled" Icon={Rocket} number={scheduleLecture} iconColor="green" delay={0.3} />
                        <LearningCard title="Streak Days" Icon={Zap} number={0} iconColor="indigo" delay={0.4} />
                        <LearningCard title="Hours Learned" Icon={Clock} number={0} iconColor="green" delay={0.5} />
                    </div >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-primary/5 border border-primary/10 overflow-hidden rounded-[2.5rem] p-8 relative group backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest font-oswald">Morning DSA Goal</h3>
                                <Target className="text-primary" size={20} />
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                    <span className="text-muted-foreground">Solved Progress</span>
                                    <span>3 / 5 Problems</span>
                                </div>

                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '60%' }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                    />
                                </div>

                                <p className="text-[11px] text-muted-foreground italic font-inter leading-relaxed mt-4">"{quote}"</p>
                            </div>
                            <Zap className="absolute -right-8 -bottom-8 w-32 h-32 text-primary/5 group-hover:rotate-12 transition-transform duration-700" />
                        </div>

                        <div className="bg-card/40 border border-border rounded-[2.5rem] p-8 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest font-oswald">Productivity</h3>
                                <TrendingUp className="text-emerald-500" size={20} />
                            </div>

                            <div className="flex items-end gap-3 h-24 px-2">
                                {[40, 65, 45, 90, 85, 50, 75].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.1, ease: "circOut" }}
                                        className="flex-1 bg-primary/20 dark:bg-white/5 rounded-t-lg hover:bg-primary/40 transition-colors"
                                    />
                                ))}
                            </div>

                            <p className="mt-6 text-[9px] text-muted-foreground uppercase text-center font-bold tracking-[0.2em]">
                                Activity Loop — Last 7 days
                            </p>
                        </div>
                    </div>
                </section>

                <section className="w-full lg:w-95 space-y-8">
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] font-oswald border-b border-border pb-4">
                        Upcoming Schedule
                    </h3>
                    <DaySchedule onLecturechange={(number) => setScheduleLecture(number)} />
                    <TutoraiveUserCard name={user?.firstName + " " + user?.lastName}/>
                </section>

            </div>

            <div className="fixed right-12 top-[46%] -rotate-90 opacity-[0.03] dark:opacity-[0.05] select-none pointer-events-none hidden xl:block">
                <h1 className="text-[7rem] font-black font-cinzel text-foreground leading-none uppercase">
                    TUTORAIVE
                </h1>
            </div>
        </main>
    )
}

export default Home