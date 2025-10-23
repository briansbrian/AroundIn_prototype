
import React, { useState } from 'react';
import { SHOP_TEMPLATES } from '../constants';
import OptimizedImage from './common/OptimizedImage';
import type { Product, Shop, ShopTemplate } from '../types';
import { XMarkIcon, ArrowPathIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, TagIcon, UserIcon } from './common/Icons';

// Helper to generate random coordinates for the prototype
const generateRandomCoordinates = (centerLat: number, centerLng: number, radiusInMeters: number) => {
    const y0 = centerLat;
    const x0 = centerLng;
    const rd = radiusInMeters / 111300; // Roughly 111300 meters in one degree
    
    const u = Math.random();
    const v = Math.random();
    
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    
    return {
        latitude: y + y0,
        longitude: x + x0,
    };
};

const SalesChart = () => (
    <div className="h-64 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center">
        <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M 0 45 Q 15 10, 30 25 T 60 20 T 90 35 L 100 30" stroke="#4ade80" fill="transparent" strokeWidth="2"/>
            <text x="50" y="5" textAnchor="middle" fontSize="4" className="fill-gray-500 dark:fill-gray-400">Sales Trend</text>
        </svg>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        {change && (
            <p className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {changeType === 'increase' ? '▲' : '▼'} {change}
            </p>
        )}
    </div>
);

