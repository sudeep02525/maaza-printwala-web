'use client';

import React, { useEffect, useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh list
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Orders Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount (₹)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-600">{order.orderNumber}</td>
                  <td className="p-4 text-slate-800 font-medium">
                    {order.contactDetails?.fullName}<br/>
                    <span className="text-xs text-slate-500 font-normal">{order.contactDetails?.phone}</span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {order.items?.[0]?.productNameSnapshot}<br/>
                    <span className="text-xs text-slate-500">Qty: {order.items?.[0]?.quantity}</span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-slate-800">{order.finalPayableAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                      order.fulfilmentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      order.fulfilmentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.fulfilmentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.fulfilmentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:border-[#0082CA]"
                    >
                      <option value="ORDER_RECEIVED">Pending</option>
                      <option value="PRINTING">Printing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
