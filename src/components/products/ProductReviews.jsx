'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, ThumbsUp, X } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ count: 0, avgRating: 5.0, distribution: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/reviews/product/${productId}`);
      if (res.data) {
        setReviews(res.data.reviews || []);
        setStats({
          count: res.data.count || 0,
          avgRating: res.data.avgRating || 5.0,
          distribution: res.data.distribution || {},
        });
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please enter your review comment.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await axiosInstance.post(`/reviews/product/${productId}`, {
        rating,
        comment,
      });
      setSubmitSuccess(true);
      setComment('');
      fetchReviews();
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1350px] mx-auto px-4 md:px-8 py-10 border-t border-[var(--border)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#0082CA] uppercase tracking-wider block mb-1">Customer Feedback</span>
          <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Verified Customer Reviews</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit px-5 py-2.5 bg-[var(--text-main)] hover:bg-[#0082CA] text-[var(--bg-card)] hover:text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-[#71cbf4]" /> Write a Review
        </button>
      </div>

      {/* Ratings Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--bg-subtle)] rounded-xl p-6 border border-[var(--border)] mb-8">
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border)] pb-4 md:pb-0">
          <div className="text-4xl font-black text-[var(--text-main)] mb-1">{stats.avgRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-faint)]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Based on {stats.count} verified orders</span>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const starCount = stats.distribution[stars] || 0;
            const pct = stats.count > 0 ? Math.round((starCount / stats.count) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-[var(--text-muted)] flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-[var(--text-faint)]">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-10 text-xs font-semibold text-[var(--text-faint)]">Loading verified reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-strong)]">
          <p className="text-[var(--text-muted)] text-sm mb-3">No reviews submitted yet for this product.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#0082CA] hover:underline cursor-pointer"
          >
            Be the first to review!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={r._id || i} className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0082CA] font-bold text-xs flex items-center justify-center border border-blue-100 uppercase">
                    {(r.user?.name || 'Customer')[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-main)] block">{r.user?.name || 'Verified Buyer'}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified Order
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--border)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">"{r.comment}"</p>

              <div className="text-[10px] text-[var(--text-faint)] flex items-center justify-between pt-1 border-t border-[var(--border)]">
                <span>{new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  <ThumbsUp className="w-2.5 h-2.5" /> Helpful
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-faint)] hover:text-[var(--text-muted)] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-[var(--text-main)] mb-1">Write a Review</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">{productName || 'Custom Print Product'}</p>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-[var(--text-main)]">Thank you for your review!</p>
                <p className="text-xs text-[var(--text-muted)]">Your feedback helps fellow creators.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMsg && (
                  <div className="p-2.5 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-2">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-faint)]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[var(--text-muted)] ml-2">{rating} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details of the paper finish, color fidelity, turn-around speed..."
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA] focus:ring-1 focus:ring-[#0082CA]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#0082CA] hover:bg-[#006da8] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
