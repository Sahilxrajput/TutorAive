import { Link } from 'react-router-dom'
import { Baby, BellIcon, BookOpen, ChartSpline, Info, LucideOctagon, MessageCircle, NotepadText } from 'lucide-react'


const Sidebar
    = () => {
        return (
            <div>
                <aside className='flex flex-col fixed h-screen bg-gray-600 items-center-safe justify-between py-6'>
                    <div className='flex flex-col justify-center gap-6 items-center'>
                        <Link to="/" className='flex flex-col items-center justify-center'><LucideOctagon /> logo</Link>
                        <Link to="/classrooms" className='flex flex-col items-center justify-center'><BookOpen /> Classroom</Link>
                        <Link to="/notes" className='flex flex-col items-center justify-center'><NotepadText />Notes</Link>
                        <Link to="/chats" className='flex flex-col items-center justify-center'><MessageCircle />Chat</Link>
                        <Link to="/dashboard" className='flex flex-col items-center justify-center'><ChartSpline /> dashboard</Link>
                        <Link to="/about" className='flex flex-col items-center justify-center'><Info />About</Link>
                    </div>
                    <div className='flex items-center justify-center gap-6 flex-col'>
                        <Link to="/profile" className='flex flex-col items-center justify-center'><BellIcon /></Link>
                        <Link to="/signin" className='flex flex-col items-center justify-center'><Baby /></Link>
                    </div>
                </aside>
            </div>
        )
    }

export default Sidebar
