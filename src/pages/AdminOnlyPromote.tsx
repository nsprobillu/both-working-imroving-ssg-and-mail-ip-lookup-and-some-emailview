import React, { useState, useEffect } from 'react';
import {
  Mail, Search, Filter, Shield, Send, X, AlertTriangle,
  RefreshCw, Check, Settings, Users, Clock, Calendar,
  ChevronDown, ChevronUp, Download, Share2, Star, ChevronLeft, ChevronRight
} from 'lucide-react';
import axios, { AxiosError } from 'axios';

// Add declaration for import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
      VITE_ADMIN_PASSPHRASE: string;
    };
  }
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_login: string | null;
  email_count: number;
  received_email_count: number;
  custom_domain_count: number;
}

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  max_daily_emails?: number;
}

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function AdminOnlyPromote() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [throttleDelay, setThrottleDelay] = useState(300);
  const [requestTimeout, setRequestTimeout] = useState(0);
  
  // Time tracking states
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Advanced Filters
  const [filters, setFilters] = useState({
    emailCountMin: '',
    emailCountMax: '',
    dateStart: '',
    dateEnd: '',
    isActive: '',
    inactiveDays: '',
    neverLoggedIn: false,
    hasCustomDomain: '',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Multiple SMTP Settings
  const [smtpAccounts, setSmtpAccounts] = useState<SMTPSettings[]>([{
    host: '',
    port: 587,
    username: '',
    password: '',
    from_email: '',
    from_name: '',
    max_daily_emails: 300
  }]);
  const [currentSmtpIndex, setCurrentSmtpIndex] = useState(0);
  
  // External email recipients
  const [externalEmails, setExternalEmails] = useState('');
  const [includeExternalEmails, setIncludeExternalEmails] = useState(false);
  
  // Email Content
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: ''
  });

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('adminAuth');
      const adminPassphrase = import.meta.env.VITE_ADMIN_PASSPHRASE || '';
      if (storedAuth === adminPassphrase) {
        setIsAuthorized(true);
        fetchAllUsers();
      }
    } catch (error) {
      console.error('Error during authorization check:', error);
      setError('Failed to check authorization');
    }
  }, []);

  // Apply filtering locally
  useEffect(() => {
    filterUsers();
  }, [searchTerm, filters, allUsers]);

  const filterUsers = () => {
    if (!allUsers.length) return;
    
    let filteredUsers = [...allUsers];
    
    // Apply search term
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply min email count
    if (filters.emailCountMin) {
      filteredUsers = filteredUsers.filter(user => 
        user.email_count >= parseInt(filters.emailCountMin)
      );
    }
    
    // Apply max email count
    if (filters.emailCountMax) {
      filteredUsers = filteredUsers.filter(user => 
        user.email_count <= parseInt(filters.emailCountMax)
      );
    }
    
    // Apply date filters
    if (filters.dateStart) {
      const startDate = new Date(filters.dateStart);
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.created_at) >= startDate
      );
    }
    
    if (filters.dateEnd) {
      const endDate = new Date(filters.dateEnd);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filteredUsers = filteredUsers.filter(user => 
        new Date(user.created_at) <= endDate
      );
    }
    
    // Apply never logged in filter
    if (filters.neverLoggedIn) {
      filteredUsers = filteredUsers.filter(user => !user.last_login);
    } 
    // Apply inactive days filter
    else if (filters.inactiveDays && parseInt(filters.inactiveDays) > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(filters.inactiveDays));
      
      filteredUsers = filteredUsers.filter(user => 
        !user.last_login || new Date(user.last_login) < cutoffDate
      );
    }
    // Apply active status based on 7-day period
    else if (filters.isActive === 'true') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filteredUsers = filteredUsers.filter(user => 
        user.last_login && new Date(user.last_login) >= sevenDaysAgo
      );
    } else if (filters.isActive === 'false') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filteredUsers = filteredUsers.filter(user => 
        !user.last_login || new Date(user.last_login) < sevenDaysAgo
      );
    }
    
    // Apply custom domain filter
    if (filters.hasCustomDomain === 'true') {
      filteredUsers = filteredUsers.filter(user => user.custom_domain_count > 0);
    } else if (filters.hasCustomDomain === 'false') {
      filteredUsers = filteredUsers.filter(user => user.custom_domain_count === 0);
    }
    
    // Apply sorting
    filteredUsers.sort((a, b) => {
      if (filters.sortBy === 'created_at') {
        return filters.sortOrder === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'last_login') {
        const aTime = a.last_login ? new Date(a.last_login).getTime() : 0;
        const bTime = b.last_login ? new Date(b.last_login).getTime() : 0;
        return filters.sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
      } else if (filters.sortBy === 'email_count') {
        return filters.sortOrder === 'desc'
          ? b.email_count - a.email_count
          : a.email_count - b.email_count;
      }
      return 0;
    });
    
    setUsers(filteredUsers);
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const adminPassphrase = import.meta.env.VITE_ADMIN_PASSPHRASE || '';
      
      // Attempt to get user count first to determine best fetching strategy
      const countResponse = await axios.get(
        `${apiUrl}/emails/admin/users`,
        {
          headers: { 'Admin-Access': adminPassphrase },
          params: {
            limit: 1,
            countOnly: true
          }
        }
      );
      
      const totalUserCount = countResponse.data?.metadata?.total || 0;
      console.log(`Total users to fetch: ${totalUserCount}`);
      
      if (totalUserCount === 0) {
        setAllUsers([]);
        setUsers([]);
        setIsLoading(false);
        return;
      }
      
      // If total count is manageable, try a single large request
      if (totalUserCount <= 2000) {
        try {
          const response = await axios.get(
            `${apiUrl}/emails/admin/users`,
            {
              headers: { 'Admin-Access': adminPassphrase },
              params: {
                limit: totalUserCount,
                page: 1
              }
            }
          );

          if (response.data && response.data.data) {
            setAllUsers(response.data.data);
            setUsers(response.data.data);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.log("Error with large request, will use paginated approach", err);
        }
      }
      
      // For large user bases, use parallel fetching with optimal page size
      // Determine optimal settings
      const CONCURRENT_REQUESTS = 5; // Number of parallel requests
      const PAGE_SIZE = 500; // Users per page - adjust based on API performance
      
      // Calculate total pages
      const totalPages = Math.ceil(totalUserCount / PAGE_SIZE);
      console.log(`Fetching ${totalUserCount} users with ${totalPages} pages in parallel`);
      
      // Create batches of page numbers to fetch in parallel
      let allFetchedUsers: User[] = [];
      
      // Process pages in batches to avoid overwhelming the server
      for (let startPage = 1; startPage <= totalPages; startPage += CONCURRENT_REQUESTS) {
        const pagesToFetch = [];
        for (let i = 0; i < CONCURRENT_REQUESTS && startPage + i <= totalPages; i++) {
          pagesToFetch.push(startPage + i);
        }
        
        console.log(`Fetching pages ${pagesToFetch.join(', ')}`);
        
        // Fetch pages in parallel
        const pageResults = await Promise.all(
          pagesToFetch.map(page => 
            axios.get(`${apiUrl}/emails/admin/users`, {
              headers: { 'Admin-Access': adminPassphrase },
              params: {
                page,
                limit: PAGE_SIZE
              }
            })
          )
        );
        
        // Combine results
        for (const response of pageResults) {
          if (response.data && response.data.data) {
            allFetchedUsers = [...allFetchedUsers, ...response.data.data];
          }
        }
        
        // Update progress by showing partial results
        if (allFetchedUsers.length > 0) {
          setAllUsers(allFetchedUsers);
          setUsers(allFetchedUsers);
        }
      }
      
      console.log(`Successfully fetched ${allFetchedUsers.length} users`);
      setAllUsers(allFetchedUsers);
      setUsers(allFetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      const axiosError = error as AxiosError;
      setError(axiosError.response?.data?.error as string || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adminPassphrase = import.meta.env.VITE_ADMIN_PASSPHRASE || '';
      if (passphrase === adminPassphrase) {
        sessionStorage.setItem('adminAuth', passphrase);
        setIsAuthorized(true);
        fetchAllUsers();
      } else {
        setError('Invalid passphrase');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Authentication failed');
    }
  };

  const handleSendEmails = async () => {
    // Prepare recipients data
    let selectedUserIds: string[] = [];
    let externalEmailsList: string[] = [];
    
    // Clear previous messages when starting a new send
    setError('');
    setSuccess('');
    
    // Add selected users
    if (selectedUsers.size > 0) {
      selectedUserIds = Array.from(selectedUsers);
    }
    
    // Add external emails if enabled
    if (includeExternalEmails && externalEmails.trim()) {
      externalEmailsList = externalEmails
        .split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email && /\S+@\S+\.\S+/.test(email));
    }
    
    if (selectedUserIds.length === 0 && externalEmailsList.length === 0) {
      setError('Please select at least one recipient or add external emails');
      return;
    }

    if (!emailContent.subject || !emailContent.body) {
      setError('Please provide both subject and body for the email');
      return;
    }

    if (smtpAccounts.length === 0 || 
        !smtpAccounts.some(smtp => 
          smtp.host && smtp.username && smtp.password && smtp.from_email
        )) {
      setError('Please provide at least one complete SMTP configuration');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      // Start the timer
      const start = Date.now();
      setStartTime(start);
      setElapsedTime(0);
      
      // Calculate estimated total time based on recipient count and throttle delay
      const estimatedTime = calculateEstimatedTime();
      setEstimatedTotalTime(estimatedTime);
      
      // Set up interval to update elapsed time
      const interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Date.now() - startTime);
        }
      }, 1000);
      setTimerInterval(interval);
      
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const adminPassphrase = import.meta.env.VITE_ADMIN_PASSPHRASE || '';
      
      // Filter valid SMTP accounts
      const validSmtpAccounts = smtpAccounts.filter(
        smtp => smtp.host && smtp.username && smtp.password && smtp.from_email
      );
      
      if (validSmtpAccounts.length === 0) {
        throw new Error('No valid SMTP accounts available');
      }
      
      let totalSucceeded = 0;
      let totalFailed = 0;
      
      // If we have multiple SMTP accounts, distribute the load
      if (validSmtpAccounts.length > 1) {
        // Process selected users
        if (selectedUserIds.length > 0) {
          const userIdGroups = distributeUserIds(selectedUserIds, validSmtpAccounts);
          
          for (let i = 0; i < validSmtpAccounts.length; i++) {
            if (userIdGroups[i].length === 0) continue;
            
            const response = await axios.post(
              `${apiUrl}/emails/admin/bulk-send`,
              {
                userIds: userIdGroups[i],
                email: emailContent,
                smtp: validSmtpAccounts[i],
                throttleDelay: throttleDelay,
              },
              {
                headers: {
                  'Admin-Access': adminPassphrase
                },
                ...(requestTimeout > 0 ? { timeout: requestTimeout } : {}) // Only set timeout if greater than 0
              }
            );
            
            totalSucceeded += response.data.succeeded || 0;
            totalFailed += response.data.failed || 0;
          }
        }
        
        // Process external emails
        if (externalEmailsList.length > 0) {
          const externalEmailGroups = distributeEmails(externalEmailsList, validSmtpAccounts);
          
          for (let i = 0; i < validSmtpAccounts.length; i++) {
            if (externalEmailGroups[i].length === 0) continue;
            
            const response = await axios.post(
              `${apiUrl}/emails/admin/bulk-send-external`,
              {
                emails: externalEmailGroups[i],
                email: emailContent,
                smtp: validSmtpAccounts[i],
                throttleDelay: throttleDelay,
              },
              {
                headers: {
                  'Admin-Access': adminPassphrase
                },
                ...(requestTimeout > 0 ? { timeout: requestTimeout } : {}) // Only set timeout if greater than 0
              }
            );
            
            totalSucceeded += response.data.succeeded || 0;
            totalFailed += response.data.failed || 0;
          }
        }
      } else {
        // Single SMTP account - use existing API endpoints
        // Send to selected users
        if (selectedUserIds.length > 0) {
          const response = await axios.post(
            `${apiUrl}/emails/admin/bulk-send`,
            {
              userIds: selectedUserIds,
              email: emailContent,
              smtp: validSmtpAccounts[0],
              throttleDelay: throttleDelay,
            },
            {
              headers: {
                'Admin-Access': adminPassphrase
              },
              ...(requestTimeout > 0 ? { timeout: requestTimeout } : {}) // Only set timeout if greater than 0
            }
          );
          
          totalSucceeded += response.data.succeeded || 0;
          totalFailed += response.data.failed || 0;
        }
        
        // Send to external emails
        if (externalEmailsList.length > 0) {
          const response = await axios.post(
            `${apiUrl}/emails/admin/bulk-send-external`,
            {
              emails: externalEmailsList,
              email: emailContent,
              smtp: validSmtpAccounts[0],
              throttleDelay: throttleDelay,
            },
            {
              headers: {
                'Admin-Access': adminPassphrase
              },
              ...(requestTimeout > 0 ? { timeout: requestTimeout } : {}) // Only set timeout if greater than 0
            }
          );
          
          totalSucceeded += response.data.succeeded || 0;
          totalFailed += response.data.failed || 0;
        }
      }

      // Clear timer on success
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setStartTime(null);
      
      // Use the already calculated totalRecipients
      setSuccess(`Successfully sent emails to ${totalSucceeded} recipients. ${totalSucceeded} succeeded, ${totalFailed} failed.`);
      
      // Clear all inputs after successful send
      setSelectedUsers(new Set());
      setExternalEmails('');
      // Create a fresh object for email content to ensure state update
      setEmailContent({ 
        subject: '', 
        body: '' 
      });
    } catch (error) {
      // Clear timer on error
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setStartTime(null);
      
      console.error('Failed to send emails:', error);
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data?.error as string || 
                          (error as Error).message || 
                          'Failed to send emails';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to distribute user IDs across SMTP accounts
  const distributeUserIds = (userIds: string[], smtpAccounts: SMTPSettings[]) => {
    const result: string[][] = Array(smtpAccounts.length).fill(null).map(() => []);
    
    // Calculate total send capacity
    const totalDailyCapacity = smtpAccounts.reduce(
      (sum, account) => sum + (account.max_daily_emails || 300), 0
    );
    
    // If recipients exceed capacity, distribute proportionally
    if (userIds.length <= totalDailyCapacity) {
      // We can send all emails, distribute optimally
      let currentAccountIndex = 0;
      
      for (const userId of userIds) {
        // Find next account with capacity
        while (
          result[currentAccountIndex].length >= (smtpAccounts[currentAccountIndex].max_daily_emails || 300) &&
          currentAccountIndex < smtpAccounts.length - 1
        ) {
          currentAccountIndex++;
        }
        
        result[currentAccountIndex].push(userId);
        
        // If we've filled this account, move to next
        if (result[currentAccountIndex].length >= (smtpAccounts[currentAccountIndex].max_daily_emails || 300)) {
          currentAccountIndex++;
          
          // If we've run out of accounts, cycle back to the beginning
          if (currentAccountIndex >= smtpAccounts.length) {
            currentAccountIndex = 0;
          }
        }
      }
    } else {
      // We can't send all emails in one day, distribute proportionally
      for (let i = 0; i < smtpAccounts.length; i++) {
        const maxEmails = smtpAccounts[i].max_daily_emails || 300;
        const proportion = maxEmails / totalDailyCapacity;
        const emailCount = Math.min(
          Math.floor(userIds.length * proportion),
          maxEmails
        );
        
        result[i] = userIds.slice(0, emailCount);
        userIds = userIds.slice(emailCount);
        
        if (userIds.length === 0) break;
      }
    }
    
    return result;
  };

  // Helper function to distribute external emails across SMTP accounts
  const distributeEmails = (emails: string[], smtpAccounts: SMTPSettings[]) => {
    const result: string[][] = Array(smtpAccounts.length).fill(null).map(() => []);
    
    // Calculate total send capacity
    const totalDailyCapacity = smtpAccounts.reduce(
      (sum, account) => sum + (account.max_daily_emails || 300), 0
    );
    
    // If recipients exceed capacity, distribute proportionally
    if (emails.length <= totalDailyCapacity) {
      // We can send all emails, distribute optimally
      let currentAccountIndex = 0;
      
      for (const email of emails) {
        // Find next account with capacity
        while (
          result[currentAccountIndex].length >= (smtpAccounts[currentAccountIndex].max_daily_emails || 300) &&
          currentAccountIndex < smtpAccounts.length - 1
        ) {
          currentAccountIndex++;
        }
        
        result[currentAccountIndex].push(email);
        
        // If we've filled this account, move to next
        if (result[currentAccountIndex].length >= (smtpAccounts[currentAccountIndex].max_daily_emails || 300)) {
          currentAccountIndex++;
          
          // If we've run out of accounts, cycle back to the beginning
          if (currentAccountIndex >= smtpAccounts.length) {
            currentAccountIndex = 0;
          }
        }
      }
    } else {
      // We can't send all emails in one day, distribute proportionally
      for (let i = 0; i < smtpAccounts.length; i++) {
        const maxEmails = smtpAccounts[i].max_daily_emails || 300;
        const proportion = maxEmails / totalDailyCapacity;
        const emailCount = Math.min(
          Math.floor(emails.length * proportion),
          maxEmails
        );
        
        result[i] = emails.slice(0, emailCount);
        emails = emails.slice(emailCount);
        
        if (emails.length === 0) break;
      }
    }
    
    return result;
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  const handleExportUsers = () => {
    const csv = [
      ['Email', 'Created At', 'Last Login', 'Email Count', 'Received Emails', 'Custom Domains'],
      ...users.map(user => [
        user.email,
        new Date(user.created_at).toLocaleString(),
        user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
        user.email_count,
        user.received_email_count,
        user.custom_domain_count
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setFilters({
      emailCountMin: '',
      emailCountMax: '',
      dateStart: '',
      dateEnd: '',
      isActive: '',
      inactiveDays: '',
      neverLoggedIn: false,
      hasCustomDomain: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  // Add a new SMTP account
  const addSmtpAccount = () => {
    setSmtpAccounts([
      ...smtpAccounts,
      {
        host: '',
        port: 587,
        username: '',
        password: '',
        from_email: '',
        from_name: '',
        max_daily_emails: 300
      }
    ]);
    setCurrentSmtpIndex(smtpAccounts.length);
  };
  
  // Remove an SMTP account
  const removeSmtpAccount = (index: number) => {
    if (smtpAccounts.length <= 1) {
      return; // Keep at least one account
    }
    
    const newAccounts = [...smtpAccounts];
    newAccounts.splice(index, 1);
    setSmtpAccounts(newAccounts);
    
    if (currentSmtpIndex >= newAccounts.length) {
      setCurrentSmtpIndex(newAccounts.length - 1);
    }
  };
  
  // Update current SMTP account
  const updateCurrentSmtp = (field: keyof SMTPSettings, value: string | number) => {
    const newAccounts = [...smtpAccounts];
    newAccounts[currentSmtpIndex] = {
      ...newAccounts[currentSmtpIndex],
      [field]: value
    };
    setSmtpAccounts(newAccounts);
  };

  // Format time in minutes and seconds
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Calculate estimated time based on current selections
  const calculateEstimatedTime = () => {
    const totalRecipients = selectedUsers.size + 
      (includeExternalEmails && externalEmails
        ? externalEmails
            .split(/[,;\n]/)
            .map(e => e.trim())
            .filter(e => e && /\S+@\S+\.\S+/.test(e)).length
        : 0);
    
    return totalRecipients * throttleDelay;
  };
  
  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Access Required
          </h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter passphrase"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-colors"
          >
            Access Admin Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">User Management & Bulk Email</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportUsers}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Users
            </button>
            <button
              onClick={() => fetchAllUsers()}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Selection Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Select Recipients
            </h2>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {showFilters && (
                <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Min Email Count</label>
                      <input
                        type="number"
                        value={filters.emailCountMin}
                        onChange={(e) => setFilters({
                          ...filters,
                          emailCountMin: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Max Email Count</label>
                      <input
                        type="number"
                        value={filters.emailCountMax}
                        onChange={(e) => setFilters({
                          ...filters,
                          emailCountMax: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Start Date</label>
                      <input
                        type="date"
                        value={filters.dateStart}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateStart: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">End Date</label>
                      <input
                        type="date"
                        value={filters.dateEnd}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateEnd: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Activity Status</label>
                      <select
                        value={filters.isActive}
                        onChange={(e) => setFilters({
                          ...filters,
                          isActive: e.target.value,
                          // Reset conflicting filters
                          inactiveDays: '',
                          neverLoggedIn: false
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        disabled={filters.neverLoggedIn || !!filters.inactiveDays}
                      >
                        <option value="">All Users</option>
                        <option value="true">Active Users (last 7 days)</option>
                        <option value="false">Inactive Users (7+ days)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Inactive For (days)</label>
                      <input
                        type="number"
                        value={filters.inactiveDays}
                        onChange={(e) => setFilters({
                          ...filters,
                          inactiveDays: e.target.value,
                          // Reset conflicting filters
                          isActive: '',
                          neverLoggedIn: false
                        })}
                        placeholder="e.g. 30 for users inactive for 30 days"
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                        min="1"
                        disabled={filters.neverLoggedIn || !!filters.isActive}
                      />
                    </div>

                    <div className="flex items-center col-span-2">
                      <input
                        type="checkbox"
                        id="neverLoggedIn"
                        checked={filters.neverLoggedIn}
                        onChange={(e) => setFilters({
                          ...filters,
                          neverLoggedIn: e.target.checked,
                          // Reset conflicting filters
                          isActive: '',
                          inactiveDays: ''
                        })}
                        className="mr-2"
                        disabled={!!filters.isActive || !!filters.inactiveDays}
                      />
                      <label htmlFor="neverLoggedIn" className="text-sm cursor-pointer">
                        Never logged in users only
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Custom Domain</label>
                      <select
                        value={filters.hasCustomDomain}
                        onChange={(e) => setFilters({
                          ...filters,
                          hasCustomDomain: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      >
                        <option value="">All Users</option>
                        <option value="true">With Custom Domain</option>
                        <option value="false">Without Custom Domain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Sort By</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({
                          ...filters,
                          sortBy: e.target.value
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      >
                        <option value="created_at">Registration Date</option>
                        <option value="last_login">Last Login</option>
                        <option value="email_count">Email Count</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Sort Order</label>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters({
                          ...filters,
                          sortOrder: e.target.value as 'asc' | 'desc'
                        })}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {selectedUsers.size === users.length ? 'Deselect All' : 'Select All'}
              </button>
              <div className="text-sm text-gray-400 flex items-center">
                <span className="mr-4">{selectedUsers.size} users selected</span>
                <span>{users.length} users shown</span>
                {users.length !== allUsers.length && (
                  <span className="ml-4 text-yellow-400">
                    (filtered from {allUsers.length})
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto border border-gray-700 rounded-lg">
              {users.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center p-4 hover:bg-gray-700 border-b border-gray-700 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedUsers);
                      if (newSelected.has(user.id)) {
                        newSelected.delete(user.id);
                      } else {
                        newSelected.add(user.id);
                      }
                      setSelectedUsers(newSelected);
                    }}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.email}</span>
                      <div className="flex items-center space-x-2">
                        {user.custom_domain_count > 0 && (
                          <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                            {user.custom_domain_count} Domains
                          </span>
                        )}
                        <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                          {user.email_count} Emails
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                      <Clock className="w-4 h-4 ml-4 mr-1" />
                      Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>

            {/* User count summary */}
            <div className="mt-4 text-sm text-gray-400">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading users...
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Total users: {allUsers.length}</span>
                  {users.length !== allUsers.length && (
                    <span>Filtered users: {users.length}</span>
                  )}
                </div>
              )}
            </div>

            {/* External Email Recipients */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">External Recipients</h3>
                <label className="flex items-center text-sm">
                  <input 
                    type="checkbox" 
                    checked={includeExternalEmails}
                    onChange={(e) => setIncludeExternalEmails(e.target.checked)}
                    className="mr-2"
                  />
                  Include external emails
                </label>
              </div>
              
              <textarea
                value={externalEmails}
                onChange={(e) => setExternalEmails(e.target.value)}
                placeholder="Enter email addresses separated by commas, semicolons, or new lines"
                className={`w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 h-24 transition-opacity ${includeExternalEmails ? 'opacity-100' : 'opacity-50'}`}
                disabled={!includeExternalEmails}
              />
              
              {includeExternalEmails && externalEmails && (
                <div className="mt-2 text-sm text-gray-400">
                  {externalEmails
                    .split(/[,;\n]/)
                    .map(e => e.trim())
                    .filter(e => e && /\S+@\S+\.\S+/.test(e)).length} external email(s)
                </div>
              )}
            </div>
          </div>

          {/* Email Composition Panel */}
          <div className="space-y-8">
            {/* SMTP Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  SMTP Settings
                </h2>
                
                <div className="flex space-x-2">
                  <button
                    onClick={addSmtpAccount}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    + Add Account
                  </button>
                </div>
              </div>
              
              {/* SMTP Account Tabs */}
              <div className="mb-4 flex flex-wrap items-center border-b border-gray-700">
                {smtpAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSmtpIndex(index)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center ${
                      index === currentSmtpIndex
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    Account {index + 1}
                    {index > 0 && (
                      <X
                        className="ml-2 w-3 h-3 hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSmtpAccount(index);
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpAccounts[currentSmtpIndex]?.host || ''}
                    onChange={(e) => updateCurrentSmtp('host', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    placeholder="smtp.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpAccounts[currentSmtpIndex]?.port || 587}
                    onChange={(e) => updateCurrentSmtp('port', parseInt(e.target.value) || 587)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={smtpAccounts[currentSmtpIndex]?.username || ''}
                    onChange={(e) => updateCurrentSmtp('username', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={smtpAccounts[currentSmtpIndex]?.password || ''}
                    onChange={(e) => updateCurrentSmtp('password', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">From Email</label>
                  <input
                    type="email"
                    value={smtpAccounts[currentSmtpIndex]?.from_email || ''}
                    onChange={(e) => updateCurrentSmtp('from_email', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">From Name</label>
                  <input
                    type="text"
                    value={smtpAccounts[currentSmtpIndex]?.from_name || ''}
                    onChange={(e) => updateCurrentSmtp('from_name', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Daily Email Limit</label>
                  <input
                    type="number"
                    value={smtpAccounts[currentSmtpIndex]?.max_daily_emails || 300}
                    onChange={(e) => updateCurrentSmtp('max_daily_emails', parseInt(e.target.value) || 300)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Throttle Delay Control */}
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <label className="flex items-center justify-between text-sm mb-2">
                  <span>Throttle Delay Between Emails (ms)</span>
                  <span className="text-gray-400 text-xs">Recommended: 300ms or higher</span>
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={throttleDelay}
                    onChange={(e) => setThrottleDelay(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={throttleDelay}
                    onChange={(e) => setThrottleDelay(parseInt(e.target.value) || 300)}
                    className="w-20 bg-gray-600 text-white px-2 py-1 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Higher values reduce server load and improve delivery success, but increase total sending time.
                </p>
              </div>
              
              {/* Request Timeout Control */}
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <label className="flex items-center justify-between text-sm mb-2">
                  <span>Request Timeout (seconds)</span>
                  <span className="text-gray-400 text-xs">0 = No timeout</span>
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    value={requestTimeout}
                    onChange={(e) => setRequestTimeout(parseInt(e.target.value))}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
                  >
                    <option value="0">No timeout</option>
                    <option value="300000">5 minutes</option>
                    <option value="600000">10 minutes</option>
                    <option value="1800000">30 minutes</option>
                    <option value="3600000">1 hour</option>
                    <option value="7200000">2 hours</option>
                    <option value="10800000">3 hours</option>
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  For large batches, set a longer timeout or disable timeout completely. 
                  Be aware that browser or server limitations may still apply.
                </p>
              </div>
              
              {/* SMTP Summary */}
              <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
                <p>
                  <span className="text-gray-400">Total SMTP Accounts:</span>{' '}
                  <span className="font-medium">{smtpAccounts.length}</span>
                </p>
                <p>
                  <span className="text-gray-400">Total Daily Capacity:</span>{' '}
                  <span className="font-medium">
                    {smtpAccounts.reduce((sum, account) => sum + (account.max_daily_emails || 300), 0)} emails
                  </span>
                </p>
              </div>
            </div>

            {/* Email Content */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Content
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    value={emailContent.subject}
                    onChange={(e) => setEmailContent({
                      ...emailContent,
                      subject: e.target.value
                    })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Body (HTML Supported)</label>
                  <textarea
                    value={emailContent.body}
                    onChange={(e) => setEmailContent({
                      ...emailContent,
                      body: e.target.value
                    })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    rows={10}
                    placeholder="<p>Your HTML content here...</p>"
                  />
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendEmails}
              disabled={isLoading || (selectedUsers.size === 0 && !(includeExternalEmails && externalEmails.trim()))}
              className="w-full bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Email
                </>
              )}
            </button>
            
            {/* Time Estimation - Show before sending */}
            {!isLoading && (selectedUsers.size > 0 || (includeExternalEmails && externalEmails.trim())) && (
              <div className="mt-4 bg-gray-800/70 border border-gray-700 p-3 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estimated Time:</span>
                  <span className="font-mono text-white">{formatTime(calculateEstimatedTime())}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Based on {selectedUsers.size + 
                    (includeExternalEmails && externalEmails
                      ? externalEmails
                          .split(/[,;\n]/)
                          .map(e => e.trim())
                          .filter(e => e && /\S+@\S+\.\S+/.test(e)).length
                      : 0)} recipients with {throttleDelay}ms delay.
                </p>
              </div>
            )}
            
            {/* Time tracking UI - Only show when emails are being sent */}
            {isLoading && startTime && (
              <div className="mt-4 bg-blue-900/20 border border-blue-800 text-blue-300 p-4 rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span>Elapsed Time:</span>
                    <span className="font-mono">{formatTime(elapsedTime)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Estimated Total Time:</span>
                    <span className="font-mono">{formatTime(estimatedTotalTime)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Estimated Remaining:</span>
                    <span className="font-mono">
                      {formatTime(Math.max(0, estimatedTotalTime - elapsedTime))}
                    </span>
                  </div>
                  
                  <div className="w-full bg-blue-900/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-200" 
                      style={{ 
                        width: `${Math.min(100, (elapsedTime / estimatedTotalTime) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-blue-400 mt-2">
                    These are estimates based on your throttle delay setting. Actual time may vary.
                  </p>
                </div>
              </div>
            )}
            
            {/* Recipient Summary */}
            <div className="bg-gray-800/50 p-4 rounded text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Selected Users:</span>
                <span className="font-medium">{selectedUsers.size}</span>
              </div>
              {includeExternalEmails && externalEmails && (
                <div className="flex items-center justify-between mt-1">
                  <span>External Recipients:</span>
                  <span className="font-medium">
                    {externalEmails
                      .split(/[,;\n]/)
                      .map(e => e.trim())
                      .filter(e => e && /\S+@\S+\.\S+/.test(e)).length}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between mt-1 text-white font-medium">
                <span>Total Recipients:</span>
                <span>
                  {selectedUsers.size + 
                   (includeExternalEmails && externalEmails
                     ? externalEmails
                         .split(/[,;\n]/)
                         .map(e => e.trim())
                         .filter(e => e && /\S+@\S+\.\S+/.test(e)).length
                     : 0)
                  }
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span>SMTP Daily Capacity:</span>
                  <span className="font-medium">
                    {smtpAccounts.reduce((sum, account) => sum + (account.max_daily_emails || 300), 0)} emails
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}