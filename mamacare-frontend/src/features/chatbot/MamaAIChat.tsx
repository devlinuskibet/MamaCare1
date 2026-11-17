import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import MessageBubble, { type Message } from './MessageBubble';
import { chatApi } from '../../api/chat';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE = rawApiUrl.replace(/\/api\/?$/, '');

const initialMessages: Message[] = [
    {
        id: '1',
        text: "Hi there! I'm MamaAI, your personal pregnancy assistant. I can help answer questions about your health, baby's development, or clinic appointments. What's on your mind today? 🌸",
        sender: 'ai',
        timestamp: new Date()
    }
];

const MamaAIChat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await chatApi.getHistory();
                if (history && history.length > 0) {
                    const formatted: Message[] = history.map((m: any, idx: number) => ({
                        id: 'hist-' + idx,
                        text: m.content,
                        sender: m.role === 'user' ? 'user' : 'ai',
                        timestamp: new Date(m.timestamp)
                    }));
                    setMessages(formatted);
                }
            } catch (err) {
                console.log("Could not load chat history:", err);
            }
        };
        loadHistory();
    }, []);

    const handleSendText = async (textToSend: string) => {
        if (!textToSend.trim() || isThinking) return;

        const userMsgText = textToSend.trim();
        const userMsgId = Date.now().toString() + '-user';
        const newUserMessage: Message = {
            id: userMsgId,
            text: userMsgText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsThinking(true);

        const aiMessageId = (Date.now() + 1).toString() + '-ai';

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE}/api/chat/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ message: userMsgText })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server error (${response.status})`);
            }

            if (!response.body) {
                throw new Error("No ReadableStream in response");
            }

            setIsThinking(false);

            setMessages(prev => [
                ...prev,
                {
                    id: aiMessageId,
                    text: '',
                    sender: 'ai',
                    timestamp: new Date(),
                    isStreaming: true
                }
            ]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunkText = decoder.decode(value, { stream: true });
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === aiMessageId
                                ? { ...msg, text: msg.text + chunkText }
                                : msg
                        )
                    );
                    scrollToBottom();
                }
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
                )
            );
        } catch (error: any) {
            console.error("MamaAI Chat error:", error);
            setIsThinking(false);
            setMessages(prev => [
                ...prev,
                {
                    id: aiMessageId,
                    text: "I'm having a little trouble connecting right now. Please make sure you are logged in and try again! 🌸",
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);
        }
    };

    const handleSend = () => {
        handleSendText(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickReplies = [
        "Is my blood pressure normal?",
        "What are signs of pre-eclampsia?",
        "How often should my baby kick?",
        "Is this contraction real or Braxton Hicks?"
    ];

    const handleQuickReply = (reply: string) => {
        handleSendText(reply);
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-6rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
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
                
                {isThinking && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex gap-2 flex-row max-w-[75%]">
                            <div className="shrink-0 mt-auto mb-1">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                    <Sparkles size={16} />
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-4 shadow-sm flex items-center gap-1.5 h-12">
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Footer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                {/* Quick Replies */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-1 snap-x scrollbar-hide">
                    {quickReplies.map((reply, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="shrink-0 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-medium px-4 py-2 rounded-full transition-all snap-start"
                        >
                            {reply}
                        </button>
                    ))}
                </div>

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
                        className="h-[52px] w-[52px] shrink-0 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Send size={20} className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MamaAIChat;
