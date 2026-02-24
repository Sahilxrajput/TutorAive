import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from "gsap/ScrollTrigger";
import { Star } from 'lucide-react';
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

        gsap.set(cards, {
            y: 120,
            opacity: 0,
            scale: 0.9,
            rotationX: -20,
            transformOrigin: "50% 100%",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".testimonials-wrapper",
                start: "top top",
                end: "+=400%",
                pin: true,
                scrub: 1.2,
                anticipatePin: 1,
            }
        });

        cards.forEach((card, i) => {
            tl.to(card, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationX: 0,
                rotation: i % 2 === 0 ? -1.5 : 1.5,
                duration: 2.5,
                ease: "expo.out",
            }, i * 1.5)

            if (i > 0) {
                tl.to(cards[i - 1], {
                    scale: 0.94,
                    opacity: 0.2,
                    y: -50,
                    filter: "blur(4px)",
                    duration: 2,
                    ease: "power2.inOut"
                }, `<`);
            }
        });
    });

    return (
        <div className="testimonials-wrapper h-screen w-full bg-background flex flex-col items-center justify-start pt-24 overflow-hidden relative perspective-1200">

            <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="text-center mb-12 z-10 px-6">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block font-oswald"
                >
                    User Testimonials
                </motion.span>
                <h2 className="text-5xl md:text-7xl font-bold text-foreground leading-tight font-cinzel tracking-tight">
                    TRUSTED BY THE <br />
                    <span className="text-primary italic font-montserrat">COMMUNITY.</span>
                </h2>
            </div>

            <div className="relative h-125 w-full max-w-162.5 px-6 flex items-center justify-center">
                {feedbacks.map((f, i) => (
                    <div
                        key={i}
                        className="feedback-card absolute w-full h-full bg-card dark:bg-neutral-900/60 backdrop-blur-xl border border-border dark:border-white/10 flex flex-col items-start justify-between rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-black/5 dark:shadow-black/40"
                        style={{ zIndex: i }}
                    >
                        <svg
                            className='absolute w-48 h-auto top-10 left-10 text-primary/[0.07] dark:text-white/3 pointer-events-none -z-10'
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 379.51"
                        >
                            <path
                                fill="currentColor"
                                d="M212.27 33.98C131.02 56.52 78.14 103.65 64.99 185.67c-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160.01 60.56 27.12 149.48-159.79 175.36-215.11 92.8-12.87-19.19-21.39-41.59-24.46-66.19C-11.35 159.99 43.48 64.7 139.8 19.94c17.82-8.28 36.6-14.76 56.81-19.51 10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78zm267.78 0c-81.25 22.54-134.14 69.67-147.28 151.69-3.58 22.32 1.42 5.46 16.55-5.86 49.4-36.96 146.53-23.88 160 60.56 27.13 149.48-159.78 175.36-215.1 92.8-12.87-19.19-21.39-41.59-24.46-66.19C256.43 159.99 311.25 64.7 407.58 19.94 425.4 11.66 444.17 5.18 464.39.43c10.12-2.05 17.47 3.46 20.86 12.77 2.87 7.95 3.85 16.72-5.2 20.78z"
                            />
                        </svg>

                        <div className="w-full flex justify-between items-start z-20">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, starI) => (
                                        <Star key={starI} size={16} className={starI < f.rating ? "text-primary fill-primary" : "text-muted dark:text-neutral-800"} />
                                    ))}
                                </div>
                                <p className='text-2xl md:text-3xl font-light text-foreground leading-relaxed font-inter italic tracking-tight pr-6'>
                                    "{f.feedback}"
                                </p>
                            </div>

                            <Avatar className="w-16 h-16 border-4 border-background shadow-xl shrink-0">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.userName}`} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{f.userName[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="z-20 flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-primary/20 rounded-full" />
                            <div>
                                <h3 className='font-bold text-xl font-oswald text-foreground tracking-wider uppercase'>
                                    {f.userName}
                                </h3>
                                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]'>
                                    {f.location}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;