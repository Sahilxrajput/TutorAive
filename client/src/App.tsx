import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Notes from "./pages/Notes";
import ClassroomLayout from "./components/classroom/ClassroomLayout";
import BrowseClassroom from "./pages/BrowseClassroom";
import Layout from "./components/Layout";
import EnrolledRoute from "./routes/EnrolledRoute";
import ClassroomOverview from "./components/classroom/ClassroomOverview";
import Assignments from "./components/classroom/Assignments";
import LeaderboardPage from "./components/LeaderboardPage";
import ClassroomNotes from "./components/classroom/ClassroomNotes";




const App: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chats" element={<ChatRoom />} />
        <Route path="notes" element={<Notes />} />

        {/* Browse all classrooms */}
        <Route path="classrooms" element={<BrowseClassroom />} />

        {/* Individual classroom page */}
        <Route path="classrooms/:id" element={
          <EnrolledRoute>
            <ClassroomLayout />
          </EnrolledRoute>
        }>
          <Route index element={<ClassroomOverview />} />
          <Route path="notes" element={<ClassroomNotes />} />
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
