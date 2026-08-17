'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    // In a real app with auth, we'd fetch the user's orders using their token
    // For now, if we are guest, we might just show a message or fetch from localstorage guest token
    // Let's attempt to fetch from the API (which uses the cookie or token)
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        // Just hitting the /api/orders endpoint. If unauth, it returns 401.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
          headers
        });
        const data = await res.json();
        if (data.success && data.data.orders) {
           setOrders(data.data.orders);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Orders</h1>
      
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-600 mb-4">You have not placed any orders yet, or you are not logged in.</p>
          <a href={`/${locale}/products`} className="text-[#0082CA] font-bold hover:underline">Continue Shopping</a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Order #{order.orderNumber}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{order.items?.[0]?.productNameSnapshot || 'Custom Print Item'}</h3>
                <p className="text-sm text-slate-600">Quantity: {order.items?.[0]?.quantity}</p>
                <p className="text-sm text-slate-600 mt-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.fulfilmentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                  order.fulfilmentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.fulfilmentStatus.replace('_', ' ')}
                </span>
                <span className="text-xl font-black text-slate-900">₹{order.finalPayableAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
