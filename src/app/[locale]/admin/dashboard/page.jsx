'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Total Orders</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Total Products</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">Manage in Products tab</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Revenue</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">₹0</p>
        </div>
      </div>
    </div>
  );
}
