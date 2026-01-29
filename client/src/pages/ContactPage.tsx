import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Github,
    Linkedin,
    Twitter,
    Instagram,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import API from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";


type IRole = "student" | "instructor" | "institution"

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('')
    const [role, setRole] = useState<IRole>("student");

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            toast.warning("Please fill all required fields");
            return;
        }

        try {
            await API.post("/contact", {
                name,
                email,
                role,
                message,
            });

            toast.success("Message sent successfully");

            setName("");
            setEmail("");
            setMessage("");
            setRole("student");
        } catch {
            toast.error("Failed to send message. Try again later.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            {/* TOP CONTACT SECTION */}
            <section className="w-full flex flex-col items-center justify-center p-8 space-y-12 pb-20"
                style={{
                    background: "radial-gradient(circle at center, #FAFBFD 0%, #CFE0F3 80%)",
                }}>
                <h1 className="text-4xl font-light py-8 w-1/5 text-center border-primary bg-primary/10 text-primary tracking-wider border-2 rounded-full">
                    Contact
                </h1>
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-3xl text-primary text-center font-poppins">
                            Get in touch with us!
                        </CardTitle>
                        <p className="text-center text-muted-foreground">
                            Students, educators, and institutions. This is your direct line to
                            TutorAive.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                        <Input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" />

                        <Select value={role} onValueChange={(value) => setRole(value as IRole)}>
                            <SelectTrigger>
                                <SelectValue placeholder="I am a..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="instructor">Teacher</SelectItem>
                                <SelectItem value="institution">Institution</SelectItem>
                            </SelectContent>
                        </Select>


                        <Textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you're trying to learn or teach."
                            rows={5}
                        />


                        <Button onClick={handleSubmit} className="w-full">
                            Send message
                        </Button>


                        <p className="text-xs text-muted-foreground text-center">
                            We usually reply within 24–48 hours. No spam. No automated nonsense.
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Separator />

            {/* INFO SECTION */}
            <section
                className="w-full"
                style={{
                    background: "radial-gradient(circle at center, #FAFBFD 0%, #CFE0F3 80%)",
                }}
            >
                <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">For Students</h3>
                        <p className="text-muted-foreground">
                            Need help choosing the right course, planning what to learn next, or
                            staying consistent? Reach out. We’ll guide you without overwhelming
                            you.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">For Educators</h3>
                        <p className="text-muted-foreground">
                            Want to teach on TutorAive or need help managing your courses? If
                            you’re serious about teaching, we’re serious about supporting you.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold">For Institutions</h3>
                        <p className="text-muted-foreground">
                            Partner with TutorAive for workshops, classrooms, or curated learning
                            paths. This is for real collaboration, not empty partnerships.
                        </p>
                    </div>
                </div>
            </section>


            <Separator />

            <section>
                
            </section>

            <footer style={{
                background: "radial-gradient(circle at center, #FAFBFD 0%, #CFE0F3 80%)",
            }}>
                <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
                    <div className="col-span-2 space-y-4">
                        <h4 className="text-lg font-semibold">TutorAive</h4>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Built for students. Empowered by educators.
                        </p>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/Sahilxrajput"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <Github size={20} />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/sahilxrajput/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <Linkedin size={20} />
                            </a>

                            <a
                                href="https://x.com/SaahilxRajput"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <Twitter size={20} />
                            </a>

                            <a
                                href="https://www.instagram.com/sahil_rajput.env/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>


                    <div className="space-y-2">
                        <h5 className="font-medium">Product</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>About Us</li>
                            <li>How It Works</li>
                            <li>FAQs</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-medium">Students</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>Explore Courses</li>
                            <li>Free Resources</li>
                            <li>Community</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h5 className="font-medium">Educators</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>Become an Instructor</li>
                            <li>Create a Course</li>
                            <li>Teaching Guidelines</li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
                    <span>© 2026 TutorAive. All rights reserved.</span>
                    <div className="flex gap-4">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactPage;
