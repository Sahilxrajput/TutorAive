// import { useState } from "react";
// import { ChevronLeft } from "lucide-react";
// import { Link, useParams } from "react-router-dom";
// import useAuth from "@/hooks/useAuth";
// import { Button } from "../ui/button";
// import { StartClass } from "./StartClass";
// import { PdfUploadDialog } from "../PdfUpload";

// const ClassroomSideBar = () => {
//     const [isHide, setIsHide] = useState<boolean>(false);
//     const [showPopup, setShowPopup] = useState<boolean>(false)
//     const { user } = useAuth()

//     const pathDetector = (item: string) => {
//         item = item.toLowerCase()
//         if (item == "overview") {
//             return ""
//         }
//         return "/" + item;
//     }

//     const classContent = ["Overview", "Resources", "Notes", "Assignments", "Leaderboard"]

//     const { classroomId } = useParams();

//     return (
//         <div
//             className={`relative flex flex-col border-r-2 h-screen transition-all duration-300 
//       ${isHide ? "w-0" : "w-64"}`}
//         >
//             <button
//                 onClick={() => setIsHide(!isHide)}
//                 className={`absolute border-2 bg-white z-40 p-1 rounded-full -right-3 top-4 
//         transition-transform duration-300 ${isHide && "rotate-180"}`}
//             >
//                 <ChevronLeft />
//             </button>

//             <div className="flex flex-col items-start mt-12 space-y-1">
//                 <h2
//                     className={`text-lg p-4 font-semibold -mt-6 transition-all duration-200 ${isHide ? "opacity-0 w-0" : "opacity-100 w-full"
//                         }`}
//                 >
//                     Classroom
//                 </h2>

//                 {classContent.map(
//                     (item) => (
//                         <Link
//                             to={'/classrooms/' + classroomId + pathDetector(item)}
//                             key={item}
//                             className={`hover:bg-blue-400 text-left p-4 w-full transition-all duration-200 ease-in-out ${isHide ? "opacity-0 pointer-events-none" : "opacity-100"
//                                 }`}
//                         >
//                             {item}
//                         </Link>
//                     )
//                 )}
//                 <div>
//                     <div>
//                         {/* @todo only creator of that classroom can create assignment */}
//                         {user?.role === "instructor" &&
//                             <div className="flex justify-center items-center flex-col space-y-2">
//                                 <Button
//                                     onClick={() => setShowPopup(true)}
//                                     className={`hover:bg-blue-400 text-left cursor-pointer p-4 w-full transition-all duration-200 ease-in-out ${isHide ? "opacity-0 pointer-events-none" : "opacity-100"
//                                         }`}
//                                 >
//                                     Start Class
//                                 </Button>
//                                 <PdfUploadDialog buttonText=" Create Assignment" title="Create Assignment" id={classroomId!} type="assignment" />
//                             </div>
//                         }

//                     </div>
//                 </div>
//             </div>

//             <StartClass showPopup={showPopup} setShowPopup={setShowPopup} />

//         </div>
//     );
// };

// export default ClassroomSideBar;

// import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion'
// import { BookOpen, Radio, Target, Users } from 'lucide-react';

// export default function ClassroomNavigator({ activeTab, setActiveTab }) {
//     const sectors = [
//         { id: "intel", label: "Intel", icon: Target, sub: "Assignments" },
//         { id: "broadcasts", label: "Broadcasts", icon: Radio, sub: "Lectures" },
//         { id: "archives", label: "Archives", icon: BookOpen, sub: "Notes" },
//         { id: "roster", label: "Roster", icon: Users, sub: "Students" },
//     ];

//     return (
//         <div className="flex items-center gap-2 p-2 rounded-[2rem] bg-card/40 dark:bg-black/20 border border-border dark:border-white/5 backdrop-blur-2xl">
//             {sectors.map((sector) => {
//                 const IsActive = activeTab === sector.id;
//                 return (
//                     <button
//                         key={sector.id}
//                         onClick={() => setActiveTab(sector.id)}
//                         className={cn(
//                             "relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 group",
//                             IsActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
//                         )}
//                     >
//                         {IsActive && (
//                             <motion.div
//                                 layoutId="active-sector"
//                                 className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl"
//                                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                             />
//                         )}
//                         <sector.icon size={18} className={cn("relative z-10 transition-transform duration-500", IsActive && "scale-110")} />
//                         <div className="relative z-10 flex flex-col items-start leading-none">
//                             <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">{sector.label}</span>
//                             <span className="text-[8px] font-medium opacity-50 uppercase tracking-tighter">{sector.sub}</span>
//                         </div>
//                     </button>
//                 );
//             })}
//         </div>
//     );
// };

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'
import { BookOpen, Radio, Target, Users } from 'lucide-react';

export default function ClassroomNavbar({ activeTab, setActiveTab }) {
    const sectors = [
        { id: "intel", label: "Intel", icon: Target, sub: "Assignments" },
        { id: "broadcasts", label: "Broadcasts", icon: Radio, sub: "Lectures" },
        { id: "archives", label: "Archives", icon: BookOpen, sub: "Notes" },
        { id: "roster", label: "Roster", icon: Users, sub: "Students" },
    ];

    return (
        <nav className="flex items-center gap-2 p-2 rounded-[2rem] bg-card/40 dark:bg-black/40 border border-border dark:border-white/5 backdrop-blur-2xl shadow-2xl">
            {sectors.map((sector) => {
                const IsActive = activeTab === sector.id;
                return (
                    <button
                        key={sector.id}
                        onClick={() => setActiveTab(sector.id)}
                        className={cn(
                            "relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 group",
                            IsActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {IsActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <sector.icon size={18} className={cn("relative z-10 transition-transform duration-500", IsActive && "scale-110")} />
                        <div className="relative z-10 flex flex-col items-start leading-none text-left">
                            <span className="text-[10px] font-bold font-oswald uppercase tracking-widest">{sector.label}</span>
                            <span className="text-[8px] font-medium opacity-50 uppercase tracking-tighter">{sector.sub}</span>
                        </div>
                    </button>
                );
            })}
        </nav>
    );
};
