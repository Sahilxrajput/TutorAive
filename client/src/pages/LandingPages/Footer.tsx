import { Github, Linkedin, Twitter, Instagram, Zap } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: Github, href: "https://github.com/Sahilxrajput" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/sahilxrajput/" },
        { icon: Twitter, href: "https://x.com/SaahilxRajput" },
        { icon: Instagram, href: "https://www.instagram.com/sahil_rajput.env/" }
    ];
    const links = [
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
            links: ["Become an Instructor", "Create a Course", "Teaching Guidelines"]
        }
    ]

    return (
        <footer className="bg-black border-t border-white/5  relative overflow-hidden">
            {/* Ready to begin */}
            
                {/* <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold text-center border-b border-px border-[#121212] text-white py-12 font-cinzel"
                >
                    READY TO <span className="text-indigo-500 italic">BEGIN?</span>
                </motion.h2> */}

            <div className="absolute bottom-0 w-full h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 my-10">

                {/* Brand Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel">TUTORAIVE</span>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                        Built for students. Empowered by educators. Transforming silent screen time into a vibrant, interactive digital classroom experience.
                    </p>

                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
                            >
                                <social.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link Columns */}
                {links.map((col, i) => (
                    <div key={i} className="space-y-6">
                        <h5 className="text-white font-bold font-oswald text-xs uppercase tracking-[0.2em]">
                            {col.title}
                        </h5>
                        <ul className="space-y-4">
                            {col.links.map((link, j) => (
                                <li key={j}>
                                    <a href="#" className="text-neutral-500 text-sm hover:text-white transition-colors duration-200">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto px-8 items-center gap-8 py-8 border-t border-white/5 text-neutral-600 text-sm">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-indigo-500" />
                    <span className="font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel">TUTORAIVE</span>
                    <span className="ml-2">© 2026. Make Learning Feel ALIVE.</span>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;