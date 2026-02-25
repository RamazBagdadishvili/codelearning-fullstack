import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InstructorRoute from './components/InstructorRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AchievementsPage from './pages/AchievementsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-dark-950">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/courses/:slug" element={<CourseDetailPage />} />
                        <Route path="/lesson/:courseSlug/:lessonSlug" element={
                            <ProtectedRoute><LessonPage /></ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute><ProfilePage /></ProtectedRoute>
                        } />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/achievements" element={
                            <ProtectedRoute><AchievementsPage /></ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <InstructorRoute><AdminPage /></InstructorRoute>
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                </main>
                <Footer />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        className: '!bg-dark-800 !text-dark-100 !border !border-dark-700 !rounded-xl',
                        duration: 3000,
                        style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
                    }}
                />
            </div>
        </Router>
    );
}

export default App;
