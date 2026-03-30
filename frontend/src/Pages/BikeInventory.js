import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBolt,
  faGaugeHigh,
  faCog,
  faPhone,
  faChevronLeft,
  faChevronRight,
  faUserPlus,
  faRightToBracket,
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import transition from "../transition";

const API_BASE = "http://localhost:8080/api";
const CATEGORIES = ["SCOOTER", "PREMIUM", "MOTORCYCLE"];

function RegisterModal({ onClose, reason }) {
  const navigate = useNavigate();
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
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          overflow: "hidden",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        <div
          style={{
            height: 5,
            background: "linear-gradient(90deg,#d30000,#ef4444)",
          }}
        />
        <div style={{ padding: "28px 28px 24px" }}>
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
                transition: "all 0.15s",
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
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg,#d30000,#ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(211,0,0,0.3)",
            }}
          >
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ color: "#fff", fontSize: 26 }}
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
            {reason === "bike"
              ? "Sign In to View Details"
              : "Join M&J Enterprises"}
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
            {reason === "bike"
              ? "Create a free account or log in to explore full bike specifications, pricing details and request a call back."
              : "Register for free to track your enquiries, save your favourite bikes, and get exclusive member pricing."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => {
                onClose();
                navigate("/register");
              }}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "#d30000",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.06em",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                boxShadow: "0 4px 16px rgba(211,0,0,0.3)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#b91c1c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#d30000")
              }
            >
              <FontAwesomeIcon icon={faUserPlus} style={{ fontSize: 14 }} />
              Register Here — It's Free
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/login");
              }}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d30000";
                e.currentTarget.style.color = "#d30000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              <FontAwesomeIcon
                icon={faRightToBracket}
                style={{ fontSize: 14 }}
              />{" "}
              Log In
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BikeSilhouette({ category, color, size = "full" }) {
  const h = size === "full" ? 200 : 120;
  if (category === "SCOOTER")
    return (
      <svg
        viewBox="0 0 320 160"
        height={h}
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
      >
        <ellipse cx="80" cy="130" rx="32" ry="18" fill="#1a1a1a" />
        <ellipse cx="80" cy="130" rx="22" ry="12" fill="#333" />
        <ellipse cx="240" cy="130" rx="32" ry="18" fill="#1a1a1a" />
        <ellipse cx="240" cy="130" rx="22" ry="12" fill="#333" />
        <rect x="60" y="95" width="200" height="30" rx="8" fill={color} />
        <rect x="100" y="60" width="120" height="40" rx="10" fill={color} />
        <rect x="110" y="50" width="90" height="20" rx="6" fill="#111" />
        <path d="M55 112 Q40 100 50 85 L70 80 L65 112Z" fill={color} />
        <path d="M265 112 Q280 95 270 82 L250 80 L258 112Z" fill={color} />
        <rect x="130" y="38" width="50" height="16" rx="4" fill="#222" />
        <rect x="148" y="30" width="14" height="12" rx="2" fill="#333" />
        <circle cx="80" cy="130" r="8" fill="#555" />
        <circle cx="240" cy="130" r="8" fill="#555" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 340 160"
      height={h}
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}
    >
      <ellipse cx="70" cy="130" rx="34" ry="18" fill="#1a1a1a" />
      <ellipse cx="70" cy="130" rx="22" ry="12" fill="#333" />
      <ellipse cx="270" cy="130" rx="34" ry="18" fill="#1a1a1a" />
      <ellipse cx="270" cy="130" rx="22" ry="12" fill="#333" />
      <path d="M70 112 L85 70 L160 68 L200 80 L270 112Z" fill={color} />
      <path d="M140 68 L155 40 L195 40 L200 68Z" fill={color} />
      <rect x="148" y="28" width="40" height="16" rx="3" fill="#111" />
      <path d="M85 70 L95 50 L130 50 L140 68Z" fill="#222" />
      <path d="M200 80 L230 68 L265 78 L270 112 L200 112Z" fill={color} />
      <rect x="250" y="62" width="28" height="12" rx="3" fill="#111" />
      <circle cx="70" cy="130" r="8" fill="#555" />
      <circle cx="270" cy="130" r="8" fill="#555" />
    </svg>
  );
}

