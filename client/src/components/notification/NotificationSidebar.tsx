import { useEffect, useState } from "react";
import {
    Bell,
    Calendar,
    BookOpen,
    MessageSquare,
    CheckCircle2,
} from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import API from "@/lib/api";
import { useNotifications } from "@/tanStack/hooks/useNotifications";
import type { INotification } from "@/types/type";

export function NotificationSidebar() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "lecture" | "assignment" | "message">("all");

    // const { data, isLoading } = useNotifications();

    // useEffect(() => {
    //     if (data) setNotifications(data);
    // }, [data]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === "all") return true;
        return n.type === activeTab;
    });

    const markAllAsRead = async () => {
        try {
            const { data } = await API.patch("/notifications/mark-all-read");
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
            console.log("data: mark ", data)
        } catch (err) {
            console.error("Failed to mark notifications as read", err);
        }
    };

    const getIcon = (type: INotification["type"]) => {
        switch (type) {
            case "lecture":
                return <Calendar className="h-4 w-4 text-blue-600" />;
            case "assignment":
                return <BookOpen className="h-4 w-4 text-amber-600" />;
            case "message":
                return <MessageSquare className="h-4 w-4 text-green-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative">
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
                    )}
                </button>
            </SheetTrigger>

            <SheetContent className="w-[400px] sm:w-[520px] p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="flex items-center gap-2">
                        Notifications
                        <Badge variant="secondary">{unreadCount}</Badge>
                    </SheetTitle>
                    <SheetDescription>
                        Everything you missed while pretending to be productive.
                    </SheetDescription>
                </SheetHeader>

                <Tabs
                    defaultValue="all"
                    className="flex-1 flex flex-col min-h-0"
                    onValueChange={(v) =>
                        setActiveTab(v as "all" | "lecture" | "assignment" | "message")
                    }
                >
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="lecture">Class</TabsTrigger>
                            <TabsTrigger value="assignment">Tasks</TabsTrigger>
                            <TabsTrigger value="message">Chat</TabsTrigger>
                        </TabsList>
                    </div>

                    <Separator className="mt-4" />

                    {/* <ScrollArea className="flex-1 px-6 min-h-0">
                        <div className="py-6 space-y-3">
                            {isLoading && (
                                <p className="text-sm text-muted-foreground">
                                    Loading notifications…
                                </p>
                            )}

                            {!isLoading && filteredNotifications.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No notifications. Miracles do happen.
                                </p>
                            )}

                            {filteredNotifications.map(item => (
                                <div
                                    key={item._id}
                                    className={`flex gap-3 p-3 rounded-lg border transition ${item.isRead
                                        ? "bg-background"
                                        : "bg-muted/40"
                                        }`}
                                >
                                    <div className="p-2 aspect-square rounded-full bg-muted">
                                        {getIcon(item.type)}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {!item.isRead && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea> */}
                </Tabs>

                <div className="p-6 border-t">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
