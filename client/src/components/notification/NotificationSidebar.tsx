import { Bell, Calendar, BookOpen, MessageSquare, CheckCircle2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";

const notifications = {
    classes: [
        { id: 1, title: "Data Structures", time: "Starts at 2:00 PM", status: "Live" },
    ],
    assignments: [
        { id: 2, title: "React Hooks Lab", time: "Due in 3 hours", priority: "High" },
        { id: 3, title: "Database Schema Design", time: "Due Tomorrow", priority: "Normal" },
    ],
    messages: [
        { id: 4, sender: "Prof. Sahil", text: "Please check the WebRTC docs.", time: "10m ago" },
    ],
};

export function NotificationSidebar() {
    const totalNotifications =
        notifications.classes.length +
        notifications.assignments.length +
        notifications.messages.length;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button  className="relative group">
                    <Bell className="h-6 w-6 group-hover:text-gray-800" />
                    {totalNotifications > 0 && (
                        <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-600" />
                    )}
                </button>
                {/* <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {totalNotifications > 0 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-600" />
                    )}
                </Button> */}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="flex items-center gap-2">
                        Notifications <Badge variant="secondary">{totalNotifications}</Badge>
                    </SheetTitle>
                    <SheetDescription>
                        Stay updated with your latest classroom activities.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="all" className="flex-1 flex flex-col">
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="classes">Class</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                        </TabsList>
                    </div>

                    <Separator className="mt-4" />

                    <ScrollArea className="flex-1 px-6">
                        <div className="space-y-6 py-6">
                            {/* Upcoming Classes Section */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                    Upcoming Classes
                                </h3>
                                {notifications.classes.map((item) => (
                                    <div key={item.id} className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-all mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.time}</p>
                                            </div>
                                        </div>
                                        {/* Join button with animation */}
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-8 text-xs bg-green-600 hover:bg-green-700 animate-ripple"
                                            >
                                                Join Now
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Pending Assignments */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                    Pending Assignments
                                </h3>
                                {notifications.assignments.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors mb-2">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <BookOpen className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">{item.time}</p>
                                        </div>
                                        {item.priority === "High" && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                                    </div>
                                ))}
                            </section>

                            {/* Recent Messages */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                    Messages
                                </h3>
                                {notifications.messages.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors mb-2">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <MessageSquare className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.sender}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{item.text}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                                    </div>
                                ))}
                            </section>
                        </div>
                    </ScrollArea>
                </Tabs>

                <div className="p-6 border-t bg-muted/20">
                    <Button className="w-full" variant="outline">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
