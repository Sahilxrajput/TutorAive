import {  Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollToPlugin)

const scrollToSection = (id: string) => {
    gsap.to(window, {
        duration: 1.2,
        scrollTo: {
            y: `#${id}`,
            offsetY: 80,
        },
        ease: "power3.out",
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
            duration: 0.4,
            ease: "power2.out",
        })
    }, [open])



    const handleClick = (action: () => void) => {
        action()
        setOpen(false)
    }

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-black/40">
            <div className="flex justify-between items-center px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    {/* <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"> */}
                    {/* <Zap className="text-white fill-white" size={24} /> */}
                    {/* </div> */}
                    <div className="w-2">
                        <img
                            className="w-full h-auto object-contain"
                            src="/logo2.png"
                            alt="logo" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel">
                        TUTORAIVE
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide font-oswald">
                    <button onClick={() => navigate("/home")} className="hover:text-indigo-400 uppercase">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("how-it-works")} className="hover:text-indigo-400 uppercase">
                        How it Works
                    </button>
                    <button onClick={() => scrollToSection("mission")} className="hover:text-indigo-400 uppercase">
                        Our Mission
                    </button>
                    <button onClick={() => scrollToSection("contacts")} className="hover:text-indigo-400 uppercase">
                        Contact
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="bg-white text-black px-6 py-2 rounded-full hover:bg-indigo-50 active:scale-95 shadow-xl"
                    >
                        GET STARTED
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className="md:hidden overflow-hidden px-6"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="flex flex-col gap-6 py-6 text-sm font-medium font-oswald">
                    <button onClick={() => handleClick(() => navigate("/home"))}>Home</button>
                    <button onClick={() => handleClick(() => scrollToSection("how-it-works"))}>How it Works</button>
                    <button onClick={() => handleClick(() => scrollToSection("mission"))}>Our Mission</button>
                    <button onClick={() => handleClick(() => scrollToSection("contacts"))}>Contact</button>

                    <button
                        onClick={() => handleClick(() => navigate("/home"))}
                        className="bg-white text-black px-6 py-2 rounded-full shadow-md"
                    >
                        GET STARTED
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
