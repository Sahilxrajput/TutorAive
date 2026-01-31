
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
    Award
} from 'lucide-react'
import axios from 'axios'

import API from '@/lib/api'
import useAuth from '@/hooks/useAuth'
import LearningCard from '@/components/home/LeaningCard'
import DaySchedule from '@/components/home/DaySchedule'
import { ShortcutForHideSidebar } from '@/components/ShortcutForHideSidebar'



const Home = () => {
    const { user } = useAuth()
    const [pendingAssignments, setPendingAssignments] = useState(0)
    const [quote, setQuote] = useState('')

    /* ---------------- FETCH ASSIGNMENTS ---------------- */
    useEffect(() => {
        if (!user) return

        const fetchAssignments = async () => {
            try {
                const { data } = await API.get(`/assignments/student/${user._id}`)
                setPendingAssignments(data?.pending?.length ?? 0)
            } catch (err) {
                console.error('Assignment fetch failed', err)
            }
        }

        fetchAssignments()
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
        <main className="min-h-screen bg-black text-white p-6 lg:p-10 relative overflow-hidden">
            <ShortcutForHideSidebar />

            {/* Ambient background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">

                {/* LEFT SECTION */}
                <section className="flex-1 flex flex-col gap-8">

                    {/* BANNER */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-56 md:h-72 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-neutral-900 to-black" />

                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full"
                        />

                        <div className="relative z-10 h-full p-10 flex flex-col justify-center">
                            <span className="text-indigo-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-2">
                                Explorer Dashboard
                            </span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl md:text-6xl font-bold font-cinzel leading-none"
                            >
                                WELCOME BACK, <br />
                                <span className="text-white italic">{user?.userName ?? "Explorer"}</span>
                            </motion.h1>

                            <p className="mt-4 text-neutral-400 text-sm max-w-md">
                                Progress compounds quietly. Keep going.
                            </p>
                        </div>
                    </motion.div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        <LearningCard title="Pending Tasks" Icon={BookHeartIcon} number={pendingAssignments} iconColor="green" delay={0.6} />
                        <LearningCard title="Certificates" Icon={Bookmark} number={2} iconColor="indigo" delay={0.7} />
                        <LearningCard title="Scheduled" Icon={Rocket} number={3} iconColor="green" delay={0.8} />
                        <LearningCard title="Streak Days" Icon={Zap} number={12} iconColor="indigo" delay={0.9} />
                        <LearningCard title="Hours Learned" Icon={Clock} number={18.5} iconColor="green" delay={1.0} />
                    </div >

                    {/* GOALS & PRODUCTIVITY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* DSA GOAL */}
                        <div className="bg-indigo-500/5 border border-indigo-500/20 overflow-hidden rounded-[2rem] p-6 relative group">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold uppercase">Morning DSA Goal</h3>
                                <Target className="text-indigo-400" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span className="text-neutral-400">Solved</span>
                                    <span>3 / 5</span>
                                </div>

                                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '60%' }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-indigo-600"
                                    />
                                </div>

                                <p className="text-[11px] text-neutral-500 italic">{quote}</p>
                            </div>
                            <Zap className="absolute -right-8 -bottom-8 w-32 h-32 text-indigo-500/10 group-hover:rotate-12 transition-transform duration-700" />
                        </div>

                        {/* PRODUCTIVITY */}
                        <div className="bg-neutral-900/60 border border-white/5 rounded-[2rem] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold uppercase">Productivity</h3>
                                <TrendingUp className="text-green-500" />
                            </div>

                            <div className="flex items-end gap-2 h-20">
                                {[40, 65, 45, 90, 85, 50, 75].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                        className="flex-1 bg-white/5 rounded-t-lg"
                                    />
                                ))}
                            </div>

                            <p className="mt-4 text-[10px] text-neutral-500 uppercase text-center">
                                Last 7 days
                            </p>
                        </div>
                    </div>
                </section>

                {/* RIGHT SECTION */}
                <section className="w-full lg:w-[350px] space-y-8">
                    <h3 className="text-xl font-bold uppercase border-b border-white/5 pb-4">
                        Upcoming Schedule
                    </h3>
                    <DaySchedule />

                    <div className="bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/10 rounded-[2rem] p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                                <Award />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold uppercase">Top Explorer</h4>
                                <p className="text-[10px] text-neutral-500 uppercase">
                                    GSoC Contributor
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-400 italic">
                            You&apos;re operating in the top percentile. Don&apos;t slow down now.
                        </p>
                    </div>
                </section>

            </div>
            {/* Float Label Decoration */}
            <div className="fixed right-12 top-[46%] -rotate-90 opacity-[0.03] select-none pointer-events-none hidden xl:block">
                <h1 className="text-[7rem] font-black font-cinzel text-white leading-none uppercase">
                    TutorAive
                </h1>
            </div>
        </main>
    )
}

export default Home
