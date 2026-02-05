import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Repeat2,
    Quote,
    X,
    Zap,
    Send,
    Terminal,
    Hash
} from "lucide-react";
import { ITweet } from "@/types/type";
import API from "@/lib/api";
import { toast } from "sonner";
import TweetAvatar from "./TweetAvatar";

interface Props {
    isOpen: boolean,
    onClose: () => void,
    parentTweet: ITweet,
}

const MiniParentNode = ({ tweet }: { tweet: ITweet }) => {
    if (!tweet) return null;
    return (
        <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 dark:bg-white/5 border-dashed space-y-2">
            <div className="flex items-center gap-2">
                
                <TweetAvatar size={5} author={tweet.author} />

                <span className="text-[10px] font-bold font-inter text-foreground/90">{tweet.author?.firstName}</span>

                <span className="text-[8px] text-muted-foreground uppercase font-oswald tracking-widest">@{tweet.author?.userName}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-inter line-clamp-2 italic leading-relaxed">
                "{tweet.content}"
            </p>
        </div>
    );
};

const RepostDialog = ({ isOpen, onClose, parentTweet }: Props) => {
    const [step, setStep] = useState("choice"); // 'choice' | 'quote'
    const [quoteContent, setQuoteContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetAndClose = () => {
        setStep("choice");
        setQuoteContent("");
        onClose();
    };

    const handleInstantRepost = async () => {
        setIsSubmitting(true);
        try {
            await API.post(`/tweets/${parentTweet._id}/repost`)
            toast.success("Tweet reposted successfully")
            await new Promise(r => setTimeout(r, 800));
            resetAndClose();
        } catch {
            toast.error("Somthing goes wrong")
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuoteSubmit = async () => {
        try {
            if (!quoteContent.trim()) return;
            setIsSubmitting(true);
            await API.post(`/tweets/${parentTweet._id}/repost`, { content: quoteContent })
            toast.success("Tweet reposted successfully")
            await new Promise(r => setTimeout(r, 800));
            resetAndClose();
        } catch {
            toast.error("Somthing goes wrong")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-card/90 dark:bg-neutral-900/90 border border-primary/20 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary">
                                <Repeat2 size={16} />
                                <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.3em]">Repost Authorization</span>
                            </div>
                            <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                                <X size={18} className="text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {step === "choice" ? (
                                    /* STEP 1: INITIAL CHOICE */
                                    <motion.div
                                        key="choice-step"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center space-y-2 mb-8">
                                            <h3 className="text-xl font-bold font-cinzel text-foreground uppercase">Select Protocol</h3>
                                            <p className="text-xs text-muted-foreground font-inter">Determine how to relay this data packet.</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Repost Option */}
                                            <button
                                                onClick={handleInstantRepost}
                                                disabled={isSubmitting}
                                                className="group relative flex items-center gap-4 p-5 rounded-[1.5rem] border border-border dark:border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left overflow-hidden"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Repeat2 size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold font-oswald uppercase tracking-wider text-foreground">Instant Relay</p>
                                                    <p className="text-[10px] text-muted-foreground font-inter">Broadcast directly to your sector.</p>
                                                </div>
                                                {isSubmitting && <div className="absolute right-6 animate-spin"><Zap size={14} className="text-primary" /></div>}
                                            </button>

                                            {/* Quote Option */}
                                            <button
                                                onClick={() => setStep("quote")}
                                                className="group flex items-center gap-4 p-5 rounded-[1.5rem] border border-border dark:border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                    <Quote size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold font-oswald uppercase tracking-wider text-foreground">Contextual Analysis</p>
                                                    <p className="text-[10px] text-muted-foreground font-inter">Append your own logic before relaying.</p>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* STEP 2: QUOTE COMPOSE */
                                    <motion.div
                                        key="quote-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Terminal size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.2em] text-muted-foreground">Initializing Broadcaster...</span>
                                        </div>

                                        <textarea
                                            autoFocus
                                            value={quoteContent}
                                            onChange={(e) => setQuoteContent(e.target.value)}
                                            placeholder="Enter sector analysis..."
                                            className="w-full h-32 bg-transparent border-none outline-none resize-none font-inter text-sm text-foreground placeholder:text-muted-foreground/30 custom-scrollbar"
                                        />

                                        {/* Mini Parent Tweet Preview */}
                                        <MiniParentNode tweet={parentTweet} />

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => setStep("choice")}
                                                className="px-6 py-3 rounded-xl bg-muted font-oswald text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleQuoteSubmit}
                                                disabled={!quoteContent.trim() || isSubmitting}
                                                className="flex-1 py-3 rounded-xl bg-primary text-white font-oswald text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                {isSubmitting ? "SYNCING..." : <>INITIATE BROADCAST <Send size={12} /></>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer encryption tag */}
                        <div className="p-4 bg-muted/30 flex justify-center items-center gap-2 opacity-30 border-t border-border/20">
                            <Hash size={10} />
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-[0.2em]">Quantum Encryption Active</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RepostDialog;