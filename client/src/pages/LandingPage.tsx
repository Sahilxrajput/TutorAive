import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import deafultAvtar from '@/assets/image/avatar.png'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, BrainCircuit } from 'lucide-react'



const LandingPage = () => {
    const avatar = [deafultAvtar, deafultAvtar, "./canva.png"]

    return (
        <div className="flex h-screen w-screen items-center justify-between">

            <nav className='fixed top-0 w-screen h-16 flex items-center justify-between px-16'>
                <h1 className='text-2xl font-cinzel'>TutorAive</h1>
                <div className='flex items-center space-x-4 rounded-full border border-muted-foreground p-2 px-4'>
                    <button className='px-2 py-1 text-sm '>Home</button>
                    <button className='px-2 py-1 text-sm '>Features</button>
                    <button className='px-2 py-1 text-sm '>Courses</button>
                    <button className='px-2 py-1 text-sm '>About Us</button>
                    {/* <button className='px-2 py-1 text-xs rounded-xl border border-muted-foreground'>Home</button>
                    <button className='px-2 py-1 text-xs rounded-xl border border-muted-foreground'>Features</button>
                    <button className='px-2 py-1 text-xs rounded-xl border border-muted-foreground'>Courses</button>
                    <button className='px-2 py-1 text-xs rounded-xl border border-muted-foreground'>About Us</button> */}
                </div>
                <button className='flex items-center justify-center px-2 py-1 font-light border-b-1 border-sidebar-primary'>Contact Us <ArrowUpRight /></button>
            </nav>

            <div className="relative w-1/2 h-full flex flex-col items-start space-y-8 justify-center pl-20">
                <Badge className='bg-transparent text-primary border border-muted-background shadow-md'>AI POWERED ONLINE LEARNING PLATFORM</Badge>
                <div className='text-6xl tracking-wider leading-20 z-20'>
                    <h1 className='font-cinzel'>
                        Learn Smarter
                    </h1>
                    <h1 className='font-cinzel'>
                        Grow Faster With
                    </h1>
                    <h1 className='flex items-center justify-start gap-4 font-cinzel'>
                        TutorAive
                        <div className='relative flex items-center w-30'>
                            {
                                avatar.map((a, i) => (
                                    <Avatar key={i} className="w-10 h-10 border-2 border-white shadow-md bg-secondary"
                                        style={{
                                            objectFit: "contain",
                                            marginLeft: i === 0 ? 0 : -15,
                                            zIndex: i
                                        }}>
                                        <AvatarImage src={a} />
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                ))
                            }
                        </div>
                    </h1>

                </div>
                <h3 className='text-lg font-light'>TutorAive combines intelligent guidance with structured learning to help students stay focused, consistent, and confident on their learning journey.</h3>
                <Button className='p-6'>Start Leaning</Button>
                <div className='absolute bg-primary min-w-xs blur-3xl rounded-full aspect-square top-1/4 -left-1/5' />
            </div>


            <div className="w-1/2 h-full flex items-center justify-center">
                <div className="relative w-1/2">
                    <div className='absolute bottom-0 right-auto w-full h-4/5 rounded-3xl shadow-xs bg-primary/10 shadow-primary' />
                    {/* <div className='absolute top-0  bg-primary/20 h-2/3  rounded-full aspect-square blur-lg ' /> */}
                    <div className='absolute top-2/5 z-30 -left-1/6 border flex items-center justify-around gap-2 px-4 py-2 rounded-xl backdrop-blur-2xl text-sm bg-[#ffffff10]'>
                        <span className='p-2 bg-amber-500 text-white rounded-full backdrop-blur-2xl '><BrainCircuit size={14} /></span>
                        AI POWERED
                    </div>
                    <img
                        draggable="false"
                        src="/hero.png"
                        alt="boy"
                        className="relative z-10 w-full h-auto object-contain"
                    />
                </div>
            </div>

        </div>
    )
}

export default LandingPage