import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Bell,
    Calendar,
    Zap,
    BookOpen,
    MessageSquare,
    CheckCircle2,
    Check,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import API from "@/lib/api";
import { useNotifications } from "@/tanStack/hooks/useNotifications";
import type { INotification } from "@/types/type";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function NotificationSidebar({ open, setOpen }: Props) {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [activeTab, setActiveTab] = useState<string>("all");
    const navigate = useNavigate();

    const { data, isLoading } = useNotifications();

    useEffect(() => {
        if (data) setNotifications(data);
    }, [data]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications
        .filter(n => {
            if (activeTab === "all") return true;
            return n.type === activeTab;
        })
        .sort((a, b) => Number(a.isRead) - Number(b.isRead));

    const markAllAsRead = async () => {
        try {
            await API.patch("/notifications/mark-all-read");
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch {
            toast.info("Somthing goes wrong");
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await API.patch(`/notifications/${id}/mark-read`);
        } catch {
            toast.info("Somthing goes wrong");
        }
    }

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

    const handleNotificationClick = async (item: INotification) => {
        try {
            if (!item.isRead) {
                await API.patch(`/notifications/${item._id}/mark-read`);
            }


            switch (item.type) {
                case "assignment":
                    navigate(`/classrooms/${item.data?.classroomId}`);
                    break;

                case "lecture":
                    navigate(`/classrooms/${item.data?.classroomId}`);
                    break;
                    
                case "resource":
                    navigate(`/classrooms/${item.data?.classroomId}`);
                    break;

                case "message":
                    // navigate(`/chat/${item.data?.referenceId}`);
                    break;

                default:
                    break;
            }
            setOpen(false); // close sidebar
        } catch {
            toast.info("Something went wrong");
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-[450px] sm:max-w-[520px] p-0 flex flex-col bg-background border-l border-foreground/10 shadow-2xl">

                {/* Header Section */}
                <SheetHeader className="p-6 sm:p-8 pb-4 relative overflow-hidden shrink-0">
                    {/* Background Energy Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -z-10" />

                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold font-cinzel text-foreground">
                            <Zap className="text-primary fill-primary" size={20} />
                            NOTIFICATIONS
                        </SheetTitle>
                        <Badge className="bg-primary/20 text-primary border border-primary/30  font-oswald px-3 py-1">
                            {unreadCount} NEW
                        </Badge>
                    </div>
                    <SheetDescription className="text-neutral-500 font-light text-xs mt-2 uppercase tracking-widest font-oswald">
                        Everything you missed while exploring the frontier.
                    </SheetDescription>
                </SheetHeader>

                <Tabs
                    defaultValue="all"
                    className="flex-1 flex flex-col min-h-0"
                    onValueChange={(v) => setActiveTab(v)}
                >
                    <div className="px-6 sm:px-8 mt-2 shrink-0">
                        <TabsList className="grid w-full grid-cols-4 bg-neutral-300/50 dark:bg-neutral-900/50 border border-foreground/5 p-1 rounded-xl">
                            {["all", "lecture", "assignment", "message"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-bold font-oswald uppercase tracking-widest transition-all"
                                >
                                    {tab === "lecture" ? "Class" : tab === "assignment" ? "Tasks" : tab === "message" ? "Chat" : "All"}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <Separator className="mt-6 bg-foreground/5 shrink-0" />

                    <div className="flex-1 px-4 sm:px-8 min-h-0 overflow-x-hidden ">
                        <div className="py-6 space-y-4">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <p className="text-[10px] font-bold font-oswald text-neutral-600 uppercase tracking-[0.3em]">
                                        Syncing Feed...
                                    </p>
                                </div>
                            )}

                            {!isLoading && (!filteredNotifications || filteredNotifications.length === 0) && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Bell className="text-neutral-800 mb-4" size={40} />
                                    <p className="text-sm font-cinzel text-neutral-500 uppercase">
                                        No new echoes found.
                                    </p>
                                </div>
                            )}

                            {filteredNotifications && filteredNotifications.map(item => (
                                <button
                                    key={item._id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={cn(
                                        "flex gap-4 p-4 rounded-2xl border transition-all duration-300 relative group w-full",
                                        item.isRead
                                            ? "bg-transparent border-foreground/5 opacity-60"
                                            : "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(79,70,229,0.05)]"
                                    )}
                                >
                                    {/* Icon Container */}
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-xl dark:bg-neutral-900 bg-neutral-300 border border-foreground/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                            {getIcon && getIcon(item.type)}
                                        </div>
                                    </div>

                                    {/* Message Content - min-w-0 is critical for flex text-wrapping */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className="text-sm font-medium text-foreground leading-tight break-all">
                                            {item.message}
                                        </p>
                                        <p className="text-[10px] font-bold font-oswald text-neutral-600 uppercase tracking-widest">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                                        </p>
                                    </div>

                                    {/* Mark as read interaction */}
                                    {!item.isRead && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item._id);
                                            }}
                                            className="shrink-0 flex items-start pt-1"
                                            title="Mark as read"
                                        >
                                            <div className="relative cursor-pointer group/dot">
                                                <span className="block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all group-hover/dot:scale-0" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/dot:opacity-100 transition-opacity">
                                                    <Check size={14} className="text-indigo-400" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </Tabs>

                {/* Footer Action */}
                <div className="p-6 sm:p-8 border-t border-foreground/5 bg-neutral-400/50 dark:bg-neutral-950/50 backdrop-blur-md shrink-0">
                    <Button
                        variant="ghost"
                        className="w-full h-12 bg-primary text-white hover:bg-primary rounded-xl font-bold font-oswald tracking-[0.2em] uppercase text-[10px] transition-all"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <CheckCircle2 className="mr-3 h-4 w-4" />
                        Acknowledge All
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
