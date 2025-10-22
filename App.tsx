

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CustomerView from './components/CustomerView';
import VendorView from './components/VendorView';
import ShopPortfolio from './components/ShopPortfolio';
import { SunIcon, MoonIcon, Bars3Icon, HomeIcon, BuildingStorefrontIcon, UserIcon } from './components/common/Icons';
import ParticlesBackground from './components/common/ParticlesBackground';
import Footer from './components/common/Footer';

type Role = 'customer' | 'vendor';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const Navigation = () => {
    const location = useLocation();

    return (
      <nav className="flex items-center gap-6">
        <Link
          to="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/'
              ? 'bg-teal-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Customer</span>
        </Link>
        <Link
          to="/vendor"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/vendor'
              ? 'bg-teal-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <BuildingStorefrontIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Vendor</span>
        </Link>
      </nav>
    );
  };

  const Header = () => (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="cursor-pointer">
            <h1 className="text-2xl font-bold text-teal-600">Aroundin</h1>
          </Link>
          <Navigation />
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-500" />}
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50 rounded-lg shadow-lg py-2 animate-fade-in-fast">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Terms of Service</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Documentation</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Help Centre</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <Router>
      <div className={`font-sans ${isDarkMode ? 'dark text-white' : ''}`}>
        <ParticlesBackground theme={isDarkMode ? 'dark' : 'light'} />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/" element={<CustomerView />} />
              <Route path="/vendor" element={<VendorView />} />
              <Route path="/shop/:shopId" element={<ShopPortfolio />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;