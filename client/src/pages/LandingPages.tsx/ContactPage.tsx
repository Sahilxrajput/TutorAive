import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Github, Linkedin, Twitter, type LucideIcon } from 'lucide-react';
import Footer from './Footer';
import { useState, type FormEvent } from 'react';
import API from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';


type ContactInfoItem = {
    icon: LucideIcon;
    label: string;
    value: string;
    href: string;
};

type SocialLink = {
    icon: LucideIcon;
    href: string;
};


const contactInfo: ContactInfoItem[] = [
    { icon: Mail, label: "Email Us", value: "hello@aive.edu", href: "mailto:hello@aive.edu" },
    { icon: MessageSquare, label: "Live Chat", value: "Available 24/7", href: "#" },
    { icon: MapPin, label: "Location", value: "Varanasi, Uttar Pradesh, India", href: "#" }
]

const socialLinks: SocialLink[] = [
    {
        icon: Github,
        href: "https://github.com/Sahilxrajput",
    },
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/sahilxrajput/",
    },
    {
        icon: Twitter,
        href: "https://x.com/SaahilxRajput",
    },
];

const ContactSection = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);



    const isFormValid =
        name.trim().length > 0 &&
        email.trim().length > 0 &&
        subject.trim().length > 0 &&
        message.trim().length > 0;


    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) return

        try {
            setIsSubmitting(true);
            await API.post("/contact", { name, email, message, subject });
            toast.success("message send successfully")
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (err) {
            console.error("Contact form failed", err);
            toast.error("somthing goes wrong")
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-black relative overflow-hidden">
            {/* Background Accent Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* LEFT SIDE: INFO */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-indigo-500 font-bold tracking-[0.3em] text-xs uppercase mb-4 block font-oswald">
                                Get in Touch
                            </span>
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-cinzel)' }}>
                                LET'S START A <br />
                                <span className="text-indigo-500 italic">CONVERSATION.</span>
                            </h2>
                            <p className="text-neutral-400 text-lg font-light max-w-md">
                                Have questions about our classroom features? We're here to help you scale your learning journey.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {contactInfo.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold font-oswald">{item.label}</div>
                                        <a href={item.href} className="text-white hover:text-indigo-400 transition-colors">{item.value}</a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 pt-4">
                            {socialLinks.map(({ icon: Icon, href }, i) => (
                                <motion.a
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-indigo-500/50 transition-all"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE: FORM */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 30 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-[3rem] relative"
                    >
                        <form className="space-y-6"
                            onSubmit={(e) => handleFormSubmit(e)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold font-oswald text-neutral-500 uppercase tracking-widest ml-1">Name</label>
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        placeholder="Sahil Rajput"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold font-oswald text-neutral-500 uppercase tracking-widest ml-1">Email</label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        value={email}
                                        placeholder="sahil@bhu.ac.in"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold font-oswald text-neutral-500 uppercase tracking-widest ml-1">Subject</label>
                                <select className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}
                                >
                                    <option value={"general-inquiry"}>General Inquiry</option>
                                    <option value={"teacher-inquiry"}>Teacher Inquiry</option>
                                    <option value={"student-inquiry"}>Student Inquiry</option>
                                    <option value={"feedback-inquiry"}>Feedback </option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold font-oswald text-neutral-500 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us what's on your mind..."
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-700 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className={cn("w-full py-5 rounded-2xl font-bold font-oswald tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-3 transition-all",
                                    isFormValid
                                        ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20"
                                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                )}
                            >
                                Send Message
                                <Send size={18} />
                            </button>

                        </form>
                    </motion.div>
                </div>
            </div>
        </section >
    );
};

export default ContactSection;