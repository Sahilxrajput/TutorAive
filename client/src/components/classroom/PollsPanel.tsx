import { useEffect, useState } from "react";
import { Plus, Check, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import useSocketContext from "@/hooks/useSocketContext";
import { useParams } from "react-router-dom";

interface PollOption {
    _id: string;
    text: string;
    votes: number;
}

interface Poll {
    _id: string;
    question: string;
    options: PollOption[];
    isActive: boolean;
    totalVotes: number;
}

// const mockPolls: Poll[] = [
//     {
//         _id: "1",
//         question: "What topic should we cover next?",
//         options: [
//             { _id: "1a", text: "Advanced Functions", votes: 15 },
//             { _id: "1b", text: "Data Structures", votes: 22 },
//             { _id: "1c", text: "Algorithms", votes: 18 },
//             { _id: "1d", text: "Design Patterns", votes: 9 },
//         ],
//         isActive: true,
//         totalVotes: 64,
//     },
//     {
//         _id: "2",
//         question: "Was today's pace appropriate?",
//         options: [
//             { _id: "2a", text: "Too fast", votes: 5 },
//             { _id: "2b", text: "Just right", votes: 28 },
//             { _id: "2c", text: "Too slow", votes: 3 },
//         ],
//         isActive: false,
//         totalVotes: 36,
//     },
// ];

interface PollsPanelProps {
    isTeacher?: boolean;
}

export default function PollsPanel({ isTeacher = false }: PollsPanelProps) {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", ""]);
    const [userVotes, setUserVotes] = useState<Record<string, string>>({});    // pollId -> optionId
    const { socket } = useSocketContext()
    const { lectureId } = useParams<{
        classroomId: string;
        lectureId: string;
    }>();

    const handleVote = (pollId: string, optionId: string) => {
        if (userVotes[pollId]) return;

        // optimistic UI for counts
        setPolls(prev =>
            prev.map(p =>
                p._id === pollId
                    ? {
                        ...p,
                        options: p.options.map(o =>
                            o._id === optionId ? { ...o, votes: o.votes + 1 } : o
                        ),
                        totalVotes: p.totalVotes + 1,
                    }
                    : p
            )
        );

        // user-specific state (NOT shared)
        setUserVotes(prev => ({ ...prev, [pollId]: optionId }));

        if (!socket || !lectureId) return
        socket.emit("poll:vote", { pollId, lectureId, optionId })
    };

    const handleCreatePoll = () => {
        if (!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) return;
        if (!socket || !lectureId) return;

        socket.emit("poll:create", {
            lectureId,
            question: newQuestion,
            options: newOptions.filter(o => o.trim()),
        });

        setNewQuestion("");
        setNewOptions(["", ""]);
        setIsCreating(false);
    };

    const addOption = () => {
        if (newOptions.length < 6) {
            setNewOptions([...newOptions, ""]);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const onPollCreated = (poll: Poll) => {
            setPolls(prev => [poll, ...prev]);
        };

        const onPollUpdated = (updatedPoll: Poll) => {
            setPolls(prev =>
                prev.map(p => (p._id === updatedPoll._id ? updatedPoll : p))
            );
        };

        socket.on("poll:created", onPollCreated);
        socket.on("poll:updated", onPollUpdated);

        return () => {
            socket.off("poll:created", onPollCreated);
            socket.off("poll:updated", onPollUpdated);
        };
    }, [socket]);


    return (
        <div className="flex flex-col h-full">
            {isTeacher && <div className="p-4 border-b border-border">
                {isCreating ? (
                    <div className="space-y-3">
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter your poll question..."
                            className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        <div className="space-y-2">
                            {newOptions.map((option, index) => (
                                <Input
                                    key={index}
                                    value={option}
                                    onChange={(e) => {
                                        const updated = [...newOptions];
                                        updated[index] = e.target.value;
                                        setNewOptions(updated);
                                    }}
                                    placeholder={`Option ${index + 1}`}
                                    className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {newOptions.length < 6 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={addOption}
                                    className="text-muted-foreground"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add option
                                </Button>
                            )}
                            <div className="flex-1" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleCreatePoll}>
                                Create Poll
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Poll
                    </Button>
                )}
            </div>}

            <ScrollArea className="flex-1 px-4 min-h-0">
                <div className="space-y-4 py-4">
                    
                    {polls.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            <p className="font-medium">No polls yet</p>
                            <p className="text-xs">Polls will appear here once created</p>
                        </div>
                    )}

                    {polls.map((poll) => (
                        <div
                            key={poll._id}
                            className={cn(
                                "p-4 rounded-xl border animate-fade-in",
                                poll.isActive
                                    ? "border-primary"
                                    : "border-border bg-secondary/30"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="font-medium text-sm">{poll.question}</h3>
                                {poll.isActive && (
                                    <span className="text-[10px] bg-primary/30 text-primary font-semibold px-1.5 py-0.5 rounded flex-shrink-0">
                                        Active
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {poll.options.map((option) => {
                                    const percentage =
                                        poll.totalVotes > 0
                                            ? Math.round((option.votes / poll.totalVotes) * 100)
                                            : 0;

                                    const myVote = userVotes[poll._id];
                                    const isSelected = myVote === option._id;
                                    const showResults = !!myVote || !poll.isActive;

                                    return (
                                        <button
                                            key={option._id}
                                            onClick={() =>
                                                poll.isActive && handleVote(poll._id, option._id)
                                            }
                                            disabled={!poll.isActive || Boolean(myVote)}
                                            className={cn(
                                                "poll-option w-full py-2 px-4  border-2 rounded-lg text-left transition-all",
                                                isSelected && "border-primary/30 bg-primary/10",
                                                !poll.isActive && "cursor-default"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm flex items-center gap-2">
                                                    {isSelected && (
                                                        <Check className="h-3.5 w-3.5 text-primary" />
                                                    )}
                                                    {option.text}
                                                </span>
                                                {showResults && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {percentage}%
                                                    </span>
                                                )}
                                            </div>
                                            {showResults && (
                                                <Progress
                                                    value={percentage}
                                                    className="h-1.5 bg-secondary [&>div]:bg-primary"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                <BarChart2 className="h-3.5 w-3.5" />
                                <span>{poll.totalVotes} votes</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
