'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      
      <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/30">
        <XCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Payment Unsuccessful</h1>
        <p className="text-xs text-gray-500">
          Your payment could not be processed. No funds were debited from your account.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Link
          href="/membership"
          className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Link>

        <Link
          href="/account"
          className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm"
        >
          View My Account
        </Link>
      </div>

    </div>
  );
}
