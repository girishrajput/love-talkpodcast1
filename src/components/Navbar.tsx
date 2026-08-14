'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Radio, 
  Search, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Heart,
  User,
  Crown,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isPremium, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/episodes', label: t('navEpisodes') },
    { href: '/membership', label: 'Membership' },
    { href: '/search', label: t('navSearch') },
    { href: '/about', label: t('navAbout') },
  ];

  if (user?.role === 'super_admin') {
    navLinks.push({ href: '/super-admin', label: 'Super Admin' });
  } else if (user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Love Talk <Heart className="w-4 h-4 text-brand-500 fill-brand-500 inline" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">with Tim & Chels</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-gray-100/70 dark:bg-gray-900/60 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/50">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Account, Language Switcher, Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* User Account / Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-500 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.substring(0, 1).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                {isPremium && (
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                )}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
            >
              Log In
            </Link>
          )}

          {/* Language Select */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800">
            <Globe className="w-4 h-4 text-gray-400 ml-2 mr-1" />
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                lang === 'hi'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 space-y-3">
          {user ? (
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-500" />
                <span className="font-bold text-xs text-gray-900 dark:text-white">{user.name}</span>
              </div>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-brand-600">
                My Account
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm mb-2"
            >
              Log In / Register
            </Link>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
