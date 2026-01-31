import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star, } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
    gsap.registerPlugin(ScrollTrigger);

    const feedbacks = [
        {
            userName: "Sahil Rajput",
            feedback: "The platform is easy to use and doesn’t overwhelm you with useless features. I joined as a student and ended up creating a small course myself.",
            location: "Varanasi, India",
            rating: 5,
        },
        {
            userName: "Ananya Verma",
            feedback: "I like how tutors and students are treated equally here. The course structure is clean and the UI feels modern. Solid start for GSoC prep.",
            location: "Bengaluru, India",
            rating: 4,
        },
        {
            userName: "Rohit Sharma",
            feedback: "Content quality depends on the tutor, but the platform itself stays out of the way, which is good. Great for technical learning.",
            location: "Pune, India",
            rating: 5,
        },
        {
            userName: "Neha Gupta",
            feedback: "As a tutor, managing lectures was straightforward. Analytics are improving, and for a growing platform, this works perfectly.",
            location: "Jaipur, India",
            rating: 4,
        },
        {
            userName: "Aman Khan",
            feedback: "No unnecessary pop-ups, no aggressive selling. Loads smoothly even on late-night coding sessions. High quality UI.",
            location: "Lucknow, India",
            rating: 5,
        },
    ];

    useGSAP(() => {
        const cards = gsap.utils.toArray(".feedback-card") as Element[];

        // 1. Initial State: Spread them out slightly in 3D space
        gsap.set(cards, {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotationX: -15, // Tilt backwards
            transformOrigin: "50% 100%",
        });

        // 2. The Master Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-wrapper",
                start: "top top",
                end: "+=400%", // Longer scroll for smoother transition
                pin: true,
                scrub: 1.5, // High scrub value for "fluid" feel
                anticipatePin: 1,
            }
        });

        cards.forEach((card, i) => {
            tl.to(card, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationX: 0,
                rotation: i % 2 === 0 ? -2 : 2, // Alternating subtle tilt
                duration: 2, // Longer duration for scrub interpolation
                ease: "expo.out", // Smooth entry
            }, i * 1.2) // Increased stagger for clarity

            // Subtle "Sink" effect for previous cards
            if (i > 0) {
                tl.to(cards[i - 1], {
                    scale: 0.95,
                    opacity: 0.4,
                    y: -20,
                    duration: 1.5,
                    ease: "power1.inOut"
                }, `<`); // Starts at the same time as the new card
            }
        });
    });

    return (
        <div className="testimonials-wrapper h-screen w-full bg-black flex flex-col items-center justify-start pt-32 overflow-hidden relative perspective-1000">
            <div className="absolute bottom-0 w-full h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -z-10" />

            <div className="text-center mb-16 z-10 px-4">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-indigo-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block font-oswald"
                >
                    User Testimonials
                </motion.span>
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight font-cinzel tracking-tight">
                    TRUSTED BY THE <span className="text-indigo-500 italic uppercase">Community</span>
                </h2>
            </div>

            <div className="relative h-[480px] w-full max-w-[600px] px-6 mt-4 flex items-center justify-center">
                {feedbacks.map((f, i) => (
                    <div
                        key={i}
                        className="feedback-card absolute w-full h-full bg-neutral-900/60 backdrop-blur-2xl border border-white/10 flex flex-col items-start justify-between rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t-white/20"
                        style={{ zIndex: i }}
                    >
                        {/* Quote Icon Background */}
                        <svg className='absolute w-48 text-white/[0.03] top-10 left-10 pointer-events-none' xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 379.51"><path fill="currentColor" d="M212.27 33.98C131.02 56.52 78.14 103.65 64.99 185.67c-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160.01 60.56 27.12 149.48-159.79 175.36-215.11 92.8-12.87-19.19-21.39-41.59-24.46-66.19C-11.35 159.99 43.48 64.7 139.8 19.94c17.82-8.28 36.6-14.76 56.81-19.51 10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78zm267.78 0c-81.25 22.54-134.14 69.67-147.28 151.69-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160 60.56 27.13 149.48-159.78 175.36-215.1 92.8-12.87-19.19-21.39-41.59-24.46-66.19C256.43 159.99 311.25 64.7 407.58 19.94 425.4 11.66 444.17 5.18 464.39.43c10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78z" /></svg>

                        <div className="w-full flex justify-between items-center z-20">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, starI) => (
                                    <Star key={starI} size={14} className={starI < f.rating ? "text-indigo-400 fill-indigo-400" : "text-neutral-800"} />
                                ))}
                            </div>
                            <Avatar className="w-14 h-14 border-2 border-white/5">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.userName}`} />
                                <AvatarFallback className="bg-neutral-800 text-indigo-400 font-bold">{f.userName[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <p className='text-xl md:text-2xl font-light text-neutral-100 leading-relaxed z-20 font-serif italic'>
                            "{f.feedback}"
                        </p>

                        <div className="z-20 border-l-2 border-indigo-500/30 pl-6">
                            <h3 className='font-bold text-lg font-oswald text-white tracking-wider uppercase'>
                                {f.userName}
                            </h3>
                            <span className='text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em]'>
                                {f.location}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;