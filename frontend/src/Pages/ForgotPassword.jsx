import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import transition from "../transition";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faSpinner,
  faTriangleExclamation,
  faArrowLeft,
  faArrowsRotate,
  faShieldHalved,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";
const RESEND_COOLDOWN = 60;

function getStrength(pw) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1)
    return {
      label: "Weak",
      bar: "w-1/4",
      color: "bg-red-500",
      text: "text-red-600",
    };
  if (s <= 2)
    return {
      label: "Fair",
      bar: "w-2/4",
      color: "bg-orange-400",
      text: "text-orange-600",
    };
  if (s <= 3)
    return {
      label: "Good",
      bar: "w-3/4",
      color: "bg-yellow-400",
      text: "text-yellow-600",
    };
  return {
    label: "Strong",
    bar: "w-full",
    color: "bg-emerald-500",
    text: "text-emerald-600",
  };
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const context = params.get("context") || "user";
  const isAdmin = context === "admin";
  const loginPath = isAdmin ? "/admin/login" : "/login";
  const accentColor = isAdmin ? "#d30000" : "#2563eb";

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [pwErrors, setPwErrors] = useState({});
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), context }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("code");
        setCooldown(RESEND_COOLDOWN);
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      } else setError(data.message || "Failed to send code.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), context }),
      });
      const data = await res.json();
      if (data.success) {
        setCooldown(RESEND_COOLDOWN);
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else setError(data.message || "Failed to resend.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }, [cooldown, loading, email, context]);

  const handleDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (digit && index === 5) {
      const full = [...next.slice(0, 5), digit].join("");
      if (full.length === 6) verifyCode(full);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      verifyCode(pasted);
    }
  };

  const verifyCode = async (code) => {
    if (!code || code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/verify/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("password");
      } else {
        setError(data.message || "Incorrect code. Please try again.");
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPw) errs.newPw = "New password is required";
    else if (newPw.length < 6) errs.newPw = "Minimum 6 characters";
    if (!confirmPw) errs.confirmPw = "Please confirm your password";
    else if (newPw !== confirmPw) errs.confirmPw = "Passwords do not match";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword: newPw,
          context,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
        setTimeout(() => navigate(loginPath), 2500);
      } else setError(data.message || "Failed to reset password.");
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(newPw);
  const inputCls = (hasErr) =>
    `w-full border ${hasErr ? "border-red-400 bg-red-50" : "border-gray-200"} rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`;

  if (step === "done")
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isAdmin ? "bg-gray-100" : "bg-gray-50"}`}
      >
        <div className="text-center p-10">
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-emerald-600 text-4xl"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Password Reset!
          </h2>
          <p className="text-gray-500 text-sm mb-1">
            Your password has been updated successfully.
          </p>
          <p className="text-gray-400 text-xs">Redirecting to login…</p>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-5 py-12 ${isAdmin ? "bg-gray-100" : "bg-gray-50"}`}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: accentColor }}
            >
              MJ
            </div>
            <span className="font-extrabold text-xl text-gray-900">
              M&J Enterprises
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "code" && `Enter the 6-digit code sent to ${email}`}
            {step === "password" && "Set your new password"}
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["email", "code", "password"].map((s, i) => {
            const current = ["email", "code", "password"].indexOf(step);
            const isDone = i < current;
            const isActive = i === current;
            return (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isDone ? "bg-emerald-500 text-white" : isActive ? "text-white" : "bg-gray-200 text-gray-400"}`}
                  style={isActive ? { background: accentColor } : {}}
                >
                  {isDone ? <FontAwesomeIcon icon={faCircleCheck} /> : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 max-w-12 transition-all ${isDone ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-5">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mt-0.5 shrink-0"
              />
              {error}
            </div>
          )}

          {/* Enter email */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder={isAdmin ? "admin@mj.com" : "you@example.com"}
                    className={`${inputCls(false)} pl-10`}
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-extrabold tracking-widest text-sm rounded-xl py-4 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: accentColor }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> SENDING…
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} /> SEND RESET CODE
                  </>
                )}
              </button>
            </form>
          )}

          {/* Verification code */}
          {step === "code" && (
            <div className="flex flex-col gap-5 items-center">
              <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="text-blue-600 text-2xl"
                />
              </div>
              <div className="flex gap-2" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={loading}
                    className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all font-mono caret-transparent
                      ${error ? "border-red-400 bg-red-50" : d ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
                    style={
                      d
                        ? {
                            borderColor: accentColor,
                            background: isAdmin ? "#fff5f5" : "#eff6ff",
                          }
                        : {}
                    }
                  />
                ))}
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FontAwesomeIcon icon={faSpinner} spin /> Verifying…
                </div>
              )}
              {!loading && digits.join("").length === 6 && (
                <button
                  onClick={() => verifyCode(digits.join(""))}
                  className="w-full text-white font-extrabold text-sm rounded-xl py-3.5 transition-all flex items-center justify-center gap-2"
                  style={{ background: accentColor }}
                >
                  <FontAwesomeIcon icon={faCircleCheck} /> Verify Code
                </button>
              )}
              <div className="flex justify-between w-full">
                <button
                  onClick={() => {
                    setStep("email");
                    setDigits(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs font-semibold transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />{" "}
                  Change email
                </button>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: cooldown > 0 ? "#9ca3af" : accentColor }}
                >
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    spin={loading}
                    className="text-xs"
                  />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
              <p className="text-gray-400 text-xs">
                Code expires in 10 minutes · Max 5 attempts
              </p>
            </div>
          )}

          {/* New password */}
          {step === "password" && (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-2">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-emerald-600 shrink-0"
                />
                <p className="text-emerald-700 text-sm font-semibold">
                  Email verified! Set your new password below.
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => {
                      setNewPw(e.target.value);
                      setPwErrors((p) => ({ ...p, newPw: "" }));
                    }}
                    placeholder="Min. 6 characters"
                    className={`${inputCls(!!pwErrors.newPw)} pl-10 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={showPw ? faEyeSlash : faEye}
                      className="text-sm"
                    />
                  </button>
                </div>
                {newPw && strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${strength.color} ${strength.bar}`}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold mt-1 ${strength.text}`}
                    >
                      Strength: {strength.label}
                    </p>
                  </div>
                )}
                {pwErrors.newPw && (
                  <p className="text-red-500 text-xs mt-1">{pwErrors.newPw}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
                  />
                  <input
                    type={showCpw ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => {
                      setConfirmPw(e.target.value);
                      setPwErrors((p) => ({ ...p, confirmPw: "" }));
                    }}
                    placeholder="Repeat new password"
                    className={`${inputCls(!!pwErrors.confirmPw)} pl-10 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCpw((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon
                      icon={showCpw ? faEyeSlash : faEye}
                      className="text-sm"
                    />
                  </button>
                </div>
                {newPw && confirmPw && (
                  <p
                    className={`text-xs font-semibold mt-1 flex items-center gap-1 ${newPw === confirmPw ? "text-emerald-600" : "text-red-500"}`}
                  >
                    <FontAwesomeIcon
                      icon={
                        newPw === confirmPw
                          ? faCircleCheck
                          : faTriangleExclamation
                      }
                    />
                    {newPw === confirmPw
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
                {pwErrors.confirmPw && (
                  <p className="text-red-500 text-xs mt-1">
                    {pwErrors.confirmPw}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-extrabold tracking-widest text-sm rounded-xl py-4 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
                style={{ background: accentColor }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> RESETTING…
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} /> RESET PASSWORD
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link
            to={loginPath}
            className="flex items-center justify-center gap-1.5 font-semibold hover:underline"
            style={{ color: accentColor }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Back to {isAdmin ? "Admin " : ""}Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default transition(ForgotPassword);
