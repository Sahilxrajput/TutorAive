
import { useState, useRef, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Image as ImageIcon,
    DollarSign,
    ChevronRight,
    X,
    Sparkles,
    Layout,
    Info,
    Tag,
    Hash,
    Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import API from '@/lib/api';
import { notifyError } from '@/utils/notifyError';


const LaunchClassroom = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        description: '',
        thumbnail: null as File | null,
        thumbnailPreview: null as string | ArrayBuffer | null,
        isPaid: false,
        price: '',
        currency: 'INR',
        status: 'active'
    });


    const selectFile = () => fileInputRef.current?.click();
    
    const removeThumbnail = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, thumbnail: null, thumbnailPreview: null }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    thumbnail: file,
                    thumbnailPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("description", formData.description);
            payload.append("tags", formData.tags);
            if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);

            const { data } = await API.post("/classrooms", payload, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(data.message);
            navigate("/classrooms")
        } catch (err) {
            notifyError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8 lg:p-12 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl w-full bg-card rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border/40 backdrop-blur-xl"
            >

                {/* Left Section */}
                <div className="md:w-[40%] bg-primary dark:bg-transparent p-10 md:p-14 text-primary-foreground flex flex-col justify-between relative overflow-hidden">

                    {/* Grid Overlays */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[80px]" />

                    <div className="relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center mb-10 border border-white/20 shadow-2xl shadow-black/10"
                        >
                            <BookOpen className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-5xl font-black mb-6 tracking-tighter leading-[0.95] uppercase">
                            Provision <br /> <span className="text-white/70 italic font-medium lowercase">your</span> <br /> Sector.
                        </h1>
                        <p className="text-primary-foreground/70 text-base leading-relaxed max-w-xs font-medium border-l-2 border-white/20 pl-4">
                            Establish a high-density learning matrix. Integrate WebRTC protocols and automate student enrollment.
                        </p>
                    </div>

                    <div className="mt-16 space-y-8 relative z-10">
                        {[
                            { text: "Identity Protocol", icon: <Layout className="w-3.5 h-3.5" />, active: !!formData.title },
                            { text: "Monetization Layer", icon: <DollarSign className="w-3.5 h-3.5" />, active: formData.isPaid },
                            { text: "Deployment Ready", icon: <Sparkles className="w-3.5 h-3.5" />, active: true }
                        ].map((item, idx) => (
                            <div key={idx} className={`flex items-center gap-5 transition-all duration-700 ${item.active ? 'opacity-100' : 'opacity-30'}`}>
                                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-xl">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-black tracking-[0.2em] uppercase">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Professional Dashboard Form */}
                <div className="md:w-[62%] p-8 md:p-16 overflow-y-auto max-h-[92vh] custom-scrollbar bg-card/30">
                    <form onSubmit={handleSubmit} className="space-y-14">

                        {/* Heading Matrix */}
                        <div className="flex items-center justify-between border-b border-border/50 pb-8">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tighter uppercase">Deployment Matrix</h2>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">Strategic Control Center</p>
                            </div>
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border/50">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System: Online</span>
                            </div>
                        </div>

                        {/* Media Upload Container */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                    <ImageIcon className="w-4 h-4 text-primary" /> Visual Identity
                                </label>
                                <span className="text-[10px] text-muted-foreground font-medium italic">Recommended: 16:9 • 1080p</span>
                            </div>
                            <motion.div
                                onClick={selectFile}
                                whileHover={{ scale: 1.01 }}
                                className={`relative group cursor-pointer border-2 border-dashed rounded-[3rem] transition-all duration-500 flex flex-col items-center justify-center min-h-[260px] p-2 overflow-hidden ${formData.thumbnailPreview
                                    ? 'border-primary/50 bg-primary/[0.02]'
                                    : 'border-border/50 hover:border-primary/40 hover:bg-muted/30'
                                    }`}
                            >
                                {formData.thumbnailPreview ? (
                                    <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden shadow-2xl">
                                        <img src={formData.thumbnailPreview?.toString()} alt="Preview" className="w-full h-64 object-cover" />
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-md">
                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                onClick={removeThumbnail}
                                                className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3 border border-red-500/30 text-red-500"
                                            >
                                                <X size={32} />
                                            </motion.button>
                                            <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Flush Media Buffer</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-12">
                                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-primary/5">
                                            <ImageIcon className="w-9 h-9 text-primary opacity-60" />
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-widest">Map Classroom Visuals</p>
                                        <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-tighter opacity-60">Click to upload or drag & drop</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                            </motion.div>
                        </div>

                        {/* Core Inputs Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-primary" /> System Label
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Enter classroom designation..."
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-muted/20 px-10 py-6 rounded-3xl border border-border focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-xl tracking-tight placeholder:text-muted-foreground/30 shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Tag className="w-4 h-4 text-primary" /> Sector Index
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                    <input
                                        type="text"
                                        name="tags"
                                        required
                                        placeholder="REACT NEXTJS DSA"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full bg-muted/20 pl-14 pr-8 py-5 rounded-2xl border border-border focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-sm tracking-[0.2em] uppercase placeholder:text-muted-foreground/30 shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 md:col-span-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                    <Info className="w-4 h-4 text-primary" /> Strategic Description
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    placeholder="Briefly explain the learning objectives..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-muted/20 px-10 py-8 rounded-[2.5rem] border border-border focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all outline-none font-medium placeholder:text-muted-foreground/30 resize-none leading-relaxed shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Monetization Engine */}
                        {/* <div className="bg-muted/30 rounded-[3.5rem] p-10 md:p-14 border border-border/40 shadow-2xl shadow-black/5">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center shadow-lg border border-primary/5">
                                        <DollarSign className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black tracking-tighter uppercase">Revenue Engine</h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Access & Valuation</p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer group scale-125">
                                    <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleInputChange} className="sr-only peer" />
                                    <div className="w-14 h-8 bg-border/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                </label>
                            </div>

                            <AnimatePresence>
                                {formData.isPaid && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-hidden"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3">Slot Valuation</label>
                                            <div className="relative group">
                                                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-2xl">
                                                    {formData.currency === 'INR' ? '₹' : '$'}
                                                </div>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    required={formData.isPaid}
                                                    placeholder="0.00"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-16 pr-10 py-6 rounded-3xl border border-border bg-card focus:ring-8 focus:ring-primary/5 transition-all outline-none font-black text-2xl shadow-xl border-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3">Currency Zone</label>
                                            <div className="relative">
                                                <Globe className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                                                <select
                                                    name="currency"
                                                    value={formData.currency}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-16 pr-8 py-6 rounded-3xl border border-border bg-card focus:ring-8 focus:ring-primary/5 transition-all outline-none font-bold text-sm appearance-none cursor-pointer shadow-xl"
                                                >
                                                    <option value="INR">INDIA (INR)</option>
                                                    <option value="USD">GLOBAL (USD)</option>
                                                </select>
                                                <ChevronRight className="absolute right-7 top-1/2 -translate-y-1/2 w-5 h-5 rotate-90 text-muted-foreground/30 pointer-events-none" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div> */}

                        {/* Provision Trigger */}
                        <div className="pt-10 space-y-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-7 rounded-[2.5rem] bg-primary text-primary-foreground font-black text-2xl tracking-[0.1em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-6 group relative overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
                            >
                                {/* Shimmer Effect on Button */}
                                <motion.div
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                                    animate={{ x: ['100%', '-100%'] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                />

                                {loading ? (
                                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        PROVISION SECTOR
                                        <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-500" />
                                    </>
                                )}
                            </motion.button>

                            <div className="flex flex-col items-center gap-2 opacity-50">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                                    Secure SFU Transport Protocol Active
                                </p>
                                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LaunchClassroom;