import { motion, useInView } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Github, Linkedin, Twitter, type LucideIcon, MailIcon } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
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
    { icon: Mail, label: "Email Us", value: "sahilrazput18@gmail.com", href: "mailto:sahilrazput18@gmail.com" },
    { icon: MessageSquare, label: "Live Chat", value: "Available 24/7", href: "#contact" },
    { icon: MapPin, label: "Location", value: "Varanasi, Uttar Pradesh, India", href: "#contact" }
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
    {
        icon: MailIcon,
        href: "mailto:sahilrazput18@gmail.com?subject=Hello&body=Hi"
    }
];

const ContactSection = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('general-inquiry')
    const [isSubmitting, setIsSubmitting] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });


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
            toast.success("Message sent successfully");
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

     return (
            <section id="contacts" className="py-24 bg-background relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10 opacity-50" />

                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* LEFT SIDE: INFO */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <div>
                                <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block font-oswald">
                                    Get in Touch
                                </span>
                                <h2 className="text-5xl md:text-6xl font-bold font-cinzel text-foreground leading-tight mb-6">
                                    LET'S START A <br />
                                    <span className="text-primary italic font-medium font-montserrat">CONVERSATION.</span>
                                </h2>
                                <p className="text-muted-foreground text-lg font-inter max-w-md leading-relaxed">
                                    Have questions about our classroom features? We're here to help you scale your learning journey.
                                </p>
                            </div>

                            <div ref={ref} className="space-y-8">
                                {contactInfo.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center gap-5 group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold font-oswald mb-1">{item.label}</div>
                                            <a href={item.href} className="text-foreground font-medium text-lg hover:text-primary transition-colors">
                                                {item.value}
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-5 pt-6">
                                {socialLinks.map(({ icon: Icon, href }, i) => (
                                    <motion.a
                                        key={i}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        href={href}
                                        target="_blank"
                                        className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                                    >
                                        <Icon size={20} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* RIGHT SIDE: FORM */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-card dark:bg-neutral-900/40 backdrop-blur-sm border border-border dark:border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5"
                        >
                            <form className="space-y-5" onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest ml-1">Name</label>
                                        <input
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                            type="text"
                                            placeholder="John doe"
                                            className="w-full bg-input/50 border border-transparent rounded-xl px-5 py-4 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-input/50 border border-transparent rounded-xl px-5 py-4 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-input/50 border border-transparent rounded-xl px-5 py-4 appearance-none cursor-pointer focus:bg-background focus:border-primary/30 outline-none transition-all"
                                            onChange={(e) => setSubject(e.target.value)}
                                            value={subject}
                                        >
                                            <option value="general-inquiry">General Inquiry</option>
                                            <option value="teacher-inquiry">Teacher Inquiry</option>
                                            <option value="student-inquiry">Student Inquiry</option>
                                            <option value="feedback-inquiry">Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold font-oswald text-muted-foreground uppercase tracking-widest ml-1">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={4}
                                        placeholder="How can we help?"
                                        className="w-full bg-input/50 border border-transparent rounded-xl px-5 py-4 focus:bg-background focus:border-primary/30 outline-none transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isFormValid || isSubmitting}
                                    className={cn(
                                        "w-full py-5 rounded-xl font-bold font-oswald tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-3 transition-all duration-300",
                                        isFormValid
                                            ? "bg-foreground text-background hover:bg-primary hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-muted text-muted-foreground opacity-50"
                                    )}
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    
};

export default ContactSection;