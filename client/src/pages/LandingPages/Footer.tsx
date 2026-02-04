import { motion } from 'framer-motion';
import GradientHeading from '@/components/GradientHeading';
import { Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
    const socialLinks = [
        { icon: Github, href: "https://github.com/Sahilxrajput" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/sahilxrajput/" },
        { icon: Twitter, href: "https://x.com/SaahilxRajput" },
        { icon: Instagram, href: "https://www.instagram.com/sahil_rajput.env/" }
    ];

    const linkGroups = [
        {
            title: "Product",
            links: ["About Us", "How It Works", "FAQs", "Blog"]
        },
        {
            title: "Students",
            links: ["Explore Courses", "Free Resources", "Community"]
        },
        {
            title: "Educators",
            links: ["Become Instructor", "Create Course", "Guidelines"]
        }
    ];

    return (
        <footer className="bg-background border-t border-border/50 relative overflow-hidden">

            {/* Top Banner */}
            <div className="border-b border-border/50">
                <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-5xl md:text-8xl font-bold font-cinzel text-foreground tracking-tighter leading-none uppercase">
                            Ready to <span className="text-primary italic font-light">Begin?</span>
                        </h2>
                        <button className="px-10 py-4 bg-foreground text-background rounded-full font-oswald font-bold tracking-widest text-xs uppercase hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-black/5">
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Background */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-16 mb-20">

                    {/* Brand Column (Span 2) */}
                    <div className="md:col-span-3 lg:col-span-2 space-y-8">
                        <div className="flex gap-3">
                            <Logo w={10} h={10}/>
                            <GradientHeading className="text-2xl tracking-tighter mt-1">
                                TUTORAIVE
                            </GradientHeading>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-inter font-light">
                            Empowering educators and inspiring students through immersive, real-time digital classroom technology. Built for the future of learning.
                        </p>

                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-sm"
                                >
                                    <social.icon size={18} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Link Groups */}
                    {linkGroups.map((col, i) => (
                        <div key={i} className="space-y-8">
                            <h5 className="text-foreground font-bold font-oswald text-[10px] uppercase tracking-[0.3em]">
                                {col.title}
                            </h5>
                            <ul className="space-y-4">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300 font-inter">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <h5 className="text-foreground font-bold font-oswald text-[10px] uppercase tracking-[0.3em]">
                            Stay Updated
                        </h5>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-bold font-oswald uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="text-primary tracking-normal">© 2026</span>
                        <span>TUTORAIVE PLATFORM</span>
                        <span className="text-[8px] opacity-20 hidden md:block">|</span>
                        <span className="hidden md:block">MAKE LEARNING FEEL ALIVE</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;