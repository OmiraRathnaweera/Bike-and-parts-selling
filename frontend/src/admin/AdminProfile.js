import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import transition from "../transition";
import { ROLE_STYLES } from "./rbac";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCity,
  faHome,
  faLock,
  faEye,
  faEyeSlash,
  faShield,
  faFloppyDisk,
  faTrash,
  faCheckCircle,
  faTriangleExclamation,
  faPen,
  faIdBadge,
  faKey,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";

const SRI_LANKA_CITIES = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Dambulla",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Hatton",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Negombo",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

function RoleBadge({ role }) {
  const s = ROLE_STYLES[role] || ROLE_STYLES.STAFF;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }}
      />
      {role}
    </span>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 200,
        padding: "12px 18px",
        borderRadius: 12,
        background: type === "success" ? "#10b981" : "#dc2626",
        color: "white",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      }}
    >
      <FontAwesomeIcon
        icon={type === "success" ? faCheckCircle : faTriangleExclamation}
      />
      {message}
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
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
        background: "rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#ffffff",
          borderRadius: 18,
          padding: 28,
          textAlign: "center",
          border: danger ? "1px solid #fecaca" : "1px solid #e5e7eb",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: danger ? "#fee2e2" : "#dbeafe",
            border: `1px solid ${danger ? "#fecaca" : "#bfdbfe"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <FontAwesomeIcon
            icon={danger ? faTrash : faCheckCircle}
            style={{ color: danger ? "#dc2626" : "#2563eb", fontSize: 20 }}
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
          {title}
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.6,
            margin: "0 0 22px",
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
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
              borderRadius: 10,
              border: "none",
              background: danger ? "#dc2626" : "#2563eb",
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {danger ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminProfile() {
  const adminId = Number(sessionStorage.getItem("userId"));
  const role = sessionStorage.getItem("adminRole") || "STAFF";

  const [tab, setTab] = useState("info");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const showToast = (msg, type = "success") => setToast({ msg, type });
  const setF = (k, v) => setFormData((f) => ({ ...f, [k]: v }));
  const setPF = (k, v) => {
    setPwForm((f) => ({ ...f, [k]: v }));
    setPwErrors((e) => ({ ...e, [k]: "" }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/${adminId}`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
      } else showToast(data.message || "Failed to load profile", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  // Save profile info
  const handleSaveInfo = async () => {
    if (!formData.firstName?.trim()) {
      showToast("First name is required", "error");
      return;
    }
    if (!formData.lastName?.trim()) {
      showToast("Last name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData(data.data);
        setEditing(false);
        sessionStorage.setItem(
          "adminName",
          `${data.data.firstName} ${data.data.lastName}`,
        );
        sessionStorage.setItem(
          "userName",
          `${data.data.firstName} ${data.data.lastName}`,
        );
        showToast("Profile updated successfully");
      } else showToast(data.message || "Update failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  // Validate and change password
  const validatePassword = () => {
    const e = {};
    if (!pwForm.current) e.current = "Enter current password";
    if (!pwForm.next) e.next = "Enter new password";
    else if (pwForm.next.length < 6) e.next = "Min 6 characters";
    else if (pwForm.next === pwForm.current)
      e.next = "New password must differ from current";
    if (!pwForm.confirm) e.confirm = "Confirm your password";
    else if (pwForm.next !== pwForm.confirm)
      e.confirm = "Passwords don't match";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/${adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          currentPassword: pwForm.current,
          password: pwForm.next,
          confirmPassword: pwForm.confirm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPwForm({ current: "", next: "", confirm: "" });
        showToast("Password changed successfully");
      } else showToast(data.message || "Password change failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete 
  const handleDeleteAccount = async () => {
    setConfirm(null);
    try {
      const res = await fetch(`${API_BASE}/admin/${adminId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.clear();
        localStorage.clear();
        showToast("Account deleted. Redirecting…", "error");
        setTimeout(() => (window.location.href = "/admin/login"), 1800);
      } else showToast(data.message || "Delete failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";
  const initials =
    fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const palettes = [
    "135deg,#3b82f6,#1d4ed8",
    "135deg,#8b5cf6,#6d28d9",
    "135deg,#10b981,#059669",
    "135deg,#f59e0b,#d97706",
    "135deg,#d30000,#991b1b",
    "135deg,#06b6d4,#0891b2",
  ];
  const grad = palettes[(fullName.charCodeAt(0) || 0) % palettes.length];

  const TABS = [
    { id: "info", label: "Account Info", icon: faUser },
    { id: "security", label: "Security", icon: faShield },
  ];

  const inputStyle = {
    width: "100%",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 13px 10px 38px",
    color: "#374151",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  };
  const inputStyleEditing = {
    ...inputStyle,
    background: "#ffffff",
    border: "1px solid #d1d5db",
  };

  const PwInput = ({ field, label, placeholder }) => (
    <div>
      <label
        style={{
          color: "#374151",
          fontSize: 12,
          fontWeight: 700,
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <FontAwesomeIcon
          icon={faKey}
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            fontSize: 12,
            pointerEvents: "none",
          }}
        />
        <input
          type={showPw[field] ? "text" : "password"}
          value={pwForm[field]}
          onChange={(e) => setPF(field, e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: "#ffffff",
            border: `1px solid ${pwErrors[field] ? "#fca5a5" : "#d1d5db"}`,
            borderRadius: 10,
            padding: "10px 38px 10px 38px",
            color: "#374151",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
          onFocus={(e) => {
            if (!pwErrors[field]) e.target.style.borderColor = "#d30000";
          }}
          onBlur={(e) => {
            if (!pwErrors[field]) e.target.style.borderColor = "#d1d5db";
          }}
        />
        <button
          type="button"
          onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={showPw[field] ? faEyeSlash : faEye}
            style={{ fontSize: 13 }}
          />
        </button>
      </div>
      {pwErrors[field] && (
        <p style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>
          {pwErrors[field]}
        </p>
      )}
    </div>
  );

  if (loading)
    return (
      <AdminLayout currentPage="profile">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            gap: 12,
            flexDirection: "column",
          }}
        >
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ fontSize: 32, color: "#9ca3af" }}
          />
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading profile…</p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout currentPage="profile">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirm && (
        <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Hero card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: "24px 28px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: `linear-gradient(${grad})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                fontSize: 26,
              }}
            >
              {initials}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#d30000",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faShield}
                style={{ color: "white", fontSize: 9 }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: 20,
                margin: "0 0 4px",
              }}
            >
              {fullName}
            </h2>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 8px" }}>
              {profile?.email}
            </p>
            <RoleBadge role={profile?.role || role} />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "City", value: profile?.city || "—", icon: faCity },
              { label: "Phone", value: profile?.phone || "—", icon: faPhone },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                  icon={s.icon}
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                    display: "block",
                    marginBottom: 4,
                  }}
                />
                <p
                  style={{
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: 13,
                    margin: "0 0 2px",
                  }}
                >
                  {s.value}
                </p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            marginBottom: 16,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "9px 14px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                transition: "all 0.15s",
                background: tab === t.id ? "#d30000" : "transparent",
                color: tab === t.id ? "white" : "#6b7280",
              }}
            >
              <FontAwesomeIcon icon={t.icon} style={{ fontSize: 13 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Account Info tab */}
        {tab === "info" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faIdBadge}
                    style={{ color: "#d30000", fontSize: 15 }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      color: "#111827",
                      fontWeight: 800,
                      fontSize: 15,
                      margin: 0,
                    }}
                  >
                    Account Information
                  </h3>
                  <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                    Personal details and contact info
                  </p>
                </div>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 14px",
                    borderRadius: 9,
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#ffffff")
                  }
                >
                  <FontAwesomeIcon icon={faPen} style={{ fontSize: 12 }} /> Edit
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      setFormData(profile);
                      setEditing(false);
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 9,
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
                    onClick={handleSaveInfo}
                    disabled={saving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 16px",
                      borderRadius: 9,
                      border: "none",
                      background: saving ? "#9ca3af" : "#d30000",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: saving ? "not-allowed" : "pointer",
                    }}
                  >
                    {saving ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        style={{ width: 14, height: 14 }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faFloppyDisk}
                        style={{ fontSize: 13 }}
                      />
                    )}
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div
              style={{
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                {[
                  { label: "First Name", key: "firstName", icon: faUser },
                  { label: "Last Name", key: "lastName", icon: faUser },
                ].map((f) => (
                  <div key={f.key}>
                    <label
                      style={{
                        color: "#374151",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {f.label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <FontAwesomeIcon
                        icon={f.icon}
                        style={{
                          position: "absolute",
                          left: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                          fontSize: 12,
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        value={formData[f.key] || ""}
                        onChange={(e) => setF(f.key, e.target.value)}
                        disabled={!editing}
                        style={editing ? inputStyleEditing : inputStyle}
                        onFocus={(e) => {
                          if (editing) e.target.style.borderColor = "#d30000";
                        }}
                        onBlur={(e) => {
                          if (editing) e.target.style.borderColor = "#d1d5db";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Email - read only */}
              <div>
                <label
                  style={{
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Email Address{" "}
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: 11,
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    (cannot be changed)
                  </span>
                </label>
                <div style={{ position: "relative" }}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: 12,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    value={profile?.email || ""}
                    disabled
                    style={{
                      ...inputStyle,
                      color: "#9ca3af",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>

              {/* Phone + City */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#374151",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Phone
                  </label>
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        fontSize: 12,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      value={formData.phone || ""}
                      onChange={(e) => setF("phone", e.target.value)}
                      disabled={!editing}
                      style={editing ? inputStyleEditing : inputStyle}
                      onFocus={(e) => {
                        if (editing) e.target.style.borderColor = "#d30000";
                      }}
                      onBlur={(e) => {
                        if (editing) e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      color: "#374151",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    City
                  </label>
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faCity}
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        fontSize: 12,
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                    {editing ? (
                      <select
                        value={formData.city || ""}
                        onChange={(e) => setF("city", e.target.value)}
                        style={{
                          ...inputStyleEditing,
                          appearance: "none",
                          cursor: "pointer",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#d30000")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                      >
                        <option value="">Select city</option>
                        {SRI_LANKA_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={formData.city || ""}
                        disabled
                        style={inputStyle}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  style={{
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Address
                </label>
                <div style={{ position: "relative" }}>
                  <FontAwesomeIcon
                    icon={faHome}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: 12,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    value={formData.address || ""}
                    onChange={(e) => setF("address", e.target.value)}
                    disabled={!editing}
                    style={editing ? inputStyleEditing : inputStyle}
                    onFocus={(e) => {
                      if (editing) e.target.style.borderColor = "#d30000";
                    }}
                    onBlur={(e) => {
                      if (editing) e.target.style.borderColor = "#d1d5db";
                    }}
                  />
                </div>
              </div>

              {/* Role — read only */}
              <div>
                <label
                  style={{
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Admin Role{" "}
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: 11,
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    (managed by Owner)
                  </span>
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 13px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLock}
                    style={{ color: "#9ca3af", fontSize: 12 }}
                  />
                  <RoleBadge role={profile?.role || role} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab === "security" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Change password */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 24px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faKey}
                    style={{ color: "#2563eb", fontSize: 14 }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      color: "#111827",
                      fontWeight: 800,
                      fontSize: 15,
                      margin: 0,
                    }}
                  >
                    Change Password
                  </h3>
                  <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                    Update your login credentials
                  </p>
                </div>
              </div>
              <div
                style={{
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <PwInput
                  field="current"
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <PwInput
                  field="next"
                  label="New Password"
                  placeholder="Min. 6 characters"
                />
                <PwInput
                  field="confirm"
                  label="Confirm New Password"
                  placeholder="Repeat new password"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: saving ? "#9ca3af" : "#2563eb",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: saving ? "not-allowed" : "pointer",
                    alignSelf: "flex-start",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) e.currentTarget.style.background = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) e.currentTarget.style.background = "#2563eb";
                  }}
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Updating…
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFloppyDisk} /> Update Password
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #fecaca",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 24px",
                  borderBottom: "1px solid #fecaca",
                  background: "#fff5f5",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    style={{ color: "#dc2626", fontSize: 14 }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      color: "#991b1b",
                      fontWeight: 800,
                      fontSize: 15,
                      margin: 0,
                    }}
                  >
                    If you want a remove your account
                  </h3>
                  <p style={{ color: "#f87171", fontSize: 12, margin: 0 }}>
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: 14,
                        margin: "0 0 3px",
                      }}
                    >
                      Delete Admin Account
                    </p>
                    <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>
                      Permanently remove your account and all associated data.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setConfirm({
                        title: "Delete Account?",
                        message: `Permanently delete the account for ${fullName}?`,
                        onConfirm: handleDeleteAccount,
                        danger: true,
                      })
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "9px 16px",
                      borderRadius: 9,
                      border: "1px solid #fecaca",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dc2626";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.borderColor = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.borderColor = "#fecaca";
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: 12 }} />{" "}
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default transition(AdminProfile);
