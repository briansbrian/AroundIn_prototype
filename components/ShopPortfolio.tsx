

import React, { useState, useEffect, useRef } from 'react';
import type { Shop, GeoLocation, ChatMessage, Product } from '../types';
import { ArrowLeftIcon, BookmarkIcon, BookmarkSquareIcon, MapPinIcon, ChatBubbleLeftRightIcon, TagIcon } from './common/Icons';
import ChatModal from './common/ChatModal';

const ShopLocationMapPlaceholder: React.FC<{ shopName: string }> = ({ shopName }) => {
    return (
        <div className="relative h-full w-full rounded-lg bg-gray-200">
            <img 
                src="https://images.unsplash.com/photo-1526778548025-13c5b642b588?q=80&w=2070&auto=format&fit=crop" 
                alt={`Map showing ${shopName}`} 
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg text-center shadow-md">
                    <p className="font-bold text-gray-800 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-red-500" />
                        {shopName}
                    </p>
                </div>
            </div>
        </div>
    );
};

const ShopPortfolio: React.FC<{
    shop: Shop;
    userLocation: GeoLocation | null;
    onBack: () => void;
}> = ({ shop, userLocation, onBack }) => {
    const [isSaved, setIsSaved] = useState(shop.isSaved || false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', type: 'text', text: `Hi! Welcome to ${shop.name}. How can I help you today?`, sender: 'seller' }
    ]);

    const handleSaveToggle = () => {
        setIsSaved(prev => !prev);
    };

    const handleDirectionsClick = () => {
       if (userLocation) {
            const origin = `${userLocation.latitude},${userLocation.longitude}`;
            const destination = `${shop.location.latitude},${shop.location.longitude}`;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            window.open(url, '_blank');
        } else {
            alert("Could not get your current location to provide directions. Please ensure location services are enabled.");
        }
    };

    const handleSendMessage = (text: string) => {
        const newMessage: ChatMessage = {
            id: new Date().toISOString(),
            type: 'text',
            text,
            sender: 'user',
        };
        setMessages(prev => [...prev, newMessage]);

        // Simulate seller response
        setTimeout(() => {
            const response: ChatMessage = {
                id: new Date().toISOString() + '_seller',
                type: 'text',
                text: 'Thanks for your message! I see your request and will get back to you shortly.',
                sender: 'seller',
            };
            setMessages(prev => [...prev, response]);
        }, 1500);
    };
    
    const handleTagProduct = (product: Product) => {
        const newTagMessage: ChatMessage = {
            id: new Date().toISOString(),
            type: 'product_tag',
            product,
            sender: 'user',
        };
        setMessages(prev => [...prev, newTagMessage]);
        setIsChatOpen(true); // Open chat when an item is tagged
    };


    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 font-medium">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Discovery
            </button>

            <div className="bg-teal-50/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                    <img src={shop.image} alt={shop.name} className="w-full h-48 md:h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <h2 className="text-3xl font-bold text-white shadow-text">{shop.name}</h2>
                        <p className="text-white text-lg font-medium shadow-text">{shop.category} &middot; {shop.rating} ★</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            onClick={handleDirectionsClick}
                            className="bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors text-center"
                        >
                            Get Directions
                        </button>
                         <button 
                            onClick={handleSaveToggle}
                            className="flex items-center justify-center gap-2 text-teal-800 dark:text-teal-200 bg-teal-500/20 hover:bg-teal-500/30 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            {isSaved ? <BookmarkSquareIcon className="w-6 h-6 text-teal-600 dark:text-teal-300" /> : <BookmarkIcon className="w-6 h-6" />}
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                         <button 
                            onClick={() => setIsChatOpen(true)}
                            className="flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            <ChatBubbleLeftRightIcon className="w-6 h-6" />
                           Chat with Seller
                        </button>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600 pb-2 mb-4">Products</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {shop.products.map(product => (
                                <div key={product.id} className="bg-teal-50/30 border border-gray-200/50 dark:bg-gray-700/30 dark:border-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {product.image && <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover"/>}
                                        <div>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">{product.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-bold text-teal-600 dark:text-teal-300">Ksh {product.price.toLocaleString()}</p>
                                        <button 
                                            onClick={() => handleTagProduct(product)}
                                            title="Tag this item in chat"
                                            className="p-2 bg-teal-500/20 hover:bg-teal-500/30 rounded-full transition-colors"
                                        >
                                            <TagIcon className="w-5 h-5 text-teal-700 dark:text-teal-200" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600 pb-2 mb-4">Location</h3>
                        <div className="h-64 rounded-lg overflow-hidden">
                           <ShopLocationMapPlaceholder shopName={shop.name} />
                        </div>
                    </div>
                </div>
            </div>
            
            <ChatModal 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                shopName={shop.name}
                messages={messages}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default ShopPortfolio;