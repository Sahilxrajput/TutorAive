import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

// wrappers / layout / loading (keep eager)
import Layout from "./components/Layout";
import ProtectedRoute from "./wrapper/ProtectedRoute";
import EnrolledRoute from "./wrapper/EnrolledRoute";
import LoadingPage from "./pages/LandingPages/LoadingPage";
import { initTheme } from "./lib/theme";

// lazy pages
const LandingPage = lazy(
    () => import("./pages/LandingPages/LandingPage")
);
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrowseNotes = lazy(() => import("./pages/BrowseNotes"));
const BrowseClassroom = lazy(() => import("./pages/BrowseClassroom"));
const Quiz = lazy(() => import("./pages/Quiz"));
const LiveSession = lazy(() => import("./pages/LiveSession"));
const SaveNotes = lazy(() => import("./pages/SaveNotes"));
const Note = lazy(() => import("./pages/Note"));
const TweetFeed = lazy(() => import("./pages/TweetFeed"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// classroom (heavy → lazy)
const ClassroomLayout = lazy(
    () => import("./components/classroom/ClassroomLayout")
);
const ClassroomOverview = lazy(
    () => import("./components/classroom/ClassroomOverview")
);
const AssignmentPage = lazy(
    () => import("./components/classroom/Assignments")
);
const LeaderboardPage = lazy(
    () => import("./components/LeaderboardPage")
);

const App: React.FC = () => {
    useEffect(() => {
        initTheme();
    }, []);

    return (
        <>
            <Analytics />
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route element={<Layout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="community" element={<TweetFeed />} />

                        <Route path="notes">
                            <Route index element={<BrowseNotes />} />
                            <Route path="new" element={<SaveNotes />} />
                            <Route path=":noteId" element={<Note />} />
                        </Route>

                        <Route path="quiz" element={<Quiz />} />

                        {/* Browse all classrooms */}
                        <Route path="classrooms" element={<BrowseClassroom />} />

                        {/* Individual classroom */}
                        <Route
                            path="classrooms/:classroomId"
                            element={
                                <EnrolledRoute>
                                    <ClassroomLayout />
                                </EnrolledRoute>
                            }
                        >
                            <Route index element={<ClassroomOverview />} />
                            <Route path="notes" element={<BrowseNotes />} />
                            <Route path="assignments" element={<AssignmentPage />} />
                            <Route path="leaderboard" element={<LeaderboardPage />} />
                            <Route
                                path="lecture/live/:lectureId"
                                element={<LiveSession />}
                            />
                        </Route>

                        {/* Protected dashboard */}
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="auth" element={<Auth />} />
                    <Route path="auth/success" element={<AuthSuccess />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </>

    );
};

export default App;
