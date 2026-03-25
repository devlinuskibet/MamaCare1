import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import MotherDashboard from './features/dashboard/MotherDashboard';
import VitalsForm from './features/triage/VitalsForm';
import ChatWindow from './features/chatbot/ChatWindow';
import ProviderDashboard from './features/provider/ProviderDashboard';
import HealthHistory from './features/dashboard/HealthHistory';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import LandingPage from './pages/LandingPage';
import PatientDetails from './features/provider/PatientDetails';
import ExercisesPage from './features/exercises/ExercisesPage';
import { UserProvider } from './contexts/UserContext';
import ProfilePage from './features/common/ProfilePage';
import PatientDirectory from './features/provider/PatientDirectory';
import ReportsDashboard from './features/provider/ReportsDashboard';

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes (Wrapped in MainLayout) */}
                    <Route path="/dashboard" element={<MainLayout><MotherDashboard /></MainLayout>} />
                    <Route path="/vitals" element={<MainLayout><VitalsForm /></MainLayout>} />
                    <Route path="/chatbot" element={<MainLayout><ChatWindow /></MainLayout>} />
                    <Route path="/history" element={<MainLayout><HealthHistory /></MainLayout>} />
                    <Route path="/exercises" element={<MainLayout><ExercisesPage /></MainLayout>} />
                    <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

                    {/* Provider Routes (Ideally protected by role, but open for now) */}
                    <Route path="/provider" element={<MainLayout><ProviderDashboard /></MainLayout>} />
                    <Route path="/provider/patients" element={<MainLayout><PatientDirectory /></MainLayout>} />
                    <Route path="/patient/:id" element={<MainLayout><PatientDetails /></MainLayout>} />
                    <Route path="/provider/reports" element={<MainLayout><ReportsDashboard /></MainLayout>} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;