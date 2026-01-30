import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Props {
    icon: LucideIcon
    subTitle: string,
    title: string,
    styleName: string,
    iconColor?: string,
    dir?: 'postive' | 'negative'
}

const FloatingBadge = ({ icon: Icon, title, subTitle, styleName, dir = 'postive', iconColor = 'indigo' }: Props) => {
    const yCoordinates: number[] = dir === 'postive' ? [0, 20, 0] : [0, -20, 0]
    return (
        <motion.div
            animate={{ y: yCoordinates }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={cn("absolute hidden lg:flex items-center gap-3 bg-neutral-900/80 border border-white/10 p-4 rounded-2xl shadow-2xl", styleName)}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${iconColor}-500/20 text-${iconColor}-400`}><Icon size={20} /></div>
            <div>
                <div className="text-xs text-neutral-500">{title}</div>
                <div className="text-sm font-bold">{subTitle}</div>
            </div>
        </motion.div>)
}

export default FloatingBadge