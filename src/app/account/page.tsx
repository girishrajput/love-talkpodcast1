'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Crown, 
  LogOut, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Edit3,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStoredPayments } from '@/lib/data';

export default function AccountPage() {
  const router = useRouter();
  const { user, membership, payments, isPremium, logout, updateProfile } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <User className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to view your account</h2>
        <p className="text-xs text-gray-500">Access your membership status, subscription details, and payment history.</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
      setEditModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-gray-900 to-gray-950 p-8 rounded-3xl text-white border border-brand-800/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-500 shadow-md flex-shrink-0 bg-gray-800">
            <Image
              src={user.avatar_url || '/images/podcast_cover.jpg'}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                user.role === 'super_admin' ? 'bg-purple-600 text-white' :
                user.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-200'
              }`}>
                {user.role}
              </span>
            </div>

            <p className="text-xs text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> {user.email}
            </p>

            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => { setNameInput(user.name); setEditModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>

          <button
            onClick={() => { logout(); router.push('/'); }}
            className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Membership Card */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">Love Talk Membership</h2>
              <p className="text-xs text-gray-500">Your current subscription status & access level</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            isPremium
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
          }`}>
            {isPremium ? 'Active Premium' : 'Free Listener'}
          </span>
        </div>

        {isPremium && membership ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400 font-medium">Active Plan</p>
              <p className="font-bold text-gray-900 dark:text-white text-base mt-0.5">{membership.plan_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Subscription Period</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                {new Date(membership.start_date).toLocaleDateString()} — {new Date(membership.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <Link
                href="/membership"
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow"
              >
                Manage / Renew Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Unlock 25 Premium Benefits</h4>
              <p className="text-xs text-gray-500">Listen to locked premium episodes, ad-free high audio, and join monthly live Q&As starting at just ₹99/year.</p>
            </div>

            <Link
              href="/membership"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 flex-shrink-0"
            >
              Upgrade to Premium Now
            </Link>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">Payment History</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">{payments.length} transactions</span>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-gray-400 italic p-4 text-center">No payment transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400">
                  <th className="py-3">Payment ID</th>
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Date</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 font-mono text-gray-900 dark:text-white font-bold">{p.razorpay_payment_id}</td>
                    <td className="py-3 font-mono text-gray-500 text-xs">{p.razorpay_order_id}</td>
                    <td className="py-3 font-bold text-brand-600">₹{p.amount}</td>
                    <td className="py-3 text-gray-500">{p.payment_method}</td>
                    <td className="py-3 text-gray-400">{new Date(p.paid_at).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Profile Name</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
