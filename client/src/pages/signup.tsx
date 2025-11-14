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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"

export default function Signup() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [role, setRole] = useState<"student" | "instructor" | "admin" | "">("");

    const { refreshUser } = useAuth()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("login Triggered")
        try {
            const res = await API.post("/auth/signup", { email, password, role, userName });
            console.log(res);
            setEmail("")
            setPassword("")
            setUserName("")
            setRole("")
            await refreshUser()
            navigate("/dashboard")
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const GoogleSignup = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <Card className="w-full max-w-sm" >
                <CardHeader>
                    <CardTitle>Register your account</CardTitle>
                    <CardDescription>
                        Enter your details below to register your account
                    </CardDescription>
                    <CardAction>
                        <Link to="/signin">
                            <Button variant="link" className="cursor-pointer">Sign In</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Username</Label>
                                <Input
                                    id="password"
                                    type="text"
                                    required
                                    placeholder="@student"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <Select value={role} onValueChange={(val) => setRole(val as "student" | "instructor" | "admin")}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select user role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>role</SelectLabel>
                                        <SelectItem value="student">student</SelectItem>
                                        <SelectItem value="instructor">instructor</SelectItem>
                                        <SelectItem value="admin">admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full mt-6 cursor-pointer">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2 ">
                    <Button onClick={GoogleSignup} variant="outline" className="w-full cursor-pointer">
                        Sign up with Google
                    </Button>
                </CardFooter>

            </Card>
        </div>
    )
}
