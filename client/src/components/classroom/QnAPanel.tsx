import { useState } from "react";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    upvotes: number;
    isAnswered: boolean;
    answer?: string;
    timestamp: Date;
}

const mockQuestions: Question[] = [
    {
        id: "1",
        userId: "u1",
        userName: "James Park",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        content: "How does this concept apply to real-world scenarios?",
        upvotes: 12,
        isAnswered: true,
        answer: "Great question! In practice, this is used in...",
        timestamp: new Date(Date.now() - 600000),
    },
    {
        id: "2",
        userId: "u2",
        userName: "Lisa Wang",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        content: "Can you explain the difference between method A and B?",
        upvotes: 8,
        isAnswered: false,
        timestamp: new Date(Date.now() - 400000),
    },
    {
        id: "3",
        userId: "u3",
        userName: "Omar Hassan",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
        content: "Will this be covered in the exam?",
        upvotes: 5,
        isAnswered: false,
        timestamp: new Date(Date.now() - 200000),
    },
];

export default function QnAPanel () {
    const [questions, setQuestions] = useState<Question[]>(mockQuestions);
    const [newQuestion, setNewQuestion] = useState("");
    const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(new Set());

    const handleAskQuestion = () => {
        if (!newQuestion.trim()) return;

        const question: Question = {
            id: Date.now().toString(),
            userId: "current-user",
            userName: "You",
            userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
            content: newQuestion,
            upvotes: 0,
            isAnswered: false,
            timestamp: new Date(),
        };

        setQuestions([question, ...questions]);
        setNewQuestion("");
    };

    const handleUpvote = (questionId: string) => {
        if (upvotedQuestions.has(questionId)) return;

        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
            )
        );
        setUpvotedQuestions(new Set([...upvotedQuestions, questionId]));
    };

    const sortedQuestions = [...questions].sort((a, b) => b.upvotes - a.upvotes);

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-2 p-4 border-b border-border">
                <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                    placeholder="Ask a question..."
                    className="flex-1 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button
                    size="icon"
                    onClick={handleAskQuestion}
                    disabled={!newQuestion.trim()}
                    className="bg-primary hover:bg-primary/90"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 px-4 min-h-0">
                <div className="space-y-3 py-4">
                    {sortedQuestions.map((question) => (
                        <div
                            key={question.id}
                            className={cn(
                                "p-3 rounded-xl border animate-fade-in",
                                question.isAnswered
                                    ? "border-success/40 bg-success/5"
                                    : "border-border bg-secondary/30"
                            )}
                        >
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={question.userAvatar} alt={question.userName} />
                                    <AvatarFallback className="bg-secondary text-xs">
                                        {question.userName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-medium">{question.userName}</span>
                                        {question.isAnswered && (
                                            <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded">
                                                Answered
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/90 mt-1">
                                        {question.content}
                                    </p>
                                    {question.answer && (
                                        <div className="mt-2 pl-3 border-l-2 border-success/50">
                                            <p className="text-sm text-muted-foreground">
                                                {question.answer}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => handleUpvote(question.id)}
                                            className={cn(
                                                "flex items-center gap-1 text-xs transition-colors",
                                                upvotedQuestions.has(question.id)
                                                    ? "text-success"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                            <span>{question.upvotes}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
