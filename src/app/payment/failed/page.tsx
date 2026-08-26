'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Your payment was cancelled or could not be completed.';

  return (
    <div className="space-y-6">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/30">
        <XCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Payment Unsuccessful</h1>
        <p className="text-xs text-gray-500">
          Your payment could not be processed and your membership was not activated.
        </p>
      </div>

      {reason && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 text-left">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{reason}</span>
        </div>
      )}

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

export default function PaymentFailedPage() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <Suspense fallback={<div className="text-sm font-semibold text-gray-400">Loading details...</div>}>
        <PaymentFailedContent />
      </Suspense>
    </div>
  );
}
