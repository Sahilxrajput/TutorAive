import { Link } from 'react-router-dom'
import { Baby, BookOpen, ChartSpline, LucideOctagon, MessageCircle, NotepadText, Twitch } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { NotificationSideBar } from './notification/NotificationSidebar';


const Sidebar = () => {
    const { user } = useAuth();
    return (
        <aside className='flex flex-col fixed h-full bg-gray-600 items-center-safe justify-between py-6 z-50'>
            <div className='flex flex-col justify-center gap-6 items-center'>
                <Link to="/" className='flex flex-col items-center justify-center'><LucideOctagon /> logo</Link>
                <Link to="/classrooms" className='flex flex-col items-center justify-center'><BookOpen /> Classroom</Link>
                <Link to="/notes" className='flex flex-col items-center justify-center'><NotepadText />Notes</Link>
                <Link to="/chats" className='flex flex-col items-center justify-center'><MessageCircle />Chat</Link>
                {/* <Link to="/quiz" className='flex flex-col items-center justify-center'><CircleQuestionMark />Quiz</Link> */}
                <Link to="/dashboard" className='flex flex-col items-center justify-center'><ChartSpline /> dashboard</Link>
                <Link to="/community" className='flex flex-col items-center justify-center'><Twitch /> Tweets</Link>
            </div>
            <div className='flex items-center justify-center gap-6 flex-col'>
                {/* <Link to="/" className='flex flex-col items-center justify-center'><NotificationSideBar/> </Link> */}
                <NotificationSideBar />
                {!user ?
                    <Link to="/signin" className='flex flex-col items-center justify-center'><Baby /></Link>
                    :
                    <Link to="/profile" className='flex flex-col items-center justify-center'><img className='w-10 aspect-square rounded-full' src={user?.profilePicture} alt="" /></Link>
                }
            </div>
        </aside>
    )
}

export default Sidebar
