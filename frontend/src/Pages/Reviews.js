import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPen,
  faTrash,
  faPlus,
  faXmark,
  faCheckCircle,
  faTriangleExclamation,
  faSpinner,
  faQuoteLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import transition from "../transition";

const API_BASE = "http://localhost:8080/api";

// Helpers
function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

const AVATAR_GRADIENTS = [
  "135deg,#3b82f6,#1d4ed8",
  "135deg,#8b5cf6,#6d28d9",
  "135deg,#10b981,#059669",
  "135deg,#f59e0b,#d97706",
  "135deg,#ef4444,#dc2626",
  "135deg,#06b6d4,#0891b2",
  "135deg,#ec4899,#be185d",
];
function avatarGrad(name) {
  return AVATAR_GRADIENTS[(name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];
}

// Star Rating Input
function StarInput({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            lineHeight: 1,
          }}
        >
          <FontAwesomeIcon
            icon={faStar}
            style={{
              fontSize: size,
              color: (hover || value) >= s ? "#f59e0b" : "#d1d5db",
              transition: "color 0.1s",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// Static star display
function StarDisplay({ value, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FontAwesomeIcon
          key={s}
          icon={faStar}
          style={{ fontSize: size, color: value >= s ? "#f59e0b" : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

// Toast
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        padding: "12px 18px",
        borderRadius: 12,
        background: type === "success" ? "#10b981" : "#dc2626",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <FontAwesomeIcon
        icon={type === "success" ? faCheckCircle : faTriangleExclamation}
      />
      {message}
    </motion.div>
  );
}

// Review Form Modal
function ReviewFormModal({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    comment: initial?.comment || "",
    rating: initial?.rating || 0,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!form.comment.trim()) {
      setError("Please write your review.");
      return;
    }
    if (form.comment.length > 600) {
      setError("Review must be under 600 characters.");
      return;
    }
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 22,
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          overflow: "hidden",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg,#f59e0b,#fbbf24)",
          }}
        />

        <div style={{ padding: "28px 28px 24px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
            }}
          >
            <div>
              <h3
                style={{
                  color: "#111827",
                  fontWeight: 900,
                  fontSize: 18,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {initial ? "Edit Your Review" : "Write a Review"}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: "4px 0 0" }}>
                {initial
                  ? "Update your feedback for M&J Enterprises"
                  : "Share your experience with M&J Enterprises"}
              </p>
            </div>
            <button
              onClick={onCancel}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fee2e2";
                e.currentTarget.style.color = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.color = "#6b7280";
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 14 }} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Star rating */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Your Rating
              </label>
              <StarInput
                value={form.rating}
                onChange={(v) => {
                  setForm((f) => ({ ...f, rating: v }));
                  setError("");
                }}
                size={28}
              />
              {form.rating > 0 && (
                <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>
                  {
                    ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      form.rating
                    ]
                  }
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label
                style={{
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Your Review
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => {
                  setForm((f) => ({ ...f, comment: e.target.value }));
                  setError("");
                }}
                placeholder="Tell us about your experience with M&J Enterprises..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: 11,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  color: "#374151",
                  lineHeight: 1.6,
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              <p
                style={{
                  color: form.comment.length > 550 ? "#ef4444" : "#9ca3af",
                  fontSize: 11,
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {form.comment.length}/600
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: 9,
                }}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{ color: "#dc2626", fontSize: 12 }}
                />
                <span
                  style={{ color: "#991b1b", fontSize: 13, fontWeight: 600 }}
                >
                  {error}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 11,
                  border: "none",
                  background: saving ? "#9ca3af" : "#f59e0b",
                  color: "#111827",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.background = "#d97706";
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.currentTarget.style.background = "#f59e0b";
                }}
              >
                {saving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving…
                  </>
                ) : initial ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: "12px 18px",
                  borderRadius: 11,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#6b7280",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Confirm Delete Modal
function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9100,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          textAlign: "center",
          border: "1px solid #fee2e2",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#fee2e2",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "#dc2626", fontSize: 20 }}
          />
        </div>
        <h3
          style={{
            color: "#111827",
            fontWeight: 800,
            fontSize: 17,
            margin: "0 0 8px",
          }}
        >
          Delete Review?
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.6,
            margin: "0 0 22px",
          }}
        >
          This will permanently remove your review. This action cannot be
          undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#6b7280",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Review Card
