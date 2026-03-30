import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, isAdmin, isLoggedIn, logout } from "../service/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import transition from "../transition";

import {
  faUser,
  faBoxOpen,
  faBell,
  faGear,
  faArrowRightFromBracket,
  faChevronRight,
  faTriangleExclamation,
  faSpinner,
  faEye,
  faEyeSlash,
  faCircle,
  faStar,
  faShieldHalved,
  faChevronLeft,
  faXmark,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

import bikeVD from "../assets/BikeVD.mp4";
import discountImage from "../assets/Discount.jpg";
import partsImage from "../assets/Parts.jpg";
import MostSelling from "../assets/MostSelling.jpg";
import NewArrival from "../assets/BikeSideImage.jpg";
import LongBanner from "../assets/LongBanner.jpg";
import SlideshowBanner01 from "../assets/SlideshowBanner01.jpg";
import SlideshowBanner02 from "../assets/SlideshowBanner02.jpg";
import Chatbot from "../components/chatbot/Chatbot";

const scrollAnimationStyles = `
  @keyframes appear {
    from { opacity: 0; scale: 0.5; }
    to   { opacity: 1; scale: 1;   }
  }
  .scroll-appear {
    animation: appear linear;
    animation-timeline: view();
    animation-range: entry 0;
  }
`;

const CATEGORIES = [
  { label: "Engine Parts", path: "" },
  { label: "Brakes", path: "" },
  { label: "Suspension", path: "" },
  { label: "Exhaust", path: "" },
  { label: "Lighting", path: "" },
  { label: "Wheels", path: "" },
  { label: "Body Kits", path: "" },
  { label: "Interior", path: "" },
  { label: "Filters", path: "" },
  { label: "Belts & Hoses", path: "" },
  { label: "Fuel System", path: "" },
  { label: "Cooling", path: "" },
];

const PROMOS = [
  {
    id: 1,
    image: partsImage,
    type: "DEAL OF THE WEEK",
    typeColor: "#fff",
    typeBg: "rgba(230,57,70,0.15)",
    title: "Up to 40% OFF",
    sub: "Don't Miss Out on Our Exclusive Offers",
    badge: "Hot Deal",
    accent: "#e63946",
    cta: "Shop Brakes",
    path: "",
  },
  {
    id: 2,
    image: MostSelling,
    type: "MOST SELLING",
    typeColor: "#FFD77A",
    typeBg: "rgba(244,162,97,0.15)",
    title: "#1 This Week",
    sub: "Top-Rated Performance",
    badge: "Best Seller",
    accent: "#FFD77A",
    cta: "View Product",
    path: "",
  },
  {
    id: 3,
    image: NewArrival,
    type: "NEW ARRIVAL",
    typeColor: "#7B7F85",
    typeBg: "#C1C4C8",
    title: "Just Dropped",
    sub: "Latest Additions to Our Collection",
    badge: "New",
    accent: "#FFF8E7",
    cta: "Explore Now",
    path: "",
  },
  {
    id: 4,
    image: discountImage,
    type: "RECOMMENDATION",
    typeColor: "#C1C4C8",
    typeBg: "#2B2E33",
    title: "Top Rated",
    sub: "Suspension Upgrade Kits",
    badge: "Recommended",
    accent: "#7B7F85",
    cta: "Shop Now",
    path: "",
  },
];

const FEATURED = {
  image: LongBanner,
  type: "LIMITED TIME OFFER",
  typeColor: "#F5F6F7",
  typeBg: "#2B2E33",
  title: "Offer Ends Soon",
  sub: "50% - 70% off",
  badge: "Hot Deal",
  accent: "#F5F6F7",
  cta: "View Deals",
  path: "/offers",
};

const BIKE_SLIDESHOW = [
  {
    image: SlideshowBanner01,
    type: "BIKE CATEGORIES",
    typeColor: "#E6A520",
    typeBg: "#FFF8E7",
    title: "Explore Our Bike Categories",
    sub: "Find the Perfect Fit for Your Ride",
    badge: "Shop Now",
    accent: "#FFD77A",
  },
  {
    image: SlideshowBanner02,
    type: "BIKE CATEGORIES",
    typeColor: "#E6A520",
    typeBg: "#FFF8E7",
    title: "Explore Our Bike Categories",
    sub: "Find the Perfect Fit for Your Ride",
    badge: "Shop Now",
    accent: "#FFD77A",
  },
];

const ArrowIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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

function BikeCategoriesSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayTimer, setAutoplayTimer] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BIKE_SLIDESHOW.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const resetAutoplay = () => {
    if (autoplayTimer) clearTimeout(autoplayTimer);
  };
  const goToSlide = (i) => {
    setCurrentSlide(i);
    resetAutoplay();
  };
  const nextSlide = () => {
    setCurrentSlide((p) => (p + 1) % BIKE_SLIDESHOW.length);
    resetAutoplay();
  };
  const prevSlide = () => {
    setCurrentSlide(
      (p) => (p - 1 + BIKE_SLIDESHOW.length) % BIKE_SLIDESHOW.length,
    );
    resetAutoplay();
  };

  const slide = BIKE_SLIDESHOW[currentSlide];

  return (
    <div>
      <br />
      <div className="relative overflow-hidden rounded-2xl mb-6 group">
        <div className="relative min-h-[400px] flex items-end p-8">
          <div
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
          <div className="absolute top-6 left-6 z-10">
            <span
              className="text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-full uppercase backdrop-blur-sm transition-all"
              style={{ color: slide.typeColor, background: slide.typeBg }}
            >
              {slide.type}
            </span>
          </div>
          <div className="absolute top-6 right-6 z-10">
            <span className="text-xs font-bold text-white/80 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full">
              {slide.badge}
            </span>
          </div>
          <div className="relative z-20">
            <div
              className="font-black text-5xl md:text-6xl leading-none mb-2 drop-shadow-lg transition-all duration-500"
              style={{
                color: slide.accent,
                opacity: currentSlide !== undefined ? 1 : 0,
              }}
            >
              {slide.title}
            </div>
            <div className="text-white/90 text-lg font-medium mb-6 drop-shadow transition-all duration-500">
              {slide.sub}
            </div>
            <Link
              to="/bikes"
              className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase py-3 px-6 rounded-lg transition-all hover:gap-3 backdrop-blur-sm no-underline"
              style={{ background: slide.typeBg, color: slide.accent }}
            >
              {slide.badge} <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {BIKE_SLIDESHOW.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/70 w-2"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function LoggedInCard({ onLogout }) {
  // ── CHANGED: localStorage → sessionStorage ──
  const name = sessionStorage.getItem("userName") || "User";
  const email = sessionStorage.getItem("userEmail") || "";
  const role = sessionStorage.getItem("userRole") || "USER";
  const isAdminUser = ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"].includes(
    role,
  );
  const [confirmLogout, setConfirmLogout] = useState(false);

  const QUICK_LINKS = [
    {
      to: "/profile",
      icon: faUser,
      label: "My Profile",
      sub: "Account info & settings",
    },
    {
      to: "/profile",
      icon: faBoxOpen,
      label: "Purchase History",
      sub: "View your orders",
    },
    {
      to: "/profile",
      icon: faBell,
      label: "Service Reminders",
      sub: "Bike maintenance alerts",
    },
  ];

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col min-h-[340px]"
      style={{
        background:
          "linear-gradient(135deg,#1a3a5c 0%,#264668 55%,#2d5988 100%)",
      }}
    >
      <div className="relative z-10 flex flex-col h-full p-7 gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl text-white shrink-0 shadow-lg"
            style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}
          >
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-0.5">
              {getGreeting()},
            </p>
            <h2 className="text-white font-extrabold text-xl leading-tight truncate">
              {name}
            </h2>
            <p className="text-blue-400 text-xs mt-0.5 truncate">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full tracking-wide
            ${isAdminUser ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-white/10 text-blue-200 border border-white/10"}`}
          >
            <FontAwesomeIcon
              icon={isAdminUser ? faShieldHalved : faCircle}
              className={`text-[10px] ${isAdminUser ? "text-amber-300" : "text-blue-400"}`}
            />
            {role}
          </span>
          <span className="text-blue-400 text-xs flex items-center gap-1">
            <FontAwesomeIcon
              icon={faStar}
              className="text-[9px] text-blue-500"
            />
            M&amp;J Member
          </span>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-col gap-2 flex-1">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 transition-all group no-underline"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-blue-300 text-sm"
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{item.label}</p>
                <p className="text-blue-300 text-xs">{item.sub}</p>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-blue-400 group-hover:text-white text-xs transition-colors"
              />
            </Link>
          ))}
          {isAdminUser && (
            <Link
              to="/admin/users"
              className="flex items-center gap-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 hover:border-amber-400/40 rounded-xl px-4 py-3 transition-all group no-underline"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={faGear}
                  className="text-amber-300 text-sm"
                />
              </div>
              <div className="flex-1">
                <p className="text-amber-300 font-bold text-sm">Admin Panel</p>
                <p className="text-amber-400/70 text-xs">
                  Manage users &amp; data
                </p>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-amber-400 group-hover:text-amber-200 text-xs transition-colors"
              />
            </Link>
          )}
        </div>

        {!confirmLogout ? (
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-blue-300 hover:text-red-300 border border-white/10 hover:border-red-400/40 hover:bg-red-500/10 transition-all"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-sm"
            />
            Sign Out
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-blue-300 font-semibold flex items-center justify-center gap-1.5">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-amber-400 text-xs"
              />
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-blue-300 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 py-2.5 rounded-xl font-extrabold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginCard({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form.email.trim(), form.password);
      if (data.success) {
        onLoginSuccess();
      } else setError(data.message || "Invalid email or password.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-8 flex flex-col gap-5 justify-center">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500">
          Sign in to access your M&amp;J account
        </p>
      </div>
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="mt-0.5 shrink-0"
          />
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
            Email Address
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
            />
            <input
              name="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3.5 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-0.5"
            >
              <FontAwesomeIcon
                icon={showPw ? faEyeSlash : faEye}
                className="text-sm"
              />
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold tracking-widest text-sm rounded-xl py-4 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />{" "}
              SIGNING IN...
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="rotate-180"
              />{" "}
              LOG IN
            </>
          )}
        </button>
      </form>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

// Review
function ReviewPromptModal({ onClose, onWriteReview }) {
  const userName = sessionStorage.getItem("userName") || "there";
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 28 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            height: 5,
            background: "linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)",
          }}
        />

        <div style={{ padding: "28px 28px 24px" }}>
          {/* Close */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <button
              onClick={onClose}
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

          {/* Star icon */}
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#fff", fontSize: 28 }}
            />
          </div>

          <h2
            style={{
              color: "#111827",
              fontWeight: 900,
              fontSize: 22,
              textAlign: "center",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            How was your experience?
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 1.7,
              margin: "0 0 24px",
            }}
          >
            Hi{" "}
            <strong style={{ color: "#111827" }}>
              {userName.split(" ")[0]}
            </strong>
            ! We'd love to hear your thoughts about M&J Enterprises. Your
            feedback helps us improve.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={onWriteReview}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "#f59e0b",
                color: "#111827",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.04em",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d97706")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f59e0b")
              }
            >
              <FontAwesomeIcon icon={faQuoteLeft} style={{ fontSize: 14 }} />{" "}
              Write a Review
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                background: "#fff",
                color: "#374151",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.color = "#6b7280";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  // Show review prompt after login
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("userRole");
    const adminRoles = ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"];
    if (!userId || adminRoles.includes(role)) return;

    if (sessionStorage.getItem("reviewPromptSeen")) return;

    const timer = setTimeout(() => setShowReviewPrompt(true), 20000);
    return () => clearTimeout(timer);
  }, [loggedIn]);

  const handleCloseReviewPrompt = () => {
    setShowReviewPrompt(false);
    sessionStorage.setItem("reviewPromptSeen", "1");
  };

  const handleWriteReview = () => {
    handleCloseReviewPrompt();
    navigate("/reviews");
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    if (isAdmin()) navigate("/admin/users");
  };
  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-5 pt-6">
      <style>{scrollAnimationStyles}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 mb-6">
        {loggedIn ? (
          <LoggedInCard onLogout={handleLogout} />
        ) : (
          <LoginCard onLoginSuccess={handleLoginSuccess} />
        )}

        <div className="scroll-appear relative rounded-2xl overflow-hidden min-h-[340px] flex items-end p-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          >
            <source src={bikeVD} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(37,99,235,0.22),transparent_60%)]" />
          <div className="relative z-10">
            <p className="text-blue-300 font-bold text-xs tracking-[0.2em] uppercase mb-3">
              The Ultimate Destination
            </p>
            <h1 className="text-white font-black leading-none text-5xl lg:text-6xl xl:text-7xl mb-4 tracking-tight">
              Vehicle Parts &amp;
              <br />
              Accessories
            </h1>
            <p className="text-blue-200 text-sm font-medium tracking-widest uppercase">
              Upgrade Your Ride with Confidence
            </p>
            <div className="flex gap-3 mt-7">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-widest px-6 py-3 rounded-lg transition-colors">
                SHOP NOW
              </button>
              <button className="bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-bold text-sm tracking-widest px-6 py-3 rounded-lg transition-colors">
                VIEW DEALS
              </button>
            </div>
          </div>
        </div>
      </div>

      <BikeCategoriesSlideshow />

      <div className="mb-10">
        <h3 className="font-extrabold text-xl text-gray-900 mb-4 tracking-wide uppercase">
          This Week's Highlights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMOS.map((promo) => (
            <Link
              key={promo.id}
              to={promo.path}
              className="scroll-appear relative rounded-xl overflow-hidden min-h-[450px] flex flex-col justify-between p-6 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 no-underline group bg-gray-900 bg-cover bg-center"
              style={{ backgroundImage: `url(${promo.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 rounded-xl" />
              <div className="relative z-10 flex items-start justify-between">
                <span
                  className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full uppercase backdrop-blur-sm"
                  style={{ color: promo.typeColor, background: promo.typeBg }}
                >
                  {promo.type}
                </span>
                <span className="text-xs font-bold text-white/80 backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded-full">
                  {promo.badge}
                </span>
              </div>
              <div className="relative z-10">
                <div
                  className="font-black text-3xl leading-none mb-1 drop-shadow"
                  style={{ color: promo.accent }}
                >
                  {promo.title}
                </div>
                <div className="text-white/90 text-sm font-semibold mb-4 drop-shadow">
                  {promo.sub}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase py-1.5 px-3 rounded-lg transition-all group-hover:gap-2.5 backdrop-blur-sm"
                  style={{ background: promo.typeBg, color: promo.accent }}
                >
                  {promo.cta} <ArrowIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <br />
        <Link
          to={FEATURED.path}
          className="scroll-appear relative rounded-xl overflow-hidden flex items-end p-8 cursor-pointer hover:shadow-2xl transition-all duration-200 no-underline group block"
          style={{
            backgroundImage: `url(${FEATURED.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "400px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 rounded-xl" />
          <div className="absolute top-5 left-6 z-10">
            <span
              className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full uppercase backdrop-blur-sm"
              style={{ color: FEATURED.typeColor, background: FEATURED.typeBg }}
            >
              {FEATURED.type}
            </span>
          </div>
          <div className="absolute top-5 right-6 z-10">
            <span className="text-xs font-bold text-white/80 backdrop-blur-sm bg-black/20 px-2.5 py-1 rounded-full">
              {FEATURED.badge}
            </span>
          </div>
          <div className="relative z-10">
            <div
              className="font-black text-4xl md:text-5xl leading-none mb-1 drop-shadow"
              style={{ color: FEATURED.accent }}
            >
              {FEATURED.title}
            </div>
            <div className="text-white/80 text-sm font-medium mb-4 drop-shadow">
              {FEATURED.sub}
            </div>
            <div
              className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase py-2 px-4 rounded-lg transition-all group-hover:gap-3 backdrop-blur-sm"
              style={{ background: FEATURED.typeBg, color: FEATURED.accent }}
            >
              {FEATURED.cta} <ArrowIcon />
            </div>
          </div>
        </Link>
      </div>

      <div className="mb-10">
        <h3 className="font-extrabold text-xl text-gray-900 mb-4 tracking-wide uppercase">
          Shop By Category
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="scroll-appear bg-white border border-gray-200 rounded-xl py-4 px-3 text-center text-xs font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all no-underline"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      <Chatbot />

      {/* 20-second review prompt */}
      <AnimatePresence>
        {showReviewPrompt && (
          <ReviewPromptModal
            onClose={handleCloseReviewPrompt}
            onWriteReview={handleWriteReview}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default transition(Home);