function SpecChip({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 14px",
        background: "#f7f7f7",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#9ca3af",
        }}
      >
        <FontAwesomeIcon icon={icon} style={{ fontSize: 13 }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#111827",
          lineHeight: 1.3,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function BikeInventory() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("SCOOTER");
  const [bikes, setBikes] = useState([]);
  const [loadingBikes, setLoadingBikes] = useState(true);
  const [selectedBike, setSelectedBike] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  // MULTI-COLOR: active colour index per bike id
  const [activeColorIdx, setActiveColorIdx] = useState({});
  const [showEnquire, setShowEnquire] = useState(false);
  const [enquireForm, setEnquireForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [enquireSent, setEnquireSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState("timed");

  const isLoggedIn = Boolean(sessionStorage.getItem("userId"));

  const resolveColors = (bike) => {
    if (bike.colors && bike.colors.length > 0) return bike.colors;
    return [{ hex: bike.color || "#cccccc", image: bike.image || null }];
  };

  const getACI = (bikeId) => activeColorIdx[bikeId] ?? 0;
  const handleColorSwitch = (bikeId, idx) =>
    setActiveColorIdx((prev) => ({ ...prev, [bikeId]: idx }));

  useEffect(() => {
    setLoadingBikes(true);
    setSelectedBike(null);
    setActiveColorIdx({});
    fetch(`${API_BASE}/bikes/category/${activeCategory}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBikes(d.data);
      })
      .catch(() => {})
      .finally(() => setLoadingBikes(false));
  }, [activeCategory]);

  useEffect(() => {
    if (isLoggedIn) return;
    const t = setTimeout(() => {
      setModalReason("timed");
      setShowModal(true);
    }, 20000);
    return () => clearTimeout(t);
  }, [isLoggedIn]);

  const handleSelect = async (bike) => {
    if (!isLoggedIn) {
      setModalReason("bike");
      setShowModal(true);
      return;
    }

    setSelectedBike(bike);
    setShowEnquire(false);
    setEnquireSent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setLoadingDetail(true);
    try {
      const res = await fetch(`${API_BASE}/bikes/${bike.id}/specs`);
      const data = await res.json();
      if (data.success) {
        const d = data.data;

        const colors =
          d.colors && d.colors.length > 0
            ? d.colors
            : [
                {
                  hex: d.color || bike.color || "#cccccc",
                  image: d.image || bike.image || null,
                },
              ];
        setSelectedBike((prev) =>
          prev?.id === bike.id ? { ...prev, ...d, colors } : prev,
        );
      }
    } catch {
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleNav = (dir) => {
    const idx = bikes.findIndex((b) => b.id === selectedBike.id);
    const next = bikes[(idx + dir + bikes.length) % bikes.length];
    handleSelect(next);
  };

  const handleEnquire = (e) => {
    e.preventDefault();
    setEnquireSent(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap');
        * { box-sizing:border-box; }
        .bike-card:hover .bike-card-inner { transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,0.13); }
        .bike-card-inner { transition:transform 0.25s ease,box-shadow 0.25s ease; }
        .cat-tab { cursor:pointer; background:none; border:none; font-family:inherit; transition:color 0.2s; }
        .cat-tab:hover { color:#111827 !important; }
        .bikes-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          border-left: 1px solid #e5e7eb;
          border-top: 1px solid #e5e7eb;
        }
        .bike-card-wrap {
          width: 220px;
          flex: 0 0 220px;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          .bike-card-wrap { width: 100%; flex: 0 0 100%; }
        }
      `}</style>

      {/* HERO */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          paddingTop: 48,
          paddingBottom: 40,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 200,
            height: 200,
            background: "rgba(211,0,0,0.04)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: -40,
            width: 160,
            height: 160,
            background: "rgba(211,0,0,0.03)",
            borderRadius: "50%",
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
            color: "#d30000",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          M&J Enterprises · Official Dealer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{
            fontSize: "clamp(28px,5vw,52px)",
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: "0 auto 14px",
            maxWidth: 600,
          }}
        >
          BE THE FUTURE OF <span style={{ color: "#d30000" }}>MOBILITY</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            width: 40,
            height: 3,
            background: "#d30000",
            margin: "0 auto 20px",
            borderRadius: 2,
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            color: "#6b7280",
            fontSize: 14,
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Your trusted partner for Hero MotoCorp bikes in Sri Lanka — premium
          quality at honest prices.
        </motion.p>
      </div>

      {/* CATEGORY TABS */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="cat-tab"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "18px 36px",
                fontSize: 13,
                letterSpacing: "0.14em",
                fontWeight: activeCategory === cat ? 800 : 600,
                color: activeCategory === cat ? "#111827" : "#9ca3af",
                borderBottom:
                  activeCategory === cat
                    ? "2.5px solid #d30000"
                    : "2.5px solid transparent",
                marginBottom: -1,
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedBike &&
          (() => {
            const sbColors = resolveColors(selectedBike);
            const sbACI = getACI(selectedBike.id);
            const sbActive = sbColors[sbACI] || sbColors[0];
            return (
              <motion.div
                key={selectedBike.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  background: "#f3f4f6",
                  borderBottom: "1px solid #e5e7eb",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "38%",
                    height: "100%",
                    background: "#ebebeb",
                    clipPath: "polygon(0 0,85% 0,100% 100%,0 100%)",
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "40px 24px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 48,
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* LEFT - bike visual + colour swatches */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >

                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {sbActive.image ? (
                        <img
                          src={sbActive.image}
                          alt={selectedBike.name}
                          style={{
                            maxHeight: 200,
                            maxWidth: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))",
                            transition: "opacity 0.2s",
                            opacity: loadingDetail ? 0.6 : 1,
                          }}
                        />
                      ) : (
                        <BikeSilhouette
                          category={selectedBike.category}
                          color={sbActive.hex}
                          size="full"
                        />
                      )}

                      {loadingDetail && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -8,
                            right: -8,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            style={{ color: "#d30000", fontSize: 12 }}
                          />
                        </div>
                      )}
                    </div>

                    {sbColors.length > 1 && !loadingDetail && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            fontWeight: 600,
                          }}
                        >
                          Colours:
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                          {sbColors.map((c, i) => (
                            <button
                              key={i}
                              type="button"
                              title={c.hex}
                              onClick={() =>
                                handleColorSwitch(selectedBike.id, i)
                              }
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: c.hex,
                                border:
                                  i === sbACI
                                    ? "2.5px solid #111827"
                                    : "2px solid rgba(0,0,0,0.12)",
                                cursor: "pointer",
                                padding: 0,
                                transform:
                                  i === sbACI ? "scale(1.2)" : "scale(1)",
                                transition:
                                  "transform 0.15s, border-color 0.15s",
                                boxShadow:
                                  i === sbACI
                                    ? "0 2px 8px rgba(0,0,0,0.2)"
                                    : "none",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.25)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  i === sbACI ? "scale(1.2)" : "scale(1)";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleNav(-1)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6b7280",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          style={{ fontSize: 12 }}
                        />
                      </button>
                      <button
                        onClick={() => handleNav(1)}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6b7280",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          style={{ fontSize: 12 }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <button
                      onClick={() => setSelectedBike(null)}
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b7280",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ fontSize: 14 }}
                      />
                    </button>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.2em",
                          color: "#d30000",
                          textTransform: "uppercase",
                          margin: "0 0 6px",
                        }}
                      >
                        {selectedBike.tagline}
                      </p>
                      <h2
                        style={{
                          fontSize: "clamp(26px,3vw,38px)",
                          fontWeight: 900,
                          color: "#111827",
                          margin: "0 0 8px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {selectedBike.name}
                      </h2>
                    </div>
                    <div
                      style={{
                        background: "#111827",
                        borderRadius: 12,
                        padding: "14px 20px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        alignSelf: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#9ca3af",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        Price
                      </span>
                      <span
                        style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}
                      >
                        LKR {Number(selectedBike.price).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 8,
                      }}
                    >
                      <SpecChip
                        icon={faBolt}
                        label="Power"
                        value={selectedBike.specPower}
                      />
                      <SpecChip
                        icon={faGaugeHigh}
                        label="Torque"
                        value={selectedBike.specTorque}
                      />
                      <SpecChip
                        icon={faCog}
                        label="Engine"
                        value={selectedBike.specEngine}
                      />
                    </div>
                    {!showEnquire ? (
                      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        <button
                          onClick={() => setShowEnquire(true)}
                          style={{
                            flex: 1,
                            padding: "13px 20px",
                            borderRadius: 10,
                            border: "none",
                            background: "#d30000",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 13,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#b91c1c")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#d30000")
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPhone}
                            style={{ marginRight: 8 }}
                          />
                          Request a Call Back
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/bikes/${selectedBike.slug}/specs`)
                          }
                          style={{
                            flex: 1,
                            padding: "13px 20px",
                            borderRadius: 10,
                            border: "2px solid #d30000",
                            background: "transparent",
                            color: "#d30000",
                            fontWeight: 800,
                            fontSize: 13,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#d30000";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#d30000";
                          }}
                        >
                          View Full Specs
                        </button>
                      </div>
                    ) : enquireSent ? (
                      <div
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 12,
                          padding: "16px 20px",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "#166534",
                            fontWeight: 700,
                            fontSize: 14,
                            margin: 0,
                          }}
                        >
                          ✓ We'll call you back shortly!
                        </p>
                        <button
                          onClick={() => {
                            setShowEnquire(false);
                            setEnquireSent(false);
                          }}
                          style={{
                            marginTop: 8,
                            background: "none",
                            border: "none",
                            color: "#166534",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleEnquire}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          background: "#fff",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 8,
                          }}
                        >
                          <input
                            required
                            value={enquireForm.name}
                            onChange={(e) =>
                              setEnquireForm((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Your Name"
                            style={{
                              padding: "9px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: 8,
                              fontSize: 13,
                              fontFamily: "inherit",
                              outline: "none",
                            }}
                          />
                          <input
                            required
                            value={enquireForm.phone}
                            onChange={(e) =>
                              setEnquireForm((f) => ({
                                ...f,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="Phone Number"
                            style={{
                              padding: "9px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: 8,
                              fontSize: 13,
                              fontFamily: "inherit",
                              outline: "none",
                            }}
                          />
                        </div>
                        <textarea
                          value={enquireForm.message}
                          onChange={(e) =>
                            setEnquireForm((f) => ({
                              ...f,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Any questions? (optional)"
                          rows={2}
                          style={{
                            padding: "9px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "inherit",
                            outline: "none",
                            resize: "none",
                          }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="submit"
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: 8,
                              border: "none",
                              background: "#d30000",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowEnquire(false)}
                            style={{
                              padding: "10px 16px",
                              borderRadius: 8,
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
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* BIKE GRID */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {loadingBikes ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#9ca3af",
            }}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              style={{ fontSize: 32, marginBottom: 12, display: "block" }}
            />
            <p style={{ fontSize: 14 }}>Loading bikes…</p>
          </div>
        ) : bikes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#9ca3af",
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 600 }}>
              No bikes available in this category.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="bikes-grid"
          >
            {bikes.map((bike) => {
              const colors = resolveColors(bike);
              const aci = getACI(bike.id);
              const activeEntry = colors[aci] || colors[0];
              return (
                <motion.div
                  key={bike.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    },
                  }}
                  className="bike-card bike-card-wrap"
                  onClick={() => handleSelect(bike)}
                >
                  <div
                    className="bike-card-inner"
                    style={{
                      padding: "32px 24px 24px",
                      background:
                        selectedBike?.id === bike.id ? "#fff5f5" : "#fff",
                      position: "relative",
                    }}
                  >
                    {selectedBike?.id === bike.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: "#d30000",
                        }}
                      />
                    )}
                    {!isLoggedIn && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "#111827",
                          borderRadius: 8,
                          padding: "3px 8px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faLock}
                          style={{ color: "#9ca3af", fontSize: 9 }}
                        />
                        <span
                          style={{
                            color: "#9ca3af",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                          }}
                        >
                          LOGIN
                        </span>
                      </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.18em",
                          color: "#9ca3af",
                          textTransform: "uppercase",
                        }}
                      >
                        {bike.category}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 20,
                      }}
                    >
                      {activeEntry.image ? (
                        <img
                          src={activeEntry.image}
                          alt={bike.name}
                          style={{
                            height: 120,
                            maxWidth: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                            transition: "opacity 0.2s",
                          }}
                        />
                      ) : (
                        <BikeSilhouette
                          category={bike.category}
                          color={activeEntry.hex}
                          size="small"
                        />
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "#111827",
                        margin: "0 0 4px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {bike.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#d30000",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        margin: "0 0 10px",
                      }}
                    >
                      {bike.tagline}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#374151",
                        margin: "0 0 12px",
                      }}
                    >
                      LKR {Number(bike.price).toLocaleString()}
                    </p>

                    {colors.length > 1 && (
                      <div
                        style={{ display: "flex", gap: 5, flexWrap: "wrap" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {colors.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            title={c.hex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSwitch(bike.id, i);
                            }}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: c.hex,
                              border:
                                i === aci
                                  ? "2px solid #111827"
                                  : "1.5px solid rgba(0,0,0,0.15)",
                              cursor: "pointer",
                              padding: 0,
                              transform: i === aci ? "scale(1.2)" : "scale(1)",
                              transition: "transform 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform =
                                i === aci ? "scale(1.2)" : "scale(1)";
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* FOOTER BAND */}
      <div
        style={{
          background: "#111827",
          padding: "32px 24px",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
          All prices are indicative. Contact us for the latest offers and
          availability.{" "}
          <a
            href="/contact"
            style={{
              color: "#d30000",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Get in touch →
          </a>
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <RegisterModal
            reason={modalReason}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default transition(BikeInventory);
