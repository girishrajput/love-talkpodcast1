'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Crown, 
  Lock, 
  UserX, 
  UserCheck, 
  Gift, 
  Sparkles,
  ArrowLeft,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, UserRole, UserMembership } from '@/lib/types';

export default function SuperAdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Manual Grant Modal
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [grantDays, setGrantDays] = useState(365);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/super-admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (data.users) {
        setProfiles(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!currentUser || currentUser.role !== 'super_admin') {
    return <div className="p-8 text-center text-rose-500 font-bold">403 Access Denied</div>;
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id, grantPremiumDays: grantDays })
      });

      if (res.ok) {
        setGrantModalOpen(false);
        alert(`Granted ${grantDays} days premium access to ${targetUser.name} in MySQL!`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to grant premium:', err);
    }
  };

  const filtered = profiles.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || p.role === roleFilter;
    return matchQuery && matchRole;
  });

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <Link href="/super-admin" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-gradient-to-r from-purple-950 via-gray-900 to-gray-950 p-8 rounded-3xl text-white border border-purple-800/40 space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
          <Users className="w-4 h-4" /> User Management
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Accounts & Authorization</h1>
        <p className="text-xs text-gray-300">Assign roles (User, Admin, Super Admin), suspend accounts, or manually grant premium access.</p>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-gray-400">Role Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400">
                <th className="py-3">User Profile</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3">Joined Date</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        p.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => { setTargetUser(p); setGrantModalOpen(true); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                      title="Grant Premium"
                    >
                      <Gift className="w-3.5 h-3.5" /> Grant Premium
                    </button>

                    <button
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        p.status === 'active' ? 'bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {p.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Premium Modal */}
      {grantModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manually Grant Premium</h3>
              <button onClick={() => setGrantModalOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-gray-500">Granting premium access to <strong>{targetUser.name}</strong> ({targetUser.email}).</p>

            <form onSubmit={handleGrantPremium} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={grantDays}
                  onChange={(e) => setGrantDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGrantModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
                >
                  Confirm Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
