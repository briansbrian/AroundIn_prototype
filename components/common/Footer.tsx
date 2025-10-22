
import React from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon } from './Icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg text-gray-600 dark:text-gray-300 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">About Aroundin</h3>
                        <p className="text-xs">
                            Aroundin is a hyperlocal marketplace dedicated to empowering Micro, Small, and Medium Enterprises (MSMEs) in Africa. We connect local vendors with nearby customers, fostering community growth and economic inclusion.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">Quick Links</h3>
                        <ul className="space-y-2 text-xs">
                            <li><a href="/?role=vendor" className="text-left hover:text-teal-500 transition-colors">For Vendors</a></li>
                            <li><a href="#" className="hover:text-teal-500 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-teal-500 transition-colors">Guide on how to enroll documentation</a></li>
                            <li><a href="#" className="hover:text-teal-500 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-2">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                                <TwitterIcon className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                                <FacebookIcon className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-teal-500 transition-colors">
                                <InstagramIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-8 pt-4 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Aroundin. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;