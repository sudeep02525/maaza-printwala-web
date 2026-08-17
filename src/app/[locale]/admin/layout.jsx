'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Package, ShoppingCart, LogOut, Settings, Users, LayoutDashboard } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

export default function AdminLayout({ children, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // If we are not on the login page, redirect to login
      if (!pathname.endsWith('/admin')) {
        router.push(`/${params.locale}/admin`);
      }
    } else {
      setIsAuthenticated(true);
      // Redirect from login to dashboard if already authenticated
      if (pathname.endsWith('/admin')) {
        router.push(`/${params.locale}/admin/dashboard`);
      }
    }
    setIsLoading(false);
  }, [pathname, router, params.locale]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    router.push(`/${params.locale}/admin`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  // If not authenticated and on login page, just render children (login form)
  if (!isAuthenticated && pathname.endsWith('/admin')) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Avoid rendering admin layout if redirecting to login
  if (!isAuthenticated) return null;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: `/admin/dashboard` },
    { label: 'Products', icon: Package, href: `/admin/products` },
    { label: 'Orders', icon: ShoppingCart, href: `/admin/orders` },
    { label: 'Customers', icon: Users, href: `/admin/customers` },
    { label: 'Settings', icon: Settings, href: `/admin/settings` },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.includes(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
}
