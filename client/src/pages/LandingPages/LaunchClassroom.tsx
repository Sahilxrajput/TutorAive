import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Image as ImageIcon,
    DollarSign,
    ChevronRight,
    X,
    Sparkles,
    Layout,
    CheckCircle2,
    Info
} from 'lucide-react';
import API from '@/lib/api';
import { toast } from 'sonner';
import { notifyError } from '@/utils/notifyError';
import { useNavigate } from 'react-router-dom';

const LaunchClassroom = () => {
    const navigate = useNavigate()
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

    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center p-4 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl w-full bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-border/40"
            >
                {/* Left Section - Hero Sidebar */}
                <div className="md:w-[40%] bg-primary p-10 md:p-14 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[80px]" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-xl"
                        >
                            <BookOpen className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                            Launch your <br />
                            <span className="text-white/70 italic font-serif">classroom.</span>
                        </h1>
                        <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xs">
                            Create a sophisticated learning environment with SFU-powered video sessions.
                        </p>
                    </div>

                    <div className="mt-12 space-y-6 relative z-10">
                        {[
                            { step: 1, text: "Architecture & Basics", icon: Layout },
                            { step: 2, text: "Monetization Engine", icon: DollarSign },
                            { step: 3, text: "Sector Distribution", icon: Sparkles }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/20">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="md:w-[60%] p-8 md:p-16 overflow-y-auto max-h-[90vh] bg-card/30 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-12">

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Identity & Vision</h2>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="group">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">Classroom Banner</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-300 min-h-[200px] flex items-center justify-center ${formData.thumbnailPreview
                                    ? 'border-primary/20 bg-muted/20'
                                    : 'border-border hover:border-primary/50 hover:bg-primary/[0.02]'
                                    }`}
                            >
                                {formData.thumbnailPreview ? (
                                    <div className="relative w-full h-full p-2">
                                        <img
                                            src={formData.thumbnailPreview.toString()}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-[1.5rem]"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-[1.8rem]">
                                            <X className="text-white w-8 h-8" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-sm font-bold">Click to upload banner</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-balance">16:9 aspect ratio works best</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                            </div>
                        </div>

                        {/* Inputs Grid */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    minLength={3}
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Master Class: Advanced WebRTC"
                                    className="w-full bg-muted/50 dark:bg-white/5 px-6 py-4 rounded-2xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black transition-all outline-none text-lg font-medium ring-0 focus:ring-4 focus:ring-primary/5"
                                />
                            </div>


                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    minLength={10}
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What will students learn?"
                                    className="w-full bg-muted/50 dark:bg-white/5 px-6 py-4 rounded-2xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black transition-all outline-none font-medium resize-none focus:ring-4 focus:ring-primary/5"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    minLength={3}
                                    required
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g. react, nodejs, python, dsa"
                                    className="w-full bg-muted/50 dark:bg-white/5 px-6 py-4 rounded-2xl border border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black transition-all outline-none text-lg font-medium ring-0 focus:ring-4 focus:ring-primary/5"
                                />
                            </div>

                        </div>

                        {/* Status Selection */}
                        <div className="flex gap-4">
                            {[
                                { id: 'active', label: 'Draft', icon: Info },
                                { id: 'published', label: 'Live', icon: CheckCircle2 }
                            ].map((status) => (
                                <button
                                    key={status.id}
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, status: status.id }))}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${formData.status === status.id
                                        ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5'
                                        : 'bg-transparent border-border text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    <status.icon size={16} />
                                    {status.label}
                                </button>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        PROVISION CLASSROOM
                                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-center mt-6 text-muted-foreground font-bold tracking-[0.3em] uppercase opacity-50">
                                Secure SFU Infrastructure Enabled
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LaunchClassroom;