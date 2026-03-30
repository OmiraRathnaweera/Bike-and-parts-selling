import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import transition from "../transition";

import {
  faUser,
  faEnvelope,
  faPhone,
  faLocationDot,
  faHome,
  faLock,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faTriangleExclamation,
  faSpinner,
  faCircleExclamation,
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

// Phone validation
function validatePhone(value) {
  if (!value || !value.trim()) return null;

  const v = value.trim();

  if (/[a-zA-Z]/.test(v))
    return "Phone number must contain digits only — no letters";
  if (/\s/.test(v)) return "Phone number must not contain spaces";
  if (!/^\+?\d+$/.test(v)) return "Phone number must contain digits only";

  if (v.startsWith("0")) {
    if (v.length < 10)
      return "Too short — local number must be 10 digits (e.g. 0771234567)";
    if (v.length > 10)
      return "Too long — local number must be 10 digits (e.g. 0771234567)";
    return null; 
  }

  if (v.startsWith("+94")) {
    if (v.length < 12)
      return "Too short — must be +94 followed by 9 digits (e.g. +94771234567)";
    if (v.length > 12)
      return "Too long — must be +94 followed by 9 digits (e.g. +94771234567)";
    return null; 
  }

  return "Enter a number starting with 0 (e.g. 0771234567) or +94 (e.g. +94771234567)";
}

// Strips letters and spaces as user types
function sanitizePhone(raw) {
  const hasPlus = raw.startsWith("+");
  const digitsOnly = raw.replace(/\D/g, "");
  return hasPlus ? "+" + digitsOnly : digitsOnly;
}

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const setF = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setError("");
  };

  // Phone: strip letters and spaces instantly as user types
  const handlePhoneChange = (raw) => {
    const sanitized = sanitizePhone(raw);
    setF("phone", sanitized);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";

    // Phone: Optional but must be valid format if provided
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinueToVerify = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("verify");
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
        setTimeout(() => navigate("/login"), 2200);
      } else {
        setError(data.message || "Registration failed.");
        setStep("form");
      }
    } catch {
      setError("Cannot connect to server.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key) => ({
    width: "100%",
    border: `1px solid ${errors[key] ? "#fca5a5" : "#e5e7eb"}`,
    borderRadius: 12,
    padding: "12px 14px 12px 42px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    background: errors[key] ? "#fff5f5" : "#ffffff",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  });

  const iconStyle = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    fontSize: 13,
    pointerEvents: "none",
  };

  // Done screen
  if (step === "done")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: 40 }}>
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
              icon={faCircleCheck}
              style={{ color: "#16a34a", fontSize: 32 }}
            />
          </div>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: 22,
              margin: "0 0 6px",
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">Join M&J Enterprises today</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* FORM */}
          {step === "form" && (
            <form
              onSubmit={handleContinueToVerify}
              className="flex flex-col gap-4"
            >
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="mt-0.5 shrink-0"
                  />
                  {error}
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "First Name",
                    key: "firstName",
                    placeholder: "John",
                  },
                  { label: "Last Name", key: "lastName", placeholder: "Doe" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                      {f.label}
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} style={iconStyle} />
                      <input
                        value={form[f.key]}
                        onChange={(e) => setF(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={inputCls(f.key)}
                        onFocus={(e) => {
                          if (!errors[f.key])
                            e.target.style.borderColor = "#3b82f6";
                        }}
                        onBlur={(e) => {
                          if (!errors[f.key])
                            e.target.style.borderColor = "#e5e7eb";
                        }}
                      />
                    </div>
                    {errors[f.key] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[f.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setF("email", e.target.value)}
                    placeholder="you@example.com"
                    style={inputCls("email")}
                    onFocus={(e) => {
                      if (!errors.email) e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      if (!errors.email) e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/*  Phone - digits only, strict length */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Phone Number
                  <span className="text-gray-400 font-normal normal-case tracking-normal ml-2 text-xs">
                    optional · digits only
                  </span>
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} style={iconStyle} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="0771234567 or +94771234567"
                    maxLength={12}
                    style={{ ...inputCls("phone"), paddingRight: 52 }}
                    onFocus={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                  {/* Live character counter */}
                  {form.phone.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 11,
                        fontWeight: 700,
                        pointerEvents: "none",
                        color:
                          form.phone.length === 10 || form.phone.length === 12
                            ? "#10b981"
                            : "#9ca3af",
                      }}
                    >
                      {form.phone.length}/
                      {form.phone.startsWith("+94") ? "12" : "10"}
                    </span>
                  )}
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      style={{ fontSize: 10 }}
                    />
                    {errors.phone}
                  </p>
                )}
                {/* Only shown when field is empty and no error */}
                {!errors.phone && !form.phone && (
                  <p className="text-gray-400 text-xs mt-1">
                    Local: 10 digits starting with 0 · International: +94 + 9
                    digits
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  City
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLocationDot} style={iconStyle} />
                  <select
                    value={form.city}
                    onChange={(e) => setF("city", e.target.value)}
                    style={{
                      ...inputCls("city"),
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  >
                    <option value="">Select city</option>
                    {SRI_LANKA_CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faHome} style={iconStyle} />
                  <input
                    value={form.address}
                    onChange={(e) => setF("address", e.target.value)}
                    placeholder="Your street address"
                    style={inputCls("address")}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} style={iconStyle} />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setF("password", e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ ...inputCls("password"), paddingRight: 42 }}
                    onFocus={(e) => {
                      if (!errors.password)
                        e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      if (!errors.password)
                        e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      padding: 0,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showPw ? faEyeSlash : faEye}
                      style={{ fontSize: 14 }}
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} style={iconStyle} />
                  <input
                    type={showCpw ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setF("confirmPassword", e.target.value)}
                    placeholder="Repeat password"
                    style={{ ...inputCls("confirmPassword"), paddingRight: 42 }}
                    onFocus={(e) => {
                      if (!errors.confirmPassword)
                        e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      if (!errors.confirmPassword)
                        e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCpw((v) => !v)}
                    tabIndex={-1}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      padding: 0,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showCpw ? faEyeSlash : faEye}
                      style={{ fontSize: 14 }}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-widest text-sm rounded-xl py-4 transition-colors flex items-center justify-center gap-2 mt-1"
              >
                REGISTER
              </button>
            </form>
          )}

          {/*  EMAIL VERIFICATION */}
          {step === "verify" && (
            <>
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    style={{ fontSize: 32, color: "#9ca3af" }}
                  />
                  <p className="text-gray-500 text-sm">
                    Creating your account…
                  </p>
                </div>
              ) : (
                <EmailVerifyStep
                  email={form.email}
                  context="user"
                  onVerified={handleRegister}
                  onBack={() => setStep("form")}
                />
              )}
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-bold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
