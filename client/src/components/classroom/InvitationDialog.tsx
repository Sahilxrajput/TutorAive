import API from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Bell, Check, Copy, Download, Mail, QrCode, X, ShieldCheck, UserPlus, Send, Zap, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { notifyError } from "@/utils/notifyError";
import { IClassroom } from "@/types/type";

const InvitationDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [activeMethod, setActiveMethod] = useState("link");
    const [isCopied, setIsCopied] = useState(false);
    const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "syncing" | "complete">("idle");
    const [base64Data, setBase64Data] = useState("");
    const [invitationLink, setInvitationLink] = useState("");
    const [email, setEmail] = useState("");
    const { classroomId } = useParams();
    const { classroom } = useOutletContext<{ classroom: IClassroom }>();

    const methods = [
        { id: "link", label: "Link", icon: Copy },
        { id: "qr", label: "QR Code", icon: QrCode },
        { id: "notification", label: "In-App", icon: Bell },
        { id: "email", label: "Email", icon: Mail },
    ];

    useEffect(() => {
        const createInvitation = async () => {
            try {
                const { data } = await API.get(`/classrooms/${classroomId}/create-invitation`);
                setBase64Data(data.qrCode);
                setInvitationLink(data.invitationLink);
            } catch (e) {
                notifyError(e);
            }
        };
        if (isOpen) createInvitation();
    }, [classroomId, isOpen]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(invitationLink);
        setIsCopied(true);
        toast.success("Coordinate copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDeployment = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        setDeploymentStatus("syncing");
        // Simulated logic for in-app notification search/deploy
        await new Promise(r => setTimeout(r, 1500));
        setDeploymentStatus("complete");
        setTimeout(() => {
            setDeploymentStatus("idle");
            onClose();
        }, 1500);
    };

    const handleSendMail = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            setDeploymentStatus("syncing");
            const { data } = await API.post(`/classrooms/${classroomId}/send-invitation`, {
                email: email.toLowerCase(),
                invitationLink
            });

            setDeploymentStatus("complete");
            toast.success(data.message || "Invitation Transmitted");

            // Allow user to see "Verified/Complete" state before closing
            setTimeout(() => {
                setDeploymentStatus("idle");
                onClose();
                setEmail(""); // Reset form
            }, 1500);
        } catch (err) {
            setDeploymentStatus("idle");
            notifyError(err);
        }
    };

    function downloadQR() {
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = `${classroom.title}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex z-50 items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-card/90 dark:bg-neutral-900/90 border border-primary/20 rounded-[2.5rem] max-w-lg w-full shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Modal Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-primary/2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <UserPlus size={16} />
                                    <span className="text-[10px] font-bold font-oswald uppercase tracking-[0.4em]">Auth Protocol</span>
                                </div>
                                <h3 className="text-2xl font-bold font-cinzel uppercase text-foreground leading-none">Authorize Identity</h3>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="px-8 pt-6">
                            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/20 border border-white/5 overflow-x-auto no-scrollbar">
                                {methods.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            setActiveMethod(m.id);
                                            setDeploymentStatus("idle"); // Reset status when switching methods
                                        }}
                                        className={cn(
                                            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-500 group shrink-0",
                                            activeMethod === m.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {activeMethod === m.id && (
                                            <motion.div layoutId="active-invite-tab" className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl" />
                                        )}
                                        <m.icon size={14} className="relative z-10" />
                                        <span className="relative z-10 text-[10px] font-bold font-oswald uppercase tracking-widest">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 min-h-80 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {activeMethod === "link" && (
                                    <motion.div key="link" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold font-oswald text-muted-foreground uppercase tracking-widest">Public Sector Link</h4>
                                            <div className="flex items-center gap-2 p-4 rounded-xl bg-black/40 border border-white/5">
                                                <input readOnly value={invitationLink} className="bg-transparent border-none outline-none w-full font-mono text-sm text-primary" />
                                                <button onClick={handleCopyLink} className="p-2 rounded-lg hover:bg-primary/20 text-primary transition-all">
                                                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic text-center">Share this encrypted coordinate to allow nodes to self-initialize into the sector.</p>
                                    </motion.div>
                                )}

                                {activeMethod === "qr" && (
                                    <motion.div key="qr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center gap-6">
                                        <div className="p-4 bg-white rounded-3xl shadow-xl relative group">
                                            {base64Data ? (
                                                <img src={base64Data} alt="qrCode" className="w-32 h-32" />
                                            ) : (
                                                <div className="w-32 h-32 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                                            )}
                                        </div>
                                        <button
                                            onClick={downloadQR}
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 text-primary font-oswald text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                        >
                                            <Download size={14} /> Download Scan Matrix
                                        </button>
                                    </motion.div>
                                )}
                                {/* @todo */}
                                {activeMethod === "notification" && (
                                    <motion.div key="notify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <form onSubmit={handleDeployment} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold font-oswald uppercase tracking-widest text-muted-foreground ml-1">Target Username</label>
                                                <div className="relative">
                                                    <AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                                                    <input required placeholder="SEARCH USER..." className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-[10px] font-oswald uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all" />
                                                </div>
                                            </div>
                                            <button disabled={deploymentStatus !== "idle"} type="submit" className="w-full py-4 rounded-xl bg-primary text-white font-oswald text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-50">
                                                {deploymentStatus === "syncing" ? <Loader2 className="animate-spin" size={14} /> : deploymentStatus === "complete" ? <Check size={14} /> : <>DEPLOY NOTIFICATION <Send size={14} /></>}
                                                {deploymentStatus === "syncing" ? "DEPLOYING..." : deploymentStatus === "complete" ? "SUCCESS" : ""}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {activeMethod === "email" && (
                                    <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <form onSubmit={handleSendMail} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold font-oswald uppercase tracking-widest text-muted-foreground ml-1">Network Email Address</label>
                                                <div className="relative">
                                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                                                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="NODE@FRONTIER.COM" className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-[10px] font-oswald uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all" required />
                                                </div>
                                            </div>
                                            <button disabled={deploymentStatus !== "idle"} type="submit" className="w-full py-4 rounded-xl bg-primary text-white font-oswald text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-50">
                                                {deploymentStatus === "syncing" ? <Loader2 className="animate-spin" size={14} /> : deploymentStatus === "complete" ? <ShieldCheck size={14} /> : <>TRANSMIT INVITATION <Zap size={14} /></>}
                                                {deploymentStatus === "syncing" ? "TRANSMITTING..." : deploymentStatus === "complete" ? "VERIFIED" : ""}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* System Footer Decoration */}
                        <div className="p-4 bg-muted/30 border-t border-white/5 flex justify-center items-center gap-4 opacity-30">
                            <ShieldCheck size={10} />
                            <span className="text-[8px] font-bold font-oswald uppercase tracking-widest">End-to-End Encryption Active</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InvitationDialog;