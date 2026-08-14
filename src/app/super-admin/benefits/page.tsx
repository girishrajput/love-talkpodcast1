'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PremiumBenefit } from '@/lib/types';

export default function SuperAdminBenefitsPage() {
  const { user } = useAuth();
  const [benefits, setBenefits] = useState<PremiumBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<PremiumBenefit | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const fetchBenefits = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/super-admin/benefits', { cache: 'no-store' });
      const data = await res.json();
      if (data.benefits) {
        setBenefits(data.benefits);
      }
    } catch (err) {
      console.error('Failed to fetch benefits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  if (!user || user.role !== 'super_admin') {
    return <div className="p-8 text-center text-rose-500 font-bold">403 Access Denied</div>;
  }

  const openCreate = () => {
    setEditingBenefit(null);
    setTitle('');
    setDescription('');
    setSortOrder(benefits.length + 1);
    setModalOpen(true);
  };

  const openEdit = (b: PremiumBenefit) => {
    setEditingBenefit(b);
    setTitle(b.title);
    setDescription(b.description || '');
    setSortOrder(b.sort_order);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingBenefit ? editingBenefit.id : undefined,
        title,
        description,
        sort_order: Number(sortOrder)
      };

      const res = await fetch('/api/super-admin/benefits', {
        method: editingBenefit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalOpen(false);
        fetchBenefits();
      }
    } catch (err) {
      console.error('Failed to save benefit:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Disable this benefit?')) {
      try {
        const res = await fetch('/api/super-admin/benefits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, is_enabled: false })
        });
        if (res.ok) fetchBenefits();
      } catch (err) {
        console.error('Failed to disable benefit:', err);
      }
    }
  };

  const toggleEnable = async (id: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/super-admin/benefits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_enabled: !currentEnabled })
      });
      if (res.ok) fetchBenefits();
    } catch (err) {
      console.error('Failed to toggle benefit:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <Link href="/super-admin" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-950 via-gray-900 to-gray-950 p-8 rounded-3xl text-white border border-brand-800/40">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> 25 Premium Benefits Manager
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Feature & Privilege Catalog</h1>
        </div>

        <button
          onClick={openCreate}
          className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Benefit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((b) => (
          <div key={b.id} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-start justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-bold font-mono">
                  #{b.sort_order}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                  {b.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">{b.title}</h4>
              {b.description && <p className="text-xs text-gray-500">{b.description}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <button onClick={() => openEdit(b)} className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-brand-600 hover:text-white">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => toggleEnable(b.id, b.is_enabled)} className={`p-1.5 rounded-lg text-xs font-bold ${b.is_enabled ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`} title={b.is_enabled ? 'Disable' : 'Enable'}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Benefit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                {editingBenefit ? 'Edit Premium Benefit' : 'Add Premium Benefit'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Sort Order #</label>
                <input
                  type="number"
                  required
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow"
                >
                  Save Benefit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
