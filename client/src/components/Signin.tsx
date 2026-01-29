import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useState, type Dispatch, type SetStateAction } from "react"
import { Label } from "./ui/label"

export default function Signin({ setIsLoginPage }: { setIsLoginPage: Dispatch<SetStateAction<boolean>> }) {

    const { signin } = useAuth()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            signin({ email, password })
            setEmail("")
            setPassword("")
            navigate("/dashboard")
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const GoogleSignin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <Card className="h-full w-2/5 flex flex-col p-10 items-center justify-around rounded-l-[15%] rounded-r-none relative">
            {/* Header */}
            <CardHeader className="text-start space-y-2 w-full mt-8">
                <CardTitle className="text-3xl font-thin font-cinzel">
                    Welcome to TutorAive
                </CardTitle>

                <CardDescription>
                    Continue where you left off.
                </CardDescription>

                <CardAction className="justify-center">
                    <Button variant="link" className="text-[#B8C8FF]" onClick={() => setIsLoginPage(false)}>Sign Up</Button>
                </CardAction>
            </CardHeader>

            {/* Form */}
            <CardContent className="w-full">
                <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col items-center justify-center">
                    {/* Email & Username */}
                    <div className="space-y-2 w-full">
                        <Label>Email</Label>
                        <Input
                            className="h-12 px-4 text-base"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="m@example.com"
                            required
                        />
                    </div>


                    {/* Password & Role */}
                    <div className="space-y-2 w-full">
                        <Label>Password</Label>
                        <Input
                            className="h-12 px-4 text-base"
                            placeholder="**********"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full h-12 text-lg tracking-wider rounded-lg text-white bg-[#B8C8FF] mt-2">
                        Login
                    </button>
                </form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex flex-col gap-10 w-full -mt-10">
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card w-full">
                    Or continue with
                </FieldSeparator>
                <Field>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={GoogleSignin}
                        className="p-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Login with Google
                    </Button>
                </Field>
            </CardFooter>
            {/* < FieldDescription className="px-6 text-center" >
                By clicking continue, you agree to our <a a href="#" > Terms of Service</a > {" "}
                and <a  href="#" > Privacy Policy</a >.
            </FieldDescription >  */}
        </Card >
    )
}
