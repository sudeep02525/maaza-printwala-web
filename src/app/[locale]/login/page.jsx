'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { useRouter, Link } from '@/i18n/routing.js';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [submitError, setSubmitError] = useState('');

  const { login, isLoading, error: storeError, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/orders';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextUrl);
    }
  }, [isAuthenticated, nextUrl, router]);

  useEffect(() => {
    if (storeError) {
      setSubmitError(storeError);
    }
  }, [storeError]);

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let valid = true;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
      valid = false;
    }

    if (!password) {
      errors.password = 'Please enter your password.';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim(), password);
      router.push(nextUrl);
    } catch (err) {
      setSubmitError(err.message || 'Incorrect email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    // Graceful Google Auth fallback / prompt
    alert('Google One-Tap is being configured with your production client credentials. Please use email and password to log in.');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-[var(--bg-card)] p-7 sm:p-9 rounded-2xl shadow-sm border border-[var(--border)]">
        
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight mb-2">Welcome Back</h1>
          <p className="text-[var(--text-muted)] font-medium text-xs sm:text-sm">Sign in to your Maza Printwala account</p>
        </div>
        
        {/* Global Error Banner */}
        {submitError && (
          <div
            role="alert"
            className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm font-semibold flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
          
          {/* Email Field */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                if (submitError) setSubmitError('');
              }}
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                fieldErrors.email
                  ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                  : 'border-[var(--border)] focus:border-[#0082CA]'
              }`}
              placeholder="name@example.com"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#0082CA] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                  if (submitError) setSubmitError('');
                }}
                required
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className={`w-full px-4 py-3 pr-11 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                  fieldErrors.password
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                    : 'border-[var(--border)] focus:border-[#0082CA]'
                }`}
                placeholder="Enter your account password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)] p-1.5 cursor-pointer rounded-lg"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#0082CA] rounded border-[var(--border-strong)] focus:ring-[#0082CA] cursor-pointer"
              />
              <span className="text-xs text-[var(--text-muted)] font-medium">Remember me on this browser</span>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <span className="relative px-3 bg-[var(--bg-card)] text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Social Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 px-4 border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--hover)] rounded-xl font-bold text-xs sm:text-sm text-[var(--text-main)] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Security & GST Trust Line */}
        <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[var(--text-faint)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL encrypted &bull; GST tax invoices enabled</span>
        </div>

        {/* Sign Up Redirect */}
        <p className="mt-5 text-center text-xs sm:text-sm font-medium text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link
            href={searchParams.get('next') ? `/register?next=${encodeURIComponent(searchParams.get('next'))}` : '/register'}
            className="text-[#0082CA] hover:underline font-bold"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
