import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { ReactNode } from "react";

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    useRealtimeNotifications() // update on realtime
    return <>{children}</>;
};

export default NotificationProvider;
