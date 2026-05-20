import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { chatApi } from '../../api/chat';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const quickPrompts = [
    "I have a headache",
    "Is swelling normal?",
    "Diet tips for trimester 2",
    "Baby movement patterns"
];

const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        document.title = "Chat with MamaAI";
        const loadHistory = async () => {
            try {
                const history = await chatApi.getHistory();
                if (history && history.length > 0) {
                    const formatted: Message[] = history.map((m: any, i: number) => ({
                        id: i + 1,
                        text: m.content,
                        sender: m.role === 'user' ? 'user' : 'bot',
                        timestamp: new Date(m.timestamp)
                    }));
                    setMessages(formatted);
                } else {
                    // Default welcome message if no history
                    setMessages([{
                        id: 1,
                        text: "Hello Mama! I am MamaAI. How can I support you and your baby today?",
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };
        loadHistory();
    }, []);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        setIsTyping(true);

        // Native Fetch API for SSE Parsing
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/chat/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: text })
            });

            if (!response.body) throw new Error("No ReadableStream from backend");

            setIsTyping(false); // remove initial UX "thinking"
            
            // Build ghost message base
            const newBotMessageId = messages.length + 2;
            setMessages(prev => [
                ...prev, 
                { id: newBotMessageId, text: '', sender: 'bot', timestamp: new Date() }
            ]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunkText = decoder.decode(value, { stream: true });
                    setMessages(prev => {
                        return prev.map(msg => {
                            if (msg.id === newBotMessageId) {
                                return { ...msg, text: msg.text + chunkText }
                            }
                            return msg;
                        });
                    });
                    scrollToBottom();
                }
            }
        } catch (error) {
            console.error("Chat Error", error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: messages.length + 2,
                text: "I'm having trouble connecting right now. Please try again.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-pink-50/50">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
                    <Bot size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">MamaAI</h2>
                    <p className="text-xs text-slate-500">Always here for you</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-slate-100 text-slate-800 rounded-br-none'
                                : 'bg-pink-50 text-slate-800 rounded-bl-none border border-pink-100'
                                }`}
                        >
                            <p>{msg.text}</p>
                            <span className="text-[10px] opacity-50 mt-1 block">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-pink-50 px-4 py-3 rounded-2xl rounded-bl-none border border-pink-100 flex gap-1 items-center">
                            <span className="text-xs text-pink-500 font-medium mr-2">MamaAI is thinking</span>
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts & Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
                {/* Quick Prompts (only show if no recent user message or useful context) */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                    {quickPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handleSendMessage(prompt)}
                            className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 border border-slate-200 hover:border-pink-200 rounded-full text-xs transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Input Field */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask MamaAI anything..."
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-slate-400"
                    />
                    <button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim()}
                        className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:opacity-50 disabled:hover:bg-pink-600 transition-colors shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
