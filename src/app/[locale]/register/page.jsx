'use client';
import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { useRouter } from '@/i18n/routing.js';
import { Link } from '@/i18n/routing.js';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const { register, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, phone);
      router.push('/orders');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFCFF] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 font-medium text-sm">Join Maza Printwala today</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-white transition-colors"
              placeholder="Create a password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0082CA] hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
