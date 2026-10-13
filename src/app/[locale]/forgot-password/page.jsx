'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { Link } from '@/i18n/routing.js';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState(null);
  const [localError, setLocalError] = useState('');
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      const res = await forgotPassword(email);
      setSubmitted(true);
      if (res?.data?.resetToken || res?.resetToken) {
        setDevToken(res?.data?.resetToken || res?.resetToken);
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-subtle)] px-4 py-12">
      <div className="w-full max-w-md bg-[var(--bg-card)] p-8 rounded-2xl shadow-sm border border-[var(--border)]">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-sky-50 text-[#0082CA] rounded-2xl flex items-center justify-center shadow-xs border border-sky-100">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] mb-2">Forgot Password?</h1>
          <p className="text-[var(--text-muted)] font-medium text-sm">
            No worries! Enter your account email and we'll send you a password reset link.
          </p>
        </div>

        {localError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-sm font-semibold">
            {localError}
          </div>
        )}

        {submitted ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Reset instructions sent</h4>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  If an account exists with <strong className="font-semibold">{email}</strong>, a password reset email has been dispatched. Check your inbox and spam folder.
                </p>
              </div>
            </div>

            {devToken && (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Fast Test Link</span>
                  <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-1.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-sky-700">Click below to proceed to the password reset form directly:</p>
                <Link
                  href={`/reset-password?token=${devToken}`}
                  className="w-full py-2.5 px-3 bg-[#0082CA] hover:bg-[#0068A2] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Reset Password Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3 bg-[var(--hover)] hover:bg-[var(--border)] text-[var(--text-main)] font-bold rounded-lg text-center block text-sm transition-colors"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-2"
              >
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-[var(--bg-card)] transition-colors text-[var(--text-main)]"
                  placeholder="name@example.com"
                />
                <Mail className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--text-muted)] hover:text-[#0082CA] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
