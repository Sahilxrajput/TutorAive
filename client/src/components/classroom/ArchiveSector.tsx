import { motion } from "framer-motion";
import SectorHeader from "./SectorHeader";
import { Download, FileText } from "lucide-react";

const ArchiveSector = () => {
    const files = [
        { name: "BinaryTrees_Lec4.pdf", size: "2.4MB", date: "Jan 24" },
        { name: "WebRTC_Security.pdf", size: "1.1MB", date: "Jan 22" },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <SectorHeader title="Knowledge Vault" subtitle="Authorized course materials and archives" icon={BookOpen} />
            <div className="space-y-4">
                {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-card/40 border border-border dark:border-white/5 hover:bg-primary/5 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-foreground uppercase font-oswald tracking-wide">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground">{file.size} • Last Sync: {file.date}</p>
                            </div>
                        </div>
                        <button className="p-3 rounded-xl bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ArchiveSector;