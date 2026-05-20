import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type LoginCredentials, type SignupData, type User } from '../api/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    role: 'mother' | 'provider' | null;
    login: (credentials: LoginCredentials) => Promise<string>;
    googleLogin: (idToken: string) => Promise<string>; // returns 'needs_otp'
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    userRole: 'mother' | 'provider';
    setUserRole: (role: 'mother' | 'provider') => void;
    isProfileComplete: boolean;
    setIsProfileComplete: (status: boolean) => void;
    hasConsented: boolean;
    setHasConsented: (status: boolean) => void;
    pendingOtpEmail: string | null;
    verifyOtp: (code: string) => Promise<string>;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Basic state
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState<'mother' | 'provider'>('mother');
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(localStorage.getItem('profile_complete') === 'true');
    const [hasConsented, setHasConsented] = useState<boolean>(localStorage.getItem('has_consented') === 'true');
    const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);

    // Hydrate state from localStorage on mount (simple version)
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedRole = localStorage.getItem('user_role') as 'mother' | 'provider';
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRole) {
            setUserRole(storedRole);
        }
        setIsProfileComplete(localStorage.getItem('profile_complete') === 'true');
        setHasConsented(localStorage.getItem('has_consented') === 'true');
    }, []);

    const login = async (credentials: LoginCredentials): Promise<string> => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.username, password: credentials.password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Login failed');

            if (data.requires_otp) {
                setPendingOtpEmail(data.email);
                return 'needs_otp';
            }
            return 'done';
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const googleLogin = async (idToken: string): Promise<string> => {
        const response = await fetch('http://localhost:8000/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: idToken })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Google login failed');
        if (data.requires_otp) {
            setPendingOtpEmail(data.email);
            return 'needs_otp';
        }
        return 'done';
    };

    const _applySession = (data: any) => {
        const role = data.role as 'mother' | 'provider';
        const profileStatus = data.is_profile_complete || false;
        const consentStatus = data.has_consented || false;
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_role', role);
        localStorage.setItem('profile_complete', String(profileStatus));
        localStorage.setItem('has_consented', String(consentStatus));
        setToken(data.access_token);
        setUser({ email: pendingOtpEmail || '', full_name: data.user_name, role, is_profile_complete: profileStatus, has_consented: consentStatus });
        setUserRole(role);
        setIsProfileComplete(profileStatus);
        setHasConsented(consentStatus);
        setPendingOtpEmail(null);
    };

    const verifyOtp = async (code: string): Promise<string> => {
        if (!pendingOtpEmail) throw new Error('No pending OTP session.');
        const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingOtpEmail, otp_code: code })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'OTP verification failed');
        _applySession(data);
        if (data.role === 'provider') return 'provider';
        if (!data.is_profile_complete) return 'needs_profile';
        if (!data.has_consented) return 'needs_consent';
        return 'ok';
    };

    const signup = async (data: SignupData) => {
        try {
            await authApi.signup(data);
            // Auto login or just redirect? Prompt says: 
            // - SignUp Endpoint: POST /api/auth/signup. 
            // - Login Endpoint: POST /api/auth/login.
            // Usually signup returns user. We might need to login after signup or if signup returns token.
            // Prompt doesn't specify signup returns token. Let's assume we redirect to login or auto-login.
            // For MVP, calling signup then login is safest if backend doesn't return token on signup.
            // But let's check standard behavior. I'll just return and let the page handle navigation to login or dashboard.
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('profile_complete');
        localStorage.removeItem('has_consented');
        setToken(null);
        setUser(null);
        setUserRole('mother');
        setIsProfileComplete(false);
        setHasConsented(false);
    };

    return (
        <UserContext.Provider value={{
            user,
            isAuthenticated: !!token,
            role: userRole,
            login,
            googleLogin,
            signup,
            logout,
            userRole,
            setUserRole,
            isProfileComplete,
            setIsProfileComplete,
            hasConsented,
            setHasConsented,
            pendingOtpEmail,
            verifyOtp
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserRole = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserRole must be used within a UserProvider');
    }
    return context;
};
