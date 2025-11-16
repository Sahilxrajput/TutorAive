// // import { createContext, useContext, useState, useCallback } from "react";

// // interface Classroom {
// //     id: string;
// //     title: string;
// //     status: "active" | "archived" | "deleted";
// //     isPublic: boolean;
// // }

// // interface ClassroomContextType {
// //     classrooms: Classroom[];
// //     loading: boolean;
// //     statusFilter: string | null;
// //     isPublicFilter: boolean | null;

// //     setStatusFilter: (status: string | null) => void;
// //     setIsPublicFilter: (val: boolean | null) => void;

// //     fetchClassrooms: () => Promise<void>;
// // }

// // const ClassroomContext = createContext<ClassroomContextType | null>(null);

// // export function ClassroomProvider({ children }: { children: React.ReactNode }) {
// //     const [classrooms, setClassrooms] = useState<Classroom[]>([]);
// //     const [statusFilter, setStatusFilter] = useState<string | null>(null);
// //     const [isPublicFilter, setIsPublicFilter] = useState<boolean | null>(null);
// //     const [loading, setLoading] = useState(false);

// //     const fetchClassrooms = useCallback(async () => {
// //         try {
// //             setLoading(true);

// //             const query = new URLSearchParams();
// //             if (statusFilter) query.append("status", statusFilter);
// //             if (isPublicFilter != null) query.append("isPublic", String(isPublicFilter));

// //             const res = await fetch(`/api/classrooms?${query.toString()}`);
// //             const data = await res.json();

// //             setClassrooms(data.classrooms || []);
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [statusFilter, isPublicFilter]);

// //     return (
// //         <ClassroomContext.Provider
// //             value={{
// //                 classrooms,
// //                 loading,
// //                 statusFilter,
// //                 isPublicFilter,
// //                 setStatusFilter,
// //                 setIsPublicFilter,
// //                 fetchClassrooms,
// //             }}
// //         >
// //             {children}
// //         </ClassroomContext.Provider>
// //     );
// // }

// // export function useClassroom() {
// //     const ctx = useContext(ClassroomContext);
// //     if (!ctx) throw new Error("useClassroom must be used inside ClassroomProvider");
// //     return ctx;
// // }


// import { createContext, useContext, useState, useCallback } from "react";

// interface Tweet {
//     id: string;
//     content: string;
//     type: "general" | "mentorship" | "problem";
//     createdBy: string;
//     createdAt: string;
// }

// interface TweetContextType {
//     tweets: Tweet[];
//     loading: boolean;
//     filter: string | null;

//     setFilter: (filter: string | null) => void;

//     fetchTweets: () => Promise<void>;
//     createTweet: (content: string, type: Tweet["type"]) => Promise<void>;
//     deleteTweet: (id: string) => Promise<void>;
// }

// const TweetContext = createContext<TweetContextType | null>(null);

// export function TweetProvider({ children }: { children: React.ReactNode }) {
//     const [tweets, setTweets] = useState<Tweet[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [filter, setFilter] = useState<string | null>(null);

//     const fetchTweets = useCallback(async () => {
//         try {
//             setLoading(true);

//             const query = filter ? `?type=${filter}` : "";
//             const res = await fetch(`/api/tweets${query}`);
//             const data = await res.json();

//             setTweets(data.tweets || []);
//         } finally {
//             setLoading(false);
//         }
//     }, [filter]);

//     const createTweet = useCallback(
//         async (content: string, type: Tweet["type"]) => {
//             const res = await fetch("/api/tweets", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ content, type }),
//             });

//             const data = await res.json();

//             setTweets(prev => [data.tweet, ...prev]);
//         },
//         []
//     );

//     const deleteTweet = useCallback(async (id: string) => {
//         await fetch(`/api/tweets/${id}`, { method: "DELETE" });

//         setTweets(prev => prev.filter(t => t.id !== id));
//     }, []);

//     return (
//         <TweetContext.Provider
//             value={{
//                 tweets,
//                 loading,
//                 filter,
//                 setFilter,
//                 fetchTweets,
//                 createTweet,
//                 deleteTweet,
//             }}
//         >
//             {children}
//         </TweetContext.Provider>
//     );
// }

// export function useTweet() {
//     const ctx = useContext(TweetContext);
//     if (!ctx) throw new Error("useTweet must be used inside TweetProvider");
//     return ctx;
// }
