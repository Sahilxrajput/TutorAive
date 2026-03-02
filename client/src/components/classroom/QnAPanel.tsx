import { useEffect, useState } from "react";
import { ThumbsUp, Send, CircleCheckBig } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import useSocketContext from "@/hooks/useSocketContext";
import useAuth from "@/hooks/useAuth";
import { useParams } from "react-router-dom";

interface Question {
    _id: string;
    userId: string;
    userName: string;
    question: string;
    upvotes: number;
    isAnswered: boolean;
    userProfilePicture: string;
    createdAt: string;
}

export default function QnAPanel() {
    const { socket } = useSocketContext();
    const { user, isInstructor } = useAuth();
    const { lectureId } = useParams<{ lectureId: string }>();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

    /* ================= SYNC + LISTENERS ================= */
    useEffect(() => {
        if (!socket || !lectureId) return;

        socket.emit("qna:sync", { lectureId }, (res: { questions: Question[] }) => {
            if (res?.questions) {
                setQuestions(res.questions);
            }
        });

        const onNew = (q: Question) => {
            setQuestions(prev => [q, ...prev]);
        };

        const onUpdate = ({ questionId, upvotes }: { questionId: string; upvotes: number }) => {
            setQuestions(prev =>
                prev.map(q => q._id === questionId ? { ...q, upvotes } : q)
            );
        };

        const onAnswered = ({ questionId }: { questionId: string }) => {
            setQuestions(prev =>
                prev.map(q => q._id === questionId ? { ...q, isAnswered: true } : q)
            );
        };

        socket.on("qna:new", onNew);
        socket.on("qna:update", onUpdate);
        socket.on("qna:answered", onAnswered);

        return () => {
            socket.off("qna:new", onNew);
            socket.off("qna:update", onUpdate);
            socket.off("qna:answered", onAnswered);
        };

    }, [socket, lectureId]);

    /* ================= ASK ================= */
    const handleAskQuestion = async () => {
        if (!newQuestion.trim() || !socket || !user) return;

        const res = await socket.emitWithAck("qna:ask", {
            lectureId,
            question: newQuestion,
            userId: user._id,
            userName: user.userName,
            userProfilePicture: user.profilePicture,
        });

        if (res?.error) return;

        setNewQuestion("");
    };

    /* ================= UPVOTE ================= */
    const handleUpvote = (questionId: string) => {
        if (upvoted.has(questionId) || !socket || !user) return;

        socket.emit("qna:upvote", {
            lectureId,
            questionId,
            userId: user._id,
        });

        setUpvoted(prev => new Set(prev).add(questionId));
    };

    /* ================= MARK ANSWERED ================= */
    const handleAnswer = (questionId: string) => {
        if (!socket) return;

        socket.emit("qna:mark-answered", {
            lectureId,
            questionId,
        });
    };

    const sortedQuestions = [...questions].sort(
        (a, b) => b.upvotes - a.upvotes
    );

    return (
        <div className="flex flex-col h-full">

            {!isInstructor && (
                <div className="flex gap-2 p-4 border-b border-border">
                    <Input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                        placeholder="Ask a question..."
                        className="flex-1 bg-secondary/50 border-0 focus-visible:ring-1"
                    />
                    <Button
                        size="icon"
                        onClick={handleAskQuestion}
                        disabled={!newQuestion.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">

                    {sortedQuestions.map((q) => (
                        <div
                            key={q._id}
                            className={cn(
                                "p-3 rounded-xl border",
                                q.isAnswered
                                    ? "border-green-400/50 bg-green-400/5"
                                    : "border-border bg-secondary/30"
                            )}
                        >
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={q.userProfilePicture} />
                                    <AvatarFallback>
                                        {q.userName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{q.userName}</span>
                                        {q.isAnswered && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-600">
                                                Answered
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm mt-1">{q.question}</p>

                                    <button
                                        onClick={() => handleUpvote(q._id)}
                                        className={cn(
                                            "mt-2 flex items-center gap-1 text-xs",
                                            upvoted.has(q._id)
                                                ? "text-green-600"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        {q.upvotes}
                                    </button>
                                </div>

                                {isInstructor && !q.isAnswered && (
                                    <button
                                        className="text-green-500 self-center"
                                        onClick={() => handleAnswer(q._id)}
                                    >
                                        <CircleCheckBig />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            </ScrollArea>
        </div>
    );
}