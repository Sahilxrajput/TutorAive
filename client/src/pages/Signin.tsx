import API from "@/api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"


export function Signin() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { refreshUser } = useAuth()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/signin", { email, password });
            console.log(res.data.user);
            setEmail("")
            setPassword("")
            await refreshUser()
            navigate("/dashboard")
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const GoogleSignin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <Card className="w-full max-w-sm" >
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Link to="/signup">
                            <Button variant="link" className="cursor-pointer">Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardContent>
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
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 ">
                        <Button type="submit" className="w-full cursor-pointer">
                            Login
                        </Button>
                        <Button onClick={GoogleSignin} variant="outline" className="w-full cursor-pointer">
                            Sign in with Google
                        </Button>
                    </CardFooter>
                </form>

            </Card>
        </div>

    )
}
