import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  faUserShield,
  faChartBar,
  faUsers,
  faClipboardList,
  faCheckCircle,
  faCircleExclamation,
  faArrowRight,
  faArrowLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import EmailVerifyStep from "../components/EmailVerifyStep";

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

const ADMIN_ROLES = [
  {
    key: "OWNER",
    label: "Owner",
    icon: faUserShield,
    color: "#8b5cf6",
    bg: "#ede9fe",
    desc: "Full access to all features and data",
  },
  {
    key: "ACCOUNTANT",
    label: "Accountant",
    icon: faChartBar,
    color: "#2563eb",
    bg: "#dbeafe",
    desc: "Finance, reports and PDF export",
  },
  {
    key: "SALES_REP",
    label: "Sales Rep",
    icon: faUsers,
    color: "#059669",
    bg: "#dcfce7",
    desc: "Sales data and customer management",
  },
  {
    key: "STAFF",
    label: "Staff",
    icon: faClipboardList,
    color: "#6b7280",
    bg: "#f3f4f6",
    desc: "View-only access to transaction history",
  },
];

// Phone validation
function validatePhone(value) {
  if (!value || !value.trim()) return "Phone number is required";

  const v = value.trim();

  if (/[a-zA-Z]/.test(v)) return "Phone number must contain digits only";

  if (/\s/.test(v)) return "Phone number must not contain spaces";

  if (!/^\+?\d+$/.test(v)) return "Phone number must contain digits only";

  if (v.startsWith("0")) {
    if (v.length < 10)
      return `Phone number is too short — must be 10 digits (e.g. 0771234567)`;
    if (v.length > 10)
      return `Phone number is too long — must be 10 digits (e.g. 0771234567)`;
    return null; 
  }

  if (v.startsWith("+94")) {
    const required = 12; 
    if (v.length < required)
      return `International number too short — must be +94 followed by 9 digits (e.g. +94771234567)`;
    if (v.length > required)
      return `International number too long — must be +94 followed by 9 digits (e.g. +94771234567)`;
    return null; 
  }

  return "Enter a valid phone number starting with 0 (e.g. 0771234567) or +94 (e.g. +94771234567)";
}

//  Phone input handler digits only, blocks letters and spaces
function sanitizePhone(raw) {
  const hasPlus = raw.startsWith("+");
  const digitsOnly = raw.replace(/\D/g, "");
  return hasPlus ? "+" + digitsOnly : digitsOnly;
}

