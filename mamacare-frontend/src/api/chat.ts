import axiosClient from './axiosClient';

export interface ChatResponse {
    response: string;
    source: string;
}

export const chatApi = {
    getHistory: async () => {
        const response = await axiosClient.get<any[]>('/api/chat/history');
        return response.data;
    },
    sendMessage: async (message: string) => {
        const response = await axiosClient.post<ChatResponse>('/api/chat/chat', { message });
        return response.data;
    }
};
