'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { ShoppingBag, Trash2, ArrowLeft, CheckCircle2, AlertCircle, FileText, LayoutTemplate, Sparkles, ShieldCheck, RefreshCw, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore.js';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Alert from '@/components/ui/Alert.jsx';

export default function CartPage() {
  const { items, cartTotal, isLoading, error, fetchCart, updateItemQuantity, removeItem, clearCart } = useCartStore();
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (error) {
      const initTimer = setTimeout(() => setErrorMessage(error), 0);
      const clearTimer = setTimeout(() => setErrorMessage(null), 5000);
      return () => {
        clearTimeout(initTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  const handleQuantityChange = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    setUpdatingId(itemId);
    setErrorMessage(null);
    const res = await updateItemQuantity(itemId, newQty);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
    setUpdatingId(null);
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    await removeItem(itemId);
    setUpdatingId(null);
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to remove all items from your shopping cart?')) {
      await clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">Shopping Cart</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-[#0082CA]" />
              <span>Your Print Orders</span>
            </h1>
          </div>
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0082CA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Error Toast */}
        {errorMessage && (
          <Alert variant="error" title="Cart Update Error">
            {errorMessage}
          </Alert>
        )}

        {/* Loading State for Initial Fetch */}
        {!isMounted || (isLoading && items.length === 0) ? (
          <Card className="p-16 text-center space-y-4 border-slate-200">
            <RefreshCw className="w-10 h-10 text-[#0082CA] animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syncing shopping cart items...</p>
          </Card>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <Card className="p-16 text-center max-w-2xl mx-auto space-y-6 border-slate-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0082CA] border border-blue-100">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your shopping cart is empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-normal leading-relaxed">
                Ready to prepare custom commercial printing? Explore our product catalogue and configure your specifications.
              </p>
            </div>
            <Link href="/category/all">
              <Button variant="primary" size="lg" className="px-8 py-3.5">
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          /* Active Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Cart Items ({items.length})</span>
                <button
                  onClick={handleClear}
                  className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {items.map((item, idx) => {
                const prodName = item.product?.name || item.productNameSnapshot || 'Custom Print Product';
                const prodImg = item.productImageSnapshot || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=300&q=80';
                const configMap = item.configurationSnapshot || {};
                const dims = item.dimensions;
                const isItemUpdating = updatingId === item._id;

                return (
                  <Card
                    key={item._id || idx}
                    className={`p-6 border-slate-200 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
                      isItemUpdating ? 'opacity-50 pointer-events-none' : 'hover:border-slate-300'
                    }`}
                  >
                    {/* Item Image & Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-24 h-24 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                        <img src={prodImg} alt={prodName} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-slate-900/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                          {item.designType}
                        </div>
                      </div>

                      <div className="space-y-2 flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?.slug || ''}`}
                          className="text-base font-black text-slate-900 hover:text-[#0082CA] transition-colors block truncate"
                        >
                          {prodName}
                        </Link>

                        {/* Attribute Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(configMap).map(([k, v]) => {
                            if (k === 'width' || k === 'height') return null;
                            return (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase border border-slate-200"
                              >
                                {k}: {String(v)}
                              </span>
                            );
                          })}
                          {dims && dims.width && dims.height && (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0082CA] text-[10px] font-bold uppercase border border-blue-200">
                              Size: {dims.width} × {dims.height} {dims.unit || 'ft'}
                            </span>
                          )}
                        </div>

                        {/* Design Experience Breakdown */}
                        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1">
                          {item.designType === 'UPLOAD' ? (
                            <div className="flex items-center gap-2 text-slate-700 font-normal truncate">
                              <FileText className="w-3.5 h-3.5 text-[#0082CA] shrink-0" />
                              <span className="truncate">
                                Artwork File: <strong className="text-slate-900">{item.artwork?.originalName || item.artwork?.fileId || 'Custom File'}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-slate-700 font-normal truncate">
                                <LayoutTemplate className="w-3.5 h-3.5 text-[#C71578] shrink-0" />
                                <span className="truncate">
                                  Template Layout: <strong className="text-slate-900">{item.template?.templateName || 'Predefined Template'}</strong>
                                </span>
                              </div>
                              {item.template?.customFields && (
                                <div className="text-[11px] text-slate-500 pl-5 line-clamp-1">
                                  {Object.entries(item.template.customFields)
                                    .map(([k, v]) => `${k}: "${v}"`)
                                    .join(' • ')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Prices */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-4 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Total</div>
                        <div className="text-xl font-black text-slate-900">
                          ₹{Number(item.authoritativeLineTotal || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                          ₹{Number(item.authoritativeUnitPrice || 0).toLocaleString('en-IN')} / unit
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, -50)}
                            disabled={item.quantity <= 50 || isItemUpdating}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-black disabled:opacity-40 transition-all border border-slate-200 cursor-pointer"
                            title="Decrease Quantity (-50)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-14 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, 50)}
                            disabled={isItemUpdating}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-black disabled:opacity-40 transition-all border border-slate-200 cursor-pointer"
                            title="Increase Quantity (+50)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isItemUpdating}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary Sidebar (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6 sticky top-24">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-[#0082CA] uppercase tracking-widest block">Order Calculation</span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">Order Summary</h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Total Items</span>
                  <span className="font-bold text-slate-900">{items.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Total Quantity</span>
                  <span className="font-bold text-slate-900">
                    {items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Subtotal Amount</span>
                  <span className="font-bold text-slate-900">₹{Number(cartTotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Est. GST (18% commercial rate)</span>
                  <span className="font-bold text-slate-900">₹{Math.round((cartTotal || 0) * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs font-normal">
                  <span>Shipping & Logistics</span>
                  <span>Calculated during checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900">Estimated Total</span>
                <span className="text-2xl font-black text-[#0082CA]">₹{Number(cartTotal || 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Verified Pricing Trust Badge */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0082CA] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Verified Server Valuation</span>
                  <p className="text-slate-600 font-normal leading-relaxed">
                    All unit prices, configuration modifiers, and quantity discounts are calculated directly by our server engine.
                  </p>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <div className="space-y-2 pt-2">
                <Link href="/checkout" className="block w-full">
                  <Button variant="primary" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-md py-4">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Proceed to Checkout</span>
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-slate-400 font-normal">
                  * Next step: enter delivery address and contact information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
