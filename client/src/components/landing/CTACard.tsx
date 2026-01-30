import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CTACard = ({ activeTab }: { activeTab: string }) => {
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rounded-[3.5rem]"
        >
            <div className="bg-neutral-950 rounded-[3.4rem] p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                <h3 className="text-3xl font-bold text-white mb-6 font-cinzel">
                    {activeTab === 'student' ? 'READY TO START YOUR ADVENTURE?' : 'READY TO TRANSFORM YOUR CLASSROOM?'}
                </h3>

                <div className="flex flex-wrap justify-center gap-6">
                    <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all font-oswald tracking-widest text-sm flex items-center gap-2"
                        onClick={() => navigate("/home")}
                    >
                        {activeTab === 'student' ? 'JOIN A ROOM' : 'GET STARTED NOW'} <ArrowRight size={16} />
                    </button>
                    <div className="flex items-center gap-6 text-neutral-500 text-xs font-bold font-oswald tracking-[0.2em] uppercase">
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> NO CREDIT CARD</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> FREE FOR EVERYONE</span>
                    </div>
                </div>
            </div>
        </motion.div>)
}

export default CTACard