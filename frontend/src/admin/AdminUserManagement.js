import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { can, ROLE_STYLES } from "./rbac";
import transition from "../transition";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faPhone,
  faCity,
  faHome,
  faIdBadge,
  faUsers,
  faUserShield,
  faUser,
  faMapMarkerAlt,
  faSearch,
  faLock,
  faSpinner,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";

// Role badge
function RoleBadge({ role }) {
  const s = ROLE_STYLES[role] || ROLE_STYLES.USER;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }}
      />
      {role}
    </span>
  );
}

// Colour avatar
function Avatar({ name, size = 36 }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palettes = [
    "135deg,#3b82f6,#1d4ed8",
    "135deg,#8b5cf6,#6d28d9",
    "135deg,#10b981,#059669",
    "135deg,#f59e0b,#d97706",
    "135deg,#ef4444,#dc2626",
    "135deg,#06b6d4,#0891b2",
  ];
  const grad = palettes[((name || "").charCodeAt(0) || 0) % palettes.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(${grad})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 900,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 200,
        padding: "12px 20px",
        borderRadius: 12,
        background: type === "success" ? "#10b981" : "#dc2626",
        color: "white",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
      }}
    >
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

// User details modal
function UserDetailModal({ user, role, onClose, onDelete }) {
  const displayId = user.id ? String(user.id) : "—";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div>
            <h3
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: 16,
                margin: 0,
              }}
            >
              User Profile
            </h3>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: user._source === "admin" ? "#8b5cf6" : "#059669",
              }}
            >
              {user._source === "admin"
                ? "● Admin Account"
                : "● Customer Account"}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#f3f4f6",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={`${user.firstName} ${user.lastName}`} size={56} />
            <div>
              <h4
                style={{
                  color: "#111827",
                  fontWeight: 800,
                  fontSize: 20,
                  margin: "0 0 4px",
                }}
              >
                {user.firstName} {user.lastName}
              </h4>
              <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 7px" }}>
                {user.email}
              </p>
              <RoleBadge role={user.role} />
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {[
              { icon: faPhone, label: "Phone", value: user.phone || "—" },
              { icon: faCity, label: "City", value: user.city || "—" },
              { icon: faHome, label: "Address", value: user.address || "—" },
              { icon: faIdBadge, label: "User ID", value: displayId },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#f9fafb",
                  borderRadius: 12,
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.label}
                </p>
                <p
                  style={{
                    color: "#374151",
                    fontSize: 13,
                    fontWeight: 600,
                    margin: 0,
                    wordBreak: "break-all",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#6b7280",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Close
          </button>
          {can(role, "DELETE_USERS") && user._source !== "admin" && (
            <button
              onClick={() => onDelete(user)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 12,
                border: "none",
                background: "#dc2626",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Confirm delete modal
function ConfirmDeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#ffffff",
          borderRadius: 20,
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
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          style={{
            color: "#111827",
            fontWeight: 800,
            fontSize: 18,
            margin: "0 0 8px",
          }}
        >
          Delete User?
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.6,
            margin: "0 0 22px",
          }}
        >
          Permanently delete{" "}
          <strong style={{ color: "#111827" }}>
            {user.firstName} {user.lastName}
          </strong>
          ?<br />
          This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#ffffff",
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
              borderRadius: 12,
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// MAIN
function AdminUserManagement() {
  const role = sessionStorage.getItem("adminRole") || "STAFF";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // Fetch ALL users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch both
      const [usersRes, adminsRes] = await Promise.all([
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/admin/all`),
      ]);

      const usersData = await usersRes.json();
      const adminsData = await adminsRes.json();

      const customers = (usersData.success ? usersData.data : []).map((u) => ({
        ...u,
        _source: "user",
      }));
      const admins = (adminsData.success ? adminsData.data : []).map((u) => ({
        ...u,
        _source: "admin",
      }));

      setUsers([...admins, ...customers]);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Delete user
  const doDelete = async (user) => {
    setToDelete(null);
    setSelected(null);
    try {
      const endpoint =
        user._source === "admin"
          ? `${API_BASE}/admin/${user.id}`
          : `${API_BASE}/users/${user.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setUsers((prev) =>
          prev.filter((u) => !(u.id === user.id && u._source === user._source)),
        );
        showToast(`${user.firstName} ${user.lastName} deleted`);
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  // Filter
  const filtered = users.filter((u) => {
    const q = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return (
      (!search || q.includes(search.toLowerCase())) &&
      (roleFilter === "ALL" || u.role === roleFilter)
    );
  });

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter((u) =>
      ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"].includes(u.role),
    ).length,
    customers: users.filter((u) => u.role === "USER").length,
    cities: [...new Set(users.map((u) => u.city).filter(Boolean))].length,
  };

  // Access denied
  if (!can(role, "VIEW_USERS"))
    return (
      <AdminLayout currentPage="users">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            textAlign: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#fee2e2",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: 22,
              margin: 0,
            }}
          >
            Access Denied
          </h2>
          <p
            style={{ color: "#6b7280", fontSize: 14, margin: 0, maxWidth: 300 }}
          >
            Role <strong style={{ color: "#374151" }}>{role}</strong> cannot
            access User Management.
          </p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout currentPage="users">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {selected && (
        <UserDetailModal
          user={selected}
          role={role}
          onClose={() => setSelected(null)}
          onDelete={(u) => {
            setToDelete(u);
            setSelected(null);
          }}
        />
      )}
      {toDelete && (
        <ConfirmDeleteModal
          user={toDelete}
          onConfirm={() => doDelete(toDelete)}
          onCancel={() => setToDelete(null)}
        />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: 22,
                margin: "0 0 4px",
              }}
            >
              User Management
            </h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
              All registered users — customers and admin staff
            </p>
          </div>
          <button
            onClick={fetchAllUsers}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontWeight: 700,
              fontSize: 13,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              spin={loading}
              style={{ fontSize: 13 }}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Total Users",
              val: stats.total,
              color: "#3b82f6",
              rgb: "59,130,246",
              icon: faUsers,
            },
            {
              label: "Admin Staff",
              val: stats.admins,
              color: "#8b5cf6",
              rgb: "139,92,246",
              icon: faUserShield,
            },
            {
              label: "Customers",
              val: stats.customers,
              color: "#10b981",
              rgb: "16,185,129",
              icon: faUser,
            },
            {
              label: "Cities",
              val: stats.cities,
              color: "#f59e0b",
              rgb: "245,158,11",
              icon: faMapMarkerAlt,
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: `rgba(${c.rgb},0.05)`,
                border: `1px solid rgba(${c.rgb},0.2)`,
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <p style={{ fontSize: 18, margin: "0 0 8px", color: c.color }}>
                <FontAwesomeIcon icon={c.icon} />
              </p>
              <p
                style={{
                  color: c.color,
                  fontWeight: 800,
                  fontSize: 28,
                  margin: "0 0 2px",
                }}
              >
                {loading ? "—" : c.val}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search and filter */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
                fontSize: 14,
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              style={{
                width: "100%",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 12,
                padding: "9px 14px 9px 36px",
                color: "#374151",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              background: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: "9px 14px",
              color: "#6b7280",
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="ALL">All Roles</option>
            {["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF", "USER"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1.2fr 1.3fr 1.4fr 90px",
              padding: "10px 20px",
              borderBottom: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            <span>User</span>
            <span>Email</span>
            <span>Phone</span>
            <span>City</span>
            <span>Role</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {/* Body */}
          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                style={{
                  fontSize: 32,
                  color: "#9ca3af",
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading users…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  fontSize: 36,
                  color: "#e5e7eb",
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
              <p style={{ color: "#6b7280", fontWeight: 600, margin: 0 }}>
                No users found
              </p>
            </div>
          ) : (
            filtered.map((user) => (
              <div
                key={`${user._source}-${user.id}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1.2fr 1.3fr 1.4fr 90px",
                  padding: "12px 20px",
                  alignItems: "center",
                  borderBottom: "1px solid #f3f4f6",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}
                >
                  <Avatar name={`${user.firstName} ${user.lastName}`} />
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 13,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </span>
                    {user._source === "admin" && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#8b5cf6",
                          fontWeight: 700,
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <span
                  style={{
                    color: "#6b7280",
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </span>
                <span style={{ color: "#6b7280", fontSize: 13 }}>
                  {user.phone || "—"}
                </span>
                <span style={{ color: "#6b7280", fontSize: 13 }}>
                  {user.city || "—"}
                </span>
                <span>
                  <RoleBadge role={user.role} />
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  {can(role, "VIEW_USER_DETAILS") && (
                    <button
                      onClick={() => setSelected(user)}
                      title="View details"
                      style={{
                        width: 29,
                        height: 29,
                        borderRadius: 8,
                        background: "#f3f4f6",
                        border: "none",
                        cursor: "pointer",
                        color: "#6b7280",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#2563eb";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {can(role, "DELETE_USERS") && user._source !== "admin" && (
                    <button
                      onClick={() => setToDelete(user)}
                      title="Delete user"
                      style={{
                        width: 29,
                        height: 29,
                        borderRadius: 8,
                        background: "#f3f4f6",
                        border: "none",
                        cursor: "pointer",
                        color: "#6b7280",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dc2626";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Footer */}
          <div
            style={{
              padding: "10px 20px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${users.length} users`}
            </p>
            {!can(role, "DELETE_USERS") && (
              <p style={{ color: "#d1d5db", fontSize: 12, margin: 0 }}>
                <FontAwesomeIcon icon={faLock} /> Delete requires OWNER role
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default transition(AdminUserManagement);
