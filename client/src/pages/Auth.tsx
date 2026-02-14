import { ChangeEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    GraduationCap,
    User,
    Mail,
    Lock,
    ArrowRight,
    Chrome,
    Sparkles,
    CheckCircle2,
    Fingerprint,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { notifyError } from '@/utils/notifyError';
import { toast } from 'sonner';

const initialFormState = {
    email: "",
    role: "",
    userName: "",
    name: "",
    password: ""
};

const App = () => {
    const [authMode, setAuthMode] = useState<string>('signin');
    const [formData, setFormData] = useState(initialFormState)
    const { signin, refreshUser, signup, loading } = useAuth()
    const [localLoading, setLocalLoading] = useState(false)
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            if (authMode === "signup") {
                if (!formData.role.trim()) {
                    toast.info("select user role")
                    return;
                }

                await signup(formData);
                setFormData(initialFormState);
                await refreshUser();
            } else {
                await signin(formData);
            }

            navigate("/dashboard");
        } catch (error) {
            console.log(error)
            notifyError(error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const GoogleAuth = () => {
        try {
            if (!formData.role.trim()) {
                toast.info("select user role");
                return;
            }
            setLocalLoading(true);

            window.location.href = `/api/auth/google?role=${formData.role}`;
        } catch (error) {
            notifyError(error);
        } finally {
            setLocalLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8 font-sans selection:bg-primary/20">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full bg-card rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border/50 backdrop-blur-xl relative z-10"
            >
                {/* Left Section - Branding & Value Prop */}
                <div className="md:w-5/12 bg-primary p-10 md:p-14 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    <div className="relative z-10">
                        <div className='flex justify-between'>
                            <motion.div
                                whileHover={{ rotate: -10 }}
                                className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-xl"
                            >
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </motion.div>



                            <motion.div
                                onClick={() => navigate("/home")}
                                whileHover={{ rotate: -10 }}
                                className="w-14 h-14 cursor-pointer bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-xl"
                            >
                                <Home className="w-8 h-8 text-amber-400" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter leading-none uppercase">
                            Sector <br /> <span className="text-white/60 italic font-medium lowercase tracking-normal">Gateway.</span>
                        </h1>
                        <p className="text-primary-foreground/70 text-base leading-relaxed max-w-xs font-medium border-l-2 border-white/20 pl-4">
                            Access the professional matrix for high-density learning and WebRTC collaboration.
                        </p>
                    </div>

                    <div className="mt-12 space-y-6 relative z-10">
                        {[
                            { text: "Secure SFU Tunneling", icon: <CheckCircle2 className="w-4 h-4" /> },
                            { text: "Institutional Verification", icon: <Fingerprint className="w-4 h-4" /> },
                            { text: "Real-time Synchronization", icon: <Sparkles className="w-4 h-4" /> }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 opacity-80">
                                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg text-white">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Auth Form */}
                <div className="md:w-7/12 p-8 md:p-14 bg-card/50 overflow-y-auto max-h-[90vh] custom-scrollbar">

                    {/* Mode Switcher */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50">
                            {['signin', 'signup'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setAuthMode(mode)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMode === mode
                                        ? 'bg-card text-foreground shadow-lg'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {mode === 'signin' ? 'Access' : 'Deploy'}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-2 opacity-40">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol: V2.4</span>
                        </div>
                    </div>

                    {/* Role Switcher */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {[
                            { id: 'student', label: 'Student', icon: <User className="w-4 h-4" /> },
                            { id: 'instructor', label: 'Instructor', icon: <GraduationCap className="w-4 h-4" /> }
                        ].map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    role: r.id
                                }))}
                                className={cn("flex flex-col items-center gap-2 py-4 rounded-3xl border-2 transition-all font-black uppercase text-[10px] tracking-[0.2em]",
                                    formData.role === r.id
                                        ? "bg-primary/5 border-primary text-primary shadow-xl shadow-primary/5"
                                        : "bg-transparent border-border text-muted-foreground hover:border-border-foreground/20"
                                )}
                            >
                                {r.icon}
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Social Gateway */}
                    <button
                        className="w-full flex items-center justify-center gap-4 py-4 rounded-3xl border border-border hover:bg-muted/50 transition-all group mb-8"
                        disabled={loading || localLoading}
                        onClick={GoogleAuth}
                    >
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100 transition-transform group-hover:scale-110">
                            <Chrome className="w-4 h-4 text-slate-700" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-8 opacity-20 px-4">
                        <div className="h-px flex-1 bg-foreground" />
                        <span className="text-[10px] font-black uppercase">Standard Credentials</span>
                        <div className="h-px flex-1 bg-foreground" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={authMode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {authMode === 'signup' && (<>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Full Designation</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                value={formData.name}
                                                name='name'
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="John doe"
                                                className="w-full bg-muted/30 px-14 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                value={formData.userName}
                                                name='userName'
                                                onChange={handleInputChange}
                                                type="text"
                                                placeholder="john123"
                                                className="w-full bg-muted/30 px-14 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            value={formData.email}
                                            name='email'
                                            onChange={handleInputChange}
                                            type="email"
                                            placeholder="example@mail.com"
                                            className="w-full bg-muted/30 px-14 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Security Token</label>
                                        {authMode === 'signin' && (
                                            <button type="button" className="text-[10px] font-bold text-primary hover:underline">Lost Token?</button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            value={formData.password}
                                            name='password'
                                            onChange={handleInputChange}
                                            type="password"
                                            min={4}
                                            placeholder="******"
                                            className="w-full bg-muted/30 px-14 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading || localLoading}
                            className={cn("w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black text-xs tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group uppercase",
                                loading ?
                                    "opacity-70 cursor-not-allowed" :
                                    "hover:brightness-110")}
                        >
                            {loading || localLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {authMode === 'signin' ? 'Initiate Link' : 'Initialize Account'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            Sector Protocol V2.4 © 2026
                        </p>
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default App;