const InventoryManager: React.FC<{initialProducts: Product[]}> = ({initialProducts}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const handleStockChange = (productId: string, newStock: number) => {
        setProducts(products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
    };

    return (
        <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
            <h3 className="text-base md:text-lg font-bold mb-4 dark:text-gray-200">Inventory Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-2 text-gray-600 dark:text-gray-300">Product Name</th>
                            <th className="p-2 text-gray-600 dark:text-gray-300">Price (Ksh)</th>
                            <th className="p-2 text-gray-600 dark:text-gray-300">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50/20 dark:hover:bg-gray-700/20">
                                <td className="p-2 font-medium text-gray-800 dark:text-gray-200">{product.name}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-300">{product.price.toLocaleString()}</td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => handleStockChange(product.id, parseInt(e.target.value, 10) || 0)}
                                        className="w-20 p-1 border rounded bg-gray-50/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OrderList: React.FC = () => {
    const orders = [
        { id: 'ORD-001', customer: 'John D.', items: 2, total: 2300, status: 'Pending' },
        { id: 'ORD-002', customer: 'Jane S.', items: 1, total: 800, status: 'Fulfilled' },
        { id: 'ORD-003', customer: 'Mike R.', items: 3, total: 4800, status: 'Pending' },
    ];

    return (
        <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
            <h3 className="text-base md:text-lg font-bold mb-4 dark:text-gray-200">Recent Orders</h3>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-500/10 dark:bg-gray-200/10 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{order.id}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer} &middot; {order.items} items</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Ksh {order.total.toLocaleString()}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300' : 'bg-green-500/20 text-green-800 dark:text-green-300'}`}>{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LowStockAlert = () => {
    const [isVisible, setIsVisible] = useState(true);
    if (!isVisible) return null;

    return (
        <div className="bg-red-500/20 backdrop-blur-md border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg shadow-md relative">
            <div className="flex">
                <div className="py-1">
                   <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 012 0v4a1 1 0 01-2 0V7zm1 6a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </div>
                <div>
                    <p className="font-bold">Low Stock Alert: Earphones</p>
                    <p className="text-sm">Forecast indicates a 1-day remaining to current sales rate. Reorder today to prevent a stock-out.</p>
                </div>
            </div>
            <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 p-1">
                <XMarkIcon className="w-5 h-5 text-red-600" />
            </button>
        </div>
    )
}

const ChatAnalytics: React.FC = () => {
    const recentChats = [
        { id: '1', customer: 'John D.', message: 'Hi, do you have wireless earphones in stock?', time: '2 min ago', unread: true },
        { id: '2', customer: 'Sarah M.', message: 'What\'s the price of the gaming mouse?', time: '15 min ago', unread: false },
        { id: '3', customer: 'Mike R.', message: 'Can you deliver to Westlands?', time: '1 hour ago', unread: false },
        { id: '4', customer: 'Emma K.', message: 'Are your products original?', time: '2 hours ago', unread: false },
    ];

    return (
        <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-base md:text-lg font-bold dark:text-gray-200">Customer Chats</h3>
            </div>
            <div className="space-y-3">
                {recentChats.map(chat => (
                    <div key={chat.id} className={`p-3 rounded-lg border ${chat.unread ? 'bg-teal-50/50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700' : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{chat.customer}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chat.message}</p>
                        {chat.unread && <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mt-1"></span>}
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                View All Messages
            </button>
        </div>
    );
};

const SearchAnalytics: React.FC = () => {
    const searchStats = [
        { period: 'Today', searches: 47, change: '+12%', trend: 'up' },
        { period: 'This Week', searches: 284, change: '+8%', trend: 'up' },
        { period: 'This Month', searches: 1247, change: '+15%', trend: 'up' },
    ];

    return (
        <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-base md:text-lg font-bold dark:text-gray-200">Search Analytics</h3>
            </div>
            <div className="space-y-4">
                {searchStats.map(stat => (
                    <div key={stat.period} className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
                        <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{stat.period}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.searches} searches</p>
                        </div>
                        <span className={`text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-teal-50/50 dark:bg-teal-900/20 rounded-lg">
                <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Top Search Terms</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-teal-200/50 dark:bg-teal-700/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">wireless earphones</span>
                    <span className="text-xs bg-teal-200/50 dark:bg-teal-700/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">gaming mouse</span>
                    <span className="text-xs bg-teal-200/50 dark:bg-teal-700/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">laptop stand</span>
                </div>
            </div>
        </div>
    );
};

const FeatureAnalytics: React.FC = () => {
    const features = [
        { name: 'Product Images', usage: 89, color: 'bg-blue-500' },
        { name: 'Price Display', usage: 76, color: 'bg-green-500' },
        { name: 'Location Info', usage: 65, color: 'bg-yellow-500' },
        { name: 'Contact Button', usage: 54, color: 'bg-purple-500' },
        { name: 'Reviews', usage: 43, color: 'bg-red-500' },
    ];

    return (
        <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-base md:text-lg font-bold dark:text-gray-200">Feature Usage</h3>
            </div>
            <div className="space-y-4">
                {features.map(feature => (
                    <div key={feature.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{feature.usage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${feature.color}`} 
                                style={{ width: `${feature.usage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Insight:</strong> Product images drive 89% of customer engagement. Consider adding more high-quality images to boost conversions.
                </p>
            </div>
        </div>
    );
};

const VendorDashboard: React.FC<{ shop: Shop; onReset: () => void }> = ({ shop, onReset }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Your Business Health</h2>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">An overview of your performance for {shop.name}</p>
                </div>
                <button onClick={onReset} className="flex items-center gap-2 text-sm bg-gray-500/20 hover:bg-gray-500/30 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 backdrop-blur-md text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors">
                    <ArrowPathIcon className="w-5 h-5" />
                    Create New Shop
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Net Profit (Last 7 Days)" value="Ksh 24,500" change="Up 8% vs Last Week" changeType="increase" />
                <StatCard title="Total Revenue" value="Ksh 35,000" />
                <StatCard title="Total Expenses" value="Ksh 8,900" />
            </div>

            <LowStockAlert />

            <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow">
                <SalesChart />
                <div className="text-center mt-4">
                    <button className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                        Generate Marketing Post (English/Swahili)
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InventoryManager initialProducts={shop.products} />
                <OrderList />
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Analytics & Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ChatAnalytics />
                    <SearchAnalytics />
                    <FeatureAnalytics />
                </div>
            </div>
        </div>
    );
};

const TemplateCard: React.FC<{ template: ShopTemplate; onCreate: () => void; }> = ({ template, onCreate }) => {
    const srcBase = template.image.replace('-1024.webp', '');
    return (
    <div className="bg-green-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
        <OptimizedImage srcBase={srcBase} alt={template.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200">{template.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs flex-grow">{template.description}</p>
        </div>
        <div className="p-4 pt-0">
            <button 
                onClick={onCreate}
                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
                Create This Shop
            </button>
        </div>
    </div>
    );
};

const ShopCreator: React.FC<{ onCreateShop: (template: ShopTemplate) => void }> = ({ onCreateShop }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Create Your Digital Storefront</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">Choose a template to get started in seconds. It's pre-filled with products to help you go live faster.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {SHOP_TEMPLATES.map(template => (
                    <TemplateCard key={template.name} template={template} onCreate={() => onCreateShop(template)} />
                ))}
            </div>
        </div>
    );
};

const VendorView: React.FC = () => {
    const [createdShop, setCreatedShop] = useState<Shop | null>(null);

    const handleCreateShop = (template: ShopTemplate) => {
        const newShop: Shop = {
            ...template,
            id: new Date().toISOString(),
            location: generateRandomCoordinates(-1.286389, 36.817223, 1000),
            distance: `${Math.floor(Math.random() * 800) + 200}m Away`,
            rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        };
        setCreatedShop(newShop);
    };
    
    const handleReset = () => {
        setCreatedShop(null);
    }

    if (!createdShop) {
        return <ShopCreator onCreateShop={handleCreateShop} />;
    }

    return <VendorDashboard shop={createdShop} onReset={handleReset} />;
};

export default VendorView;