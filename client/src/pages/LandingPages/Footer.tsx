import { motion } from 'framer-motion';
import GradientHeading from '@/components/GradientHeading';
import { Github, Linkedin, Instagram, Send } from 'lucide-react';
import Logo from '@/components/Logo';

// Custom SVG for X (formerly Twitter)
const XIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string; }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const SOCIAL_LINKS = [
    { name: "GitHub", icon: Github, href: "https://github.com/Sahilxrajput" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/sahilxrajput/" },
    { name: "X", icon: XIcon, href: "https://x.com/SaahilxRajput" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/sahil_rajput.env/" }
] as const;

const LINK_GROUPS = [
    {
        title: "Product",
        links: [
            { label: "About Us", href: "#" },
            { label: "How It Works", href: "#" },
            { label: "FAQs", href: "#" },
            { label: "Blog", href: "#" }
        ]
    },
    {
        title: "Students",
        links: [
            { label: "Explore Courses", href: "#" },
            { label: "Free Resources", href: "#" },
            { label: "Community", href: "#" }
        ]
    },
    {
        title: "Educators",
        links: [
            { label: "Become Instructor", href: "#" },
            { label: "Create Course", href: "#" },
            { label: "Guidelines", href: "#" }
        ]
    }
] as const;

const LEGAL_LINKS = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Support", href: "#" }
] as const;

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/50 relative overflow-hidden">

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

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-16 mb-20">

                    <div className="md:col-span-3 lg:col-span-2 space-y-8">
                        <div className="flex gap-3">
                            <Logo w={10} h={10} />
                            <GradientHeading className="text-2xl tracking-tighter mt-1">
                                TUTORAIVE
                            </GradientHeading>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-inter font-light">
                            Empowering educators and inspiring students through immersive, real-time digital classroom technology. Built for the future of learning.
                        </p>

                        <div className="flex items-center gap-4">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="w-11 h-11 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-sm"
                                >
                                    <social.icon size={18} strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Link Groups */}
                    {LINK_GROUPS.map((group) => (
                        <div key={group.title} className="space-y-8">
                            <h5 className="text-foreground font-bold font-oswald text-[10px] uppercase tracking-[0.3em]">
                                {group.title}
                            </h5>
                            <ul className="space-y-4">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground text-sm underline-offset-4 hover:underline hover:text-primary transition-colors duration-300 font-inter"
                                        >
                                            {link.label}
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
                        <form onSubmit={(e) => e.preventDefault()} className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                aria-label="Email subscription"
                                className="w-full bg-muted text-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                            <button
                                type="submit"
                                aria-label="Subscribe"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Send size={14} />
                            </button>
                        </form>
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
                        {LEGAL_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="hover:underline underline-offset-8 hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;