import { Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


const LandingNavbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Zap className="text-white fill-white" size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-indigo-600 font-cinzel">TUTORAIVE</span>
            </div>
            <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide font-oswald" >
                <a href="#teachers" className="hover:text-indigo-400 transition-colors uppercase">Teachers</a>
                <a href="#students" className="hover:text-indigo-400 transition-colors uppercase">Students</a>
                <a href="#mission" className="hover:text-indigo-400 transition-colors uppercase">Our Mission</a>
                <button
                    onClick={() => navigate('/home')}
                    className="bg-white text-black px-6 py-2 rounded-full hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
                    GET STARTED
                </button>
            </div>
        </nav>)
}

export default LandingNavbar