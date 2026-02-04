import { Menu, X, Rocket } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useGSAP } from "@gsap/react"
import GradientHeading from "../GradientHeading"
import { ThemeToggle } from "../tiptap-templates/simple/theme-toggle"

gsap.registerPlugin(ScrollToPlugin)

const scrollToSection = (id: string) => {
    gsap.to(window, {
        duration: 1.5,
        scrollTo: {
            y: `#${id}`,
            offsetY: 120,
        },
        ease: "expo.inOut",
    })
}

const Navbar = () => {
    const navigate = useNavigate()
    const menuRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    useGSAP(() => {
        if (!menuRef.current) return
        gsap.to(menuRef.current, {
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            duration: 0.5,
            ease: "power4.inOut",
        })
    }, [open])

    const handleClick = (action: () => void) => {
        action()
        setOpen(false)
    }

    const navLinks = [
        { label: "Home", action: () => navigate("/home"), type: 'link' },
        { label: "How it Works", action: () => scrollToSection("how-it-works"), type: 'scroll' },
        { label: "Our Mission", action: () => scrollToSection("mission"), type: 'scroll' },
        { label: "Contact", action: () => scrollToSection("contacts"), type: 'scroll' },
    ];

    return (
        <nav className="fixed top-0 w-full z-[100] transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
                <div className="flex justify-between items-center px-6 py-3 rounded-2xl border border-border/40 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5">

                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => scrollToSection("hero-scetion")}
                    >
                        <div className="w-8 h-8 relative">
                            <img
                                className="w-full h-full object-contain group-hover:rotate-12 transition-transform duration-300"
                                src="/logo.png"
                                alt="logo"
                            />
                        </div>
                        <GradientHeading className="text-xl tracking-tighter">
                            TUTORAIVE
                        </GradientHeading>
                    </div>

                    <div className="hidden md:flex gap-10 items-center">
                        <div className="flex gap-8 items-center text-[11px] font-bold tracking-[0.2em] font-oswald text-muted-foreground">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={link.action}
                                    className="hover:text-primary transition-colors uppercase relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
                                </button>
                            ))}
                        </div>
                        <ThemeToggle />
                        <button
                            onClick={() => navigate("/home")}
                            className="flex items-center gap-2 text-[11px] font-bold font-oswald tracking-widest bg-foreground text-background px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10"
                        >
                            GET STARTED <Rocket size={14} />
                        </button>
                    </div>

                    <button
                        className="md:hidden text-foreground p-2"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div
                    ref={menuRef}
                    className="md:hidden overflow-hidden mt-2"
                >
                    <div className="bg-background/90 backdrop-blur-2xl border border-border/40 rounded-3xl p-8 flex flex-col gap-8 text-sm font-bold font-oswald tracking-widest uppercase">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => handleClick(link.action)}
                                className="text-left hover:text-primary transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}

                        <button
                            onClick={() => handleClick(() => navigate("/home"))}
                            className="bg-primary text-white px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                        >
                            GET STARTED <Rocket size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;