'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Radio, Heart, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GoogleAuthModal } from '@/components/GoogleAuthModal';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, loginWithGoogle } = useAuth();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // Listen for Google OAuth Hash or Query redirect responses (#id_token=... or ?error=...)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const errParam = urlParams.get('error');
    if (errParam) {
      setAuthError(decodeURIComponent(errParam));
      return;
    }

    const hash = window.location.hash;
    if (hash && hash.includes('id_token=')) {
      try {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const idToken = params.get('id_token');
        if (idToken) {
          const base64Url = idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);

          if (payload.email) {
            const email = payload.email;
            const name = payload.name || email.split('@')[0];
            const picture = payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
            const googleId = payload.sub ? `google_${payload.sub}` : `google_${Date.now()}`;

            loginWithGoogle(email, name, picture, googleId).then(() => {
              window.history.replaceState({}, document.title, window.location.pathname);
            }).catch((err: any) => {
              console.error('Google OAuth Hash sync failed:', err);
              setAuthError(err.message || 'Failed to sync Google user session');
            });
          }
        }
      } catch (err: any) {
        console.error('Failed to parse Google OAuth redirect token:', err);
        setAuthError('Invalid Google OAuth token response');
      }
    }
  }, [loginWithGoogle]);

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
        
        {authError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
            {authError}
          </div>
        )}

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
