import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope, faCheckCircle, faSpinner,
  faTriangleExclamation, faArrowLeft, faArrowsRotate,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";

const RESEND_COOLDOWN = 60;

export default function EmailVerifyStep({ email, context = "user", onVerified, onBack }) {
  const [digits,     setDigits]     = useState(["", "", "", "", "", ""]);
  const [status,     setStatus]     = useState("idle"); 
  const [errorMsg,   setErrorMsg]   = useState("");
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [cooldown,   setCooldown]   = useState(0);       
  const inputRefs = useRef([]);

  // Send / resend code 
  const sendCode = useCallback(async () => {
    if (sending || cooldown > 0) return;
    setSending(true);
    setErrorMsg("");
    try {
      const res  = await fetch(`${API_BASE}/verify/send`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, context }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setCooldown(RESEND_COOLDOWN);
        // Focus first input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setErrorMsg(data.message || "Failed to send code.");
      }
    } catch {
      setErrorMsg("Cannot connect to server.");
    } finally {
      setSending(false);
    }
  }, [sending, cooldown, email, context]); 

  // Auto-send on mount
  useEffect(() => {
    sendCode();
  }, [sendCode]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle digit input
  const handleDigit = (index, value) => {
    // Only allow single digit 0-9
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setErrorMsg("");

    // Auto-advance to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === 5) {
      const full = [...newDigits.slice(0, 5), digit].join("");
      if (full.length === 6) verifyCode(full);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      verifyCode(pasted);
    }
  };

  // Verify code 
  const verifyCode = async (code) => {
    setStatus("verifying");
    setErrorMsg("");
    try {
      const res  = await fetch(`${API_BASE}/verify/confirm`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        // Brief pause to show success animation, then proceed
        setTimeout(() => onVerified(), 900);
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Incorrect code. Please try again.");
        // Clear all digits and refocus first box on error
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Cannot connect to server.");
    }
  };

  const codeValue = digits.join("");
  const isComplete = codeValue.length === 6;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, alignItems:"center", padding:"8px 0" }}>

      {/* Heading */}
      <div style={{ textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:18, background:"#dbeafe", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          {status === "success"
            ? <FontAwesomeIcon icon={faCheckCircle} style={{ color:"#16a34a", fontSize:28 }} />
            : <FontAwesomeIcon icon={faShieldHalved} style={{ color:"#2563eb", fontSize:28 }} />
          }
        </div>
        <h3 style={{ color:"#111827", fontWeight:800, fontSize:18, margin:"0 0 6px" }}>
          {status === "success" ? "Email Verified!" : "Check Your Email"}
        </h3>
        <p style={{ color:"#6b7280", fontSize:13, margin:0, lineHeight:1.6 }}>
          {status === "success"
            ? "Your email has been verified. Continuing…"
            : <>We sent a 6-digit code to<br/><strong style={{ color:"#1d4ed8" }}>{email}</strong></>
          }
        </p>
      </div>

      {/* Success state */}
      {status === "success" && (
        <div style={{ width:"100%", padding:"16px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, textAlign:"center" }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ color:"#16a34a", fontSize:20 }} />
          <p style={{ color:"#166534", fontWeight:700, fontSize:14, margin:"8px 0 0" }}>Email verified successfully!</p>
        </div>
      )}

      {/* Code input boxes */}
      {status !== "success" && (
        <>
          {/* Sending indicator */}
          {sending && (
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#6b7280", fontSize:13 }}>
              <FontAwesomeIcon icon={faSpinner} spin />
              Sending code to your email…
            </div>
          )}

          {/* Digit boxes */}
          {sent && (
            <div style={{ display:"flex", gap:8 }} onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  disabled={status === "verifying"}
                  style={{
                    width:48, height:56, textAlign:"center", fontSize:24, fontWeight:900,
                    borderRadius:12, outline:"none", fontFamily:"monospace",
                    border: `2px solid ${
                      status === "error"   ? "#fca5a5" :
                      digit               ? "#3b82f6" :
                      "#d1d5db"
                    }`,
                    background: digit ? "#eff6ff" : "#ffffff",
                    color: "#111827",
                    transition:"all 0.15s",
                    caretColor:"transparent",
                  }}
                />
              ))}
            </div>
          )}

          {errorMsg && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#fee2e2", border:"1px solid #fecaca", borderRadius:10, width:"100%" }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ color:"#dc2626", fontSize:13, flexShrink:0 }} />
              <p style={{ color:"#991b1b", fontSize:13, fontWeight:600, margin:0 }}>{errorMsg}</p>
            </div>
          )}

          {/* Verify button */}
          {sent && (
            <button
              onClick={() => isComplete && verifyCode(codeValue)}
              disabled={!isComplete || status === "verifying"}
              style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", fontFamily:"inherit", fontSize:14, fontWeight:700, cursor: isComplete && status !== "verifying" ? "pointer" : "not-allowed",
                background: status === "verifying" ? "#9ca3af" : isComplete ? "#2563eb" : "#e5e7eb",
                color: isComplete ? "white" : "#9ca3af",
                transition:"all 0.15s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {status === "verifying"
                ? <><FontAwesomeIcon icon={faSpinner} spin /> Verifying…</>
                : <><FontAwesomeIcon icon={faCheckCircle} /> Verify Code</>
              }
            </button>
          )}

          {/* Back buttons */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", flexWrap:"wrap", gap:8 }}>
            <button onClick={onBack}
              style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:13, fontWeight:600, padding:0, fontFamily:"inherit" }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize:12 }} />
              Change email
            </button>

          {/* Resend buttons */}
            <button onClick={sendCode} disabled={cooldown > 0 || sending}
              style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor: cooldown > 0 ? "not-allowed" : "pointer", color: cooldown > 0 ? "#9ca3af" : "#2563eb", fontSize:13, fontWeight:600, padding:0, fontFamily:"inherit" }}>
              <FontAwesomeIcon icon={faArrowsRotate} spin={sending} style={{ fontSize:12 }} />
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>

          <p style={{ color:"#9ca3af", fontSize:11, textAlign:"center", margin:0 }}>
            Code expires in 10 minutes · Max 5 attempts
          </p>
        </>
      )}
    </div>
  );
}