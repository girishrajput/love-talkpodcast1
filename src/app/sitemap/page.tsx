'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Map, 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Compass, 
  ShieldCheck, 
  Crown, 
  Settings, 
  FileText, 
  Radio, 
  Code,
  Check
} from 'lucide-react';

interface RouteGroup {
  category: string;
  description: string;
  icon: any;
  routes: Array<{
    path: string;
    label: string;
    description: string;
    badge?: string;
    isPublic: boolean;
  }>;
}

const sitemapData: RouteGroup[] = [
  {
    category: 'Core Navigation',
    description: 'Main public discovery pages and podcast listening routes',
    icon: Radio,
    routes: [
      { path: '/', label: 'Home Page', description: 'Hero banner, featured episodes, host story & latest releases', isPublic: true },
      { path: '/episodes', label: 'All Episodes', description: 'Browse full podcast episode catalog with filters & dual transcripts', isPublic: true },
      { path: '/search', label: 'Search Episodes', description: 'Search episodes by topic, title, host, or language tags', isPublic: true },
      { path: '/membership', label: 'Membership Plans & Pricing', description: 'Compare Youth ₹99 and Professional ₹399 membership tiers', isPublic: true },
      { path: '/about', label: 'About Tim & Chels', description: 'Meet the hosts, podcast story, contact info & press inquiries', isPublic: true },
    ]
  },
  {
    category: 'Product & User Account',
    description: 'User authentication, profile management, and payment status',
    icon: Crown,
    routes: [
      { path: '/account', label: 'User Account Dashboard', description: 'Manage active membership status, profile details & billing', isPublic: false, badge: 'Auth Required' },
      { path: '/login', label: 'Sign In', description: 'Authenticate via Google OAuth or credentials', isPublic: true },
      { path: '/register', label: 'Create Account', description: 'Register a new Love Talk Podcast account', isPublic: true },
      { path: '/payment/success', label: 'Payment Success Confirmation', description: 'Subscription activation receipt & order confirmation page', isPublic: false },
      { path: '/payment/failed', label: 'Payment Failure Handler', description: 'Troubleshoot payment errors and retry Razorpay checkout', isPublic: false },
    ]
  },
  {
    category: 'Admin & Platform Controls',
    description: 'Content administration, episode uploader, and plan configurations',
    icon: Settings,
    routes: [
      { path: '/admin', label: 'Admin Dashboard', description: 'Overview of platform statistics, episode counts & rapid controls', isPublic: false, badge: 'Admin Only' },
      { path: '/super-admin', label: 'Super Admin Overview', description: 'Super admin system diagnostics & global dashboard', isPublic: false, badge: 'Super Admin' },
      { path: '/super-admin/plans', label: 'Membership Plans Management', description: 'Manage Razorpay plan IDs, pricing & feature badges', isPublic: false, badge: 'Super Admin' },
      { path: '/super-admin/benefits', label: '25 Benefits Management', description: 'Add, reorder, or edit the 25 premium member benefits', isPublic: false, badge: 'Super Admin' },
      { path: '/super-admin/users', label: 'User & Role Management', description: 'Manage member roles, subscriber emails & profile statuses', isPublic: false, badge: 'Super Admin' },
      { path: '/super-admin/settings', label: 'Site Settings & Controls', description: 'Manage site branding, SEO metadata & maintenance flags', isPublic: false, badge: 'Super Admin' },
    ]
  },
  {
    category: 'Legal & Compliance',
    description: 'Privacy frameworks, terms of agreement, and index mappings',
    icon: ShieldCheck,
    routes: [
      { path: '/privacy-policy', label: 'Privacy Policy', description: 'GDPR & CCPA compliance, data retention & cookie disclosures', isPublic: true },
      { path: '/terms-of-service', label: 'Terms of Service', description: 'Acceptable use policy, subscription billing & liability terms', isPublic: true },
      { path: '/sitemap', label: 'Interactive HTML Sitemap', description: 'Full index mapping of all routes & SEO structure', isPublic: true },
      { path: '/sitemap.xml', label: 'XML Sitemap Feed', description: 'Standard machine-readable sitemap for search engine bots', isPublic: true, badge: 'SEO Feed' },
      { path: '/robots.txt', label: 'Robots Instruction File', description: 'Search engine crawler rules and sitemap location', isPublic: true, badge: 'SEO File' },
    ]
  }
];

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const filteredCategories = sitemapData.map(group => {
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    if (!matchesCategory) return null;

    const matchingRoutes = group.routes.filter(r => 
      r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingRoutes.length === 0) return null;

    return {
      ...group,
      routes: matchingRoutes
    };
  }).filter(Boolean) as RouteGroup[];

  const xmlSnippet = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://localhost:3000/episodes</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://localhost:3000/membership</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://localhost:3000/about</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>http://localhost:3000/privacy-policy</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>http://localhost:3000/terms-of-service</loc>
    <priority>0.5</priority>
  </url>
</urlset>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xmlSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Navigation & Header */}
      <div className="space-y-4 border-b border-gray-200 dark:border-gray-800 pb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" /> Navigation & Indexing
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Platform Sitemap
            </h1>
          </div>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold shadow-md hover:bg-gray-800 transition-all"
          >
            <span>View XML Feed</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/80 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search routes or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {sitemapData.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.category
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.category.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Categorized Route Cards */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <Search className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No routes match "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-brand-600 font-bold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredCategories.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.category} className="space-y-4">
                
                {/* Group Header */}
                <div className="flex items-center gap-3 border-b border-gray-200/80 dark:border-gray-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{group.category}</h3>
                    <p className="text-xs text-gray-500">{group.description}</p>
                  </div>
                </div>

                {/* Route Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="group p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:underline">
                            {route.path}
                          </span>
                          {route.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                              {route.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          {route.label}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {route.description}
                        </p>
                      </div>

                      <div className="pt-2 text-[11px] text-gray-400 flex items-center gap-1 font-semibold group-hover:text-brand-500">
                        <span>Visit page</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Standard XML Snippet Section */}
      <div className="bg-gray-900 text-gray-100 p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">Standard sitemap.xml Structure</h3>
          </div>

          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 flex items-center gap-2 transition-colors border border-gray-700"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
            {copiedSnippet ? 'Copied XML!' : 'Copy XML Snippet'}
          </button>
        </div>

        <pre className="p-4 bg-gray-950 rounded-2xl text-xs font-mono text-emerald-400 overflow-x-auto border border-gray-800 leading-relaxed">
          {xmlSnippet}
        </pre>
      </div>

    </div>
  );
}
