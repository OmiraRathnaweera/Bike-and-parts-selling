import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { can, ROLE_STYLES } from "./rbac";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartBar,
  faClipboardList,
  faMotorcycle,
  faLock,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  {
    id: "users",
    label: "User Management",
    icon: <FontAwesomeIcon icon={faUsers} />,
    path: "/admin/users",
    perm: "VIEW_USERS",
  },
  {
    id: "report",
    label: "Sales Report",
    icon: <FontAwesomeIcon icon={faChartBar} />,
    path: "/admin/report",
    perm: "VIEW_SALES",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <FontAwesomeIcon icon={faClipboardList} />,
    path: "/admin/transactions",
    perm: "VIEW_TRANSACTIONS",
  },
  {
    id: "bikes",
    label: "Bike Inventory",
    icon: <FontAwesomeIcon icon={faMotorcycle} />,
    path: "/admin/bikes",
    perm: "VIEW_BIKES",
  },
];

function AdminLayout({ children, currentPage }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = sessionStorage.getItem("adminRole") || "STAFF";
  const name = sessionStorage.getItem("adminName") || "Admin";
  const email = sessionStorage.getItem("adminEmail") || "";

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const rs = ROLE_STYLES[role] || ROLE_STYLES.STAFF;

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
      }}
    >
      {/* Logo */}
      <div
        style={{ padding: "18px 16px 14px", borderBottom: "1px solid #e5e7eb" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#d30000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 12 }}>
              MJ
            </span>
          </div>
          <div>
            <p
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: 13,
                margin: 0,
                lineHeight: 1,
              }}
            >
              M&J Enterprises
            </p>
            <p style={{ color: "#6b7280", fontSize: 11, margin: "3px 0 0" }}>
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Admin profile card */}
      <button
        onClick={() => navigate("/admin/profile")}
        style={{
          margin: "12px 10px 4px",
          padding: "10px 12px",
          background: "#f3f4f6",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#eeeff1")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                color: "#111827",
                fontSize: 12,
                fontWeight: 700,
                margin: "0 0 4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </p>
            <span
              style={{
                background: rs.bg,
                color: rs.text,
                border: `1px solid ${rs.border}`,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: rs.dot,
                }}
              />
              {role}
            </span>
          </div>
        </div>
      </button>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 8px 4px" }}>
        <p
          style={{
            color: "#9ca3af",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            margin: "4px 0 6px 8px",
          }}
        >
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const ok = can(role, item.perm);
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (ok) {
                  navigate(item.path);
                  setMobileOpen(false);
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 10,
                marginBottom: 2,
                cursor: ok ? "pointer" : "not-allowed",
                border: "none",
                textAlign: "left",
                transition: "all 0.15s",
                background: active
                  ? "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(29,78,216,0.08))"
                  : "transparent",
                opacity: ok ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (!active && ok) e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  color: active ? "#1d4ed8" : ok ? "#6b7280" : "#d1d5db",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? "#1d4ed8" : ok ? "#374151" : "#9ca3af",
                }}
              >
                {item.label}
              </span>
              {!ok && (
                <span
                  style={{ marginLeft: "auto", fontSize: 11, color: "#d1d5db" }}
                >
                  <FontAwesomeIcon icon={faLock} />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Your Access summary */}
      <div
        style={{
          margin: "0 10px 8px",
          padding: "10px 12px",
          background: "#f9fafb",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            color: "#9ca3af",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            margin: "0 0 7px",
          }}
        >
          Your Access
        </p>
        {[
          ["Users", "VIEW_USERS"],
          ["Sales", "VIEW_SALES"],
          ["Net Profit", "VIEW_PROFIT"],
          ["Edit Txns", "EDIT_TRANSACTIONS"],
          ["PDF Export", "GENERATE_PDF"],
          ["Bikes", "VIEW_BIKES"],
          ["Edit Bikes", "EDIT_BIKES"],
        ].map(([label, perm]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1.5px 0",
            }}
          >
            <span style={{ color: "#6b7280", fontSize: 11 }}>{label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: can(role, perm) ? "#10b981" : "#d1d5db",
              }}
            >
              {can(role, perm) ? "✓" : "✕"}
            </span>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div style={{ padding: "0 8px 16px" }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 10px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: 13,
            fontWeight: 600,
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ fontSize: 14 }}
          />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f9fafb",
        fontFamily: "'DM Sans',system-ui,sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        select option { background: #ffffff; color: #111827; }
      `}</style>

      {/* Desktop sidebar */}
      <aside
        style={{ width: 224, flexShrink: 0, borderRight: "1px solid #e5e7eb" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
            }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 224,
              zIndex: 10,
              borderRight: "1px solid #e5e7eb",
              background: "#ffffff",
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 50,
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ☰
          </button>
          <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
            M&J Admin /&nbsp;
            <span style={{ color: "#374151", fontWeight: 600 }}>
              {NAV_ITEMS.find((n) => n.id === currentPage)?.label ||
                "Dashboard"}
            </span>
          </p>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6b7280", fontSize: 12 }}>{name}</span>
            <span
              style={{
                background: rs.bg,
                color: rs.text,
                border: `1px solid ${rs.border}`,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 999,
              }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
