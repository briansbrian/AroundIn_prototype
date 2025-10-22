

import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { XMarkIcon } from './Icons';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopName: string;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, shopName, messages, onSendMessage }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    if (!isOpen) {
        return null;
    }
    
    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 w-full max-w-lg h-[80vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Chat with {shopName}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20">
                        <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'seller' && <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">A</div>}
                            
                            {msg.type === 'text' ? (
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            ) : (
                                <div className="max-w-xs p-3 rounded-2xl bg-teal-500 text-white rounded-br-lg">
                                    <p className="text-sm mb-2">I'm interested in this:</p>
                                    <div className="bg-white/20 p-2 rounded-lg flex items-center gap-3">
                                        {msg.product.image && <img src={msg.product.image} alt={msg.product.name} className="w-12 h-12 rounded-md object-cover" />}
                                        <div>
                                            <p className="font-bold">{msg.product.name}</p>
                                            <p className="text-sm opacity-90">Ksh {msg.product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 w-full px-4 py-2 bg-gray-100/80 dark:bg-gray-700/80 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-gray-200"
                        />
                        <button onClick={handleSend} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-teal-600 transition-colors">
                            Send
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatModal;