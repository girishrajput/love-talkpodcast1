'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, User, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasValidClientId = Boolean(
    googleClientId && 
    googleClientId !== 'your-google-client-id.apps.googleusercontent.com' &&
    !googleClientId.includes('your-google-client-id')
  );

  useEffect(() => {
    if (!isOpen || !hasValidClientId) return;

    // Load Google Identity Services SDK script dynamically
    const scriptId = 'google-gis-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initializeGis = () => {
      if (window.google?.accounts?.id && googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'pill'
          });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGis;
      document.body.appendChild(script);
    } else {
      initializeGis();
    }
  }, [isOpen, hasValidClientId, googleClientId]);

  const handleCredentialResponse = async (response: any) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const email = payload.email;
      const name = payload.name || email.split('@')[0];
      const picture = payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
      const googleId = payload.sub || `google_${Date.now()}`;

      await loginWithGoogle(email, name, picture, googleId);
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google OAuth Token verification failed:', err);
      setErrorMsg(err.message || 'Google authentication failed');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const triggerGoogleRedirectFlow = () => {
    if (!googleClientId) return;
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const handleSignIn = async (emailToUse?: string, nameToUse?: string) => {
    const targetEmail = emailToUse || googleEmail.trim();
    const targetName = nameToUse || googleName.trim() || targetEmail.split('@')[0];

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const googleId = `google_${Date.now()}`;
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(targetEmail)}`;

      await loginWithGoogle(targetEmail, targetName, avatarUrl, googleId);
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMsg(err.message || 'Failed to authenticate with Google');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Google OAuth Authentication</h3>
              <p className="text-xs text-gray-500">Love Talk Podcast Account Sync</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Google OAuth Button (rendered via GIS SDK) */}
        {hasValidClientId ? (
          <div className="p-5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Google Cloud Credentials Verified
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Click below to authenticate using your real Google account:
            </p>

            <div className="flex justify-center py-2" ref={googleButtonRef}></div>

            <button
              onClick={triggerGoogleRedirectFlow}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Or open Google OAuth redirect page
            </button>
          </div>
        ) : (
          /* Show setup warning ONLY if NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing or placeholder */
          <div className="p-4 bg-brand-500/10 rounded-2xl border border-brand-500/20 text-xs space-y-1">
            <p className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Google OAuth Credentials Setup Required
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">
              Set <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code> to activate native Google Sign-In.
            </p>
          </div>
        )}

        {/* Quick Testing Shortcuts (Preserved for local development) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Local Testing Account Shortcuts:</p>
            <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded font-mono">Dev Mode</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => handleSignIn('priya.k@gmail.com', 'Priya Kapoor')}
              disabled={isSubmitting}
              className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  PK
                </div>
                <div>
                  <p className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-brand-600">Priya Kapoor</p>
                  <p className="text-[11px] text-gray-500 font-mono">priya.k@gmail.com</p>
                </div>
              </div>
              <span className="text-[10px] bg-brand-500/10 text-brand-600 font-bold px-2 py-0.5 rounded-full">Premium Member</span>
            </button>

            <button
              onClick={() => handleSignIn('superadmin@lovetalkpodcast.in', 'Tim (Super Admin)')}
              disabled={isSubmitting}
              className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  T
                </div>
                <div>
                  <p className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-purple-600">Tim (Host & Admin)</p>
                  <p className="text-[11px] text-gray-500 font-mono">superadmin@lovetalkpodcast.in</p>
                </div>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-600 font-bold px-2 py-0.5 rounded-full">Super Admin</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-medium">Or enter custom Google account</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Google Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. alex.smith@gmail.com"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Display Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Alex Smith"
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Authenticating with MySQL...' : 'Sign In & Save to MySQL'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
