'use client';
import React, { useState } from 'react';
import axiosInstance from '@/services/axiosInstance.js';
import { Package, Truck, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      // The API endpoint handles finding order without requiring login
      const res = await axiosInstance.get(`/orders/track/${orderNumber.trim()}`);
      if (res.data?.order) {
        setOrder(res.data.order);
      } else {
        setError('Order not found. Please check your order number.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not find that order. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-[var(--hover)] text-[var(--text-main)] border-[var(--border)]';
    }
  };

  return (
    <div className="min-h-[80vh] bg-[var(--bg-subtle)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] mb-4">Track Your Order</h1>
          <p className="text-[var(--text-muted)] font-medium">Enter your order ID below to check its current status and estimated delivery time.</p>
        </div>

        <div className="bg-[var(--bg-card)] p-6 sm:p-10 rounded-2xl shadow-sm border border-[var(--border)] mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-12345"
              className="flex-1 px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[#0082CA] focus:bg-[var(--bg-card)] transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="px-8 py-3 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p>}
        </div>

        {order && (
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1">Order Details</p>
                <h2 className="text-xl font-extrabold text-[var(--text-main)]">{order.orderNumber || order._id}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(order.status)}`}>
                {order.status || 'Received'}
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[var(--text-faint)] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Date Placed</p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[var(--text-faint)] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">₹{order.totalAmount}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:col-span-2">
                <Truck className="w-5 h-5 text-[var(--text-faint)] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Shipping To</p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">{order.shippingAddress?.fullName}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--bg-subtle)] p-6 border-t border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4">Items Summary</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--bg-card)] rounded-md border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                      <Package className="w-6 h-6 text-[var(--text-faint)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-main)] truncate">{item.product?.name || 'Custom Product'}</p>
                      <p className="text-xs font-medium text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-main)]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
