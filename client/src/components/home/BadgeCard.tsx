import { Award } from 'lucide-react'

const BadgeCard = () => {
    return (
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Award size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest font-oswald">Top Explorer</h4>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                        GSoC 2026 Contributor
                    </p>
                </div>
            </div>

            <p className="text-xs text-muted-foreground italic font-inter font-light leading-relaxed">
                "You're operating in the top percentile. The frontier belongs to those who stay consistent."
            </p>

            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>)
}

export default BadgeCard