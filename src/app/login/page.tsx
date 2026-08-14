'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Radio, Heart, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  // If user is already logged in, redirect to account or super-admin
  React.useEffect(() => {
    if (user) {
      if (user.role === 'super_admin' || user.role === 'admin') {
        router.push('/super-admin');
      } else {
        router.push('/account');
      }
    }
  }, [user, router]);

  const handleAuthSuccess = () => {
    setGoogleModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-brand-500/30">
          <Radio className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome to Love Talk
        </h1>
        <p className="text-xs text-gray-500">Sign in to access your account, playlists, and premium episodes.</p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-xl space-y-6">
        
        {/* Google OAuth Button */}
        <button
          onClick={() => setGoogleModalOpen(true)}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold text-sm border border-gray-300 dark:border-gray-700 shadow-sm transition-all flex items-center justify-center gap-3 group"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="pt-2 text-center text-xs text-gray-500">
          By signing in, you agree to Love Talk's Privacy Policy and Terms of Service.
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        Don't have an account? <Link href="/register" className="font-bold text-brand-600 hover:underline">Register with Google</Link>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
