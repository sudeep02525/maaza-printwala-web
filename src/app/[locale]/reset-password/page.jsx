'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { Link, useRouter } from '@/i18n/routing.js';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  const { resetPassword, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setLocalError('');

    if (!token.trim()) {
      setValidationError('Password reset token is required.');
      return;
    }

    if (newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    try {
      await resetPassword(token.trim(), newPassword);
      setIsSuccess(true);
    } catch (err) {
      setLocalError(err.message || 'Failed to reset password. The link or token may have expired.');
    }
  };

  const activeError = validationError || localError;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFCFF] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-sky-50 text-[#0082CA] rounded-2xl flex items-center justify-center shadow-xs border border-sky-100">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Set New Password</h1>
          <p className="text-slate-500 font-medium text-sm">
            Create a secure password with at least 6 characters
          </p>
        </div>

        {activeError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-sm font-semibold">
            {activeError}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="text-lg font-bold text-emerald-950">Password Updated!</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Your password has been changed successfully. You can now log into your account.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full py-3.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!tokenFromUrl && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors text-slate-900 font-mono text-sm"
                  placeholder="Paste your reset token here"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors text-slate-900"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:bg-white transition-colors text-slate-900 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-rose-300 focus:border-rose-500'
                    : 'border-slate-200 focus:border-[#0082CA]'
                }`}
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                'Save New Password'
              )}
            </button>

            <p className="mt-4 text-center text-sm font-medium text-slate-600">
              Remember your password?{' '}
              <Link href="/login" className="text-[#0082CA] hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
