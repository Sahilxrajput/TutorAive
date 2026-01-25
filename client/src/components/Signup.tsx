import API from "@/lib/api"
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, type Dispatch, type SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import { Field, FieldSeparator } from "@/components/ui/field"

export default function Signup({ setIsLoginPage }: { setIsLoginPage: Dispatch<SetStateAction<boolean>> }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [userName, setUserName] = useState("")
    const [role, setRole] = useState<"student" | "instructor" | "admin" | "">("")

    const { refreshUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await API.post("/auth/signup", {
                firstName,
                lastName,
                userName,
                email,
                password,
                role,
            })
            setEmail("")
            setPassword("")
            setUserName("")
            setFirstName("")
            setLastName("")
            setRole("")
            await refreshUser()
            navigate("/dashboard")
        } catch (error) {
            console.error("Signup failed", error)
        }
    }

    const GoogleSignup = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    return (
        <Card className="h-full w-2/5 flex flex-col p-10 items-center justify-between rounded-l-[15%] rounded-r-none">

            {/* Header */}
            <CardHeader className="text-start space-y-2 w-full mt-8">
                <CardTitle className="text-3xl font-thin font-cinzel">
                    Welcome to TutorAive
                </CardTitle>

                <CardDescription>
                    Let&apos;s help you get started.
                </CardDescription>

                <CardAction className="justify-center">
                    <Button variant="link" onClick={() => setIsLoginPage(true)}>Sign In</Button>
                </CardAction>
            </CardHeader>

            {/* Form */}
            <CardContent className="flex items-center w-full">
                <form onSubmit={handleSubmit} className="w-full space-y-6">

                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                                className="h-12 px-4 text-base"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                                className="h-12 px-4 text-base"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Email & Username */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                className="h-12 px-4 text-base"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="@student"
                                required
                            />
                        </div>
                    </div>

                    {/* Password & Role */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
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

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={role}
                                onValueChange={(val) =>
                                    setRole(val as "student" | "instructor" | "admin")
                                }
                            >
                                <SelectTrigger className="h-full text-base">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="instructor">Instructor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-base mt-2">
                        Sign Up
                    </Button>
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
                        onClick={GoogleSignup}
                        className="p-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Signup with Google
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
