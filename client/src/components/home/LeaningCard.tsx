import React from "react";
import { motion } from 'framer-motion'
interface LearningCardProps {
    Icon: React.ElementType;
    title: string;
    number: number;
    delay?: number;
    iconColor?: "indigo" | "green";
}
const LearningCard: React.FC<LearningCardProps> = ({
    Icon,
    title,
    number,
    iconColor = "green",
    delay
}) => {
    return (
        <div className={`bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl`}>
            <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay }}
                >
                    <div className="flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all cursor-default">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${iconColor === 'green' ? 'bg-green-500/10 text-green-400' : 'bg-indigo-500/10 text-indigo-400'
                            }`}>
                            <Icon size={24} />
                        </div>
                        <h3 className="text-[10px] font-bold font-oswald text-neutral-500 uppercase tracking-widest mb-1">{title}</h3>
                        <p className="text-2xl font-bold text-white font-cinzel">{number}</p>
                    </div>
                </motion.div>
        </div>
    )
}


export default LearningCard;
