import { useOutletContext } from "react-router-dom";
import API from '@/lib/api';
import EventCard from '@/components/home/EventCard';
import LearningCard from '@/components/home/LeaningCard';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/hooks/useAuth';
import type { AssignmentPayload, LectureUpdatePayload, ILecture } from '@/types/type';
import { formatDateTime } from '@/utils/splitDateTime';
import { BookHeartIcon, Bookmark, Clock, Menu, Rocket } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSocketContext from '@/hooks/useSocketContext';
import EventList from '@/components/home/EventList';



const Home = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [scheduleLecture, setScheduleLecture] = useState<ILecture[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pendingAssignments, setPendingAssignments] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const { isInstructor, user } = useAuth()
    const { socket } = useSocketContext()


    const detectPath = useCallback(
        function detectPath() {
            if (isInstructor) return "/lectures/scheduled/created"
            return "/lectures/scheduled/my"
        }, [isInstructor])

    const deleteScheduleLecture = async (id: string) => {
        try {
            setLoading(true);
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

    useEffect(() => {
        const fetchScheduleLectures = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(detectPath());
                console.log("setScheduleLecture : ", data.data)
                setScheduleLecture(data.data);
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduleLectures();
    }, [detectPath]);

    useEffect(() => {
        if (!socket) return

        const joinClassrooms = async () => {
            const { data } = await API.get("/classrooms/enrolled")

            data.forEach((c) => {
                socket.emit("join:classroom", c._id)
            });
        };

        joinClassrooms()

    }, [socket])

    useEffect(() => {
        if (!socket) return;

        const handleClassUpdate = (payload: LectureUpdatePayload) => {
            console.log("payload : ", payload)
            // @todo setScheduleLecture()
            switch (payload.status) {
                case "live":
                    toast.success(`lecture ${payload.title} is live now`);
                    break;

                //@todo complete status -> remove live class event from notification bar
                // case "starting_soon":
                //     toast.info("Class starting soon ⏳");
                //     console.log("payload : ", payload)
                //     break;

                case "scheduled":
                    toast.info(`lecture scheduled at ${formatDateTime(payload.startTime)}`);
                    break;

                case "rescheduled":
                    toast.info(
                        ` ${payload.title} lecture rescheduled\nNew time: ${formatDateTime(payload.startTime)}`
                    );
                    break;

                case "delayed":
                    toast.warning(
                        ` "${payload.title}" lecture delay`
                    );
                    break;

                case "cancelled":
                    toast.error(
                        ` ${payload.title} lecture cancelled\nReason: ${payload.reason}`
                    );
                    break;

                default:
                    toast("Class updated");
                    console.log("payload : ", payload)
            }
        };

        const handleAssignmentUpdate = (payload: AssignmentPayload) => {
            console.log("assignment payload : ", payload)
            toast.info(
                ` New assignment: ${payload.title}`,
                {
                    description: `Due: ${new Date(payload.dueDate).toLocaleString()}`,
                    duration: 5000, // 5 sec
                }
            );
        };

        socket.on("lecture:update", handleClassUpdate);
        socket.on("assignment:update", handleAssignmentUpdate);

        return () => {
            socket.off("lecture:update", handleClassUpdate);
            socket.off("assignment:update", handleAssignmentUpdate);
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on("tweet:update", (payload) => {
            console.log("Mention received:", payload);
            toast.success(payload.msg);
        });

        return () => {
            socket.off("tweet:update");
        };
    }, [socket]);

    const handleDateSelect = (date: Date) => {
        // clicking same date again = unselect
        if (
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()
        ) {
            setSelectedDate(null);
            return;
        }

        setSelectedDate(date);
    };

    const handleCalendarBlur = () => {
        setSelectedDate(null);
    };

    return (
        <main className="min-h-screen flex flex-col lg:flex-row gap-4 px-4">

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
                <Input type="text" placeholder="Search Something..." />

                <Calendar
                    buttonVariant="link"
                    mode="single"
                    selected={date}
                    onDayClick={handleDateSelect}
                    onDayBlur={handleCalendarBlur}
                    onSelect={setDate}
                    className="rounded-lg border w-full text-gray-700 shadow-sm"
                    captionLayout="label"
                />

                <h1 className="text-lg font-semibold border-b pb-1">
                    Upcoming Schedule
                </h1>

                <div className="flex flex-col space-y-2">
                    {!loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="p-3 border rounded-md shadow-sm space-y-2"
                            >
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))
                    ) : scheduleLecture.length > 0 ? (
                        <EventList
                            events={scheduleLecture}
                            selectedDate={selectedDate}
                            onOpen={() => { }}
                        />
                    ) : (
                        <p className="text-gray-500 text-center">
                            No upcoming lectures
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Home;
