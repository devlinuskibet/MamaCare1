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
import FetalPortal from './features/fetal/FetalPortal';
import IFASTracker from './features/dashboard/IFASTracker';
import { UserProvider } from './contexts/UserContext';
import PatientDirectory from './features/provider/PatientDirectory';
import ProfilePage from './features/common/ProfilePage';
import ReportsDashboard from './features/provider/ReportsDashboard';
import TriageBoard from './features/provider/TriageBoard';
import { Navigate } from 'react-router-dom';
import { useUserRole } from './contexts/UserContext';
import ConsentOverlay from './features/common/ConsentOverlay';
import TermsPage from './pages/TermsPage';
import OtpPage from './features/auth/OtpPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const ProtectedRoute = ({ children, requireProfile = true }: { children: React.ReactNode, requireProfile?: boolean }) => {
    const { isAuthenticated, role, isProfileComplete, hasConsented } = useUserRole();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    if (role === 'mother' && !hasConsented) {
        return <ConsentOverlay />;
    }
    
    if (role === 'mother' && requireProfile && !isProfileComplete) {
        return <Navigate to="/profile" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <UserProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/otp" element={<OtpPage />} />

                    {/* Protected Routes (Wrapped in MainLayout and Gatekeeper) */}
                    <Route path="/dashboard" element={<ProtectedRoute><MainLayout><MotherDashboard /></MainLayout></ProtectedRoute>} />
                    <Route path="/vitals" element={<ProtectedRoute><MainLayout><VitalsForm /></MainLayout></ProtectedRoute>} />
                    <Route path="/chatbot" element={<ProtectedRoute><MainLayout><ChatWindow /></MainLayout></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><MainLayout><HealthHistory /></MainLayout></ProtectedRoute>} />
                    <Route path="/exercises" element={<ProtectedRoute><MainLayout><ExercisesPage /></MainLayout></ProtectedRoute>} />
                    <Route path="/dashboard/baby-portal" element={<ProtectedRoute><MainLayout><FetalPortal /></MainLayout></ProtectedRoute>} />
                    <Route path="/dashboard/ifas-tracker" element={<ProtectedRoute><MainLayout><IFASTracker /></MainLayout></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute requireProfile={false}><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />

                    {/* Provider Routes (Ideally protected by role, but open for now) */}
                    <Route path="/provider" element={<MainLayout><ProviderDashboard /></MainLayout>} />
                    <Route path="/provider/triage" element={<MainLayout><TriageBoard /></MainLayout>} />
                    <Route path="/provider/patients" element={<MainLayout><PatientDirectory /></MainLayout>} />
                    <Route path="/patient/:id" element={<MainLayout><PatientDetails /></MainLayout>} />
                    <Route path="/provider/reports" element={<MainLayout><ReportsDashboard /></MainLayout>} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;