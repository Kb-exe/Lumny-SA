import React, { useState } from 'react';
import { User, SubscriptionInfo, SubscriptionPlan } from '../../types';
import { updateUserSubscription, cancelUserSubscription } from '../../services/storage';
import { Check, Sparkles, X, Shield, CreditCard, Calendar, Clock, ArrowRight, Zap, RefreshCw, AlertCircle, Award } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSubscriptionUpdated: (updatedUser: User) => void;
  defaultPlan?: SubscriptionPlan;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubscriptionUpdated,
  defaultPlan = 'free_trial',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(defaultPlan);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'capitec' | 'eft' | 'googlepay'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 4012');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSub = currentUser?.subscription;
  const isTrialActive = currentSub?.status === 'trialing';
  const isPaidActive = currentSub?.status === 'active';

  // Calculate days left in trial if active
  const getTrialDaysLeft = () => {
    if (!currentSub?.trialEndsAt) return 0;
    const diff = new Date(currentSub.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubscribe = () => {
    if (!currentUser) {
      setErrorMessage('Please log in or create an account to start your subscription.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setTimeout(() => {
      let subData: SubscriptionInfo;

      if (selectedPlan === 'free_trial') {
        const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        subData = {
          plan: 'free_trial',
          status: 'trialing',
          trialEndsAt: trialEndDate,
          currentPeriodEnd: trialEndDate,
          price: 6.99,
          billingCycle: 'monthly',
          currency: '$',
          autoRenew: true,
          paymentMethod: paymentMethod === 'capitec' ? 'Capitec Pay' : paymentMethod === 'eft' ? 'Instant EFT' : 'Card ending in 4012'
        };
      } else if (selectedPlan === 'monthly') {
        const monthEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        subData = {
          plan: 'monthly',
          status: 'active',
          currentPeriodEnd: monthEndDate,
          price: 6.99,
          billingCycle: 'monthly',
          currency: '$',
          autoRenew: true,
          paymentMethod: paymentMethod === 'capitec' ? 'Capitec Pay' : paymentMethod === 'eft' ? 'Instant EFT' : 'Card ending in 4012'
        };
      } else {
        // Yearly
        const yearEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        subData = {
          plan: 'yearly',
          status: 'active',
          currentPeriodEnd: yearEndDate,
          price: 49.99,
          billingCycle: 'yearly',
          currency: '$',
          autoRenew: true,
          paymentMethod: paymentMethod === 'capitec' ? 'Capitec Pay' : paymentMethod === 'eft' ? 'Instant EFT' : 'Card ending in 4012'
        };
      }

      const updated = updateUserSubscription(currentUser.id, subData);
      setIsProcessing(false);

      if (updated) {
        onSubscriptionUpdated(updated);
        setSuccessMessage(
          selectedPlan === 'free_trial'
            ? 'Your 7-day free trial has been activated! Enjoy unlimited Grade 12 study access.'
            : selectedPlan === 'yearly'
            ? 'Welcome to the Lumina SA Yearly Plan! You are set for the entire matric year.'
            : 'Your Monthly Plan ($6.99/mo) has been activated successfully!'
        );
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage('Failed to update subscription. Please try again.');
      }
    }, 900);
  };

  const handleCancelSubscription = () => {
    if (!currentUser) return;
    setIsProcessing(true);
    setTimeout(() => {
      const updated = cancelUserSubscription(currentUser.id);
      setIsProcessing(false);
      if (updated) {
        onSubscriptionUpdated(updated);
        setSuccessMessage('Subscription auto-renew has been cancelled. You retain access until the end of your billing cycle.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Lumina SA All-Access Pass</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Supercharge Your Grade 12 Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Start with our risk-free <strong>7-Day Free Trial</strong> or choose an affordable plan to ace your Matric trials and NSC finals.
          </p>

          {/* Current status pill if subscribed */}
          {currentSub && currentSub.status !== 'expired' && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                Current Plan:{' '}
                {currentSub.status === 'trialing'
                  ? `7-Day Free Trial (${getTrialDaysLeft()} days left)`
                  : currentSub.plan === 'yearly'
                  ? 'Yearly Plan ($49.99/yr)'
                  : 'Monthly Plan ($6.99/mo)'}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 3 Subscription Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* OPTION 1: 7-DAY FREE TRIAL */}
            <div
              onClick={() => setSelectedPlan('free_trial')}
              className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between relative ${
                selectedPlan === 'free_trial'
                  ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono uppercase">
                    Risk-Free
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === 'free_trial' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedPlan === 'free_trial' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  7-Day Free Trial
                </h3>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    $0.00
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Free for 7 days, then $6.99/mo
                  </span>
                </div>

                <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full Mzansi Tuta AI</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All DBE Past Papers &amp; Memos</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Cancel anytime online</span>
                  </li>
                </ul>
              </div>

              <div className="mt-3 text-[10px] text-amber-700 font-medium">
                No charge until day 7
              </div>
            </div>

            {/* OPTION 2: MONTHLY SUBSCRIPTION ($6.99) */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between relative ${
                selectedPlan === 'monthly'
                  ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono uppercase">
                    Monthly
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === 'monthly' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedPlan === 'monthly' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Monthly Subscription
                </h3>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    $6.99 <span className="text-xs font-normal text-slate-500">/ mo</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Billed monthly (approx. R125/mo)
                  </span>
                </div>

                <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unlimited AI summaries &amp; Q&amp;A</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Interactive MCQs &amp; Flashcards</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Complete Matric Archives</span>
                  </li>
                </ul>
              </div>

              <div className="mt-3 text-[10px] text-slate-500">
                Cancel anytime, keep access to end of month
              </div>
            </div>

            {/* OPTION 3: YEARLY SUBSCRIPTION */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between relative ${
                selectedPlan === 'yearly'
                  ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Save 30% · Best Value
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                    Matric Year Pass
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === 'yearly' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedPlan === 'yearly' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Yearly Subscription
                </h3>

                <div className="pt-1">
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    $49.99 <span className="text-xs font-normal text-slate-500">/ yr</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Just $4.16/mo · Billed annually
                  </span>
                </div>

                <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All Monthly features included</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Covers all 2026 prelims &amp; finals</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Priority Mzansi Tuta AI speed</span>
                  </li>
                </ul>
              </div>

              <div className="mt-3 text-[10px] text-emerald-800 font-semibold">
                Peace of mind for the entire Grade 12 year
              </div>
            </div>

          </div>

          {/* Simulated Payment Method Selection */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Payment Method
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-white border-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('capitec')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'capitec'
                    ? 'bg-white border-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-rose-600" />
                <span>Capitec Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('eft')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'eft'
                    ? 'bg-white border-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant EFT</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('googlepay')}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'googlepay'
                    ? 'bg-white border-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>Google Pay</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 block mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Expiry / CVV</label>
                  <input
                    type="text"
                    defaultValue="08/28 · 319"
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Secure Activation...</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedPlan === 'free_trial'
                      ? 'Start 7-Day Free Trial ($0 Due Today)'
                      : selectedPlan === 'yearly'
                      ? 'Upgrade to Yearly Plan ($49.99/year)'
                      : 'Subscribe for $6.99 / month'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Cancel subscription link if currently active */}
            {currentSub && currentSub.autoRenew && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  className="text-xs text-slate-500 hover:text-rose-600 underline font-medium"
                >
                  Cancel subscription auto-renewal
                </button>
              </div>
            )}
          </div>

          {/* Trust and Guarantee badges */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Bank Grade Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant AI &amp; Past Paper Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>100% CAPS Grade 12 Aligned</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
