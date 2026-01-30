import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./wrapper/ProtectedRoute";
import Home from "./pages/Home";
import BrowseNotes from "./pages/BrowseNotes";
import ClassroomLayout from "./components/classroom/ClassroomLayout";
import BrowseClassroom from "./pages/BrowseClassroom";
import Layout from "./components/Layout";
import EnrolledRoute from "./wrapper/EnrolledRoute";
import ClassroomOverview from "./components/classroom/ClassroomOverview";
import AssignmentPage from "./components/classroom/Assignments";
import LeaderboardPage from "./components/LeaderboardPage";
import Quiz from "./pages/Quiz";
import Editor from "./pages/Editor";
import LiveSession from "./pages/LiveSession";
import SaveNotes from "./pages/SaveNotes";
import Note from "./pages/Note";
import TweetFeed from "./pages/TweetFeed";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPages.tsx/LandingPage";
import PageNotFound from "./pages/PageNotFound";




const App: React.FC = () => {

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="community" element={<TweetFeed />} />
                <Route path="editor" element={<Editor />} />
                <Route path="notes" >
                    <Route index element={<BrowseNotes />} />
                    <Route path=":noteId" element={<Note />} />
                    <Route path="new" element={<SaveNotes />} />
                </Route>
                <Route path="quiz" element={<Quiz />} />

                {/* Browse all classrooms */}
                <Route path="classrooms" element={<BrowseClassroom />} />

                {/* Individual classroom page */}
                <Route path="classrooms/:classroomId" element={
                    <EnrolledRoute>
                        <ClassroomLayout />
                    </EnrolledRoute>
                }>
                    <Route index element={<ClassroomOverview />} />
                    <Route path="notes" element={<BrowseNotes />} />
                    <Route path="assignments" element={<AssignmentPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="lecture/live/:lectureId" element={<LiveSession />} />
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
    );
};

export default App;
