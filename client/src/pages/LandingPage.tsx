import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import defaultAvtar from '@/assets/image/avatar.png'
import { Badge } from '@/components/ui/badge'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from "gsap/ScrollTrigger";
import {
    ArrowUpRight,
    BrainCircuit,
    MessageCircle,
    Mic,
    Phone,
    Settings,
    Video,
} from 'lucide-react'

const LandingPage = () => {
    const avatar = [defaultAvtar, defaultAvtar, defaultAvtar]
    gsap.registerPlugin(ScrollTrigger);
    const feedbacks = [
        {
            userName: "Sahil Rajpoot",
            feedback:
                "The platform is easy to use and doesn’t overwhelm you with useless features. I joined as a student and ended up creating a small course myself. Could be faster on slow networks, but overall it does what it promises.",
            location: "Delhi, India",
            rating: 4,
        },
        {
            userName: "Ananya Verma",
            feedback:
                "I like how tutors and students are treated equally here. The course structure is clean and the UI feels modern. Still waiting for more advanced filters, but it’s a solid start.",
            location: "Bengaluru, India",
            rating: 4,
        },
        {
            userName: "Rohit Sharma",
            feedback:
                "I enrolled in two free courses first before paying for one, which I appreciate. Content quality depends on the tutor, but the platform itself stays out of the way, which is good.",
            location: "Pune, India",
            rating: 5,
        },
        {
            userName: "Neha Gupta",
            feedback:
                "As a tutor, uploading and managing lectures was straightforward. Analytics are basic right now, but for a growing platform, this works well enough.",
            location: "Jaipur, India",
            rating: 4,
        },
        {
            userName: "Aman Khan",
            feedback:
                "No unnecessary pop-ups, no aggressive selling. I use it mostly at night and everything loads smoothly. Would love a mobile app soon.",
            location: "Lucknow, India",
            rating: 5,
        },
        {
            userName: "Virat Kohli",
            feedback:
                "I enrolled in two free courses first before paying for one, which I appreciate. Content quality depends on the tutor, but the platform itself stays out of the way, which is good.",
            location: "Delhi, India",
            rating: 5,
        },
    ];

    const StarIcon = ({ filled }: { filled: boolean }) => (
        <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"
                }`}
            fill="currentColor"
        >
            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );

    const Rating = ({ rating }: { rating: number }) => (
        <div className="flex gap-1 z-10 ml-4">
            {[1, 2, 3, 4, 5].map(i => (
                <StarIcon key={i} filled={i <= rating} />
            ))}
        </div>
    );

    // useGSAP(() => {
    //     gsap.to(".feedbacks", {
    //         xPercent: -60, // adjust based on number of cards
    //         ease: "back.in",
    //         scrollTrigger: {
    //             trigger: ".page2",
    //             start: "top top",
    //             end: "+=200%",
    //             pin: true,
    //             scrub: 1,
    //             markers: true, // remove when done
    //         },
    //     });
    // });


    useGSAP(() => {
        const container = document.querySelector(".feedbacks");
        const section = document.querySelector(".page2");

        if (!container || !section) return;

        // HARD RESET — this fixes “hidden at start”
        gsap.set(container, { x: 0 });

        const scrollAmount =
            container.scrollWidth - window.innerWidth;

        gsap.to(container, {
            x: -scrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${scrollAmount}`,
                pin: true,
                scrub: 1,
                markers: true,
            },
        });
    });


    return (
        <div className="main-div">
            {/* PAGE ONE */}
            <div className="relative min-h-screen w-screen flex flex-col">
                {/* NAVBAR */}
                <nav className="fixed top-0 w-full h-16 flex items-center justify-between px-6 lg:px-16 z-50">
                    <h1 className="text-xl lg:text-xl px-4 font-cinzel p-2 border border-muted-foreground backdrop-blur-md rounded-full">TutorAive</h1>

                    <div className="hidden md:flex items-center space-x-4 rounded-full border border-muted-foreground p-2 px-4 backdrop-blur-md">
                        <button className="px-2 py-1 text-sm">Home</button>
                        <button className="px-2 py-1 text-sm">Features</button>
                        <button className="px-2 py-1 text-sm">Courses</button>
                        <button className="px-2 py-1 text-sm">About Us</button>
                    </div>

                    <button className="flex items-center gap-1 text-sm border-b">
                        Contact Us <ArrowUpRight size={16} />
                    </button>
                </nav>

                {/* BACKGROUND */}
                <img
                    src="./cloud4.jpg"
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                />

                {/* HERO TEXT */}
                <div className="relative mt-28 flex flex-col items-center text-center px-6 space-y-4">
                    <div className="text-4xl sm:text-5xl lg:text-6xl tracking-wider">
                        <h1 className="font-poppins">Learn Smarter, Grow Faster</h1>
                        <h1 className="font-poppins">
                            With <span className="font-cinzel">TutorAive</span>
                        </h1>
                    </div>

                    <h3 className="text-sm sm:text-base lg:text-lg font-light max-w-3xl">
                        TutorAive is a two-way learning platform where educators create
                        impactful courses and students learn with structure and real
                        guidance.
                    </h3>

                    <div className="absolute bg-primary w-64 h-64 blur-3xl rounded-full top-1/2 -left-32" />
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 w-full flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-around gap-12 px-6 lg:px-16 mt-16">
                    {/* INSTRUCTOR */}
                    <div className="flex flex-col items-center text-center space-y-6 w-full lg:w-1/4">
                        <div className="w-32 aspect-square rounded-full border-y-4 flex items-center justify-center p-4">
                            <img src="./cash.png" alt="cash" />
                        </div>

                        <h3 className="text-sm">
                            “An excellent platform for educators to monetize their skills.”
                        </h3>

                        <button className="bg-gradient-to-l from-transparent via-white to-transparent px-12 py-3">
                            Explore More
                        </button>
                    </div>

                    {/* HERO IMAGE */}
                    <div className="relative w-full lg:w-1/3 flex justify-center order-first lg:order-none">
                        <div className="absolute inset-0 rounded-3xl border-x-4 border-t-2 border-b-12 bg-primary/10 z-10" />

                        <div className="absolute top-1/3 -left-10 z-20 flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/10 text-sm">
                            <span className="p-2 bg-amber-500 text-white rounded-full">
                                <BrainCircuit size={14} />
                            </span>
                            AI POWERED
                        </div>

                        <div className="absolute top-4 left-4 z-20 flex">
                            {avatar.map((a, i) => (
                                <Avatar
                                    key={i}
                                    className="w-8 h-8 border-2 border-white bg-secondary"
                                    style={{ marginLeft: i === 0 ? 0 : -15, zIndex: i }}
                                >
                                    <AvatarImage src={a} />
                                    <AvatarFallback>US</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>

                        <Badge className="absolute top-4 right-4 z-20">
                            56 Watching
                        </Badge>

                        <img
                            src="/video.png"
                            alt="hero"
                            draggable={false}
                            className="relative z-10 w-full max-w-md lg:max-w-full object-contain"
                        />

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                            <span className="bg-white/20 p-2 rounded-full">
                                <MessageCircle size={18} />
                            </span>
                            <span className="bg-white/30 p-2 rounded-full">
                                <Mic size={18} />
                            </span>
                            <span className="bg-red-500 p-2 rounded-lg text-white">
                                <Phone className="rotate-135" size={18} />
                            </span>
                            <span className="bg-white/20 p-2 rounded-full">
                                <Video size={18} />
                            </span>
                            <span className="bg-white/20 p-2 rounded-full">
                                <Settings size={18} />
                            </span>
                        </div>
                    </div>

                    {/* STUDENT */}
                    <div className="flex flex-col items-center text-center space-y-6 w-full lg:w-1/4">
                        <div className="h-32 aspect-square rounded-full border-y-4 flex items-center justify-center p-4">
                            <img src="./book.png" alt="book" />
                        </div>

                        <h3 className="text-sm">
                            Learn with clarity. Progress with purpose.
                        </h3>

                        <span className="w-full h-[2px] bg-gradient-to-l from-transparent via-white to-transparent" />

                        <h2 className="text-xl lg:text-2xl">
                            Chosen for <br /> Quality
                        </h2>
                    </div>
                </div>
            </div>

            {/* PAGE TWO */}
            <div className="h-screen w-screen flex flex-col py-8 justify-center bg-[#CFE0F3] page2 overflow-hidden">
                <h1 className='text-4xl font-montserrat font-bold tracking-wide'>Testrimonials</h1>
                <div className='flex items-center gap-6 w-max feedbacks pl-16'>
                    {feedbacks.map((f, i) => (
                        <div
                            key={i}
                            className='shrink-0 border-4 border-primary bg-primary/40 relative rounded-xl w-[480px] h-80 p-4 flex flex-col items-start gap-4 justify-center'
                        >
                            <svg className='absolute w-32 text-[#E4E4E7] top-8' xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 379.51"><path fill="currentColor" d="M212.27 33.98C131.02 56.52 78.14 103.65 64.99 185.67c-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160.01 60.56 27.12 149.48-159.79 175.36-215.11 92.8-12.87-19.19-21.39-41.59-24.46-66.19C-11.35 159.99 43.48 64.7 139.8 19.94c17.82-8.28 36.6-14.76 56.81-19.51 10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78zm267.78 0c-81.25 22.54-134.14 69.67-147.28 151.69-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160 60.56 27.13 149.48-159.78 175.36-215.1 92.8-12.87-19.19-21.39-41.59-24.46-66.19C256.43 159.99 311.25 64.7 407.58 19.94 425.4 11.66 444.17 5.18 464.39.43c10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78z" /></svg>
                            <Avatar className="absolute right-4 top-4 w-20 h-20 border-2 border-white bg-secondary">
                                <AvatarImage
                                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${f.userName}`}
                                />
                                <AvatarFallback>{f.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Rating rating={f.rating} />
                            <h4 className='w-4/5 line-clamp-4 font-light font-poppins z-10 tracking-wide'>{f.feedback}</h4>
                            <div >
                                <h1 className='font-bold'>
                                    {f.userName}
                                </h1>
                                <span>{f.location}</span> </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* PAGE THREE */}
            <div className='w-screen h-screen bg-yellow-400'>
                PAGE THREE
            </div>
        </div>
    )
}

export default LandingPage
