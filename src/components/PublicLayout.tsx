import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, Menu, X, Zap, Shield } from 'lucide-react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempMailDropdownOpen, setTempMailDropdownOpen] = useState(false);
  const location = useLocation();
  
  // Check current path to highlight active link
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <img src="https://boomlify.com/vite.svg" alt="Boomlify" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">Boomlify</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/features" className="text-gray-600 hover:text-[#4A90E2] transition-colors">
                Features
              </Link>
              <Link to="/demo" className="text-gray-600 hover:text-[#4A90E2] transition-colors">
                Demo
              </Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-[#4A90E2] transition-colors">
                How It Works
              </Link>
              <div className="relative">
                <button
                  onClick={() => setTempMailDropdownOpen(!tempMailDropdownOpen)}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Temporary Email
                  <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${tempMailDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {tempMailDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to="/temp-mail-instant"
                        className={`flex items-start px-4 py-3 text-sm ${isActivePath('/temp-mail-instant') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setTempMailDropdownOpen(false)}
                      >
                        <Zap className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Instant Temp Mail</span>
                          <span className="text-xs text-gray-500">Quick disposable email for one-time use</span>
                        </div>
                      </Link>
                      
                      <Link
                        to="/temp-mail-privacy"
                        className={`flex items-start px-4 py-3 text-sm ${isActivePath('/temp-mail-privacy') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setTempMailDropdownOpen(false)}
                      >
                        <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Private Temp Mail</span>
                          <span className="text-xs text-gray-500">Enhanced security & privacy protection</span>
                        </div>
                      </Link>
                      
                      <Link
                        to="/temp-mail-advanced"
                        className={`flex items-start px-4 py-3 text-sm ${isActivePath('/temp-mail-advanced') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setTempMailDropdownOpen(false)}
                      >
                        <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Advanced Temp Mail</span>
                          <span className="text-xs text-gray-500">Multiple domains & advanced features</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/login" className="text-[#4A90E2] hover:text-[#357ABD] transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#357ABD] transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`md:hidden absolute top-16 inset-x-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/features"
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-[#4A90E2] border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/demo"
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-[#4A90E2] border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              to="/how-it-works"
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-[#4A90E2] border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/temp-mail-pro"
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-[#4A90E2] border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Pro Features
            </Link>
            <Link
              to="/login"
              className="block px-3 py-4 text-base font-medium text-[#4A90E2] hover:text-[#357ABD] border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block px-3 py-4 text-base font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] rounded-lg text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                    Temporary Email
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                    Disposable Address
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                    Anonymous Inbox
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                    Spam Protection
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/gdpr" className="text-gray-400 hover:text-white transition-colors">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Boomlify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}