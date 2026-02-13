import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    Activity,
    Video,
    Mic
} from "lucide-react";
import ClassroomNavbar from "./ClassroomSideBar";
import AssignmentSector from "./AssignmentSector";
import ArchiveSector from "./ArchiveSector";
import BroadcastSector from "./BroadcastSector";
import RosterSector from "./RosterSector";
import { Outlet } from "react-router-dom";

export default function ClassroomPage() {
    const [activeTab, setActiveTab] = useState("intel");

    const renderSector = () => {
        switch (activeTab) {
            case "intel": return <AssignmentSector />;
            case "broadcasts": return <BroadcastSector />;
            case "archives": return <ArchiveSector />;
            case "roster": return <RosterSector />;
            default: return (
                <div className="py-32 text-center opacity-40 flex flex-col items-center">
                    <Activity size={48} className="text-primary animate-pulse mb-4" />
                    <h3 className="font-oswald uppercase tracking-[0.4em] text-sm">Sector Synch in Progress</h3>
                </div>
            );
        }
    };

    return (
        <>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden font-inter">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

                <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border/40 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-oswald text-[10px] uppercase tracking-[0.4em]">
                                <Terminal size={14} className="animate-pulse" /> Frontier System v4.2
                            </div>
                            <h1 className="text-5xl font-bold font-cinzel tracking-tighter uppercase leading-none">
                                CLASSROOM. <span className="text-primary italic">ALPHA.</span>
                            </h1>
                        </div>
                        <ClassroomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
                    </header>

                    <main className="min-h-[60vh]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                            >
                                {renderSector()}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    <footer className="pt-20 pb-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-2"><Video size={14} /> <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">SFU Link Ready</span></div>
                            <div className="flex items-center gap-2"><Mic size={14} /> <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">Audio Decryption Active</span></div>
                        </div>
                        <p className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Personnel Management v4.2.</p>
                    </footer>
                </div>
            </div>
            <Outlet />
        </>
    );
}
