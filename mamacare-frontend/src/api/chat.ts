import axiosClient from './axiosClient';

export interface ChatResponse {
    response: string;
    source: string;
}

export const chatApi = {
    sendMessage: async (message: string) => {
        const response = await axiosClient.post<ChatResponse>('/api/chat/chat', { message });
        return response.data;
    }
};
