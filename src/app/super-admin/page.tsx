'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Crown, 
  DollarSign, 
  Radio, 
  MessageSquare, 
  Mail, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Settings,
  Sparkles,
  Lock,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStoredProfiles, getStoredMemberships, getStoredPayments, getStoredEpisodes, getStoredSubscribers } from '@/lib/data';

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  // RBAC Guard
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">403 Access Denied</h2>
        <p className="text-xs text-gray-500">Only Super Admins can access this management suite.</p>
        <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
          Login as Super Admin
        </Link>
      </div>
    );
  }

  const profiles = getStoredProfiles();
  const memberships = getStoredMemberships();
  const payments = getStoredPayments();
  const episodes = getStoredEpisodes();
  const subscribers = getStoredSubscribers();

  const totalUsers = profiles.length;
  const activePremiumUsers = memberships.filter(m => m.status === 'active').length;
  const freeUsers = Math.max(0, totalUsers - activePremiumUsers);
  const youthMembers = memberships.filter(m => m.status === 'active' && m.plan_id.includes('youth')).length;
  const proMembers = memberships.filter(m => m.status === 'active' && m.plan_id.includes('professional')).length;

  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'captured' ? p.amount : 0), 0);
  const freeEpisodes = episodes.filter(e => e.access_type === 'FREE').length;
  const premiumEpisodes = episodes.filter(e => e.access_type === 'PREMIUM').length;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-gray-900 to-gray-950 p-8 rounded-3xl text-white border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Super Admin Control Suite
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Analytics & Management</h1>
          <p className="text-xs text-gray-300">Welcome back, {user.name}. Full authorization granted.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <Link href="/super-admin/users" className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20">
            Manage Users
          </Link>
          <Link href="/super-admin/plans" className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow">
            Edit Plans
          </Link>
          <Link href="/super-admin/benefits" className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow">
            25 Benefits
          </Link>
          <Link href="/super-admin/settings" className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white">
            <Settings className="w-4 h-4 inline" />
          </Link>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">₹{totalRevenue} captured this month</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Active Memberships</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-500 font-mono">
            {activePremiumUsers}
          </p>
          <p className="text-[11px] text-gray-400">{freeUsers} Free Listeners</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-extrabold text-purple-500 font-mono">
            {totalUsers}
          </p>
          <p className="text-[11px] text-gray-400">Registered Accounts</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold">Podcast Episodes</span>
            <Radio className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-3xl font-extrabold text-brand-600 font-mono">
            {episodes.length}
          </p>
          <p className="text-[11px] text-gray-400">{freeEpisodes} Free / {premiumEpisodes} Premium</p>
        </div>

      </div>

      {/* Plan Breakdown & Revenue Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tier Distribution Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-500" /> Active Plan Breakdown
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Youth Plan (₹99/yr)</p>
                <p className="text-xs text-gray-400">18–26 Age Demographics</p>
              </div>
              <span className="px-3 py-1 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-sm rounded-full">
                {youthMembers} Members
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Professional Plan (₹399/yr)</p>
                <p className="text-xs text-gray-400">Working Professionals</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm rounded-full">
                {proMembers} Members
              </span>
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Quick Control Hub</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/super-admin/users" className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-600 hover:text-white transition-all space-y-1 group">
              <Users className="w-5 h-5 text-brand-500 group-hover:text-white" />
              <p className="font-bold text-xs">User Management</p>
              <p className="text-[10px] text-gray-400 group-hover:text-white/80">Roles & Statuses</p>
            </Link>

            <Link href="/admin" className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-600 hover:text-white transition-all space-y-1 group">
              <Radio className="w-5 h-5 text-brand-500 group-hover:text-white" />
              <p className="font-bold text-xs">Episode Access</p>
              <p className="text-[10px] text-gray-400 group-hover:text-white/80">Free vs Premium</p>
            </Link>

            <Link href="/super-admin/plans" className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-600 hover:text-white transition-all space-y-1 group">
              <Crown className="w-5 h-5 text-brand-500 group-hover:text-white" />
              <p className="font-bold text-xs">Membership Plans</p>
              <p className="text-[10px] text-gray-400 group-hover:text-white/80">Dynamic Prices</p>
            </Link>

            <Link href="/super-admin/benefits" className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-brand-600 hover:text-white transition-all space-y-1 group">
              <Sparkles className="w-5 h-5 text-brand-500 group-hover:text-white" />
              <p className="font-bold text-xs">25 Benefits</p>
              <p className="text-[10px] text-gray-400 group-hover:text-white/80">Manage Features</p>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
