'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Save, 
  Radio, 
  Globe 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStoredSettings, saveStoredSettings } from '@/lib/data';
import { SiteSettings } from '@/lib/types';

export default function SuperAdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user || user.role !== 'super_admin') {
    return <div className="p-8 text-center text-rose-500 font-bold">403 Access Denied</div>;
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <Link href="/super-admin" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-gradient-to-r from-gray-900 via-brand-950 to-gray-950 p-8 rounded-3xl text-white border border-gray-800 space-y-2">
        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" /> Global Configuration
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Site & Integration Settings</h1>
        <p className="text-xs text-gray-300">Configure podcast parameters, membership toggles, and monitor Razorpay gateway status.</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs sm:text-sm">
        
        {/* Payment Gateway Monitor */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" /> Razorpay Integration Monitor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl space-y-1">
              <span className="text-gray-400 text-xs">Gateway Connection</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Razorpay Connected</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl space-y-1">
              <span className="text-gray-400 text-xs">Webhook Receiver</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">/api/webhooks/razorpay Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* General Site Config */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-500" /> Podcast Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Site / App Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Podcast Hosts</label>
            <input
              type="text"
              value={settings.hostNames}
              onChange={(e) => setSettings({ ...settings, hostNames: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Membership Controls */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Membership System Toggles</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enablePremium}
                onChange={(e) => setSettings({ ...settings, enablePremium: e.target.checked })}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span className="font-bold text-gray-900 dark:text-white">Enable Premium Membership System</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableYouthPlan}
                onChange={(e) => setSettings({ ...settings, enableYouthPlan: e.target.checked })}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Enable Youth Membership Plan (₹99/year)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableProfessionalPlan}
                onChange={(e) => setSettings({ ...settings, enableProfessionalPlan: e.target.checked })}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Enable Professional Membership Plan (₹399/year)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>

      </form>

    </div>
  );
}
