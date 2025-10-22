import LearningCard from '@/components/home/LeaningCard';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { BookHeartIcon, Bookmark, CalendarRangeIcon, Clock, Rocket } from 'lucide-react';
import React, { useState } from 'react'


const Home = () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [scheduleClass, setScheduleClass] = useState([
        {
            title: "Mathematics Lecture",
            date: "Oct 21, 2025",
            time: "10:00 AM - 11:00 AM",
        },
        {
            title: "Physics Lab",
            date: "Oct 22, 2025",
            time: "1:30 PM - 3:00 PM",
        },
        {
            title: "Group Discussion: AI Ethics",
            date: "Oct 23, 2025",
            time: "9:00 AM - 10:30 AM",
        },
        {
            title: "Chemistry Quiz",
            date: "Oct 24, 2025",
            time: "11:30 AM - 12:00 PM",
        },
        {
            title: "Computer Science Workshop",
            date: "Oct 25, 2025",
            time: "2:00 PM - 4:00 PM",
        },
        {
            title: "English Presentation Review",
            date: "Oct 26, 2025",
            time: "10:00 AM - 11:30 AM",
        },
    ]);


    return (
        <div className='h-screen flex p-4'>
            <main className="flex-1 flex gap-6 flex-col">
                <div className='w-full h-3/10 bg-yellow-600 shadow-md hover:shadow-lg rounded-lg'></div>
                <div className='flex items-center justify-between'> 
                <LearningCard title={"Couse Completed"} Icon={BookHeartIcon} number={8} iconColor='green'/>
                <LearningCard title={"Certificates Earned"} Icon={Bookmark} number={2} iconColor='blue' />
                <LearningCard title={"Streak (Days)"} Icon={Rocket} number={3} iconColor='green'/>
                <LearningCard title={"Streak (Days)"} Icon={Rocket} number={3} iconColor='blue'/>
                <LearningCard title={"Hours Learned"} Icon={Clock} number={18.5} iconColor='green'/>
                </div>
                <h1>For You</h1>
            </main>

            {/* right side */}
            <section className='w-1/4 p-8 space-y-6 flex flex-col overflow-y-auto scrollbar-hide'>
                <Input type='text' placeholder='Search Somthing...' className='border-black border-2' />
                <Calendar buttonVariant={'link'}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border w-full text-gray-700 shadow-sm"
                    captionLayout="label"
                />
                <h1>Upcoming Schedule</h1>
                {scheduleClass.map((e, index) => (
                    <button key={index} className="p-2 border rounded-md shadow-sm">
                        <h2 className="font-semibold">{e.title}</h2>
                        <div className="flex gap-2 text-sm text-gray-600">
                            <p className="flex items-center gap-1">
                                <CalendarRangeIcon className="w-4 h-4" /> {e.date}
                            </p>
                            <p className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {e.time}
                            </p>
                        </div>
                    </button>
                ))}

            </section>
        </div>
    )
}

export default Home