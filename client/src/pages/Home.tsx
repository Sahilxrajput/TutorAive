import API from '@/lib/api';
import { DateTimePicker } from '@/components/classroom/DateTimePicker';
import EventCard from '@/components/home/EventCard';
import LearningCard from '@/components/home/LeaningCard';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/hooks/useAuth';
import type { ILecture } from '@/types/auth';
import { formatDateTime } from '@/utils/splitDateTime';
import { BookHeartIcon, Bookmark, Clock, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Home = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [scheduleLecture, setScheduleLecture] = useState<ILecture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openCalender, setOpenCalender] = useState<boolean>(false)
    const [eventId, setEventId] = useState<string>('')

    const { isInstructor } = useAuth()

    function detectPath() {
        if (isInstructor) return "/lectures/scheduled/created"
        return "/lectures/scheduled/my"
    }

    const deleteScheduleLecture = async (id: string) => {
        try {
            setLoading(true);
            console.log("id : ", id)
            const { data } = await API.delete("/lectures/" + id)
            console.log(data)
            if (data?.success) {
                toast.success(data.message)
                setScheduleLecture(scheduleLecture.filter((l: ILecture) => l._id !== id))
            }
        } catch (error: any) { // *@fix think about error meg toast
            console.error('Error fetching lectures:', error.response.data.message);
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }

    }

    async function openPopUp(id: string) {
        setOpenCalender(true);
        setEventId(id)
    }

    useEffect(() => {
        const fetchScheduleLectures = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(detectPath());
                const formattedLectures = data.data.map((lecture: ILecture) => {
                    const { dateStr, timeStr } = formatDateTime(lecture.startTime!);
                    return { ...lecture, dateStr, timeStr };
                });

                console.log("schedule lectures => ", formattedLectures)

                setScheduleLecture(formattedLectures);
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleLectures();
    }, []);

    return (
        <main className="h-screen flex p-4">

            {/* left side */}
            <section className="flex-1 flex gap-6 flex-col">
                <div className="w-full h-3/10 bg-yellow-600 shadow-md hover:shadow-lg rounded-lg"></div>
                <div className="flex items-center justify-between">
                    <LearningCard title="Couse Completed" Icon={BookHeartIcon} number={8} iconColor="green" />
                    <LearningCard title="Certificates Earned" Icon={Bookmark} number={2} iconColor="blue" />
                    <LearningCard title="Streak (Days)" Icon={Rocket} number={3} iconColor="green" />
                    <LearningCard title="Streak (Days)" Icon={Rocket} number={3} iconColor="blue" />
                    <LearningCard title="Hours Learned" Icon={Clock} number={18.5} iconColor="green" />
                </div>
                <h1>For You</h1>
            </section>

            {/* right side */}
            <section className="w-1/4 p-8 space-y-6 flex flex-col overflow-y-auto scrollbar-hide">
                <Input type="text" placeholder="Search Something..." className="border-black border-2" />
                <Calendar
                    buttonVariant={'link'}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border w-full text-gray-700 shadow-sm"
                    captionLayout="label"
                />
                <h1 className="text-lg font-semibold border-b pb-1 mb-2">Upcoming Schedule</h1>

                <div className="w-full flex flex-col space-y-2">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-2 border rounded-md shadow-sm space-y-2 flex flex-col items-center justify-center">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-8/10" />
                                <div className="flex justify-between w-full pt-2 ">
                                    <Skeleton className="h-4 w-30" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))
                    ) : scheduleLecture.length > 0 ? (
                        scheduleLecture.map((e: ILecture) => (
                            <EventCard key={e._id}
                                event={e}
                                onOpen={() => { }}
                                onEdit={openPopUp}
                                onDelete={deleteScheduleLecture} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No upcoming lectures</p>
                    )}
                </div>
                {openCalender && <DateTimePicker id={eventId} showPopup={openCalender} setShowPopup={setOpenCalender} action='edit' />}
            </section>
        </main>
    );
};

export default Home;
