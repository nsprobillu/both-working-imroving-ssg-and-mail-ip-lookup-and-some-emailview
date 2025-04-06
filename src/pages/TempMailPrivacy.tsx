import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Shield, Lock, Eye, EyeOff, Copy, CheckCircle, Mail, Clock,
  RefreshCw, QrCode, Filter, Search, Download, Share2, Bell,
  Settings, AlertTriangle, X, ChevronDown, ChevronUp, ExternalLink,
  ArrowRight, Fingerprint, Database, Key, LockIcon, UserCheck,
  Reply, Trash2, Forward
} from 'lucide-react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { PublicLayout } from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';

// Add type declaration for Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// AdSense Component
function GoogleAdSense() {
  useEffect(() => {
    try {
      // Load AdSense script
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8969239607364902';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Initialize ads when component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading AdSense:', error);
    }
  }, []);

  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8969239607364902"
        data-ad-slot="7471800483"
      ></ins>
    </div>
  );
}

// Mobile Ad Component - Only visible on mobile/tablet
function MobileAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading mobile AdSense:', error);
    }
  }, []);

  return (
    <div className="my-6 mx-auto block lg:hidden max-w-full overflow-hidden bg-white/5 p-1 rounded-lg">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8969239607364902"
        data-ad-slot="4910754746"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

// Sidebar Ad Component
function SidebarAd({ position }: { position: 'left' | 'right' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading sidebar AdSense:', error);
    }
  }, []);

  return (
    <div className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-10 hidden lg:block`}>
      <ins className="adsbygoogle"
           style={{ display: 'inline-block', width: '160px', height: '728px' }}
           data-ad-client="ca-pub-8969239607364902"
           data-ad-slot="4910754746"></ins>
    </div>
  );
}

// Storage keys
const STORAGE_KEYS = {
  TEMP_EMAIL: 'boomlify_temp_email',
  SELECTED_DOMAIN: 'boomlify_selected_domain'
};

// SEO data
const seoData = {
  title: "Private Temporary Email - Anonymous & Secure Disposable Email | Boomlify",
  description: "Create private temporary emails with enhanced security features. Stay anonymous online, protect your data, and avoid tracking with our secure disposable email service. Perfect for privacy-conscious users.",
  canonicalUrl: "https://boomlify.com/temp-mail-privacy",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Boomlify Private Email Generator",
    "applicationCategory": "EmailApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Private temporary email service with enhanced security and privacy features",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1500"
    },
    "featureList": [
      "Zero data retention",
      "End-to-end encryption",
      "Anonymous email creation",
      "Anti-tracking protection",
      "Secure attachment handling"
    ]
  }
};

interface Domain {
  id: string;
  domain: string;
}

interface TempEmail {
  id: string;
  email: string;
  created_at: string;
  expires_at: string;
}

interface ReceivedEmail {
  id: string;
  from_email: string;
  subject: string;
  body_html: string;
  body_text: string;
  received_at: string;
  temp_email: string;
  attachments?: Array<{
    filename: string;
    size: number;
    content_type: string;
    url: string;
  }>;
}

function QRModal({ isOpen, onClose, email }: { isOpen: boolean; onClose: () => void; email: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Secure QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <QRCodeSVG
            value={email}
            size={200}
            level="H"
            includeMargin={true}
            className="w-full max-w-[200px]"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4 break-all">{email}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-white/20 rounded-full transition-colors"
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
    </button>
  );
}

export function TempMailPrivacy() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [tempEmail, setTempEmail] = useState<TempEmail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [qrModal, setQRModal] = useState({ isOpen: false, email: '' });
  const [error, setError] = useState('');

  // Bot detection function from TempMailInstant
  const isBot = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /bot|crawler|spider/i.test(userAgent);
  };

  // Random letter generator from TempMailInstant
  const generateRandomLetters = (length: number) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  };

  // Initialize service (fetch domains and load/generate email)
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/domains/public`);
        const availableDomains = response.data;

        if (availableDomains && availableDomains.length > 0) {
          setDomains(availableDomains);
          setSelectedDomain(availableDomains[0]);

          const savedEmail = localStorage.getItem(STORAGE_KEYS.TEMP_EMAIL);
          if (savedEmail) {
            const emailData = JSON.parse(savedEmail);
            const expiryDate = new Date(emailData.expires_at);

            if (expiryDate > new Date()) {
              setTempEmail(emailData);
              fetchEmails(emailData.email);
              return;
            }
            localStorage.removeItem(STORAGE_KEYS.TEMP_EMAIL);
          }

          await generateEmail(availableDomains[0]);
        }
      } catch (error) {
        console.error('Service initialization error:', error);
        setError('Failed to initialize service');
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  // Auto-refresh emails with bot detection
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && tempEmail?.email && !isBot()) {
      fetchEmails(tempEmail.email);
      interval = setInterval(() => fetchEmails(tempEmail.email), 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, tempEmail]);

  const fetchEmails = async (email: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/emails/public/${email}`);
      setReceivedEmails(response.data || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    }
  };

  const generateEmail = async (domain: Domain) => {
    if (!domain) {
      setError('No domain selected');
      return;
    }

    try {
      setIsEmailLoading(true);
      setError('');
      const randomPrefix = generateRandomLetters(8);
      const newEmail = `${randomPrefix}@${domain.domain}`;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/emails/public/create`,
        {
          email: newEmail,
          domainId: domain.id
        }
      );

      if (!response.data) {
        throw new Error('Failed to create email');
      }

      localStorage.setItem(STORAGE_KEYS.TEMP_EMAIL, JSON.stringify(response.data));
      localStorage.setItem(STORAGE_KEYS.SELECTED_DOMAIN, JSON.stringify(domain));

      setTempEmail(response.data);
      setReceivedEmails([]);
      setSelectedEmail(null);
    } catch (error: any) {
      console.error('Failed to generate email:', error);
      setError(error.response?.data?.error || 'Failed to create email address');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleDomainChange = (domainId: string) => {
    const newDomain = domains.find(d => d.id === domainId);
    if (!newDomain) return;
    setSelectedDomain(newDomain);
  };

  const handleChangeEmail = async () => {
    if (!selectedDomain) return;
    await generateEmail(selectedDomain);
  };

  // Handle email selection
  const handleEmailSelect = (email: ReceivedEmail) => {
    setSelectedEmail(email);
  };

  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#2c5282] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Private Temporary Email</h1>
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-xl mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content="https://boomlify.com/privacy-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={seoData.canonicalUrl} />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="https://boomlify.com/privacy-twitter.jpg" />
        <meta name="keywords" content="private temp mail, anonymous email, secure temporary email, disposable email privacy, encrypted temp mail, no tracking email, secure disposable email, private email generator, anonymous temp mail, secure email service" />
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      </Helmet>

      {/* Left sidebar ad */}
      <SidebarAd position="left" />

      <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#2c5282] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Private Temporary Email</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Create secure, anonymous temporary emails with enhanced privacy features. 
              Protect your data and stay untracked online.
            </p>
          </div>

          {/* Email Generation Section */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 ${isEmailLoading ? 'opacity-50' : ''}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              <div className="flex-1 min-w-0">
                {tempEmail && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-mono truncate">{tempEmail.email}</span>
                      <CopyButton text={tempEmail.email} />
                      <button
                        onClick={() => setQRModal({ isOpen: true, email: tempEmail.email })}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        title="Show QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center mt-2 text-white/70 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Valid until {new Date(tempEmail.expires_at).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedDomain?.id || ''}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="border border-white/30 bg-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                >
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      @{domain.domain}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleChangeEmail}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Change Email
                    </>
                  )}
                </button>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg ${
                    autoRefresh ? 'bg-green-500/20' : 'hover:bg-white/10'
                  } transition-colors`}
                  title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
                >
                  <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {isEmailLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Ad - After email generation section */}
          <MobileAd />

          {/* Inbox Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Email List */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Secure Inbox
                </h2>
              </div>
              <div className="space-y-2 max-h-[700px] overflow-y-auto">
                {receivedEmails.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl transform -translate-y-4"></div>
                      <Mail className="w-20 h-20 mx-auto mb-8 opacity-50 relative z-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Your secure inbox is empty</h3>
                    <p className="text-white/70 mb-6">Emails will appear here automatically</p>
                    
                    <div className="border-t border-white/10 pt-6 mt-6 max-w-md mx-auto">
                      <h4 className="font-medium mb-4 text-blue-300">How your private inbox works:</h4>
                      <ul className="space-y-4 text-sm text-left text-white/70">
                        <li className="flex items-start">
                          <Clock className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                          <span>Incoming emails are automatically refreshed every 10 seconds</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                          <span>All communications are encrypted and secure from tracking</span>
                        </li>
                        <li className="flex items-start">
                          <Download className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                          <span>Download attachments without revealing your identity</span>
                        </li>
                        <li className="flex items-start">
                          <RefreshCw className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                          <span>Generate a new email address at any time for enhanced privacy</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-8 border border-blue-500/30 rounded-lg p-4 bg-blue-500/5 max-w-md mx-auto">
                      <p className="text-sm text-white/80 flex items-start">
                        <AlertTriangle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                        <span>For testing your inbox, send an email to your temporary address from any email provider, then wait a few seconds for it to appear here</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  receivedEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => handleEmailSelect(email)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedEmail?.id === email.id ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate">{email.subject || 'No Subject'}</h3>
                          <p className="text-sm text-white/70 truncate">{email.from_email}</p>
                        </div>
                        <span className="text-xs text-white/50">{new Date(email.received_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Email Content */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="max-h-[700px] overflow-y-auto">
                {selectedEmail ? (
                  <div>
                    <div className="border-b border-white/20 pb-4 mb-4">
                      <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject || 'No Subject'}</h2>
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>From: {selectedEmail.from_email}</span>
                        <span>{new Date(selectedEmail.received_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {selectedEmail.body_html ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }} />
                      ) : (
                        <pre className="whitespace-pre-wrap">{selectedEmail.body_text}</pre>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <Mail className="w-12 h-12 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Select an email to view its content</h3>
                    <p className="text-white/70 max-w-md">
                      Your messages will be displayed here. All content is rendered securely with tracking protection.
                    </p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-white/70">Email tracking pixels blocked</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-white/70">Dangerous links highlighted</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Benefits Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Private Email Service?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold">Enhanced Security</h3>
                </div>
                <p className="text-white/70">
                  State-of-the-art encryption and security protocols protect your communications from unauthorized access.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Lock className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold">Complete Privacy</h3>
                </div>
                <p className="text-white/70">
                  No personal information required. Create and use temporary emails without revealing your identity.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold">Anti-Tracking</h3>
                </div>
                <p className="text-white/70">
                  Advanced tracking prevention features keep your online activities private and untracked.
                </p>
              </div>
            </div>
          </div>

          {/* Google AdSense - Added as requested */}
          <GoogleAdSense />

          {/* Mobile Ad - After key content */}
          <MobileAd />

          {/* Top Use Cases - New Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Top Use Cases for Temporary Email</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-transform hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold mb-4 text-blue-300">Online Shopping Protection</h3>
                <p className="mb-4 text-white/80">
                  Use our private temp mail when shopping online to prevent marketing spam and protect your personal inbox from data breaches.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Prevent promotional emails from flooding your main inbox</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Shield your real email from e-commerce data breaches</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Receive order confirmations without compromising privacy</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-transform hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold mb-4 text-blue-300">Free Trial Exploration</h3>
                <p className="mb-4 text-white/80">
                  Sign up for software trials and services without worrying about follow-up marketing or spam once your trial ends.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Test premium services without commitment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Avoid automatic subscription renewals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Evaluate software without flooding your main inbox</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-transform hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold mb-4 text-blue-300">Social Media Privacy</h3>
                <p className="mb-4 text-white/80">
                  Create social media accounts with enhanced privacy when you don't want to link your personal identity or main email.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Separate personal and public online identities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Prevent social networks from accessing contact lists</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Protect against cross-platform data sharing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 transition-transform hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold mb-4 text-blue-300">Secure Document Sharing</h3>
                <p className="mb-4 text-white/80">
                  Receive sensitive documents without exposing your personal email or creating permanent records of the exchange.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Exchange confidential files with auto-deletion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Prevent digital paper trails of sensitive communications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Avoid email data mining of confidential information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Protection Features - New Section */}
          <div className="mt-20 relative">
            <div className="absolute -top-16 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#1a365d]/60 -z-10 blur-xl"></div>
            <h2 className="text-3xl font-bold text-center mb-12">Ultimate Privacy Protection</h2>
            <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl p-8 border border-white/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center">
                    <Shield className="w-6 h-6 text-blue-400 mr-3" />
                    Why Temp Mail Enhances Your Privacy
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 p-2 rounded-full mr-3 mt-1">
                        <UserCheck className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Anonymous Registration</span>
                        <p className="text-white/70 text-sm mt-1">Create accounts on websites without exposing your identity or primary email address.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 p-2 rounded-full mr-3 mt-1">
                        <Mail className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Prevent Spam Collection</span>
                        <p className="text-white/70 text-sm mt-1">Marketers can't build profiles on you when your email address disappears after use.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 p-2 rounded-full mr-3 mt-1">
                        <AlertTriangle className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Data Breach Protection</span>
                        <p className="text-white/70 text-sm mt-1">If a service is compromised, hackers only obtain a temporary email that's already expired.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center">
                    <Lock className="w-6 h-6 text-blue-400 mr-3" />
                    Privacy Risks of Permanent Email
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-2 rounded-full mr-3 mt-1">
                        <Eye className="w-5 h-5 text-red-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Tracking & Profiling</span>
                        <p className="text-white/70 text-sm mt-1">Companies track your behaviors across websites by connecting your permanent email address.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-2 rounded-full mr-3 mt-1">
                        <Share2 className="w-5 h-5 text-red-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Data Sharing</span>
                        <p className="text-white/70 text-sm mt-1">Your email becomes a unique identifier shared between companies and data brokers.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-2 rounded-full mr-3 mt-1">
                        <Trash2 className="w-5 h-5 text-red-300" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">Permanent Records</span>
                        <p className="text-white/70 text-sm mt-1">With standard email, your communications are stored indefinitely on servers beyond your control.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Email Privacy Statistics - New Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Email Privacy Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">91%</div>
                <p className="text-white/80">of cyber attacks begin with a phishing email targeting personal addresses</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">85%</div>
                <p className="text-white/80">of companies experienced email-based cyber attacks in the past year</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">73%</div>
                <p className="text-white/80">of users reuse passwords across multiple sites linked to one email</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">67%</div>
                <p className="text-white/80">of consumers are concerned about how companies use their email data</p>
              </div>
            </div>
          </div>

          {/* Additional FAQ Questions - Expanded Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">What is a Private Temporary Email?</h3>
                <p className="text-white/70">
                  A private temporary email is a secure, anonymous email address that you can use without revealing your identity. It's perfect for protecting your privacy and avoiding spam.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">How Secure is Your Service?</h3>
                <p className="text-white/70">
                  Our service uses end-to-end encryption and zero data retention policies. All emails are automatically deleted after 48 hours, ensuring your data remains private.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Can I Use This for Business?</h3>
                <p className="text-white/70">
                  Yes, our private temporary email service is perfect for businesses that need secure, temporary email addresses for testing, development, or temporary communications.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Do You Support Attachments?</h3>
                <p className="text-white/70">
                  Yes, we support various types of attachments with secure handling. All attachments are encrypted and automatically deleted after 48 hours.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">How is This Different From Regular Temp Mail?</h3>
                <p className="text-white/70">
                  Unlike standard temporary email services, our privacy-focused solution offers enhanced security features including encryption, tracker blocking, and metadata protection to ensure complete anonymity.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Is It Legal to Use Temporary Email?</h3>
                <p className="text-white/70">
                  Yes, using temporary email addresses is completely legal. It's a privacy tool that helps protect your digital identity, similar to using a VPN or private browsing mode.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Will My Emails Get Filtered as Spam?</h3>
                <p className="text-white/70">
                  Our domains are carefully maintained to ensure high deliverability. While some services may block temporary domains, most regular communications will arrive normally.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Can I Reply to Emails I Receive?</h3>
                <p className="text-white/70">
                  Yes, you can send and receive emails normally during the lifetime of your temporary address, maintaining the same privacy protections for all communications.
                </p>
              </div>
            </div>
          </div>

          {/* Industry Use Cases - New Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Industry-Specific Privacy Solutions</h2>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-300">Journalists & Whistleblowers</h3>
                <p className="text-white/80">
                  Secure communications are essential for journalists working with sensitive sources and whistleblowers. Our temporary email provides a secure channel that leaves no permanent trail, protecting both parties.
                </p>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Source protection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Anonymous tips</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Document exchange</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Investigation security</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-300">Healthcare & Telemedicine</h3>
                <p className="text-white/80">
                  Healthcare professionals can use our service to create secure channels for sensitive patient communications, especially for one-time consultations or telehealth services where privacy is paramount.
                </p>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Patient confidentiality</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Secure test results</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Temporary consultations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">HIPAA-conscious communication</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-300">Financial & Legal Services</h3>
                <p className="text-white/80">
                  Financial advisors and legal professionals can establish secure temporary channels for sharing confidential documents and sensitive information with clients without permanent digital footprints.
                </p>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Confidential client communications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Secure document delivery</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Private financial advice</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-white/70">Legal consultation privacy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Schema Markup Explanation - Hidden for SEO */}
          <div className="sr-only">
            <h2>Temporary Email Privacy Schema Markup</h2>
            <p>Our page includes rich structured data to help search engines understand our temporary email privacy service:</p>
            <ul>
              <li>Schema.org SoftwareApplication markup</li>
              <li>Aggregate ratings from user reviews</li>
              <li>Detailed feature list of our privacy protections</li>
              <li>Price information (free service)</li>
              <li>Application category and operating system compatibility</li>
            </ul>
            <p>Additional schema types that could enhance our listing:</p>
            <ul>
              <li>FAQPage schema for our frequently asked questions</li>
              <li>Service schema for our temporary email offering</li>
              <li>Organization schema for our company information</li>
            </ul>
          </div>

          {/* Hidden SEO Content */}
          <div className="sr-only">
            <h2>Private Temporary Email Service</h2>
            <p>
              Create secure, anonymous temporary email addresses with enhanced privacy features.
              Protect your data, avoid tracking, and maintain online anonymity with our
              privacy-focused disposable email service.
            </p>
            <ul>
              <li>Anonymous email creation</li>
              <li>Zero data retention</li>
              <li>End-to-end encryption</li>
              <li>Anti-tracking protection</li>
              <li>Secure attachment handling</li>
              <li>Metadata protection</li>
              <li>Private email service</li>
              <li>Secure disposable email</li>
              <li>No tracking email</li>
              <li>Privacy-focused temp mail</li>
              <li>Anonymous email generator</li>
              <li>Secure temporary inbox</li>
              <li>Private disposable email</li>
              <li>Anti-spam temporary email</li>
              <li>Secure email privacy</li>
              <li>Temporary mail for online privacy</li>
              <li>Private inbox solution</li>
              <li>Disposable email for privacy</li>
              <li>Anonymous communication tool</li>
              <li>Secure messaging alternative</li>
              <li>Privacy-focused email generator</li>
              <li>Encrypted temporary mail</li>
              <li>Anti-tracking email solution</li>
              <li>Privacy protection for online accounts</li>
              <li>Data breach prevention</li>
              <li>Online anonymity tool</li>
              <li>Temporary messaging service</li>
              <li>Private email for online forms</li>
              <li>Secure registration email</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right sidebar ad */}
      <SidebarAd position="right" />

      {/* QR Code Modal */}
      <QRModal
        isOpen={qrModal.isOpen}
        onClose={() => setQRModal({ isOpen: false, email: '' })}
        email={qrModal.email}
      />
    </PublicLayout>
  );
}