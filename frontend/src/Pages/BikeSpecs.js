import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMotorcycle,
  faChevronRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import transition from "../transition";

const API_BASE = "http://localhost:8080/api";

// Animated spec group
function SpecGroup({ group, accentColor, index }) {
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
    >
      {/* Group heading bar */}
      <div style={{ background: accentColor, padding: "10px 24px" }}>
        <span
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {group.title}
        </span>
      </div>
      {/* Rows */}
      {(group.rows || []).map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            borderBottom: "1px solid #e5e7eb",
            background: i % 2 === 0 ? "#fafafa" : "#ffffff",
          }}
        >
          <div
            style={{
              padding: "11px 24px",
              color: "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              borderRight: "1px solid #e5e7eb",
            }}
          >
            {row.label}
          </div>
          <div
            style={{
              padding: "11px 24px",
              color: "#111827",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {row.value}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// Main
function BikeSpecs() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    setError(false);
    fetch(`${API_BASE}/bikes/slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setBike(data.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const CAT_COLORS = {
    SCOOTER: "#2563eb",
    PREMIUM: "#7c3aed",
    MOTORCYCLE: "#dc2626",
  };

  if (loading)
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{
              fontSize: 32,
              color: "#9ca3af",
              marginBottom: 12,
              display: "block",
            }}
          />
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            Loading specifications…
          </p>
        </div>
      </main>
    );

  if (error || !bike)
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🏍️</p>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            Bike Not Found
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>
            Specifications for this bike aren't available yet.
          </p>
          <button
            onClick={() => navigate("/bikes")}
            style={{
              padding: "11px 24px",
              borderRadius: 10,
              border: "none",
              background: "#d30000",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back to Bikes
          </button>
        </div>
      </main>
    );

  const accentColor = bike.color || CAT_COLORS[bike.category] || "#d30000";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap'); *{box-sizing:border-box;}`}</style>

      {/* HERO */}
      <div
        style={{
          background: `linear-gradient(135deg,${accentColor}ee 0%,${accentColor}88 100%)`,
          padding: "48px 24px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            <Link
              to="/bikes"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 11 }} />{" "}
              Bikes
            </Link>
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Specifications
            </span>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 999,
              padding: "4px 12px",
              marginBottom: 16,
            }}
          >
            <FontAwesomeIcon
              icon={faMotorcycle}
              style={{ color: "#fff", fontSize: 11 }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              {bike.category}
            </span>
          </div>

          <h1
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "clamp(32px,6vw,56px)",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {bike.name}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.1em",
              margin: "0 0 20px",
              textTransform: "uppercase",
            }}
          >
            {bike.tagline}
          </p>

          {/* Price and image row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(0,0,0,0.2)",
                borderRadius: 12,
                padding: "10px 18px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Price
              </span>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>
                LKR {Number(bike.price).toLocaleString()}
              </span>
            </div>
            {bike.image && (
              <img
                src={bike.image}
                alt={bike.name}
                style={{
                  height: 120,
                  objectFit: "contain",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* SPEC TABLE */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            margin: "36px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              height: 36,
              width: 6,
              background: accentColor,
              borderRadius: 3,
            }}
          />
          <div>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 2px",
              }}
            >
              Technical
            </p>
            <h2
              style={{
                color: "#111827",
                fontWeight: 900,
                fontSize: 24,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              SPECIFICATIONS
            </h2>
          </div>
        </motion.div>

        {bike.groups && bike.groups.length > 0 ? (
          <div
            style={{
              marginTop: 24,
              marginBottom: 48,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            {bike.groups.map((group, i) => (
              <SpecGroup
                key={group.id || i}
                group={group}
                accentColor={accentColor}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9ca3af",
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600 }}>
              No specifications added yet.
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", paddingBottom: 48 }}>
          <button
            onClick={() => navigate("/bikes")}
            style={{
              padding: "13px 32px",
              borderRadius: 12,
              border: "2px solid #d30000",
              background: "transparent",
              color: "#d30000",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "inherit",
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
            ← Back to Bike Inventory
          </button>
        </div>
      </div>
    </main>
  );
}

export default transition(BikeSpecs);
