import { Link } from "react-router-dom";
import {
    Baby,
    BookOpen,
    ChartSpline,
    LucideOctagon,
    MessageCircle,
    NotepadText,
    Twitch,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { NotificationSidebar } from "./notification/NotificationSidebar";

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="flex flex-col w-16 h-screen items-center justify-between py-6 z-50 border-r-2">
            {/* Top nav */}
            <nav className="flex flex-col gap-12 text-sm items-center">
                <Link to="/" className="flex flex-col items-center gap-1">
                    <LucideOctagon />
                    {/* <span className="text-xs">Logo</span> */}
                </Link>

                <Link to="/classrooms" className="flex flex-col items-center gap-1">
                    <BookOpen />
                    {/* <span className="text-xs">Classroom</span> */}
                </Link>

                <Link to="/notes" className="flex flex-col items-center gap-1">
                    <NotepadText />
                    {/* <span className="text-xs">Notes</span> */}
                </Link>

                <Link to="/chats" className="flex flex-col items-center gap-1">
                    <MessageCircle />
                    {/* <span className="text-xs">Chat</span> */}
                </Link>

                <Link to="/dashboard" className="flex flex-col items-center gap-1">
                    <ChartSpline />
                    {/* <span className="text-xs">Dashboard</span> */}
                </Link>

                <Link to="/community" className="flex flex-col items-center gap-1">
                    <Twitch />
                    {/* <span className="text-xs">Tweets</span> */}
                </Link>
            </nav>

            {/* Bottom actions */}
            <div className="flex flex-col items-center gap-6">
                <NotificationSidebar />

                {!user ? (
                    <Link to="/signin">
                        <Baby />
                    </Link>
                ) : (
                    <Link to="/profile">
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
