import React from 'react';
import { Sparkles, User } from 'lucide-react';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isStreaming?: boolean;
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className="shrink-0 mt-auto mb-1">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <User size={16} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                            <Sparkles size={16} />
                        </div>
                    )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1">
                    <div className={`
                        px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed
                        ${isUser 
                            ? 'bg-indigo-600 text-white rounded-br-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                        }
                    `}>
                        {message.text}
                        {message.isStreaming && (
                            <span className="inline-block ml-1 w-2 h-4 bg-pink-500 animate-pulse align-middle" />
                        )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {formattedTime}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MessageBubble;
