'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Heart, Crown, ArrowRight, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { membership } = useAuth();
  const planName = searchParams.get('plan') || membership?.plan_name || 'Love Talk Premium';
  const amount = searchParams.get('amount') || '99';
  const payId = searchParams.get('payId') || `pay_${Date.now()}`;
  const isMock = searchParams.get('mock') === '1';

  const startDateStr = membership?.start_date
    ? new Date(membership.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const endDateStr = membership?.end_date
    ? new Date(membership.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8">
      {isMock && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          TEST MODE — Razorpay live credentials are not configured. No real payment was taken.
        </div>
      )}
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30 animate-in zoom-in">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose-500" /> Welcome to Love Talk Premium
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Payment Successful! ❤️
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Thank you for joining the Love Talk Premium family. Your membership is now active, and all locked premium audio episodes are unlocked!
        </p>
      </div>

      {/* Transaction Receipt Card */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl space-y-4 text-left text-xs sm:text-sm">
        <h3 className="font-bold text-gray-900 dark:text-white text-base border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" /> Subscription Receipt
        </h3>

        <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
          <div>
            <span className="text-gray-400 text-[11px] block">Plan</span>
            <span className="font-bold text-gray-900 dark:text-white">{planName}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Amount Paid</span>
            <span className="font-bold text-brand-600">₹{amount}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Payment ID</span>
            <span className="font-mono text-gray-800 dark:text-gray-200 truncate block">{payId}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Status</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Start Date</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{startDateStr}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Expiry Date</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{endDateStr}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link
          href="/episodes"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 hover:to-rose-400 font-extrabold text-white text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
        >
          Start Listening Now <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/account"
          className="px-8 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-white font-bold text-sm border border-gray-200 dark:border-gray-700 transition-all"
        >
          Go to My Account
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <Suspense fallback={<div className="text-sm font-semibold text-gray-400">Loading receipt...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
