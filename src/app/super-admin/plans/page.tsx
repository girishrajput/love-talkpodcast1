'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  ArrowLeft, 
  X,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MembershipPlan } from '@/lib/types';

export default function SuperAdminPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [target, setTarget] = useState('');
  const [price, setPrice] = useState(99);
  const [billingPeriod, setBillingPeriod] = useState<'year' | 'month'>('year');
  const [badge, setBadge] = useState('');
  const [razorpayPlanId, setRazorpayPlanId] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/super-admin/plans', { cache: 'no-store' });
      const data = await res.json();
      if (data.plans) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (!user || user.role !== 'super_admin') {
    return <div className="p-8 text-center text-rose-500 font-bold">403 Access Denied</div>;
  }

  const openCreate = () => {
    setEditingPlan(null);
    setName('');
    setSlug('');
    setTarget('');
    setPrice(99);
    setBillingPeriod('year');
    setBadge('');
    setRazorpayPlanId('');
    setBenefitsText('');
    setModalOpen(true);
  };

  const openEdit = (p: MembershipPlan) => {
    setEditingPlan(p);
    setName(p.name);
    setSlug(p.slug);
    setTarget(p.target_audience);
    setPrice(p.price);
    setBillingPeriod(p.billing_period);
    setBadge(p.badge || '');
    setRazorpayPlanId(p.razorpay_plan_id || '');
    setBenefitsText(p.benefits.join('\n'));
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefitsArr = benefitsText.split('\n').map(b => b.trim()).filter(Boolean);

    try {
      const payload = {
        id: editingPlan ? editingPlan.id : undefined,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        target_audience: target,
        price: Number(price),
        discounted_price: Number(price),
        billing_period: billingPeriod,
        badge,
        razorpay_plan_id: razorpayPlanId,
        benefits: benefitsArr
      };

      const res = await fetch('/api/super-admin/plans', {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPlans();
      }
    } catch (err) {
      console.error('Failed to save plan:', err);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/super-admin/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentActive })
      });
      if (res.ok) fetchPlans();
    } catch (err) {
      console.error('Failed to toggle plan active status:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <Link href="/super-admin" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-gray-900 to-gray-950 p-8 rounded-3xl text-white border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Crown className="w-4 h-4" /> Dynamic Plan Configurator
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Membership Tier Manager</h1>
        </div>

        <button
          onClick={openCreate}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Membership Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 uppercase">{p.target_audience}</span>
                <button
                  onClick={() => toggleActive(p.id, p.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}
                >
                  {p.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{p.name}</h3>

              <p className="text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
                ₹{p.price} <span className="text-xs text-gray-400 font-sans">/ {p.billing_period}</span>
              </p>

              <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-800">
                {p.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => openEdit(p)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-brand-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                {editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18–26 years"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Value"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Razorpay Plan ID</label>
                  <input
                    type="text"
                    placeholder="plan_12345"
                    value={razorpayPlanId}
                    onChange={(e) => setRazorpayPlanId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Benefits (1 per line)</label>
                <textarea
                  rows={4}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="All 25 Premium Benefits&#10;Exclusive Community Access&#10;Monthly Live Q&A"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans text-xs"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