function ReviewCard({ review, currentUserId, onEdit, onDelete, index }) {
  const isOwner = currentUserId && review.userId === currentUserId;
  const grad = avatarGrad(review.userName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      viewport={{ once: true, amount: 0.2 }}
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "22px 24px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)")
      }
    >
      {/* Owner actions */}
      {isOwner && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            gap: 6,
          }}
        >
          <button
            onClick={() => onEdit(review)}
            title="Edit"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dbeafe";
              e.currentTarget.style.color = "#2563eb";
              e.currentTarget.style.borderColor = "#bfdbfe";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <FontAwesomeIcon icon={faPen} style={{ fontSize: 11 }} />
          </button>
          <button
            onClick={() => onDelete(review)}
            title="Delete"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
              e.currentTarget.style.borderColor = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.color = "#6b7280";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: 11 }} />
          </button>
        </div>
      )}

      {/* Quote icon */}
      <FontAwesomeIcon
        icon={faQuoteLeft}
        style={{
          color: "#fde68a",
          fontSize: 28,
          marginBottom: 12,
          display: "block",
        }}
      />

      {/* Comment */}
      <p
        style={{
          color: "#374151",
          fontSize: 14,
          lineHeight: 1.8,
          margin: "0 0 16px",
          fontStyle: "italic",
          paddingRight: isOwner ? 72 : 0,
        }}
      >
        "{review.comment}"
      </p>

      {/* Stars */}
      <StarDisplay value={review.rating} />

      {/* Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(${grad})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {getInitials(review.userName)}
        </div>
        <div>
          <p
            style={{
              color: "#111827",
              fontWeight: 700,
              fontSize: 13,
              margin: 0,
            }}
          >
            {review.userName}
            {isOwner && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  color: "#2563eb",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 999,
                  padding: "1px 7px",
                  fontWeight: 700,
                }}
              >
                You
              </span>
            )}
          </p>
          <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>
            {timeAgo(review.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Page
function Reviews() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId")
    ? Number(sessionStorage.getItem("userId"))
    : null;
  const userName = sessionStorage.getItem("userName") || "";
  const isLoggedIn = Boolean(userId);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState(0);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // Fetch all reviews + stats
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [revRes, statRes] = await Promise.all([
        fetch(`${API_BASE}/reviews`),
        fetch(`${API_BASE}/reviews/stats`),
      ]);
      const revData = await revRes.json();
      const statData = await statRes.json();
      if (revData.success) setReviews(revData.data);
      if (statData.success) setStats(statData.data);
    } catch {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Submit new review
  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
        setShowForm(false);
        showToast("Review submitted — thank you!");
      } else showToast(data.message || "Failed to submit", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  // Edit review
  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE}/reviews/${editReview.id}/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
        setEditReview(null);
        showToast("Review updated");
      } else showToast(data.message || "Update failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete review
  const handleDelete = async () => {
    const r = toDelete;
    setToDelete(null);
    try {
      const res = await fetch(`${API_BASE}/reviews/${r.id}/user/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
        showToast("Review deleted");
      } else showToast(data.message || "Delete failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  // Filtered reviews
  const visible =
    filter === 0 ? reviews : reviews.filter((r) => r.rating === filter);

  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === s).length / reviews.length) * 100,
        )
      : 0,
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap'); *{box-sizing:border-box;}`}</style>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {showForm && (
          <ReviewFormModal
            initial={null}
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        )}
        {editReview && (
          <ReviewFormModal
            initial={editReview}
            onSave={handleEdit}
            onCancel={() => setEditReview(null)}
            saving={saving}
          />
        )}
        {toDelete && (
          <ConfirmDeleteModal
            onConfirm={handleDelete}
            onCancel={() => setToDelete(null)}
          />
        )}
      </AnimatePresence>

      {/* HERO HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e293b 0%,#0f172a 100%)",
          padding: "56px 24px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.05)",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#f59e0b",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Customer Reviews
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{
            fontSize: "clamp(28px,5vw,48px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: "0 auto 14px",
            maxWidth: 560,
          }}
        >
          What Our Customers Say
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            color: "#94a3b8",
            fontSize: 14,
            maxWidth: 400,
            margin: "0 auto 28px",
            lineHeight: 1.7,
          }}
        >
          Real experiences from real M&J Enterprises customers across Sri Lanka.
        </motion.p>

        {/* Stats strip */}
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(8px)",
              borderRadius: 16,
              padding: "14px 24px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#f59e0b",
                  fontWeight: 900,
                  fontSize: 28,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {stats.average.toFixed(1)}
              </p>
              <StarDisplay value={Math.round(stats.average)} size={12} />
            </div>
            <div
              style={{
                width: 1,
                height: 40,
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 22,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {stats.count}
              </p>
              <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0 0" }}>
                Reviews
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* LEFT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Write a review CTA */}
            {isLoggedIn ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "22px 20px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(${avatarGrad(userName)})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  {getInitials(userName)}
                </div>
                <p
                  style={{
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: 14,
                    margin: "0 0 4px",
                  }}
                >
                  {userName}
                </p>
                <p
                  style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 16px" }}
                >
                  Logged in member
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: 11,
                    border: "none",
                    background: "#f59e0b",
                    color: "#111827",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#d97706")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#f59e0b")
                  }
                >
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: 12 }} />{" "}
                  Write a Review
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "22px 20px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ color: "#9ca3af", fontSize: 20 }}
                  />
                </div>
                <p
                  style={{
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: 14,
                    margin: "0 0 4px",
                  }}
                >
                  Want to share your experience?
                </p>
                <p
                  style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 16px" }}
                >
                  Sign in to write a review
                </p>
                <Link
                  to="/login"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "11px",
                    borderRadius: 11,
                    border: "none",
                    background: "#0f172a",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "center",
                    textDecoration: "none",
                    marginBottom: 8,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1e293b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#0f172a")
                  }
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "11px",
                    borderRadius: 11,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Rating distribution */}
            {!loading && reviews.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: 13,
                    margin: "0 0 14px",
                  }}
                >
                  Rating Breakdown
                </p>
                {ratingDist.map(({ star, count, pct }) => (
                  <button
                    key={star}
                    onClick={() => setFilter(filter === star ? 0 : star)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      background: filter === star ? "#fefce8" : "transparent",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 6px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <span
                      style={{
                        color: "#374151",
                        fontSize: 12,
                        fontWeight: 600,
                        minWidth: 8,
                      }}
                    >
                      {star}
                    </span>
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#f59e0b", fontSize: 11 }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: "#f1f5f9",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: "#f59e0b",
                          borderRadius: 3,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: 11,
                        minWidth: 18,
                        textAlign: "right",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                ))}
                {filter > 0 && (
                  <button
                    onClick={() => setFilter(0)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      padding: "6px",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      background: "#f8fafc",
                      color: "#6b7280",
                      fontWeight: 600,
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Show all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* REVIEWS GRID */}
          <div>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <p
                style={{
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {filter > 0
                  ? `${visible.length} review${visible.length !== 1 ? "s" : ""} with ${filter} star${filter !== 1 ? "s" : ""}`
                  : `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#9ca3af",
                }}
              >
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: 28, marginBottom: 12, display: "block" }}
                />
                <p style={{ fontSize: 13 }}>Loading reviews…</p>
              </div>
            ) : visible.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#9ca3af",
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid #e5e7eb",
                }}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  style={{
                    fontSize: 36,
                    color: "#e5e7eb",
                    marginBottom: 12,
                    display: "block",
                  }}
                />
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    margin: "0 0 4px",
                    color: "#374151",
                  }}
                >
                  No reviews yet
                </p>
                <p style={{ fontSize: 13 }}>
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 16,
                }}
              >
                {visible.map((review, i) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={i}
                    currentUserId={userId}
                    onEdit={(r) => setEditReview(r)}
                    onDelete={(r) => setToDelete(r)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default transition(Reviews);
