import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./wrapper/ProtectedRoute";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Notes from "./pages/Notes";
import ClassroomLayout from "./components/classroom/ClassroomLayout";
import BrowseClassroom from "./pages/BrowseClassroom";
import Layout from "./components/Layout";
import EnrolledRoute from "./wrapper/EnrolledRoute";
import ClassroomOverview from "./components/classroom/ClassroomOverview";
import Assignments from "./components/classroom/Assignments";
import LeaderboardPage from "./components/LeaderboardPage";
import ClassroomNotes from "./components/classroom/ClassroomNotes";
import Quiz from "./pages/Quiz";
import Editor from "./pages/Editor";
import LiveSession from "./pages/LiveSession";
import CommunityPage from "./pages/CommunityPage";
import SaveNotes from "./pages/SaveNotes";
import Note from "./pages/Note";
import Call from "./pages/Call";




const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chats" element={<Call />} />
        {/* <Route path="chats" element={<ChatRoom />} /> */}
        <Route path="editor" element={<Editor />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:noteId" element={<Note />} />
        <Route path="notes/new" element={<SaveNotes />} />
        <Route path="quizs" element={<Quiz />} />
        <Route path="live" element={<LiveSession />} />
        <Route path="community" element={<CommunityPage />} />

        {/* Browse all classrooms */}
        <Route path="classrooms" element={<BrowseClassroom />} />

        {/* Individual classroom page */}
        <Route path="classrooms/:classroomId" element={
          <EnrolledRoute>
            <ClassroomLayout />
          </EnrolledRoute>
        }>
          <Route index element={<ClassroomOverview />} />
          <Route path="notes" element={<Notes />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
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

      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="auth/success" element={<AuthSuccess />} />
    </Routes>

  );
};

export default App;
