
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { findNearbyPlaces } from '../services/geminiService';
import { MOCK_SHOPS } from '../constants';
import LoadingSpinner from './common/LoadingSpinner';
import OptimizedImage from './common/OptimizedImage';
import { MagnifyingGlassIcon, StarIcon, XMarkIcon, BookmarkIcon, BookmarkSquareIcon } from './common/Icons';
import ShopPortfolio from './ShopPortfolio';
import type { Shop, GroundingChunk, GeoLocation } from '../types';
import { searchLocalData, type LocalSearchResult, calculateDistance } from '../lib/searchUtils';

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
        <div className="relative h-64 md:h-96 w-full rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
            <OptimizedImage 
                srcBase="/images/optimized/mainbar"
                alt="Map of the local area" 
                sizes="100vw"
                className="w-full h-full object-cover opacity-75 brightness-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
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
            <div className="bg-teal-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 relative">
                    <OptimizedImage srcBase={srcBase} alt={shop.name} className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow md:w-1/2">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
                            <h3 className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-200">{shop.name}</h3>
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
        <div className="bg-teal-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <OptimizedImage srcBase={srcBase} alt={shop.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-200">{shop.name}</h3>
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
  const [localSearchResults, setLocalSearchResults] = useState<LocalSearchResult[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [savedShops, setSavedShops] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'recommended' | Shop['category']>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get filtered suggestions based on current input
  const suggestions = MOCK_SHOPS.filter(shop =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.products.some(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 5); // Limit to 5 suggestions

  // Handle input change with suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle saving/unsaving shops
  const handleSaveShop = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedShops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shopId)) {
        newSet.delete(shopId);
      } else {
        newSet.add(shopId);
      }
      return newSet;
    });
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (shop: Shop) => {
    setSearchQuery(shop.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setSelectedShop(shop);
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setApiResponse(null);
    setLocalSearchResults([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    // Always perform local search
    const localResults = searchLocalData(searchQuery, location || undefined);
    setLocalSearchResults(localResults);

    // Perform external API search if location is available
    if (location) {
      try {
        const result = await findNearbyPlaces(searchQuery, location);
        setApiResponse(result);
      } catch (error) {
        console.error('External search failed:', error);
        // Continue with local results only
      }
    }

    setIsLoading(false);
  }, [searchQuery, location]);

  const handleViewShop = (shop: Shop) => {
      setSelectedShop(shop);
  };
  
  // Both Directions and View Shop now navigate to the portfolio
  const handleGetDirections = useCallback((shop: Shop) => {
    setSelectedShop(shop);
  }, []);


  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setLocalSearchResults([]);
    setApiResponse(null);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
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
        <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Find Shops & Products</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Search local shops, products, and services in your area.</p>
      </div>

      <div className="sticky top-[70px] bg-transparent z-10 py-4">
        <div className="relative max-w-2xl mx-auto">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search shops, products, or services..."
            className="w-full pl-10 pr-20 py-2 md:py-3 border border-gray-300/50 dark:border-gray-600/50 bg-teal-50/90 dark:bg-gray-700/90 backdrop-blur-md dark:text-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:placeholder-gray-400 text-sm md:text-base"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          {(localSearchResults.length > 0 || apiResponse) && (
            <button
              onClick={handleClearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-500 text-white font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-teal-600 disabled:bg-gray-400 transition-colors text-sm md:text-base"
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5" /> : 'Search'}
          </button>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20"
            >
              {suggestions.map((shop, index) => (
                <button
                  key={shop.id}
                  onClick={() => handleSuggestionSelect(shop)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between ${
                    index === selectedSuggestionIndex ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{shop.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{shop.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {location && (
                      <p className="text-sm text-teal-600 dark:text-teal-400">
                        {(() => {
                          const distance = calculateDistance(
                            location.latitude,
                            location.longitude,
                            shop.location.latitude,
                            shop.location.longitude
                          );
                          return distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
                        })()}
                      </p>
                    )}
                    <button
                      onClick={(e) => handleSaveShop(shop.id, e)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {savedShops.has(shop.id) ? (
                        <BookmarkSquareIcon className="w-4 h-4 text-teal-500" />
                      ) : (
                        <BookmarkIcon className="w-4 h-4 text-gray-400 hover:text-teal-500" />
                      )}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {geoError && <p className="text-center text-red-500 text-sm mt-2">Geolocation error: {geoError}. Please enable location services.</p>}
      </div>

      {(localSearchResults.length > 0 || apiResponse) && (
        <div className="space-y-6">
          {/* Local Search Results */}
          {localSearchResults.length > 0 && (
            <div className="bg-teal-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-4 md:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="font-bold text-sm md:text-base mb-4 dark:text-gray-200">Local Results</h3>
              <div className="space-y-4">
                {localSearchResults.map((result, index) => (
                  <div key={`${result.shop.id}-${result.product?.id || 'shop'}-${index}`} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        srcBase={result.shop.image.replace('-1024.webp', '')}
                        alt={result.shop.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{result.shop.name}</p>
                        {result.type === 'product' && result.product ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.product.name} - Ksh {result.product.price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{result.shop.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{result.formattedDistance}</p>
                      <button
                        onClick={() => handleViewShop(result.shop)}
                        className="text-xs bg-teal-500 text-white px-3 py-1 rounded-full hover:bg-teal-600 transition-colors mt-1"
                      >
                        View Shop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External API Results */}
          {apiResponse && (
            <div className="bg-teal-50/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 p-4 md:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
              <h3 className="font-bold text-sm md:text-base mb-2 dark:text-gray-200">Search Results</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{apiResponse.text}</p>
              {apiResponse.groundingChunks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-2 dark:text-gray-200">Sources from Google Maps:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {apiResponse.groundingChunks.map((chunk, index) => (
                      <li key={index}>
                        <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline text-sm md:text-base">
                          {chunk.maps.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <MapPlaceholder isLoading={geoLoading} />
      
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200">Featured Shops Nearby</h3>
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