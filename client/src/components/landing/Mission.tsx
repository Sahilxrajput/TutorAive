import { MessageSquare, Star, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

const Mission = () => {
    return (
        <section id="mission" className="py-24 relative overflow-hidden bg-neutral-900/30">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionHeading subtitle="The Mission" title="Online Learning Doesn't Have to be Lonely" />
                    <p className="text-xl text-neutral-400 font-light mb-8 leading-relaxed">
                        Too many virtual classes had students on mute boxes and teachers talking into the void. We exist to replace silent Zoom rooms with classrooms that really click.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl font-bold text-white mb-2"
                                style={{ fontFamily: 'var(--font-oswald)' }}
                            >
                                2.5X
                            </motion.div>
                            <div className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Higher Scoring</div>
                            <p className="text-xs text-neutral-600 mt-1">for students who get involved online vs. sitting quietly.</p>
                        </div>
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-4xl font-bold text-white mb-2"
                                style={{ fontFamily: 'var(--font-oswald)' }}
                            >
                                ZERO
                            </motion.div>
                            <div className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Manual Headcounts</div>
                            <p className="text-xs text-neutral-600 mt-1">Attendance runs itself, letting you focus on the people.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="relative">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="aspect-square bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 rounded-[4rem] flex items-center justify-center p-12 overflow-hidden shadow-3xl"
                    >
                        <div className="text-center space-y-4">
                            <div className="flex justify-center gap-4 mb-8">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50"
                                >
                                    <Users className="text-white" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                    className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10"
                                >
                                    <MessageSquare className="text-indigo-400" />
                                </motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10"
                                >
                                    <Star className="text-yellow-400" />
                                </motion.div>
                            </div>
                            <h4 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>Classroom Connection</h4>
                            <p className="text-neutral-500 text-sm max-w-[250px] mx-auto leading-relaxed">
                                Transforming screen time into a valuable learning experience through real-time participation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>)
}

export default Mission