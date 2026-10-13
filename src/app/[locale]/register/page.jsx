'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { useRouter, Link } from '@/i18n/routing.js';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });
  const [submitError, setSubmitError] = useState('');

  const { register, isLoading, error: storeError, isAuthenticated } = useAuthStore();
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

  // Dynamic Password Strength Meter
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-[var(--border)]' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  }, [password]);

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    };
    let valid = true;

    if (!name.trim()) {
      errors.name = 'Please enter your full name.';
      valid = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
      valid = false;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required.';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      valid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy.';
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
      await register(name.trim(), email.trim(), password, phone.trim());
      router.push(nextUrl);
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. An account with this email may already exist.');
    }
  };

  const handleGoogleSignUp = () => {
    alert('Google One-Tap is being configured with your production client credentials. Please fill out the registration form below.');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md bg-[var(--bg-card)] p-7 sm:p-9 rounded-2xl shadow-sm border border-[var(--border)]">
        
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight mb-2">Create Account</h1>
          <p className="text-[var(--text-muted)] font-medium text-xs sm:text-sm">Join Maza Printwala for custom merchandise & instant prints</p>
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5"
            >
              Full Name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }));
                if (submitError) setSubmitError('');
              }}
              required
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={`w-full px-4 py-2.5 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                fieldErrors.name
                  ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                  : 'border-[var(--border)] focus:border-[#0082CA]'
              }`}
              placeholder="e.g. Rahul Sharma"
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.name}</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                if (submitError) setSubmitError('');
              }}
              required
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-2.5 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                fieldErrors.email
                  ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                  : 'border-[var(--border)] focus:border-[#0082CA]'
              }`}
              placeholder="name@example.com"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="register-phone"
                className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider"
              >
                Mobile Phone
              </label>
              <span className="text-[11px] text-[var(--text-faint)] font-medium">Optional for SMS tracking</span>
            </div>
            <div className="relative flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[var(--border)] bg-[var(--hover)] text-[var(--text-muted)] text-xs font-bold">
                +91
              </span>
              <input
                id="register-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(cleaned);
                  if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }));
                }}
                maxLength={10}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                className={`w-full px-4 py-2.5 bg-[var(--bg-subtle)] border rounded-r-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                  fieldErrors.phone
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                    : 'border-[var(--border)] focus:border-[#0082CA]'
                }`}
                placeholder="10-digit number"
              />
            </div>
            {fieldErrors.phone && (
              <p id="phone-error" className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.phone}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
                  if (submitError) setSubmitError('');
                }}
                required
                minLength={6}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className={`w-full px-4 py-2.5 pr-11 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                  fieldErrors.password
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                    : 'border-[var(--border)] focus:border-[#0082CA]'
                }`}
                placeholder="At least 6 characters"
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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Strength:</span>
                  <span className={`font-bold ${passwordStrength.text}`}>{passwordStrength.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                  <div className={`rounded-full h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-[var(--border)]'} transition-all`} />
                  <div className={`rounded-full h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-[var(--border)]'} transition-all`} />
                  <div className={`rounded-full h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-[var(--border)]'} transition-all`} />
                </div>
              </div>
            )}

            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="register-confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: '' }));
                }}
                required
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                className={`w-full px-4 py-2.5 pr-11 bg-[var(--bg-subtle)] border rounded-xl focus:outline-none focus:bg-[var(--bg-card)] transition-colors text-sm text-[var(--text-main)] ${
                  fieldErrors.confirmPassword
                    ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                    : 'border-[var(--border)] focus:border-[#0082CA]'
                }`}
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)] p-1.5 cursor-pointer rounded-lg"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p id="confirm-password-error" className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <span>&bull;</span>
                <span>{fieldErrors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="pt-1">
            <label htmlFor="register-terms" className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                id="register-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (fieldErrors.agreeTerms) setFieldErrors((p) => ({ ...p, agreeTerms: '' }));
                }}
                className="mt-0.5 w-4 h-4 text-[#0082CA] rounded border-[var(--border-strong)] focus:ring-[#0082CA] cursor-pointer"
              />
              <span className="text-xs text-[var(--text-muted)] leading-normal">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#0082CA] font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#0082CA] font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {fieldErrors.agreeTerms && (
              <p className="text-xs text-rose-600 font-medium mt-1 pl-6.5">
                {fieldErrors.agreeTerms}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Social Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <span className="relative px-3 bg-[var(--bg-card)] text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
            or sign up with
          </span>
        </div>

        {/* Social Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full py-2.5 px-4 border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-slate-50/80 rounded-xl font-bold text-xs sm:text-sm text-[var(--text-main)] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
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
          <span>Sign up with Google</span>
        </button>

        {/* Trust Line */}
        <div className="mt-4 pt-3.5 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[var(--text-faint)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant account access &bull; Easy re-ordering</span>
        </div>

        {/* Sign In Redirect */}
        <p className="mt-4 text-center text-xs sm:text-sm font-medium text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link
            href={searchParams.get('next') ? `/login?next=${encodeURIComponent(searchParams.get('next'))}` : '/login'}
            className="text-[#0082CA] hover:underline font-bold"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
