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
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"

type Role = "student" | "instructor" | "admin" | ""

export default function Signup({
    setIsLoginPage,
}: {
    setIsLoginPage: Dispatch<SetStateAction<boolean>>
}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState(" ")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<Role>("")

    const { refreshUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!role) {
            console.error("Role is required")
            return
        }

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
            setLastName(" ")
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
                    Continue where you left off.
                </CardDescription>

                <CardAction className="justify-center">
                    <Button variant="link" className="text-[#B8C8FF]" onClick={() => setIsLoginPage(true)}>Sign Up</Button>
                </CardAction>
            </CardHeader>

            {/* Form */}
            <CardContent className="flex items-center w-full">
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-6">
                        <FieldGroup className="space-y-2">
                            <Field>
                                <FieldLabel htmlFor="name-required">First Name <span className="text-destructive">*</span></FieldLabel>
                                <Input
                                    className="h-12 px-4 text-base"
                                    id="name-required"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    required
                                />
                            </Field>
                        </FieldGroup>

                        <FieldGroup className="space-y-2">
                            <Field>
                                <FieldLabel>Last Name</FieldLabel>
                                <Input
                                    className="h-12 px-4 text-base"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                />
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Email & Username */}
                    <div className="grid grid-cols-2 gap-6">
                        <FieldGroup className="space-y-2">
                            <Field>
                                <FieldLabel htmlFor="email-required">Email <span className="text-destructive">*</span></FieldLabel>
                                <Input
                                    className="h-12 px-4 text-base"
                                    id="email-required"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                        </FieldGroup>

                        <FieldGroup className="space-y-2">
                            <Field>
                                <FieldLabel htmlFor="username-required">Username <span className="text-destructive">*</span></FieldLabel>
                                <Input
                                    className="h-12 px-4 text-base"
                                    id="username-required"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="@student"
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Password & Role */}
                    <div className="grid grid-cols-2 gap-6">
                        <FieldGroup className="space-y-2">
                            <Field>
                                <FieldLabel htmlFor="password-required">Password <span className="text-destructive">*</span></FieldLabel>
                                <Input
                                    className="h-12 px-4 text-base"
                                    id="password-required"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                />
                            </Field>
                        </FieldGroup>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={role}
                                onValueChange={(val) =>
                                    setRole(val as "student" | "instructor" | "admin")
                                }
                            >
                                <SelectTrigger className="h-12 text-base">
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

                    <button
                        type="submit"
                        className="w-full h-12 text-lg rounded-lg text-white bg-[#B8C8FF]"
                    >
                        Sign Up
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
                        onClick={GoogleSignup}
                        className="p-6 w-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="mr-2 h-5 w-5"
                        >
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
