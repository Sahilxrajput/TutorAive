import Signin from "@/components/Signin"
import Signup from "@/components/Signup"
import { useState } from "react"

export default function Auth() {
    const [isLoginPage, setIsLoginPage] = useState(true)
    return (
        <div
            className="relative h-screen w-screen bg-[#B8C8FF] flex items-center justify-between"
        >
            <h1 className="text-4xl absolute font-cinzel top-8 left-20 text-card">TutorAive</h1>

            <div className="h-9/10">
                <div className="absolute top-1/5 px-6 left-1/10 max-w-xl text-card flex flex-col items-start justify-center gap-4">
                    <h1 className="text-6xl font-cinzel">Smart Learning</h1>
                    <p className="text-sm pr-12 font-light">TutorAive helps students learn smarter through live classes, real time interaction, expert instructors, structured courses, secure access, and modern tools that simplify teaching, learning, and collaboration in one platform.</p>
                </div>

                <img
                    src="/bg2.svg"
                    alt="student"
                    className="h-full ml-40"
                />
            </div>
            {
                isLoginPage ?
                    <Signin setIsLoginPage={setIsLoginPage} /> :
                    <Signup setIsLoginPage={setIsLoginPage} />
            }
        </div>
    )
}