export default function AdminRegister() {
  const navigate = useNavigate();

  const [step, setStep] = useState("step1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [slots, setSlots] = useState({
    ownerAvailable: true,
    accountantAvailable: true,
  });
  const [slotsLoading, setSlotsLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch(`${API_BASE}/admin/slots`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSlots(d.data);
      })
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, []);

  const setF = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setError("");
  };

  // Phone input
  const handlePhoneChange = (raw) => {
    const sanitized = sanitizePhone(raw);
    setF("phone", sanitized);
  };

  const inputStyle = (key) => ({
    width: "100%",
    background: "#ffffff",
    borderRadius: 10,
    padding: "11px 13px 11px 38px",
    color: "#111827",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    border: `1px solid ${errors[key] ? "#fca5a5" : "#d1d5db"}`,
    transition: "border-color 0.15s",
  });

  // Step 1 validation 
  const validateStep1 = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";

    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";

    const phoneError = validatePhone(form.phone);
    if (phoneError) e.phone = phoneError;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const e = {};
    if (!form.role) e.role = "Please select a role";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // After email verified
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
        setTimeout(() => navigate("/admin/login"), 2200);
      } else {
        setError(data.message || "Registration failed.");
        setStep("step2");
      }
    } catch {
      setError("Cannot connect to server.");
      setStep("step2");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS
  if (step === "done")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "#16a34a", fontSize: 32 }}
            />
          </div>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: 22,
              marginBottom: 6,
            }}
          >
            Account Created!
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Redirecting to login…
          </p>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input::placeholder{color:#9ca3af}
        input:focus,select:focus{outline:none}
        @keyframes fade-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .reg-card{animation:fade-up 0.4s ease forwards}
        select option{background:#ffffff;color:#111827}
      `}</style>

      <div className="reg-card" style={{ width: "100%", maxWidth: 540 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#d30000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: 900, fontSize: 13 }}>
                MJ
              </span>
            </div>
            <p style={{ color: "#111827", fontWeight: 800, fontSize: 15 }}>
              M&J Enterprises
            </p>
          </div>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: 24,
              marginBottom: 5,
            }}
          >
            Create Admin Account
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13 }}>
            Register for admin console access
          </p>
        </div>

        {/* Step indicator */}
        {step !== "verify" && (
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            {[
              { n: 1, label: "Personal Info" },
              { n: 2, label: "Role & Security" },
            ].map((s, i) => {
              const stepNum = step === "step1" ? 1 : 2;
              return (
                <React.Fragment key={s.n}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        background:
                          stepNum > s.n
                            ? "#16a34a"
                            : stepNum === s.n
                              ? "#d30000"
                              : "#ffffff",
                        color: stepNum >= s.n ? "white" : "#9ca3af",
                        border: stepNum < s.n ? "1px solid #d1d5db" : "none",
                      }}
                    >
                      {stepNum > s.n ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={{ fontSize: 13 }}
                        />
                      ) : (
                        s.n
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: stepNum === s.n ? "#111827" : "#9ca3af",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i === 0 && (
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: stepNum > 1 ? "#d30000" : "#e5e7eb",
                        margin: "0 12px",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 14px",
                borderRadius: 10,
                background: "#fee2e2",
                border: "1px solid #fecaca",
                marginBottom: 18,
              }}
            >
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ color: "#dc2626", fontSize: 14 }}
              />
              <p
                style={{
                  color: "#991b1b",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* STEP 1 */}
          {step === "step1" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Personal Details
              </p>

              {/* Name row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { label: "First Name", key: "firstName", ph: "Omira" },
                  { label: "Last Name", key: "lastName", ph: "Rathnaweera" },
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
                        icon={faUser}
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
                        value={form[f.key]}
                        onChange={(e) => setF(f.key, e.target.value)}
                        placeholder={f.ph}
                        style={inputStyle(f.key)}
                        onFocus={(e) => {
                          if (!errors[f.key])
                            e.target.style.borderColor = "#d30000";
                        }}
                        onBlur={(e) => {
                          if (!errors[f.key])
                            e.target.style.borderColor = "#d1d5db";
                        }}
                      />
                    </div>
                    {errors[f.key] && (
                      <p
                        style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}
                      >
                        {errors[f.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
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
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
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
                    type="email"
                    value={form.email}
                    onChange={(e) => setF("email", e.target.value)}
                    placeholder="admin@mj.com"
                    style={inputStyle("email")}
                    onFocus={(e) => {
                      if (!errors.email) e.target.style.borderColor = "#d30000";
                    }}
                    onBlur={(e) => {
                      if (!errors.email) e.target.style.borderColor = "#d1d5db";
                    }}
                  />
                </div>
                {errors.email && (
                  <p style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
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
                  Phone Number
                </label>
                <div style={{ position: "relative" }}>
                  <FontAwesomeIcon
                    icon={faPhone}
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
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="07********"
                    maxLength={12}
                    style={inputStyle("phone")}
                    onFocus={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "#d30000";
                    }}
                    onBlur={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "#d1d5db";
                    }}
                  />
                  {/* Live character counter */}
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 11,
                      color:
                        form.phone.length === 10 || form.phone.length === 12
                          ? "#10b981"
                          : "#9ca3af",
                      fontWeight: 700,
                    }}
                  >
                    {form.phone.length}/
                    {form.phone.startsWith("+94") ? "12" : "10"}
                  </span>
                </div>
                {/* Error */}
                {errors.phone && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: 11,
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      style={{ fontSize: 11 }}
                    />
                    {errors.phone}
                  </p>
                )}
                {!errors.phone && (
                  <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>
                    10 digits starting with 0 or +94 followed by 9 digits
                  </p>
                )}
              </div>

              {/* City and Address */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
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
                    City
                  </label>
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faCity}
                      style={{
                        position: "absolute",
                        left: 13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        fontSize: 12,
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                    <select
                      value={form.city}
                      onChange={(e) => setF("city", e.target.value)}
                      style={{
                        ...inputStyle("city"),
                        appearance: "none",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#d30000")}
                      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    >
                      <option value="">Select city</option>
                      {SRI_LANKA_CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
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
                    Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faHome}
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
                      value={form.address}
                      onChange={(e) => setF("address", e.target.value)}
                      placeholder="123 Main St"
                      style={inputStyle("address")}
                      onFocus={(e) => (e.target.style.borderColor = "#d30000")}
                      onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => validateStep1() && setStep("step2")}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#d30000",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#d30000")
                }
              >
                Continue <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === "step2" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Admin Role
                </label>
                {slotsLoading ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#9ca3af",
                    }}
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Loading…
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 7 }}
                  >
                    {ADMIN_ROLES.map((r) => {
                      const disabled =
                        (r.key === "OWNER" && !slots.ownerAvailable) ||
                        (r.key === "ACCOUNTANT" && !slots.accountantAvailable);
                      const sel = form.role === r.key;
                      return (
                        <button
                          type="button"
                          key={r.key}
                          onClick={() => !disabled && setF("role", r.key)}
                          disabled={disabled}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 11,
                            padding: "11px 14px",
                            borderRadius: 10,
                            cursor: disabled ? "not-allowed" : "pointer",
                            textAlign: "left",
                            transition: "all 0.15s",
                            border: `1.5px solid ${disabled ? "#f3f4f6" : sel ? r.color : "#e5e7eb"}`,
                            background: disabled
                              ? "#fafafa"
                              : sel
                                ? r.bg
                                : "#f9fafb",
                            opacity: disabled ? 0.55 : 1,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              background: disabled
                                ? "#e5e7eb"
                                : sel
                                  ? r.color
                                  : "#e5e7eb",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={disabled ? faLock : r.icon}
                              style={{
                                color: disabled
                                  ? "#9ca3af"
                                  : sel
                                    ? "white"
                                    : "#9ca3af",
                                fontSize: 13,
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                color: disabled
                                  ? "#9ca3af"
                                  : sel
                                    ? "#111827"
                                    : "#374151",
                                fontWeight: 700,
                                fontSize: 13,
                                margin: "0 0 2px",
                              }}
                            >
                              {r.label}
                              {disabled && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: 10,
                                    color: "#ef4444",
                                    background: "#fee2e2",
                                    padding: "2px 7px",
                                    borderRadius: 99,
                                    fontWeight: 600,
                                  }}
                                >
                                  Disable
                                </span>
                              )}
                            </p>
                            <p
                              style={{
                                color: "#9ca3af",
                                fontSize: 11,
                                margin: 0,
                              }}
                            >
                              {disabled ? `Only 1 ${r.label} allowed.` : r.desc}
                            </p>
                          </div>
                          {sel && !disabled && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              style={{ color: r.color, fontSize: 16 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.role && (
                  <p style={{ color: "#dc2626", fontSize: 11, marginTop: 5 }}>
                    {errors.role}
                  </p>
                )}
              </div>

              {[
                {
                  label: "Password",
                  key: "password",
                  show: showPass,
                  toggle: () => setShowPass((p) => !p),
                  ph: "Min. 6 characters",
                },
                {
                  label: "Confirm Password",
                  key: "confirmPassword",
                  show: showConf,
                  toggle: () => setShowConf((p) => !p),
                  ph: "Repeat password",
                },
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
                      icon={faLock}
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
                      type={f.show ? "text" : "password"}
                      value={form[f.key]}
                      onChange={(e) => setF(f.key, e.target.value)}
                      placeholder={f.ph}
                      style={{ ...inputStyle(f.key), paddingRight: 40 }}
                      onFocus={(e) => {
                        if (!errors[f.key])
                          e.target.style.borderColor = "#d30000";
                      }}
                      onBlur={(e) => {
                        if (!errors[f.key])
                          e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                    <button
                      type="button"
                      onClick={f.toggle}
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
                        icon={f.show ? faEye : faEyeSlash}
                        style={{ fontSize: 13 }}
                      />
                    </button>
                  </div>
                  {errors[f.key] && (
                    <p style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setStep("step1")}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#6b7280",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: "inherit",
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => validateStep2() && setStep("verify")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#d30000",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#b91c1c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#d30000")
                  }
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* EMAIL VERIFICATION */}
          {step === "verify" &&
            (loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "40px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: 32, color: "#9ca3af" }}
                />
                <p style={{ color: "#9ca3af", fontSize: 14 }}>
                  Creating your account…
                </p>
              </div>
            ) : (
              <EmailVerifyStep
                email={form.email}
                context="admin"
                onVerified={handleRegister}
                onBack={() => setStep("step2")}
              />
            ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: 13,
            marginTop: 20,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/admin/login"
            style={{
              color: "#d30000",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
