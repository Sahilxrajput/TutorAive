import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

import ProtectedRoute from "./wrapper/ProtectedRoute";
import EnrolledRoute from "./wrapper/EnrolledRoute";
import LoadingPage from "./pages/LandingPages/LoadingPage";
import { initTheme } from "./lib/theme";

import NotificationProvider from "./providers/NotificationProvider";

// lazy components
const Layout = lazy(() => import("./components/Layout"));
const LandingPage = lazy(() => import("./pages/LandingPages/LandingPage"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrowseClassroom = lazy(() => import("./pages/BrowseClassroom"));
const LiveSession = lazy(() => import("./pages/LiveSession"));
const TweetFeed = lazy(() => import("./pages/TweetFeed"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const ClassroomPage = lazy(() => import("./components/classroom/ClassroomPage"));
const JoinSector = lazy(() => import("./pages/JoinSector"));
const LaunchClassroom = lazy(() => import("./pages/LandingPages/LaunchClassroom"));

const App: React.FC = () => {
    useEffect(() => {
        initTheme();
    }, []);

    return (
        <>
            <Analytics />

            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="auth/success" element={<AuthSuccess />} />

                    <Route
                        element={
                            <NotificationProvider>
                                <Layout />
                            </NotificationProvider>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                        <Route path="community" element={<TweetFeed />} />
                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="launch-classroom" element=
                            {
                                <ProtectedRoute>
                                    <LaunchClassroom />
                                </ProtectedRoute>
                            } />

                        <Route path="classrooms">
                            <Route index element={<BrowseClassroom />} />
                            <Route
                                path=":classroomId/join/:inviteCode"
                                element={
                                    <ProtectedRoute>
                                        <JoinSector />
                                    </ProtectedRoute>
                                }
                            />

                            <Route element={<EnrolledRoute />}>
                                <Route
                                    path=":classroomId"
                                    element={<ClassroomPage />}
                                />
                                
                                <Route
                                    path=":classroomId/lecture/live/:lectureId"
                                    element={<LiveSession />}
                                />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
