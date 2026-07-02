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
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const simulateSSE = () => {
        setIsThinking(false);
        const responseText = "I can certainly help with that! It's completely normal to experience those symptoms during your second trimester. However, if the pain becomes severe or is accompanied by fever, please contact your provider immediately.";
        const words = responseText.split(' ');
        
        const aiMessageId = Date.now().toString() + '-ai';
        const newAiMessage: Message = {
            id: aiMessageId,
            text: '',
            sender: 'ai',
            timestamp: new Date(),
            isStreaming: true
        };

        setMessages(prev => [...prev, newAiMessage]);

        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex < words.length) {
                setMessages(prev => prev.map(msg => {
                    if (msg.id === aiMessageId) {
                        return {
                            ...msg,
                            text: msg.text + (currentIndex === 0 ? '' : ' ') + words[currentIndex]
                        };
                    }
                    return msg;
                }));
                currentIndex++;
            } else {
                clearInterval(intervalId);
                setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
                ));
            }
        }, 100); // 100ms per word
    };

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
        setIsThinking(true);

        // Trigger SSE simulation after a brief delay
        setTimeout(() => {
            simulateSSE();
        }, 1500);
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
        setInputValue(reply);
        // We need to set state and then immediately trigger send. 
        // Best way is to directly trigger the send logic with the reply text.
        
        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: reply,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsThinking(true);

        setTimeout(() => {
            simulateSSE();
        }, 1500);
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
