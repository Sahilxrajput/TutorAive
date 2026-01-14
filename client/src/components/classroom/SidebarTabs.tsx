import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart2, CircleQuestionMark, MessageCircle } from "lucide-react";
import PollsPanel from "./PollsPanel";
import QnAPanel from "./QnAPanel";
import ChatPanel from "./ChatPanel";


const SidebarTabs = () => {
    return (
        <motion.div
            draggable="true"
            
            className="w-[400px] border-l bg-card min-h-screen flex flex-col"
        >
            <Tabs defaultValue="chat" className="flex flex-col w-full h-full">
                <TabsList className="grid grid-cols-3 h-10 w-full border-b bg-transparent">
                    <TabsTrigger
                        value="chat"
                        className="
                            flex items-center gap-2 rounded-none
                            text-muted-foreground
                            data-[state=active]:text-primary
                            data-[state=active]:border-b-2
                            data-[state=active]:border-primary
                            data-[state=active]:bg-transparent"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                    </TabsTrigger>

                    <TabsTrigger
                        value="qna"
                        className="
                            flex items-center gap-2 rounded-none
                            text-muted-foreground
                            data-[state=active]:text-primary
                            data-[state=active]:border-b-2
                            data-[state=active]:border-primary
                            data-[state=active]:bg-transparent"
                    >
                        <CircleQuestionMark className="h-4 w-4" />
                        Q&A
                    </TabsTrigger>

                    <TabsTrigger
                        value="poll"
                        className="
                            flex items-center gap-2 rounded-none
                            text-muted-foreground
                            data-[state=active]:text-primary
                            data-[state=active]:border-b-2
                            data-[state=active]:border-primary
                            data-[state=active]:bg-transparent"
                    >
                        <BarChart2 className="h-4 w-4" />
                        Poll
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 m-0 min-h-0">
                    <ChatPanel />
                </TabsContent>
                <TabsContent value="qna" className="flex-1 m-0 min-h-0">
                    <QnAPanel />
                </TabsContent>
                <TabsContent value="poll" className="flex-1 m-0 min-h-0">
                    <PollsPanel />
                </TabsContent>
            </Tabs>
        </motion.div>
    );
};

export default SidebarTabs;

