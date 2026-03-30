import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import transition from "../transition"

import { can, MOCK_TRANSACTIONS } from "./rbac";

import {
  faClipboardList,
  faFileEdit,
  faTrash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const STATUS_STYLE = {
  Completed: { bg:"#dcfce7",  text:"#166534", border:"#bbf7d0" },
  Pending:   { bg:"#fef3c7",  text:"#92400e", border:"#fde68a" },
  Refunded:  { bg:"#fee2e2",  text:"#991b1b", border:"#fecaca" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999, whiteSpace:"nowrap" }}>
      {status}
    </span>
  );
}

function Toast({ message, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position:"fixed", top:20, right:20, zIndex:200, padding:"12px 20px", borderRadius:12, background: type === "success" ? "#10b981" : "#dc2626", color:"white", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8, boxShadow:"0 20px 50px rgba(0,0,0,0.15)" }}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

function EditModal({ txn, onSave, onClose }) {
  const [form, setForm] = useState({ ...txn });

  const field = (label, key, type = "text") => (
    <div key={key}>
      <label style={{ color:"#6b7280", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
        style={{ width:"100%", background:"#f9fafb", border:"1px solid #d1d5db", borderRadius:11, padding:"9px 13px", color:"#374151", fontSize:13, outline:"none", fontFamily:"inherit" }}/>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.3)" }}>
      <div style={{ width:"100%", maxWidth:440, background:"#ffffff", borderRadius:20, overflow:"hidden", border:"1px solid #e5e7eb", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #e5e7eb" }}>
          <div>
            <h3 style={{ color:"#111827", fontWeight:800, fontSize:16, margin:0 }}>Edit Transaction</h3>
            <p style={{ color:"#2563eb", fontSize:12, margin:"3px 0 0", fontWeight:600 }}>{txn.id}</p>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding:20, display:"flex", flexDirection:"column", gap:13 }}>
          {field("Customer Name", "customer")}
          {field("Product", "product")}
          {field("Amount (Rs.)", "amount", "number")}
          {field("Date", "date", "date")}
          <div>
            <label style={{ color:"#6b7280", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              style={{ width:"100%", background:"#f9fafb", border:"1px solid #d1d5db", borderRadius:11, padding:"9px 13px", color:"#374151", fontSize:13, outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {["Completed","Pending","Refunded"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color:"#6b7280", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:5 }}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ width:"100%", background:"#f9fafb", border:"1px solid #d1d5db", borderRadius:11, padding:"9px 13px", color:"#374151", fontSize:13, outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {["Sale","Refund","Adjustment"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"0 20px 20px", display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:12, border:"1px solid #d1d5db", background:"#ffffff", color:"#6b7280", fontWeight:700, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex:1, padding:"10px", borderRadius:12, border:"none", background:"#2563eb", color:"white", fontWeight:700, fontSize:13, cursor:"pointer" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ txn, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:70, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.4)" }}>
      <div style={{ width:"100%", maxWidth:360, background:"#ffffff", borderRadius:20, padding:28, textAlign:"center", border:"1px solid #fee2e2", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ width:52, height:52, borderRadius:14, background:"#fee2e2", border:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 style={{ color:"#111827", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>Delete Transaction?</h3>
        <p style={{ color:"#6b7280", fontSize:13, lineHeight:1.6, margin:"0 0 22px" }}>
          Remove <strong style={{ color:"#2563eb" }}>{txn.id}</strong> permanently?<br/>This cannot be undone.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px", borderRadius:12, border:"1px solid #d1d5db", background:"#ffffff", color:"#6b7280", fontWeight:700, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", borderRadius:12, border:"none", background:"#dc2626", color:"white", fontWeight:700, fontSize:13, cursor:"pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function AdminTransactional() {
  const [role,     setRole]    = useState("OWNER");
  const [txns,     setTxns]    = useState(MOCK_TRANSACTIONS);
  const [search,   setSearch]  = useState("");
  const [statusF,  setStatusF] = useState("ALL");
  const [editing,  setEditing] = useState(null);
  const [toDelete, setToDelete]= useState(null);
  const [toast,    setToast]   = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); };

  const saveEdit = (updated) => {
    setTxns(p => p.map(t => t.id === updated.id ? updated : t));
    setEditing(null);
    showToast("Transaction updated");
  };

  const doDelete = (txn) => {
    setTxns(p => p.filter(t => t.id !== txn.id));
    setToDelete(null);
    showToast(`${txn.id} deleted`);
  };

  const filtered = txns.filter(t => {
    const q = `${t.customer} ${t.product} ${t.id}`.toLowerCase();
    return (!search || q.includes(search.toLowerCase())) &&
           (statusF === "ALL" || t.status === statusF);
  });

  const stats = {
    revenue: txns.filter(t => t.status !== "Refunded").reduce((a, b) => a + b.amount, 0),
    refunds: txns.filter(t => t.status === "Refunded").reduce((a, b) => a + b.amount, 0),
    pending: txns.filter(t => t.status === "Pending").length,
    total:   txns.length,
  };

  if (!can(role, "VIEW_TRANSACTIONS")) return (
    <AdminLayout currentPage="transactions" role={role} onRoleChange={setRole}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, textAlign:"center", gap:12 }}>
        <div style={{ width:72, height:72, borderRadius:20, background:"#fee2e2", border:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="30" height="30" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h2 style={{ color:"#111827", fontWeight:800, fontSize:22, margin:0 }}>Access Denied</h2>
        <p style={{ color:"#6b7280", fontSize:14, margin:0, maxWidth:300 }}>Role <strong style={{ color:"#374151" }}>{role}</strong> cannot access Transactions.</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout currentPage="transactions" role={role} onRoleChange={setRole}>
      {toast    && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
      {editing  && <EditModal txn={editing} onSave={saveEdit} onClose={() => setEditing(null)}/>}
      {toDelete && <ConfirmDeleteModal txn={toDelete} onConfirm={() => doDelete(toDelete)} onCancel={() => setToDelete(null)}/>}

      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        <div style={{ marginBottom:20 }}>
          <h1 style={{ color:"#111827", fontWeight:800, fontSize:22, margin:"0 0 4px" }}>Transaction History</h1>
          <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>
            {can(role,"EDIT_TRANSACTIONS") ? "View, edit and manage all transactions" : "Read-only - your role cannot edit transactions"}
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total Revenue",  val:`Rs. ${(stats.revenue/1000).toFixed(0)}K`, color:"#10b981", rgb:"16,185,129"  },
            { label:"Refunds Issued", val:`Rs. ${stats.refunds.toLocaleString()}`,   color:"#ef4444", rgb:"239,68,68"   },
            { label:"Pending Orders", val:`${stats.pending}`,                        color:"#f59e0b", rgb:"245,158,11"  },
            { label:"Total Records",  val:`${stats.total}`,                          color:"#3b82f6", rgb:"59,130,246"  },
          ].map(c => (
            <div key={c.label} style={{ background:`rgba(${c.rgb},0.05)`, border:`1px solid rgba(${c.rgb},0.2)`, borderRadius:16, padding:"16px 18px" }}>
              <p style={{ color:c.color, fontWeight:800, fontSize:26, margin:"0 0 2px" }}>{c.val}</p>
              <p style={{ color:"#6b7280", fontSize:12, fontWeight:600, margin:0 }}>{c.label}</p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", pointerEvents:"none" }} width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, customer or product…"
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d1d5db", borderRadius:12, padding:"9px 14px 9px 36px", color:"#374151", fontSize:13, outline:"none", fontFamily:"inherit" }}/>
          </div>
          <select value={statusF} onChange={e => setStatusF(e.target.value)}
            style={{ background:"#ffffff", border:"1px solid #d1d5db", borderRadius:12, padding:"9px 14px", color:"#6b7280", fontSize:13, outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
            <option value="ALL">All Status</option>
            {["Completed","Pending","Refunded"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background:"#ffffff", border:"1px solid #e5e7eb", borderRadius:18, overflow:"hidden" }}>
          {/* Head */}
          <div style={{ display:"grid", gridTemplateColumns:"110px 100px 1.8fr 1.8fr 110px 110px 80px", padding:"10px 20px", borderBottom:"1px solid #e5e7eb", color:"#6b7280", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em" }}>
            <span>ID</span><span>Date</span><span>Customer</span><span>Product</span><span>Amount</span><span>Status</span><span style={{ textAlign:"right" }}>Actions</span>
          </div>

          {/* Body */}
          {filtered.length === 0
            ? <div style={{ padding:"60px 20px", textAlign:"center" }}>
                <p style={{ fontSize:36, margin:"0 0 8px", color:"#9ca3af" }}><FontAwesomeIcon icon={faClipboardList} /></p>
                <p style={{ color:"#6b7280", fontWeight:600, margin:0 }}>No transactions found</p>
              </div>
            : filtered.map(txn => (
              <div key={txn.id}
                style={{ display:"grid", gridTemplateColumns:"110px 100px 1.8fr 1.8fr 110px 110px 80px", padding:"12px 20px", alignItems:"center", borderBottom:"1px solid #f3f4f6", transition:"background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ color:"#2563eb", fontWeight:700, fontSize:12 }}>{txn.id}</span>
                <span style={{ color:"#6b7280", fontSize:12 }}>{txn.date}</span>
                <span style={{ color:"#374151", fontWeight:500, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8 }}>{txn.customer}</span>
                <span style={{ color:"#6b7280", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:8 }}>{txn.product}</span>
                <span style={{ color:"#374151", fontWeight:700, fontSize:13 }}>Rs. {txn.amount.toLocaleString()}</span>
                <span><StatusBadge status={txn.status}/></span>
                <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                  {can(role, "EDIT_TRANSACTIONS") && (
                    <button onClick={() => setEditing(txn)} title="Edit"
                      style={{ width:29, height:29, borderRadius:8, background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="#2563eb"; e.currentTarget.style.color="white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="#f3f4f6"; e.currentTarget.style.color="#6b7280"; }}>
                      <FontAwesomeIcon icon={faFileEdit}/>
                    </button>
                  )}
                  {can(role, "DELETE_TRANSACTIONS") && (
                    <button onClick={() => setToDelete(txn)} title="Delete"
                      style={{ width:29, height:29, borderRadius:8, background:"#f3f4f6", border:"none", cursor:"pointer", color:"#6b7280", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="#dc2626"; e.currentTarget.style.color="white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="#f3f4f6"; e.currentTarget.style.color="#6b7280"; }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
            ))
          }

          {/* Footer */}
          <div style={{ padding:"10px 20px", borderTop:"1px solid #e5e7eb", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p style={{ color:"#9ca3af", fontSize:12, margin:0 }}>{filtered.length} of {txns.length} transactions</p>
            {!can(role, "EDIT_TRANSACTIONS") && <p style={{ color:"#d1d5db", fontSize:12, margin:0 }}><FontAwesomeIcon icon={faLock} /> Edit requires OWNER or ACCOUNTANT</p>}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default transition(AdminTransactional);