
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { findNearbyPlaces } from '../services/geminiService';
import { MOCK_SHOPS } from '../constants';
import LoadingSpinner from './common/LoadingSpinner';
import OptimizedImage from './common/OptimizedImage';
import { MagnifyingGlassIcon, StarIcon } from './common/Icons';
import ShopPortfolio from './ShopPortfolio';
import type { Shop, GroundingChunk, GeoLocation } from '../types';

const MapPlaceholder: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    if (isLoading) {
        return (
            <div className="h-64 md:h-96 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg flex items-center justify-center">
                <LoadingSpinner />
                <p className="ml-4 text-gray-600 dark:text-gray-300">Getting your location...</p>
            </div>
        );
    }

    return (
        <div className="relative h-64 md:h-96 w-full rounded-lg shadow-lg overflow-hidden">
            <OptimizedImage 
                srcBase="/images/optimized/mainbar"
                alt="Map of the local area" 
                sizes="100vw"
                className="w-full h-full object-cover" 
            />
        </div>
    );
};


const ShopCard: React.FC<{ 
    shop: Shop; 
    onGetDirections: (shop: Shop) => void; 
    onViewShop: (shop: Shop) => void;
    isFeatured?: boolean;
}> = ({ shop, onGetDirections, onViewShop, isFeatured = false }) => {
    
    const categoryStyles = {
        Electronics: 'bg-blue-500/20 text-blue-800 dark:text-blue-300',
        Food: 'bg-green-500/20 text-green-800 dark:text-green-300',
        General: 'bg-gray-500/20 text-gray-800 dark:text-gray-300',
        Service: 'bg-violet-500/20 text-violet-800 dark:text-violet-300',
    };

    const srcBase = shop.image.replace('-1024.webp', '');

    if (isFeatured) {
        return (
            <div className="bg-teal-50/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 relative">
                    <OptimizedImage srcBase={srcBase} alt={shop.name} className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow md:w-1/2">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">{shop.name}</h3>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[shop.category]}`}>{shop.category}</span>
                      </div>
                       <div className="flex items-center gap-2 mt-2">
                         <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <StarIcon className="w-3 h-3"/>
                            <span>FEATURED</span>
                         </div>
                         <p className="text-sm text-gray-600 dark:text-gray-400">{shop.distance} &middot; {shop.rating} ★</p>
                       </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">In Stock:</h4>
                        <div className="flex flex-wrap gap-2">
                            {shop.products.slice(0, 3).map(p => (
                                <span key={p.id} className="text-xs bg-gray-500/10 text-gray-700 dark:bg-gray-200/10 dark:text-gray-300 px-2 py-1 rounded">{p.name}</span>
                            ))}
                            {shop.products.length > 3 && <span className="text-xs bg-gray-500/10 text-gray-700 dark:bg-gray-200/10 dark:text-gray-300 px-2 py-1 rounded">...</span>}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 grid grid-cols-2 gap-2">
                      <button onClick={() => onViewShop(shop)} className="text-teal-800 bg-teal-500/20 hover:bg-teal-500/30 dark:text-gray-200 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                          View Shop
                      </button>
                      <button 
                        onClick={() => onGetDirections(shop)} 
                        className="font-bold py-2 px-4 rounded-lg transition-colors text-sm text-white bg-teal-500 hover:bg-teal-600">
                          Directions
                      </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-teal-50/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <OptimizedImage srcBase={srcBase} alt={shop.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{shop.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[shop.category]}`}>{shop.category}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{shop.distance} &middot; {shop.rating} ★</p>
                <div className="mt-4">
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">In Stock:</h4>
                    <div className="flex flex-wrap gap-2">
                        {shop.products.slice(0, 2).map(p => (
                            <span key={p.id} className="text-xs bg-gray-500/10 text-gray-700 dark:bg-gray-200/10 dark:text-gray-300 px-2 py-1 rounded">{p.name}</span>
                        ))}
                        {shop.products.length > 2 && <span className="text-xs bg-gray-500/10 text-gray-700 dark:bg-gray-200/10 dark:text-gray-300 px-2 py-1 rounded">...</span>}
                    </div>
                </div>
            </div>
             <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button onClick={() => onViewShop(shop)} className="text-teal-800 bg-teal-500/20 hover:bg-teal-500/30 dark:text-gray-200 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                    View Shop
                </button>
                <button 
                  onClick={() => onGetDirections(shop)} 
                  className="font-bold py-2 px-4 rounded-lg transition-colors text-sm text-white bg-teal-500 hover:bg-teal-600">
                    Directions
                </button>
            </div>
        </div>
    );
};

const FilterButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-colors ${isActive ? 'bg-teal-500 text-white shadow' : 'bg-white/50 dark:bg-gray-700/50 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-600/70'}`}
    >
        {children}
    </button>
);

const CustomerView: React.FC = () => {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ text: string; groundingChunks: GroundingChunk[] } | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recommended' | Shop['category']>('all');

  const handleSearch = useCallback(async () => {
    if (!searchQuery || !location) return;
    setIsLoading(true);
    setApiResponse(null);
    const result = await findNearbyPlaces(searchQuery, location);
    setApiResponse(result);
    setIsLoading(false);
  }, [searchQuery, location]);

  const handleViewShop = (shop: Shop) => {
      setSelectedShop(shop);
  };
  
  // Both Directions and View Shop now navigate to the portfolio
  const handleGetDirections = useCallback((shop: Shop) => {
    setSelectedShop(shop);
  }, []);


  const handleBackToDiscovery = () => {
      setSelectedShop(null);
  };

  const filteredShops = MOCK_SHOPS.filter(shop => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recommended') return shop.rating >= 4.5;
    return shop.category === activeFilter;
  });

  if (selectedShop) {
      return <ShopPortfolio shop={selectedShop} userLocation={location} onBack={handleBackToDiscovery} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Find What's Around You</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Discover local shops and services in your neighborhood.</p>
      </div>

      <div className="sticky top-[70px] bg-transparent z-10 py-4">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., 'best place for coffee' or 'electronics repair'"
            className="w-full pl-10 pr-20 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-teal-50/60 dark:bg-gray-700/60 backdrop-blur-md dark:text-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:placeholder-gray-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <button
            onClick={handleSearch}
            disabled={isLoading || geoLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5" /> : 'Search'}
          </button>
        </div>
        {geoError && <p className="text-center text-red-500 text-sm mt-2">Geolocation error: {geoError}. Please enable location services.</p>}
      </div>

      {apiResponse && (
        <div className="bg-teal-50/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h3 className="font-bold text-xl mb-2 dark:text-gray-200">Search Results</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{apiResponse.text}</p>
            {apiResponse.groundingChunks.length > 0 && (
                <div>
                    <h4 className="font-semibold text-lg mb-2 dark:text-gray-200">Sources from Google Maps:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {apiResponse.groundingChunks.map((chunk, index) => (
                            <li key={index}>
                                <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                                    {chunk.maps.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      )}

      <MapPlaceholder isLoading={geoLoading} />
      
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Featured Shops Nearby</h3>
            <div className="flex space-x-2">
                <FilterButton onClick={() => setActiveFilter('all')} isActive={activeFilter === 'all'}>All</FilterButton>
                <FilterButton onClick={() => setActiveFilter('recommended')} isActive={activeFilter === 'recommended'}><StarIcon className="w-4 h-4"/> Recommended</FilterButton>
                <FilterButton onClick={() => setActiveFilter('Electronics')} isActive={activeFilter === 'Electronics'}>Electronics</FilterButton>
                <FilterButton onClick={() => setActiveFilter('Food')} isActive={activeFilter === 'Food'}>Food</FilterButton>
                <FilterButton onClick={() => setActiveFilter('Service')} isActive={activeFilter === 'Service'}>Services</FilterButton>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, index) => {
             const isFeatured = index === 0 && filteredShops.length > 2;
             return (
                <div key={shop.id} className={`${isFeatured ? 'md:col-span-2' : ''}`}>
                    <ShopCard 
                        shop={shop} 
                        onGetDirections={handleGetDirections}
                        onViewShop={handleViewShop}
                        isFeatured={isFeatured}
                    />
                </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;