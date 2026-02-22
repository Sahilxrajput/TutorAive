import { CheckCircle2, MonitorPlay, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import { IClassroom } from '@/types/type'

interface Props {
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
    selectedCourse: IClassroom | null
    onConfirm: () => Promise<void>
}

const EnrollSector = ({ setIsDialogOpen, selectedCourse, onConfirm }: Props) => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDialogOpen(false)}
                className="absolute h-screen inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-[#111] border border-blue-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                            <MonitorPlay className="text-blue-400" size={24} />
                        </div>
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="p-2 hover:bg-white/5 rounded-full text-primaryclass transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight text-primary">Initiate Sync?</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Establish link with <span className="text-primary font-bold uppercase tracking-widest">{selectedCourse?.title}</span>? This will grant full database permissions.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        >
                            <CheckCircle2 size={16} /> Confirm Access
                        </button>
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="w-full bg-white/5 border border-white/10 text-white/60 font-bold py-5 rounded-2xl hover:bg-white/10 transition-colors uppercase tracking-[0.2em] text-[10px]"
                        >
                            Abort
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>)
}

export default EnrollSector;