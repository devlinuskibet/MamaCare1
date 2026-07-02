import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import MessageBubble, { Message } from './MessageBubble';

const initialMessages: Message[] = [
    {
        id: '1',
        text: "Hi there! I'm MamaAI, your personal pregnancy assistant. I can help answer questions about your health, baby's development, or clinic appointments. What's on your mind today?",
        sender: 'ai',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
];

const MamaAIChat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-100 z-10 shrink-0">
                <div className="p-2 bg-pink-100 rounded-xl">
                    <Sparkles className="text-pink-600" size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">MamaAI Assistant</h2>
                    <p className="text-xs text-slate-500 font-medium">Always here for you and your baby</p>
                </div>
            </div>

            {/* Scrollable Message Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Footer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="relative max-w-4xl mx-auto flex items-end gap-2">
                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white resize-none h-[52px] max-h-32 text-slate-700 placeholder:text-slate-400"
                        placeholder="Ask MamaAI a question..."
                        rows={1}
                    />
                    <button 
                        onClick={handleSend}
                        className="h-[52px] w-[52px] shrink-0 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl flex items-center justify-center transition-colors shadow-sm"
                    >
                        <Send size={20} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MamaAIChat;
