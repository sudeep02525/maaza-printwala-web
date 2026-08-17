'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh list
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Products</h2>
        <Link 
          href="/admin/products/add" 
          className="flex items-center gap-2 bg-[#0082CA] text-white px-4 py-2 rounded-md hover:bg-[#006A9C] transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price (₹)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {product.images && product.images[0] ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                        onError={(e) => { e.target.src = '/placeholder.png' }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-800">{product.name}</td>
                  <td className="p-4 text-slate-600">{product.category?.name || '-'}</td>
                  <td className="p-4 text-slate-600">{product.basePrice}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/products/edit/${product._id}`} className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
