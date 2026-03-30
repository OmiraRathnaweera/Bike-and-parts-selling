import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import transition from "../transition"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { resetTimer } from "../utils/auth";

const API_BASE = "http://localhost:8080/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        const payload = data.data || {};
        const admin = payload.admin ?? payload; 
        const token = payload.token;

        const adminRoles = ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"];
        if (!adminRoles.includes(admin.role)) {
          setError("This account does not have admin access.");
          setLoading(false);
          return;
        }

        sessionStorage.setItem("userId",     String(admin.id));
        sessionStorage.setItem("adminRole",  admin.role);
        sessionStorage.setItem("adminName",  `${admin.firstName} ${admin.lastName}`);
        sessionStorage.setItem("adminEmail", admin.email);
        sessionStorage.setItem("userName",   `${admin.firstName} ${admin.lastName}`);
        sessionStorage.setItem("userRole",   admin.role);
        sessionStorage.setItem("userEmail",  admin.email);
        if (token) sessionStorage.setItem("token", token);

        resetTimer();

        navigate("/admin/users");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f3f4f6", display:"flex", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .login-animate { animation: fade-up 0.4s ease forwards; }
        input::placeholder { color:#9ca3af; }
        input:focus { outline:none; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Left branding panel */}
      <div style={{ flex:1, background:"#ffffff", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 64px", borderRight:"1px solid #e5e7eb", minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:52 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:"#d30000", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"white", fontWeight:900, fontSize:15 }}>MJ</span>
          </div>
          <div>
            <p style={{ color:"#111827", fontWeight:800, fontSize:16, lineHeight:1 }}>M&J Enterprises</p>
            <p style={{ color:"#9ca3af", fontSize:11, marginTop:3 }}>Admin Console</p>
          </div>
        </div>

        <h1 style={{ fontSize:36, fontWeight:800, color:"#111827", lineHeight:1.2, marginBottom:14 }}>
          Manage your<br />
          <span style={{ color:"#d30000" }}>business,</span><br />
          your way.
        </h1>

        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:44 }}>
          {[
            { label:"User Management", color:"#ede9fe", text:"#6d28d9" },
            { label:"Sales Reports",   color:"#dbeafe", text:"#1d4ed8" },
            { label:"Transactions",    color:"#dcfce7", text:"#166534" },
            { label:"PDF Export",      color:"#fee2e2", text:"#991b1b" },
          ].map((p) => (
            <span key={p.label} style={{ background:p.color, color:p.text, fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:999 }}>
              {p.label}
            </span>
          ))}
        </div>

        <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:"16px 18px" }}>
          <p style={{ color:"#374151", fontWeight:700, fontSize:13, margin:"0 0 6px" }}>Admin Access</p>
          <p style={{ color:"#6b7280", fontSize:12, margin:0, lineHeight:1.6 }}>
            Use your registered admin credentials to sign in.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width:"100%", maxWidth:480, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 48px" }}>
        <div className="login-animate" style={{ width:"100%" }}>
          <h2 style={{ color:"#111827", fontWeight:800, fontSize:26, margin:"0 0 6px" }}>Welcome back</h2>
          <p style={{ color:"#6b7280", fontSize:14, margin:"0 0 30px" }}>Sign in to your admin account</p>

          {/* Error banner */}
          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:10, background:"#fee2e2", border:"1px solid #fecaca", marginBottom:20 }}>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ color:"#dc2626", fontSize:14 }} />
              <p style={{ color:"#991b1b", fontSize:13, fontWeight:600, margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Email */}
            <div>
              <label style={{ color:"#374151", fontSize:12, fontWeight:700, display:"block", marginBottom:7 }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13, pointerEvents:"none" }} />
                <input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@mj.com"
                  style={{ width:"100%", background:"#ffffff", border:"1px solid #d1d5db", borderRadius:10, padding:"11px 13px 11px 38px", color:"#111827", fontSize:14, fontFamily:"inherit", transition:"border-color 0.15s" }}
                  onFocus={(e) => e.target.style.borderColor = "#d30000"}
                  onBlur={(e)  => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                <label style={{ color:"#374151", fontSize:12, fontWeight:700 }}>Password</label>
                <Link to="/admin/forgot-password?context=admin"
                  style={{ color:"#d30000", fontSize:12, fontWeight:600, textDecoration:"none" }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position:"relative" }}>
                <FontAwesomeIcon icon={faLock} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:13, pointerEvents:"none" }} />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  style={{ width:"100%", background:"#ffffff", border:"1px solid #d1d5db", borderRadius:10, padding:"11px 40px 11px 38px", color:"#111827", fontSize:14, fontFamily:"inherit", transition:"border-color 0.15s" }}
                  onFocus={(e) => e.target.style.borderColor = "#d30000"}
                  onBlur={(e)  => e.target.style.borderColor = "#d1d5db"}
                />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:0, display:"flex", alignItems:"center" }}>
                  <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} style={{ fontSize:14 }} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background: loading ? "#fca5a5" : "#d30000", color:"white", fontWeight:700, fontSize:14, cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9, marginTop:4, transition:"background 0.2s", fontFamily:"inherit" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#b91c1c"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#d30000"; }}>
              {loading ? (
                <>
                  <svg style={{ animation:"spin 0.8s linear infinite", width:16, height:16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 010 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <><FontAwesomeIcon icon={faRightToBracket} /> Sign In to Admin Console</>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ marginTop:28, paddingTop:22, borderTop:"1px solid #e5e7eb", textAlign:"center" }}>
            <p style={{ color:"#6b7280", fontSize:13 }}>
              Need an account?{" "}
              <Link to="/admin/register" style={{ color:"#d30000", fontWeight:700, textDecoration:"none" }}>Register here</Link>
            </p>
            <p style={{ color:"#9ca3af", fontSize:12, marginTop:8 }}>
              Not an admin?{" "}
              <Link to="/login" style={{ color:"#6b7280", textDecoration:"none" }}>Customer login ↗</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}