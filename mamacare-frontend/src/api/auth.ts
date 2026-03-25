import axiosClient from './axiosClient';

export interface User {
    email: string;
    full_name: string;
    role: 'mother' | 'provider';
}

export interface AuthResponse {
    access_token: string;
    role: string;
    user_name: string;
}

export interface LoginCredentials {
    username: string; // Using 'username' because OAuth2 expects form data with 'username' usually, but backend might just take JSON email. Checking schema... Assuming standard JSON for now based on prompt.
    password: string;
}
// Note: The prompt endpoint says POST /api/auth/login with fields email, password. 
// Standard FastAPI OAuth2PasswordRequestForm expects form-data. 
// I will support JSON first as per typical REST, but might need URLSearchParams if backend uses OAuth2PasswordRequestForm.
// Re-reading prompt: "Fields: email, password". 
// Let's stick to the prompt's request for JSON body likely, or standard POST. 

export interface SignupData {
    email: string;
    password: string;
    full_name: string;
    role: 'mother' | 'provider';
}

export const authApi = {
    login: async (credentials: { email: string, password: string }) => {
        // Typically FastAPI OAuth2 uses form-data 'username', 'password'.
        // But prompt implies custom endpoint. I'll transform to what's likely needed.
        // Assuming the backend endpoint accepts JSON body:
        const response = await axiosClient.post<AuthResponse>('/api/auth/login', credentials);
        return response.data;
    },
    signup: async (data: SignupData) => {
        const response = await axiosClient.post<User>('/api/auth/signup', data);
        return response.data;
    }
};
