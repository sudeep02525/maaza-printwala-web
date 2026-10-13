'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing.js';
import axiosInstance from '@/services/axiosInstance.js';
import { useAuthStore } from '@/store/authStore.js';
import { Package, ArrowRight, Loader2 } from 'lucide-react';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login?next=/orders');
      return;
    }

    if (isAuthenticated) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const res = await axiosInstance.get('/orders');
          if (res.success && res.data?.orders) {
            setOrders(res.data.orders);
          } else if (res.orders) {
            setOrders(res.orders);
          }
        } catch(e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-8">My Orders</h1>
      
      {isLoading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)]">
          <p className="text-[var(--text-muted)] mb-4">You have not placed any orders yet, or you are not logged in.</p>
          <Link href="/products" className="text-[#0082CA] font-bold hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider mb-1">Order #{order.orderNumber}</p>
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">{order.items?.[0]?.productNameSnapshot || 'Custom Print Item'}</h3>
                <p className="text-sm text-[var(--text-muted)]">Quantity: {order.items?.[0]?.quantity}</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.fulfilmentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                  order.fulfilmentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.fulfilmentStatus.replace('_', ' ')}
                </span>
                <span className="text-xl font-black text-[var(--text-main)]">₹{order.finalPayableAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
