'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function AdminAddProduct() {
  const router = useRouter();
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    basePrice: '',
    shortDescription: '',
    description: '',
    artworkRequirements: JSON.stringify({
      allowedFormats: ['PDF', 'PNG', 'JPG'],
      minDpi: 300,
      requiresManualReview: true,
      safeZoneMm: 3,
      bleedMm: 3
    }, null, 2)
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data.categories || data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from name if slug is empty or user is typing name
      if (name === 'name' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (imageFile) {
      data.append('images', imageFile);
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });
      const result = await response.json();
      if (result.success) {
        alert('Product created successfully!');
        router.push(`/${locale}/admin/products`);
      } else {
        alert(result.message || 'Failed to create product');
      }
    } catch (err) {
      alert('Error creating product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
            <input 
              type="text" name="slug" value={formData.slug} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
            <select 
              name="category" value={formData.category} onChange={handleChange} required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
            >
              <option value="">Select a Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹) *</label>
            <input 
              type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
          <input 
            type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            name="description" value={formData.description} onChange={handleChange} rows="4"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
          <input 
            type="file" accept="image/*" onChange={handleImageChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Artwork Requirements (JSON)</label>
          <textarea 
            name="artworkRequirements" value={formData.artworkRequirements} onChange={handleChange} rows="6"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-[#0082CA] focus:border-[#0082CA] outline-none font-mono text-sm"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#0082CA] text-white rounded-md hover:bg-[#006A9C] transition-colors disabled:opacity-70">
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
