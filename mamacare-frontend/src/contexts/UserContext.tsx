import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type LoginCredentials, type SignupData, type User } from '../api/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    role: 'mother' | 'provider' | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    // We keep these for straightforward access in components
    userRole: 'mother' | 'provider';
    setUserRole: (role: 'mother' | 'provider') => void;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Basic state
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState<'mother' | 'provider'>('mother'); // Legacy state from previous steps

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
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const data = await authApi.login({ email: credentials.username, password: credentials.password });
            localStorage.setItem('access_token', data.access_token);
            // Assuming the backend response structure matches AuthResponse interface
            // If backend doesn't return role, we might need to decode token or fetch user profile
            // For now, let's assume we can derive or it's returned.
            // If strictly following prompt "Action: On success, save access_token to localStorage", we do that.

            // Note: The prompt's AuthResponse interface includes 'role'.
            const role = data.role as 'mother' | 'provider';

            setToken(data.access_token);
            setUser({ email: credentials.username, full_name: data.user_name, role: role });

            setUserRole(role);
            localStorage.setItem('user_role', role);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
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
        setToken(null);
        setUser(null);
        setUserRole('mother'); // Reset to default
    };

    return (
        <UserContext.Provider value={{
            user,
            isAuthenticated: !!token,
            role: userRole,
            login,
            signup,
            logout,
            userRole,
            setUserRole
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
