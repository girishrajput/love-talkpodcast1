'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Crown, 
  Zap, 
  HeartHandshake, 
  ArrowRight,
  Lock,
  Check,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_PLANS, INITIAL_BENEFITS } from '@/lib/data';
import { fetchMembershipPlans } from '@/lib/api';
import { MembershipPlan, PremiumBenefit } from '@/lib/types';

export default function MembershipPage() {
  const router = useRouter();
  const { user, membership, isPremium, refreshSession } = useAuth();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [benefits, setBenefits] = useState<PremiumBenefit[]>(INITIAL_BENEFITS);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function loadPlans() {
      setIsLoading(true);
      const res = await fetchMembershipPlans();
      setPlans(res.plans);
      setBenefits(res.benefits);
      setIsLoading(false);
    }
    loadPlans();
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleJoinPlan = async (plan: MembershipPlan) => {
    // 1. Auth Check
    if (!user) {
      router.push('/login?redirect=/membership');
      return;
    }

    setProcessingPlanId(plan.id);
    setStatusMessage('Creating subscription order...');

    try {
      // 2. Call server-side API to create Razorpay Subscription
      const res = await fetch('/api/razorpay/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id, userId: user.id })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create subscription order');
      }

      const subscriptionId = orderData.subscription_id || orderData.subscriptionId || orderData.orderId;

      // 3. Load Razorpay SDK
      setStatusMessage('Opening Razorpay Checkout...');
      const isSdkLoaded = await loadRazorpayScript();

      // Check if real configured key or test mode
      const isRealRazorpay = Boolean(
        isSdkLoaded &&
        (window as any).Razorpay &&
        orderData.isConfigured &&
        orderData.keyId &&
        !orderData.keyId.includes('YOUR_') &&
        !orderData.keyId.includes('rzp_test_lovetalk')
      );

      if (isRealRazorpay) {
        const options: any = {
          key: orderData.keyId || orderData.key,
          subscription_id: subscriptionId,
          name: 'Love Talk Podcast',
          description: `${plan.name} Subscription Plan`,
          image: '/images/tim_chels.jpg',
          handler: async function (response: any) {
            setStatusMessage('Verifying subscription payment signature...');
            try {
              const verifyRes = await fetch('/api/razorpay/subscription/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id || subscriptionId,
                  razorpay_signature: response.razorpay_signature,
                  userId: user.id,
                  planId: plan.id
                })
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                await refreshSession();
                router.push(`/payment/success?plan=${encodeURIComponent(plan.name)}&amount=${orderData.planPrice}&payId=${response.razorpay_payment_id}`);
              } else {
                router.push(`/payment/failed?reason=${encodeURIComponent(verifyData.error || 'Subscription signature verification failed')}`);
              }
            } catch (vErr: any) {
              router.push(`/payment/failed?reason=${encodeURIComponent(vErr.message || 'Verification failed')}`);
            }
          },
          prefill: {
            name: user.name || '',
            email: user.email || ''
          },
          theme: {
            color: '#e11d48'
          },
          modal: {
            ondismiss: function () {
              setProcessingPlanId(null);
              setStatusMessage('');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          console.error('Razorpay subscription payment failed:', resp.error);
          router.push(`/payment/failed?reason=${encodeURIComponent(resp.error?.description || 'Subscription payment failed')}`);
        });
        rzp.open();
      } else {
        // Dev / Test Mode Checkout Flow — Razorpay is not configured with
        // real live credentials, so no real payment gateway is involved.
        console.warn('[Razorpay] Real credentials not detected — using mock checkout flow. This must never happen in production.');
        setStatusMessage('Processing test subscription verification (mock mode — no real payment gateway configured)...');
        const mockPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const mockSignature = `mock_sig_${Date.now()}`;

        const verifyRes = await fetch('/api/razorpay/subscription/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: mockPaymentId,
            razorpay_subscription_id: subscriptionId,
            razorpay_signature: mockSignature,
            userId: user.id,
            planId: plan.id
          })
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          await refreshSession();
          router.push(`/payment/success?plan=${encodeURIComponent(plan.name)}&amount=${orderData.planPrice}&payId=${mockPaymentId}&mock=1`);
        } else {
          router.push(`/payment/failed?reason=${encodeURIComponent(verifyData.error || 'Test verification failed')}`);
        }
      }
    } catch (err: any) {
      console.error('Subscription checkout error:', err);
      router.push(`/payment/failed?reason=${encodeURIComponent(err.message || 'Subscription initiation failed')}`);
    } finally {
      setProcessingPlanId(null);
      setStatusMessage('');
    }
  };

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-brand-500" /> Unlock Love Talk Premium
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Invest in Your Relationships & Emotional Growth
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Get unlimited access to locked premium audio episodes, ad-free listening, dual-language transcripts, and monthly live Q&As with Tim & Chels.
        </p>

        {statusMessage && (
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-600 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> {statusMessage}
          </div>
        )}
      </div>

      {/* Dynamic Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isCurrentActivePlan = membership?.plan_id === plan.id && isPremium;
          const isProcessing = processingPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all flex flex-col justify-between shadow-xl ${
                plan.is_featured
                  ? 'border-brand-500 ring-4 ring-brand-500/10'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-brand-600 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-extrabold shadow-md uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    Target: {plan.target_audience}
                  </span>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    {plan.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-mono">
                    ₹{plan.discounted_price || plan.price}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    / {plan.billing_period}
                  </span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {plan.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 space-y-3">
                {isCurrentActivePlan ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm text-center flex items-center justify-center gap-2 border border-emerald-500/40">
                    <Check className="w-5 h-5" /> Active Subscription
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleJoinPlan(plan)}
                      disabled={isProcessing}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                        plan.is_featured
                          ? 'bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 hover:to-rose-400 shadow-brand-600/30'
                          : 'bg-gray-900 dark:bg-white text-gray-900 dark:text-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> {statusMessage || 'Processing...'}
                        </>
                      ) : (
                        <>
                          Subscribe Now <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic 25 Premium Benefits Breakdown */}
      <section className="space-y-8 bg-gray-50/70 dark:bg-gray-900/40 p-8 sm:p-12 rounded-3xl border border-gray-200/80 dark:border-gray-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">All 25 Premium Member Benefits</h2>
          <p className="text-xs text-gray-500">Included with both Youth and Professional memberships</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 flex items-start gap-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                #{b.sort_order}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">{b.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-1">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Razorpay Trust Seal */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 pt-4">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Payment
        </span>
        <span>•</span>
        <span>Razorpay Gateway Verified</span>
        <span>•</span>
        <span>Cancel Anytime</span>
      </div>

    </div>
  );
}
