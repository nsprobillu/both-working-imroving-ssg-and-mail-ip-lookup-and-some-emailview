import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get frontend URL from environment variable
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'https://boomlify.com';

// Define all routes to prerender
const routes = [
  '/',
  '/features',
  '/benefits',
  '/how-it-works',
  '/temp-mail-advanced',
  '/temp-mail-instant',
  '/temp-mail-privacy',
  '/temp-mail-pro',
  '/pricing',
  '/faq',
  '/blog',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/cookie-policy',
  '/cookies',
  '/gdpr',
  '/about',
  '/contact',
  '/support',
  '/careers',
  '/demo'
];

// SEO metadata for each route with enhanced fields
const seoMetadata = {
  '/': {
    title: 'Boomlify - Free Long-Term Temporary Email Service | Privacy & Security',
    description: 'Generate free temporary email addresses instantly with Boomlify. Valid for 48 hours, extendable to 2+ months. No registration needed. Protect your privacy, block spam, stay anonymous online, and enjoy secure communication with our reliable temp mail service.',
    keywords: 'temporary email, disposable email, temp mail, tempmail, temp email address, anonymous email, throwaway email, fake email, temporary inbox, disposable inbox, privacy protection, spam prevention, email security, free email service, long-term temp mail, instant email generator, secure temp mail, email privacy tool, online anonymity, no-signup email, temporary email solution, anti-spam email, email burner, privacy-first email, Boomlify email',
    twitterTitle: 'Boomlify - Free Long-Term Temp Email for Privacy & Security',
    twitterDescription: 'Create free temp emails with Boomlify—valid for 2+ months! Protect privacy, block spam, and stay secure online.',
    ogTitle: 'Boomlify - Free Temporary Email Service with Long-Term Validity',
    ogDescription: 'Instantly generate free temporary emails with Boomlify. Extendable up to 2+ months, no signup needed—perfect for privacy, spam protection, and secure online use.',
    ogImage: `${FRONTEND_URL}/home-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/home-twitter-image.jpg`,
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Boomlify Temporary Email Generator",
      "applicationCategory": "Email Service",
      "description": "Generate free temporary email addresses instantly with Boomlify. Valid for 48 hours, extendable up to 2+ months. No registration required—ideal for privacy protection, spam prevention, and secure online communication.",
      "operatingSystem": "All",
      "url": FRONTEND_URL,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Instant email generation",
        "48-hour base validity",
        "Extendable up to 2+ months",
        "No registration required",
        "Spam protection",
        "Real-time email updates",
        "Multiple domain options",
        "Privacy-first design",
        "Anti-spam technology",
        "User-friendly interface"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1200"
      }
    },
    canonical: `${FRONTEND_URL}/`
  },
  '/features': {
    title: 'Features - Boomlify Temp Email Service | Instant, Secure, Private',
    description: "Discover Boomlify\'s advanced features: instant temporary email creation, robust spam protection, extended validity up to 2+ months, multiple domain choices, real-time updates, and top-tier privacy tools. Perfect for secure, private online communication.",
    keywords: 'email features, temp mail features, disposable email features, email privacy, spam protection, temporary email validity, instant email, secure email, private email, email domains, real-time updates, Boomlify features, advanced temp mail, email security tools, privacy-first email, disposable inbox benefits, temporary email advantages, no-signup email, anti-spam features, email generator perks',
    twitterTitle: 'Features - Boomlify Temp Email: Secure, Private, Instant',
    twitterDescription: 'Explore Boomlify\'s features: instant temp email, spam protection, 2+ month validity, and real-time updates for privacy.',
    ogTitle: 'Boomlify Features - Advanced Temporary Email Solutions',
    ogDescription: 'Boomlify offers instant email generation, spam protection, extended validity, multiple domains, and real-time updates—perfect for secure and private online use.',
    ogImage: `${FRONTEND_URL}/features-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/features-twitter-image.jpg`,
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Features - Boomlify Temporary Email Service",
      "description": "Discover Boomlify\'s powerful features: instant temporary email generation, spam protection, extended validity up to 2+ months, multiple domains, and real-time updates for secure and private communication.",
      "url": `${FRONTEND_URL}/features`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Instant Email Generation", "description": "Create temp emails in seconds" },
          { "@type": "ListItem", "position": 2, "name": "Spam Protection", "description": "Block unwanted emails effectively" },
          { "@type": "ListItem", "position": 3, "name": "Extended Validity", "description": "Emails valid up to 2+ months" },
          { "@type": "ListItem", "position": 4, "name": "Multiple Domain Options", "description": "Choose from various domains" },
          { "@type": "ListItem", "position": 5, "name": "Real-Time Updates", "description": "Receive emails instantly" }
        ]
      }
    },
    canonical: `${FRONTEND_URL}/features`
  },
  '/benefits': {
    title: 'Benefits - Boomlify Temp Email | Privacy, Security, Convenience',
    description: 'Unlock the benefits of Boomlify: superior privacy protection, advanced email security, effective spam prevention, unmatched convenience, and long-term temporary email options. Ideal for individuals, businesses, and privacy-conscious users seeking reliable solutions.',
    keywords: 'email benefits, temp mail benefits, disposable email benefits, email privacy, email security, temporary email advantages, privacy protection, spam prevention, convenience, temporary email for business, Boomlify benefits, secure temp mail, private email perks, anti-spam solutions, long-term email use, disposable inbox pros, email anonymity, user-friendly email, privacy-first tools, email efficiency',
    twitterTitle: 'Benefits - Boomlify: Privacy, Security, and Convenience',
    twitterDescription: 'Enjoy privacy, security, and convenience with Boomlify\'s long-term temp email service—perfect for all users.',
    ogTitle: 'Boomlify Benefits - Privacy and Security with Temp Email',
    ogDescription: 'Boomlify delivers privacy protection, email security, spam prevention, and convenience with long-term temporary email solutions for individuals and businesses.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Benefits - Boomlify Temporary Email Service",
      "description": "Unlock the advantages of Boomlify: superior privacy, advanced security, spam prevention, convenience, and long-term temporary email options for all users.",
      "url": `${FRONTEND_URL}/benefits`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Privacy Protection", "description": "Keep your identity safe" },
          { "@type": "ListItem", "position": 2, "name": "Advanced Security", "description": "Secure email handling" },
          { "@type": "ListItem", "position": 3, "name": "Spam Prevention", "description": "Block unwanted messages" },
          { "@type": "ListItem", "position": 4, "name": "Convenience", "description": "Easy-to-use service" },
          { "@type": "ListItem", "position": 5, "name": "Business-Friendly", "description": "Ideal for professional use" }
        ]
      }
    },
    canonical: `${FRONTEND_URL}/benefits`
  },
  '/how-it-works': {
    title: 'How It Works - Boomlify Temp Email | Simple, Fast, Secure Steps',
    description: 'See how Boomlify works: instantly generate temporary emails, use them for signups or privacy, extend validity up to 2+ months—all without registration. Start protecting your inbox with our fast, secure, and easy-to-use temp mail service today.',
    keywords: 'how temp mail works, email service process, temporary email guide, email generation, temporary email setup, Boomlify guide, instant email, privacy protection, spam prevention, email extension, disposable email tutorial, temp mail instructions, secure email process, private email steps, no-signup email, email creation tool, anti-spam email guide, temporary inbox how-to, Boomlify how it works, email privacy solution',
    twitterTitle: 'How It Works - Boomlify Temp Email: Fast and Secure',
    twitterDescription: 'Learn how Boomlify generates temp emails instantly—simple, fast, secure, and extendable up to 2+ months.',
    ogTitle: 'How Boomlify Works - Temporary Email Made Simple',
    ogDescription: 'Boomlify makes it easy: generate temp emails instantly, use them securely, and extend validity up to 2+ months—no signup needed.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Use Boomlify Temporary Email Service",
      "description": "Learn how to create and use temporary email addresses with Boomlify in simple, fast, and secure steps.",
      "url": `${FRONTEND_URL}/how-it-works`,
      "step": [
        { "@type": "HowToStep", "name": "Visit Boomlify", "text": "Go to our website and click the generate button" },
        { "@type": "HowToStep", "name": "Get Your Email", "text": "Receive a temporary email address instantly" },
        { "@type": "HowToStep", "name": "Use It Anywhere", "text": "Use your temp email for signups, verifications, or privacy" },
        { "@type": "HowToStep", "name": "Extend If Needed", "text": "Extend email validity up to 2+ months effortlessly" }
      ],
      "totalTime": "PT1M"
    },
    canonical: `${FRONTEND_URL}/how-it-works`
  },
  '/temp-mail-advanced': {
    title: "Advanced Temporary Email - Multiple Domains & Features | Boomlify",
    description: "Create advanced temporary emails with multiple domains, filtering, and real-time notifications. Free disposable email service with extended features.",
    keywords: "advanced temp mail, custom email domains, temporary email features, disposable email advanced, email filtering, real-time notifications, Boomlify advanced, secure temp email, privacy email tools, professional temp mail",
    twitterTitle: "Advanced Temp Email - Boomlify: Multiple Domains & Features",
    twitterDescription: "Create advanced temp emails with Boomlify—multiple domains, filtering, and real-time notifications for free.",
    ogTitle: "Boomlify Advanced Temp Email - Multiple Domains & Features",
    ogDescription: "Generate advanced temporary emails with Boomlify: multiple domains, filtering, real-time notifications, and more—free and secure.",
    ogImage: `${FRONTEND_URL}/advanced-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/advanced-twitter-image.jpg`,
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Boomlify Advanced Email Generator",
      "applicationCategory": "Email Service",
      "description": "Advanced temporary email service with multiple domains, filtering, and real-time notifications.",
      "url": `${FRONTEND_URL}/temp-mail-advanced`,
      "provider": {
        "@type": "Organization",
        "name": "Boomlify",
        "logo": {
          "@type": "ImageObject",
          "url": `${FRONTEND_URL}/logo.png`
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Multiple domain selection",
        "Advanced filtering",
        "Real-time notifications",
        "Email organization",
        "Attachment support"
      ],
      "datePublished": "2024-01-01",
      "dateModified": "2024-07-01"
    },
    canonical: `${FRONTEND_URL}/temp-mail-advanced`
  },
  '/temp-mail-instant': {
    title: "Free Temporary Email Generator - Create Instant Disposable Email | Boomlify",
    description: "Generate free temporary email addresses instantly. No registration required. Protect your privacy with disposable email addresses that last up to 48 hours.",
    keywords: "instant temp mail, free email generator, disposable email instant, temporary email no signup, privacy protection, spam prevention, Boomlify instant, secure temp email, quick email creation, anonymous email",
    twitterTitle: "Instant Temp Email - Boomlify: Free and Fast",
    twitterDescription: "Generate free temp emails instantly with Boomlify—no signup needed, lasts up to 48 hours.",
    ogTitle: "Boomlify Instant Temp Email - Free Disposable Email Generator",
    ogDescription: "Create free temporary emails instantly with Boomlify—no registration required, perfect for privacy and spam protection.",
    ogImage: `${FRONTEND_URL}/instant-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/instant-twitter-image.jpg`,
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Boomlify Temporary Email Generator",
      "applicationCategory": "Email Service",
      "description": "Generate free temporary email addresses instantly. No registration required. Protect your privacy with disposable email addresses that last up to 48 hours.",
      "url": `${FRONTEND_URL}/temp-mail-instant`,
      "provider": {
        "@type": "Organization",
        "name": "Boomlify",
        "logo": {
          "@type": "ImageObject",
          "url": `${FRONTEND_URL}/logo.png`
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1200",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Instant email generation",
        "48-hour validity",
        "No registration required",
        "Spam protection",
        "Real-time email updates"
      ],
      "datePublished": "2024-01-01",
      "dateModified": "2024-07-01"
    },
    canonical: `${FRONTEND_URL}/temp-mail-instant`
  },
  '/temp-mail-privacy': {
    title: "Private Temporary Email - Anonymous & Secure Disposable Email | Boomlify",
    description: "Create private temporary emails with enhanced security features. Stay anonymous online, protect your data, and avoid tracking with our secure disposable email service. Perfect for privacy-conscious users.",
    keywords: "private temp mail, secure email, anonymous email, privacy email, temporary email privacy, Boomlify privacy, encrypted temp mail, anti-tracking email, secure disposable email, privacy-first email",
    twitterTitle: "Private Temp Email - Boomlify: Anonymous & Secure",
    twitterDescription: "Stay anonymous with Boomlify's private temp email—enhanced security and privacy features.",
    ogTitle: "Boomlify Private Temp Email - Anonymous & Secure Service",
    ogDescription: "Create private temporary emails with Boomlify—stay anonymous, secure, and protected from tracking.",
    ogImage: `${FRONTEND_URL}/privacy-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/privacy-twitter-image.jpg`,
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Boomlify Private Email Generator",
      "serviceType": "Temporary Email Service",
      "description": "Private temporary email service with enhanced security and privacy features.",
      "url": `${FRONTEND_URL}/temp-mail-privacy`,
      "provider": {
        "@type": "Organization",
        "name": "Boomlify",
        "logo": {
          "@type": "ImageObject",
          "url": `${FRONTEND_URL}/logo.png`
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Zero data retention",
        "End-to-end encryption",
        "Anonymous email creation",
        "Anti-tracking protection",
        "Secure attachment handling"
      ],
      "datePublished": "2024-01-01",
      "dateModified": "2024-07-01"
    },
    canonical: `${FRONTEND_URL}/temp-mail-privacy`
  },
  '/temp-mail-pro': {
    title: 'Pro Temp Email - Boomlify | Premium Features for Businesses',
    description: 'Upgrade to Boomlify Pro for premium temporary email features: unlimited emails, custom domains, priority support, extended validity, and advanced privacy tools. Ideal for businesses, professionals, and power users needing top-tier disposable email solutions.',
    keywords: 'pro temp mail, premium email, temporary email pro, business email, temporary email upgrade, unlimited emails, custom domains, priority support, advanced privacy, Boomlify Pro, secure pro email, disposable email premium, private email pro, professional temp mail, long-term pro email, anti-spam pro, privacy-first pro, temp inbox business, Boomlify premium features, email security pro',
    twitterTitle: 'Pro Temp Email - Boomlify: Premium Business Features',
    twitterDescription: 'Boomlify Pro: unlimited temp emails, custom domains, priority support, and advanced privacy for businesses.',
    ogTitle: 'Boomlify Pro Temp Email - Premium Business Solutions',
    ogDescription: 'Boomlify Pro offers unlimited temporary emails, custom domains, priority support, and advanced privacy—perfect for businesses and professionals.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "applicationCategory": "Email Service",
      "name": "Pro Temporary Email - Boomlify",
      "description": "Boomlify Pro provides premium temporary email features: unlimited emails, custom domains, priority support, and advanced privacy for businesses and power users.",
      "url": `${FRONTEND_URL}/temp-mail-pro`,
      "provider": {
        "@type": "Organization",
        "name": "Boomlify"
      },
      "offers": {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "600",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    canonical: `${FRONTEND_URL}/temp-mail-pro`
  },
  '/pricing': {
    title: 'Pricing - Boomlify Temp Email | Free and Premium Plans Available',
    description: 'Explore Boomlify\'s pricing: free plan with core features or premium plans with unlimited emails, custom domains, and advanced options. Affordable, flexible solutions for temporary email needs—perfect for individuals and businesses alike.',
    keywords: 'email pricing, temp mail pricing, temporary email plans, email subscription, temporary email cost, free plan, premium plan, custom domains, unlimited emails, Boomlify pricing, affordable temp mail, disposable email pricing, private email plans, secure email pricing, privacy-first pricing, temp inbox plans, business email pricing, email service cost, Boomlify plans, flexible email pricing',
    twitterTitle: 'Pricing - Boomlify: Free and Premium Temp Email Plans',
    twitterDescription: 'Boomlify offers free and premium plans—unlimited emails, custom domains, and more for all users.',
    ogTitle: 'Boomlify Pricing - Free and Premium Temporary Email Plans',
    ogDescription: 'Choose Boomlify\'s free plan or premium options with unlimited emails, custom domains, and advanced features—affordable and flexible pricing.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Pricing - Boomlify Temporary Email Service",
      "description": "Explore Boomlify\'s pricing options: free plan with core features and premium plans with advanced options like unlimited emails and custom domains.",
      "url": `${FRONTEND_URL}/pricing`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          { "@type": "Offer", "name": "Free Plan", "price": "0", "priceCurrency": "USD", "description": "Basic temporary email features" },
          { "@type": "Offer", "name": "Pro Plan", "price": "9.99", "priceCurrency": "USD", "description": "Unlimited emails, custom domains, priority support" }
        ]
      }
    },
    canonical: `${FRONTEND_URL}/pricing`
  },
  '/faq': {
    title: 'FAQ - Boomlify Temp Email | Answers to All Your Questions',
    description: 'Find detailed answers to common questions about Boomlify\'s temporary email service: validity periods, privacy features, security measures, usage tips, and more. Your go-to resource for understanding our fast, secure temp mail solution.',
    keywords: 'email faq, temp mail faq, temporary email questions, email help, temporary email support, Boomlify faq, email validity, privacy, security, how to use temp mail, disposable email faq, temp inbox queries, secure email faq, private email help, anti-spam faq, email privacy answers, temporary email guide, Boomlify support faq, user email questions, temp mail assistance',
    twitterTitle: 'FAQ - Boomlify Temp Email: All Your Questions Answered',
    twitterDescription: 'Boomlify FAQ: answers on validity, privacy, security, and how to use our temp email service effectively.',
    ogTitle: 'Boomlify FAQ - Temporary Email Service Questions Answered',
    ogDescription: 'Get answers to all your questions about Boomlify\'s temp email service—validity, privacy, security, and more in our detailed FAQ.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "FAQ - Boomlify Temporary Email Service",
      "url": `${FRONTEND_URL}/faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long do temporary emails last?",
          "acceptedAnswer": { "@type": "Answer", "text": "Temporary emails last 48 hours by default, extendable up to 2+ months." }
        },
        {
          "@type": "Question",
          "name": "Is registration required for Boomlify?",
          "acceptedAnswer": { "@type": "Answer", "text": "No, registration isn't required for our basic temp email service." }
        },
        {
          "@type": "Question",
          "name": "Can I use custom domains with Boomlify?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, custom domains are available with our Pro plan." }
        },
        {
          "@type": "Question",
          "name": "How does Boomlify protect my privacy?",
          "acceptedAnswer": { "@type": "Answer", "text": "We use advanced privacy tools and no personal data collection." }
        }
      ]
    },
    canonical: `${FRONTEND_URL}/faq`
  },
  '/blog': {
    title: 'Blog - Boomlify Temp Email | Privacy, Security, and Tips',
    description: 'Dive into Boomlify\'s blog for expert articles on email privacy, security best practices, spam prevention, and temporary email tips. Stay informed and protect your inbox with our latest insights and strategies.',
    keywords: 'email blog, temp mail blog, temporary email articles, email privacy, email security, temporary email tips, spam prevention, inbox protection, Boomlify blog, disposable email insights, secure email tips, private email advice, anti-spam strategies, email privacy blog, temp inbox guides, email security news, Boomlify tips, online privacy blog, temporary email strategies, email protection blog',
    twitterTitle: 'Blog - Boomlify: Email Privacy, Security, and Tips',
    twitterDescription: 'Boomlify\'s blog: expert tips on email privacy, security, and using temp emails to protect your inbox.',
    ogTitle: 'Boomlify Blog - Email Privacy and Security Insights',
    ogDescription: 'Read Boomlify\'s blog for the latest on email privacy, security, spam prevention, and temporary email best practices.',
    ogImage: `${FRONTEND_URL}/blog-og-image.jpg`,
    twitterImage: `${FRONTEND_URL}/blog-twitter-image.jpg`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Boomlify Blog",
      "description": "Expert articles on email privacy, security, spam prevention, and temporary email tips from Boomlify.",
      "url": `${FRONTEND_URL}/blog`,
      "blogPost": [
        { "@type": "BlogPosting", "headline": "Top 5 Ways to Protect Your Email Privacy", "description": "Learn how to safeguard your inbox." },
        { "@type": "BlogPosting", "headline": "Why Use Temporary Emails?", "description": "Benefits of disposable emails." }
      ]
    },
    canonical: `${FRONTEND_URL}/blog`
  },
  '/login': {
    title: 'Login - Boomlify Temp Email | Secure Account Access',
    description: 'Log in to your Boomlify account to manage temporary emails, extend validity, and unlock premium features. Enjoy a secure, fast, and user-friendly login process designed for privacy-conscious users.',
    keywords: 'email login, temp mail login, temporary email account, email sign in, temporary email access, Boomlify login, account management, premium features, secure login, private email access, disposable email login, temp inbox sign in, email privacy login, anti-spam login, user account login, Boomlify account, email security login, fast login, temporary email management, privacy-first login',
    twitterTitle: 'Login - Boomlify: Secure Temp Email Access',
    twitterDescription: 'Sign in to Boomlify to manage your temp emails and access premium features securely.',
    ogTitle: 'Boomlify Login - Secure Temporary Email Management',
    ogDescription: 'Log in to Boomlify for secure access to manage your temporary emails, extend validity, and enjoy premium features.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Login - Boomlify Temporary Email Service",
      "description": "Securely log in to your Boomlify account to manage temporary emails and access premium features.",
      "url": `${FRONTEND_URL}/login`
    },
    canonical: `${FRONTEND_URL}/login`
  },
  '/register': {
    title: 'Register - Boomlify Temp Email | Free Account Signup',
    description: 'Sign up for a free Boomlify account to access enhanced temporary email features: email extension, custom domains, and more. Quick, secure registration process—no hassle, just privacy and convenience.',
    keywords: 'email register, temp mail register, temporary email signup, email account, temporary email create, Boomlify register, free account, email extension, custom domains, secure signup, disposable email register, temp inbox signup, email privacy register, anti-spam signup, user account creation, Boomlify account signup, email security register, fast registration, temporary email account, privacy-first signup',
    twitterTitle: 'Register - Boomlify: Free Temp Email Signup',
    twitterDescription: 'Create a free Boomlify account for enhanced temp email features like custom domains and extensions.',
    ogTitle: 'Boomlify Register - Free Temporary Email Account',
    ogDescription: 'Sign up for Boomlify to unlock advanced temporary email features—free, fast, and secure registration.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Register - Boomlify Temporary Email Service",
      "description": "Create a free Boomlify account to access enhanced temporary email features like email extension and custom domains.",
      "url": `${FRONTEND_URL}/register`
    },
    canonical: `${FRONTEND_URL}/register`
  },
  '/forgot-password': {
    title: 'Forgot Password - Boomlify | Secure Password Recovery',
    description: 'Forgot your Boomlify password? Reset it quickly and securely with our easy recovery process. Regain access to your temporary email account and continue enjoying privacy and spam protection.',
    keywords: 'email password reset, temp mail password, temporary email recovery, email access, temporary email reset, Boomlify forgot password, password recovery, secure password reset, disposable email recovery, temp inbox password, email privacy reset, anti-spam recovery, account recovery, Boomlify password help, email security reset, fast password recovery, temporary email assistance, privacy-first recovery, user password reset, email account recovery',
    twitterTitle: 'Forgot Password - Boomlify: Secure Recovery',
    twitterDescription: 'Reset your Boomlify password securely and quickly to regain access to your temp email account.',
    ogTitle: 'Boomlify Forgot Password - Secure Account Recovery',
    ogDescription: 'Easily reset your Boomlify password with our secure process and get back to using your temporary email account.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Forgot Password - Boomlify",
      "description": "Reset your Boomlify password securely and quickly with our easy recovery process.",
      "url": `${FRONTEND_URL}/forgot-password`
    },
    canonical: `${FRONTEND_URL}/forgot-password`
  },
  '/reset-password': {
    title: 'Reset Password - Boomlify | Securely Set a New Password',
    description: 'Set a new password for your Boomlify account with our secure, user-friendly reset process. Keep your temporary email account protected and continue enjoying privacy-focused features effortlessly.',
    keywords: 'email password reset, temp mail password, temporary email recovery, email access, temporary email reset, Boomlify reset password, password security, secure password reset, disposable email reset, temp inbox password, email privacy reset, anti-spam reset, account security, Boomlify password reset, email security reset, fast password reset, temporary email protection, privacy-first reset, user password security, email account reset',
    twitterTitle: 'Reset Password - Boomlify: Secure and Easy',
    twitterDescription: 'Set a new Boomlify password securely and keep your temp email account protected.',
    ogTitle: 'Boomlify Reset Password - Secure Account Protection',
    ogDescription: 'Reset your Boomlify password with our secure process to maintain access to your privacy-focused temp email account.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Reset Password - Boomlify",
      "description": "Set a new password for your Boomlify account with our secure and easy reset process.",
      "url": `${FRONTEND_URL}/reset-password`
    },
    canonical: `${FRONTEND_URL}/reset-password`
  },
  '/privacy': {
    title: 'Privacy Policy - Boomlify | Data Protection and Transparency',
    description: 'Explore Boomlify\'s privacy policy: learn how we safeguard your data, ensure transparency, and prioritize your privacy with our temporary email service. Committed to secure, anonymous online communication.',
    keywords: 'email privacy, temp mail privacy, temporary email policy, email data protection, temporary email security, Boomlify privacy, data protection, user privacy, secure email policy, disposable email privacy, temp inbox security, email anonymity policy, anti-spam privacy, privacy-first policy, Boomlify data protection, email security policy, transparent privacy, temporary email safeguards, user data privacy, online privacy policy',
    twitterTitle: 'Privacy Policy - Boomlify: Protecting Your Data',
    twitterDescription: 'Boomlify\'s privacy policy: transparent data protection and privacy for our temp email users.',
    ogTitle: 'Boomlify Privacy Policy - Data Protection Commitment',
    ogDescription: 'Learn how Boomlify protects your data and privacy with our transparent policy for temporary email services.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy - Boomlify",
      "description": "Explore Boomlify\'s commitment to protecting your data and privacy with our transparent privacy policy.",
      "url": `${FRONTEND_URL}/privacy`
    },
    canonical: `${FRONTEND_URL}/privacy`
  },
  '/terms': {
    title: 'Terms of Service - Boomlify | Clear, User-Friendly Terms',
    description: 'Review Boomlify\'s terms of service for our temporary email platform. Clear, transparent, and user-focused terms ensure a smooth, secure experience for privacy-conscious individuals and businesses.',
    keywords: 'email terms, temp mail terms, temporary email service, email conditions, temporary email rules, Boomlify terms, user agreement, service terms, secure email terms, disposable email terms, temp inbox conditions, email privacy terms, anti-spam terms, privacy-first terms, Boomlify service agreement, email security terms, transparent terms, temporary email usage, user-friendly terms, email service rules',
    twitterTitle: 'Terms of Service - Boomlify: Clear and Transparent',
    twitterDescription: 'Boomlify\'s terms of service: clear, user-friendly rules for our temp email platform.',
    ogTitle: 'Boomlify Terms of Service - Transparent Usage Rules',
    ogDescription: 'Read Boomlify\'s clear and transparent terms of service for a secure temporary email experience.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service - Boomlify",
      "description": "Review our clear and transparent terms of service for using Boomlify\'s temporary email platform.",
      "url": `${FRONTEND_URL}/terms`
    },
    canonical: `${FRONTEND_URL}/terms`
  },
  '/cookie-policy': {
    title: 'Cookie Policy - Boomlify | Transparent Cookie Usage',
    description: 'Understand Boomlify\'s cookie policy: how we use cookies to improve your temporary email experience, what they track, and your control options. Transparent and privacy-focused cookie practices.',
    keywords: 'email cookies, temp mail cookies, temporary email policy, email tracking, temporary email data, Boomlify cookies, cookie usage, user experience, secure cookie policy, disposable email cookies, temp inbox tracking, email privacy cookies, anti-spam cookies, privacy-first cookies, Boomlify cookie policy, email security cookies, transparent cookies, temporary email cookies, user cookie control, online cookie policy',
    twitterTitle: 'Cookie Policy - Boomlify: Transparent Usage',
    twitterDescription: 'Boomlify\'s cookie policy: how we use cookies to enhance your temp email experience transparently.',
    ogTitle: 'Boomlify Cookie Policy - Transparent and Privacy-Focused',
    ogDescription: 'Learn how Boomlify uses cookies to improve your temporary email experience with our transparent policy.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cookie Policy - Boomlify",
      "description": "Understand how Boomlify uses cookies to enhance your experience with our transparent and privacy-focused policy.",
      "url": `${FRONTEND_URL}/cookie-policy`
    },
    canonical: `${FRONTEND_URL}/cookie-policy`
  },
  '/cookies': {
    title: 'Cookie Policy - Boomlify | How Cookies Enhance Your Experience',
    description: 'Discover Boomlify\'s cookie policy: how we use cookies to optimize your temporary email usage, what data they collect, and your management options. Privacy-first and transparent cookie practices.',
    keywords: 'email cookies, temp mail cookies, temporary email policy, email tracking, temporary email data, Boomlify cookies, cookie usage, user experience, secure cookie policy, disposable email cookies, temp inbox tracking, email privacy cookies, anti-spam cookies, privacy-first cookies, Boomlify cookie policy, email security cookies, transparent cookies, temporary email cookies, user cookie control, online cookie policy',
    twitterTitle: 'Cookie Policy - Boomlify: Enhancing Your Experience',
    twitterDescription: 'Boomlify\'s cookie policy: how cookies optimize your temp email usage with transparency.',
    ogTitle: 'Boomlify Cookie Policy - Optimizing Your Email Experience',
    ogDescription: 'See how Boomlify uses cookies to enhance your temporary email experience with privacy-first practices.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cookie Policy - Boomlify",
      "description": "Learn how Boomlify uses cookies to optimize your temporary email experience with transparent practices.",
      "url": `${FRONTEND_URL}/cookies`
    },
    canonical: `${FRONTEND_URL}/cookies`
  },
  '/gdpr': {
    title: 'GDPR Compliance - Boomlify | Data Protection and User Rights',
    description: 'Learn about Boomlify\'s GDPR compliance: how we protect your data, uphold your rights, and ensure privacy with our temporary email service. Committed to transparency and secure data practices.',
    keywords: 'email gdpr, temp mail gdpr, temporary email compliance, email data protection, temporary email privacy, Boomlify gdpr, data protection, user rights, secure email gdpr, disposable email compliance, temp inbox privacy, email privacy gdpr, anti-spam gdpr, privacy-first gdpr, Boomlify data protection, email security gdpr, transparent gdpr, temporary email rights, user data compliance, online privacy gdpr',
    twitterTitle: 'GDPR Compliance - Boomlify: Data Protection',
    twitterDescription: 'Boomlify\'s GDPR compliance: protecting your data and rights with our temp email service.',
    ogTitle: 'Boomlify GDPR Compliance - Data Protection and Privacy',
    ogDescription: 'Understand Boomlify\'s GDPR commitment to data protection, user rights, and privacy in our temp email service.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "GDPR Compliance - Boomlify",
      "description": "Learn about Boomlify\'s GDPR compliance and our dedication to data protection and user privacy.",
      "url": `${FRONTEND_URL}/gdpr`
    },
    canonical: `${FRONTEND_URL}/gdpr`
  },
  '/about': {
    title: 'About Us - Boomlify | Our Mission for Email Privacy',
    description: 'Discover Boomlify\'s mission to revolutionize email privacy with secure, temporary email solutions. Learn about our story, values, and dedication to protecting users from spam and data breaches.',
    keywords: 'email about, temp mail about, temporary email company, email mission, temporary email values, Boomlify about, company story, privacy protection, secure email about, disposable email mission, temp inbox story, email privacy company, anti-spam mission, privacy-first about, Boomlify values, email security story, transparent company, temporary email purpose, user privacy mission, online privacy company',
    twitterTitle: 'About Us - Boomlify: Email Privacy Mission',
    twitterDescription: 'Boomlify\'s mission: secure temp email solutions for privacy and spam protection—learn our story.',
    ogTitle: 'About Boomlify - Our Commitment to Email Privacy',
    ogDescription: 'Boomlify is dedicated to email privacy with secure temporary solutions—explore our mission and values.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Boomlify",
      "description": "Learn about Boomlify\'s mission to protect email privacy with secure temporary email solutions.",
      "url": `${FRONTEND_URL}/about`,
      "logo": `${FRONTEND_URL}/logo.png`,
      "sameAs": [
        "https://twitter.com/boomlify",
        "https://facebook.com/boomlify"
      ]
    },
    canonical: `${FRONTEND_URL}/about`
  },
  '/contact': {
    title: 'Contact Us - Boomlify | Support and Inquiries Made Easy',
    description: 'Reach out to Boomlify for support, inquiries, or feedback about our temporary email service. Contact us via email, form, or phone—our team is here to assist with privacy and spam protection needs.',
    keywords: 'email contact, temp mail contact, temporary email support, email help, temporary email assistance, Boomlify contact, customer support, inquiries, secure email contact, disposable email help, temp inbox support, email privacy contact, anti-spam assistance, privacy-first contact, Boomlify support team, email security help, fast contact, temporary email queries, user support contact, online contact form',
    twitterTitle: 'Contact Us - Boomlify: Support for Temp Email',
    twitterDescription: 'Contact Boomlify for support or inquiries about our temp email service—we\'re here to help.',
    ogTitle: 'Boomlify Contact Us - Support and Inquiries',
    ogDescription: 'Get in touch with Boomlify for help with our temporary email service—support, inquiries, and feedback welcome.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Us - Boomlify",
      "description": "Contact Boomlify for support, inquiries, or feedback about our temporary email service.",
      "url": `${FRONTEND_URL}/contact`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-BOOMLIFY",
        "contactType": "Customer Service",
        "email": "support@boomlify.com"
      }
    },
    canonical: `${FRONTEND_URL}/contact`
  },
  '/support': {
    title: 'Support - Boomlify | Help for Temporary Email Users',
    description: 'Access Boomlify\'s comprehensive support: FAQs, detailed guides, and direct contact options. Get assistance with our temporary email service, troubleshoot issues, and optimize your privacy protection.',
    keywords: 'email support, temp mail support, temporary email help, email assistance, temporary email guide, Boomlify support, user help, resources, secure email support, disposable email help, temp inbox assistance, email privacy support, anti-spam help, privacy-first support, Boomlify help center, email security assistance, fast support, temporary email resources, user support guide, online email support',
    twitterTitle: 'Support - Boomlify: Help for Temp Email Users',
    twitterDescription: 'Boomlify support: FAQs, guides, and contact options to assist with your temp email needs.',
    ogTitle: 'Boomlify Support - Temporary Email Help Center',
    ogDescription: 'Find help with Boomlify\'s temporary email service—FAQs, guides, and support for privacy and usage.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Support - Boomlify",
      "description": "Access comprehensive support for Boomlify\'s temporary email service—FAQs, guides, and direct assistance.",
      "url": `${FRONTEND_URL}/support`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "FAQs", "description": "Common questions answered" },
          { "@type": "ListItem", "position": 2, "name": "Guides", "description": "Step-by-step help" },
          { "@type": "ListItem", "position": 3, "name": "Contact Support", "description": "Direct assistance" }
        ]
      }
    },
    canonical: `${FRONTEND_URL}/support`
  },
  '/careers': {
    title: 'Careers - Boomlify | Join Our Email Privacy Revolution',
    description: 'Join Boomlify\'s team to shape the future of email privacy. Explore career opportunities in a passionate, innovative company dedicated to secure temporary email solutions and user protection.',
    keywords: 'email careers, temp mail jobs, temporary email company, email employment, temporary email work, Boomlify careers, job opportunities, privacy innovation, secure email jobs, disposable email careers, temp inbox employment, email privacy careers, anti-spam jobs, privacy-first careers, Boomlify job openings, email security work, innovative careers, temporary email roles, user privacy jobs, online privacy careers',
    twitterTitle: 'Careers - Boomlify: Shape Email Privacy',
    twitterDescription: 'Join Boomlify to innovate email privacy—explore career opportunities with us.',
    ogTitle: 'Boomlify Careers - Innovate Email Privacy',
    ogDescription: 'Work with Boomlify to revolutionize email privacy—exciting career opportunities in a privacy-focused company.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Careers at Boomlify",
      "description": "Join Boomlify to shape the future of email privacy with secure temporary email solutions.",
      "url": `${FRONTEND_URL}/careers`,
      "mainEntity": {
        "@type": "JobPosting",
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Boomlify",
          "sameAs": `${FRONTEND_URL}`
        }
      }
    },
    canonical: `${FRONTEND_URL}/careers`
  },
  '/demo': {
    title: 'Demo - Boomlify Temp Email | Try Our Service Now',
    description: 'Experience Boomlify\'s temporary email service with our interactive demo. Test instant email generation, privacy protection, spam prevention, and extended validity—see why we\'re the best temp mail solution.',
    keywords: 'email demo, temp mail demo, temporary email try, email test, temporary email experience, Boomlify demo, instant email, privacy protection, spam prevention, secure email demo, disposable email test, temp inbox demo, email privacy trial, anti-spam demo, privacy-first demo, Boomlify test drive, email security demo, fast email trial, temporary email preview, online email demo',
    twitterTitle: 'Demo - Boomlify: Try Temp Email Now',
    twitterDescription: 'Test Boomlify\'s temp email service with our demo—privacy, spam protection, and instant generation.',
    ogTitle: 'Boomlify Demo - Try Temporary Email Today',
    ogDescription: 'Try Boomlify\'s temporary email service in our demo—experience instant emails, privacy, and spam protection firsthand.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Boomlify Demo",
      "description": "Test Boomlify\'s temporary email service with our interactive demo—privacy, security, and instant generation.",
      "url": `${FRONTEND_URL}/demo`,
      "applicationCategory": "Email Service",
      "featureList": [
        "Instant Email Creation",
        "Privacy Protection",
        "Spam Prevention",
        "Extended Validity"
      ]
    },
    canonical: `${FRONTEND_URL}/demo`
  }
};

// Default metadata with added social media fields
const defaultMetadata = {
  title: 'Boomlify - Temporary Email Service',
  description: 'Create free temporary email addresses instantly. Valid for 48 hours with option to extend up to 2+ months. No registration required. Perfect for protecting your privacy and avoiding spam.',
  keywords: 'temporary email, disposable email, temp mail, tempmail, temp email address, anonymous email, throwaway email, fake email, temporary inbox, disposable inbox',
  twitterTitle: 'Boomlify - Free Long-Term Temporary Email Service',
  twitterDescription: 'Create free temporary emails valid for 2+ months! Perfect for privacy protection.',
  ogTitle: 'Boomlify - Free Temporary Email Service',
  ogDescription: 'Create free temporary emails with Boomlify—valid for 2+ months! Perfect for privacy protection.',
  ogImage: `${FRONTEND_URL}/og-image.jpg`,
  twitterImage: `${FRONTEND_URL}/twitter-image.jpg`,
  twitterCard: 'summary_large_image',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Boomlify Temporary Email Generator",
    "applicationCategory": "Email Service",
    "description": "Create free temporary email addresses instantly. Valid for 48 hours with option to extend up to 2+ months. No registration required.",
    "operatingSystem": "All",
    "url": FRONTEND_URL,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Instant email generation",
      "48-hour validity",
      "No registration required",
      "Spam protection",
      "Real-time email updates",
      "Multiple domain options"
    ]
  },
  canonical: `${FRONTEND_URL}/`
};

/**
 * Prerenders HTML files for each route with SEO metadata.
 */
async function prerender() {
  // Read the template
  let template;
  try {
    template = fs.readFileSync(resolve(__dirname, 'dist', 'index.html'), 'utf-8');
  } catch (error) {
    console.error('Error: Could not read dist/index.html. Ensure `vite build` has run successfully.');
    throw error;
  }

  // Process each route
  for (const route of routes) {
    const isRoot = route === '/';
    const dir = isRoot ? resolve(__dirname, 'dist') : resolve(__dirname, 'dist', route.slice(1));

    // Create directory for non-root routes if it doesn't exist
    if (!isRoot && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Get metadata for the route, falling back to default if not specified
    const metadata = seoMetadata[route] || defaultMetadata;

    // Ensure no undefined values in metadata
    const safeMetadata = {
      title: metadata.title || defaultMetadata.title,
      description: metadata.description || defaultMetadata.description,
      keywords: metadata.keywords || defaultMetadata.keywords,
      twitterTitle: metadata.twitterTitle || metadata.title || defaultMetadata.twitterTitle,
      twitterDescription: metadata.twitterDescription || metadata.description || defaultMetadata.twitterDescription,
      ogTitle: metadata.ogTitle || metadata.title || defaultMetadata.ogTitle,
      ogDescription: metadata.ogDescription || metadata.description || defaultMetadata.ogDescription,
      ogImage: metadata.ogImage || defaultMetadata.ogImage,
      twitterImage: metadata.twitterImage || defaultMetadata.twitterImage,
      twitterCard: metadata.twitterCard || defaultMetadata.twitterCard,
      structuredData: metadata.structuredData || defaultMetadata.structuredData,
      canonical: metadata.canonical || `${FRONTEND_URL}${route}`
    };

    // Replace meta tags and title in the template
    let pageHtml = template
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeMetadata.title}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${safeMetadata.description}">`)
      .replace(/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="keywords" content="${safeMetadata.keywords}">`)
      .replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${safeMetadata.ogTitle}">`)
      .replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${safeMetadata.ogDescription}">`)
      .replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:image" content="${safeMetadata.ogImage}">`)
      .replace(/<meta\s+property=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="twitter:title" content="${safeMetadata.twitterTitle}">`)
      .replace(/<meta\s+property=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="twitter:description" content="${safeMetadata.twitterDescription}">`)
      .replace(/<meta\s+property=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="twitter:image" content="${safeMetadata.twitterImage}">`);
      
    // Update og:url and twitter:url to match the canonical URL
    pageHtml = pageHtml
      .replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${safeMetadata.canonical}">`)
      .replace(/<meta\s+property=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="twitter:url" content="${safeMetadata.canonical}">`);

    // Replace or add canonical URL
    if (/link\s+rel=["']canonical["']/.test(pageHtml)) {
      pageHtml = pageHtml.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${safeMetadata.canonical}">`);
    } else {
      pageHtml = pageHtml.replace('</head>', `<link rel="canonical" href="${safeMetadata.canonical}">\n</head>`);
    }

    // Replace twitter:card (simplified to avoid duplicates)
    pageHtml = pageHtml.replace(/<meta\s+name=["']twitter:card["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="twitter:card" content="${safeMetadata.twitterCard}">`);

    // Replace structured data with formatted JSON
    const structuredDataScript = `<script type="application/ld+json">\n${JSON.stringify(safeMetadata.structuredData, null, 2)}\n</script>`;
    
    if (/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i.test(pageHtml)) {
      pageHtml = pageHtml.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, structuredDataScript);
    } else {
      pageHtml = pageHtml.replace('</head>', `${structuredDataScript}\n</head>`);
    }

    // Write the pre-rendered HTML to the appropriate file
    fs.writeFileSync(resolve(dir, 'index.html'), pageHtml);
    console.log(`Pre-rendered ${route}/index.html with SEO metadata`);
  }

  console.log('Static site generation complete!');
}

// Execute prerendering and handle errors
prerender().catch(error => {
  console.error('Prerendering failed:', error);
  process.exit(1);
});