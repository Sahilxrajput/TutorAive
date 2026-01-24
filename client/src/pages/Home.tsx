import API from '@/lib/api';
import LearningCard from '@/components/home/LeaningCard';
import useAuth from '@/hooks/useAuth';
import type { AssignmentPayload, LectureUpdatePayload } from '@/types/type';
import { formatDateTime } from '@/utils/splitDateTime';
import { BookHeartIcon, Bookmark, Clock, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSocketContext from '@/hooks/useSocketContext';
import DaySchedule from '@/components/home/DaySchedule';



const Home = () => {
    const [pendingAssignments, setPendingAssignments] = useState<number>(0)
    const { user } = useAuth()

    // @remind fetch all assignments here
    useEffect(() => {
        if (!user) return
        const fetchAssignmnets = async () => {
            try {
                const { data } = await API.get(`/assignments/student/${user._id}`)
                console.log("assignmnets : ", data)
                setPendingAssignments(data.pending.length)
            } catch (e) {
                console.log("error while fetching assignmnets", e)
            }
        }
        fetchAssignmnets()
    }, [user])

    return (
        <main className="min-h-screen flex flex-col lg:flex-row gap-4 p-4">

            {/* LEFT SIDE */}
            <section className="flex-1 flex flex-col gap-6">
                {/* Top banner */}
                <div className="w-full h-40 sm:h-48 lg:h-60 bg-yellow-600 shadow-md hover:shadow-lg rounded-lg" />

                {/* Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <LearningCard
                        title="Pending Assignment"
                        Icon={BookHeartIcon}
                        number={pendingAssignments}
                        iconColor="green"
                    />
                    <LearningCard
                        title="Certificates Earned"
                        Icon={Bookmark}
                        number={2}
                        iconColor="blue"
                    />
                    <LearningCard
                        title="Scheduled Class"
                        Icon={Rocket}
                        number={3}
                        iconColor="green"
                    />
                    <LearningCard
                        title="Streak (Days)"
                        Icon={Rocket}
                        number={3}
                        iconColor="blue"
                    />
                    <LearningCard
                        title="Hours Learned"
                        Icon={Clock}
                        number={18.5}
                        iconColor="green"
                    />
                </div>
            </section>

            {/* RIGHT SIDE */}
            <section
                className="w-full lg:w-1/4 px-2 sm:px-4 lg:px-6 space-y-6 flex flex-col overflow-y-auto scrollbar-hide"
            >
                <h1 className="text-lg font-semibold border-b pb-1">
                    Upcoming Schedule
                </h1>
                <DaySchedule />
            </section>
        </main>
    );
};

export default Home;
