'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { ShoppingBag, Trash2, ArrowLeft, CheckCircle2, AlertCircle, FileText, LayoutTemplate, Sparkles, ShieldCheck, RefreshCw, Plus, Minus, ArrowRight, Tag, Percent, X, Check } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import { useCartStore } from '@/store/cartStore.js';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Alert from '@/components/ui/Alert.jsx';

const formatFieldLabel = (key) => {
  const map = {
    company_name: 'Company Name',
    tagline: 'Tagline',
    website: 'Website',
    logo_letter: 'Logo Letter',
    address: 'Address',
    person_name: 'Person Name',
    job_title: 'Job Title',
    contact_info: 'Contact Info',
    email: 'Email',
    phone: 'Phone',
  };
  if (map[key]) return map[key];
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CartPage() {
  const { items, cartTotal, isLoading, error, fetchCart, updateItemQuantity, removeItem, clearCart } = useCartStore();
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState([]);

  useEffect(() => {
    axiosInstance.get('/coupons/active')
      .then((res) => {
        if (res.data?.coupons) setActiveCoupons(res.data.coupons);
      })
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (codeToUse) => {
    const code = (codeToUse || couponInput).trim();
    if (!code) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await axiosInstance.post('/coupons/validate', {
        code,
        cartTotal,
      });
      if (res.data) {
        setAppliedCoupon(res.data);
        setCouponInput(code);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message || 'Invalid or expired coupon.');
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

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
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">Shopping Cart</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-[#0082CA]" />
              <span>Your Print Orders</span>
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[#0082CA] transition-colors"
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
          <Card className="p-16 text-center space-y-4 border-[var(--border)]">
            <RefreshCw className="w-10 h-10 text-[#0082CA] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Syncing shopping cart items...</p>
          </Card>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <Card className="p-16 text-center max-w-2xl mx-auto space-y-6 border-[var(--border)]">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0082CA] border border-blue-100">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">Your shopping cart is empty</h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto font-normal leading-relaxed">
                Ready to prepare custom commercial printing? Explore our product catalogue and configure your specifications.
              </p>
            </div>
            <Link href="/products">
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
              <div className="flex items-center justify-between px-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
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
                    className={`p-6 border-[var(--border)] transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
                      isItemUpdating ? 'opacity-50 pointer-events-none' : 'hover:border-[var(--border-strong)]'
                    }`}
                  >
                    {/* Item Image & Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-24 h-24 rounded-lg bg-[var(--hover)] overflow-hidden shrink-0 border border-[var(--border)] relative">
                        <img src={prodImg} alt={prodName} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                          {item.designType}
                        </div>
                      </div>

                      <div className="space-y-2 flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?.slug || ''}`}
                          className="text-base font-black text-[var(--text-main)] hover:text-[#0082CA] transition-colors block truncate"
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
                                className="px-2 py-0.5 rounded bg-[var(--hover)] text-[var(--text-main)] text-[10px] font-bold uppercase border border-[var(--border)]"
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
                        <div className="bg-[var(--bg-subtle)] rounded-lg p-2.5 border border-[var(--border)] text-xs space-y-1">
                          {item.designType === 'UPLOAD' ? (
                            <div className="flex items-center gap-2 text-[var(--text-main)] font-normal truncate">
                              <FileText className="w-3.5 h-3.5 text-[#0082CA] shrink-0" />
                              <span className="truncate">
                                Artwork File: <strong className="text-[var(--text-main)]">{item.artwork?.originalName || item.artwork?.fileId || 'Custom File'}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[var(--text-main)] font-normal truncate">
                                <LayoutTemplate className="w-3.5 h-3.5 text-[#C71578] shrink-0" />
                                <span className="truncate">
                                  Template Layout: <strong className="text-[var(--text-main)]">{item.template?.templateName || 'Predefined Template'}</strong>
                                </span>
                              </div>
                              {item.template?.customFields && (
                                <div className="text-[11px] text-[var(--text-muted)] pl-5 flex flex-wrap gap-x-3 gap-y-1">
                                  {Object.entries(item.template.customFields).map(([k, v]) => (
                                    <span key={k}>
                                      <span className="font-semibold text-[var(--text-muted)]">{formatFieldLabel(k)}:</span>{' '}
                                      <span className="text-[var(--text-main)] font-medium">"{v}"</span>
                                    </span>
                                  ))}
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
                        <div className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Line Total</div>
                        <div className="text-xl font-black text-[var(--text-main)]">
                          ₹{Number(item.authoritativeLineTotal || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] font-semibold text-[var(--text-muted)]">
                          ₹{Number(item.authoritativeUnitPrice || 0).toLocaleString('en-IN')} / unit
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center bg-[var(--bg-subtle)] rounded-lg p-1 border border-[var(--border)]">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, -50)}
                            disabled={item.quantity <= 50 || isItemUpdating}
                            className="w-7 h-7 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--hover)] text-[var(--text-main)] flex items-center justify-center font-black disabled:opacity-40 transition-all border border-[var(--border)] cursor-pointer"
                            title="Decrease Quantity (-50)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-14 text-center text-xs font-bold text-[var(--text-main)]">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity, 50)}
                            disabled={isItemUpdating}
                            className="w-7 h-7 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--hover)] text-[var(--text-main)] flex items-center justify-center font-black disabled:opacity-40 transition-all border border-[var(--border)] cursor-pointer"
                            title="Increase Quantity (+50)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isItemUpdating}
                          className="p-2 text-[var(--text-faint)] hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
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
            <div className="lg:col-span-4 bg-[var(--bg-card)] p-6 sm:p-8 rounded-lg border border-[var(--border)] shadow-xs space-y-6 sticky top-24">
              <div className="border-b border-[var(--border)] pb-4">
                <span className="text-[10px] font-bold text-[#0082CA] uppercase tracking-widest block">Order Calculation</span>
                <h2 className="text-xl font-black text-[var(--text-main)] mt-0.5">Order Summary</h2>
              </div>

              {/* Promo Code / Coupon Section */}
              <div className="pt-2 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0082CA]" /> Have a Promo Code?
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-800">{appliedCoupon.coupon?.code}</span>
                        <span className="text-emerald-600 block text-[10px]">
                          Save ₹{appliedCoupon.discountAmount}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[var(--text-faint)] hover:text-red-500 p-1 cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 text-xs p-2.5 border border-[var(--border-strong)] rounded-lg uppercase tracking-wider font-bold focus:outline-none focus:border-[#0082CA]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-[var(--text-main)] hover:bg-[#0082CA] disabled:opacity-40 text-[var(--bg-card)] hover:text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}

                    {activeCoupons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeCoupons.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-[10px] font-bold px-2 py-1 rounded bg-blue-50 text-[#0082CA] hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                          >
                            🏷️ {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Figures */}
              <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-[var(--border)]">
                <div className="flex justify-between text-[var(--text-muted)] font-semibold">
                  <span>Total Items</span>
                  <span className="font-bold text-[var(--text-main)]">{items.length}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] font-semibold">
                  <span>Total Quantity</span>
                  <span className="font-bold text-[var(--text-main)]">
                    {items.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] font-semibold">
                  <span>Subtotal Amount</span>
                  <span className="font-bold text-[var(--text-main)]">₹{Number(cartTotal || 0).toLocaleString('en-IN')}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedCoupon.coupon?.code})</span>
                    <span>-₹{Number(appliedCoupon.discountAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {(() => {
                  const discount = appliedCoupon?.discountAmount || 0;
                  const taxable = Math.max(0, (cartTotal || 0) - discount);
                  const gst = Math.round(taxable * 0.18);
                  const estimatedTotal = taxable + gst;

                  return (
                    <>
                      <div className="flex justify-between text-[var(--text-muted)] font-semibold">
                        <span>Est. GST (18% commercial rate)</span>
                        <span className="font-bold text-[var(--text-main)]">₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[var(--text-faint)] text-xs font-normal">
                        <span>Shipping & Logistics</span>
                        <span>Calculated during checkout</span>
                      </div>

                      <div className="border-t border-[var(--border)] pt-4 flex justify-between items-baseline">
                        <div>
                          <span className="text-base font-black text-[var(--text-main)] block">Estimated Total</span>
                          <span className="text-[10px] font-semibold text-[var(--text-faint)]">Includes 18% GST</span>
                        </div>
                        <span className="text-2xl font-black text-[#0082CA]">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Verified Pricing Trust Badge */}
              <div className="bg-[var(--bg-subtle)] rounded-lg p-4 border border-[var(--border)] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0082CA] shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--text-main)] space-y-1">
                  <span className="font-bold text-[var(--text-main)] block">Verified Server Valuation</span>
                  <p className="text-[var(--text-muted)] font-normal leading-relaxed">
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
                <p className="text-[11px] text-center text-[var(--text-faint)] font-normal">
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
