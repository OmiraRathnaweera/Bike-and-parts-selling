import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import transition from "../transition";

import {
  faBoxOpen,
  faBell,
  faUser,
  faLock,
  faArrowsRotate,
  faFloppyDisk,
  faTriangleExclamation,
  faSpinner,
  faLocationDot,
  faIdBadge,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faShield,
  faKey,
  faPen,
  faXmark,
  faPhone,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import PurchaseHistory from "../components/PurchaseHistory";
import ServiceReminders from "../components/ServiceReminders";
import {
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserId,
} from "../service/api";

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
  if (/[a-zA-Z]/.test(v)) return "Phone must contain digits only";
  if (/\s/.test(v)) return "Phone must not contain spaces";
  if (!/^\+?\d+$/.test(v)) return "Phone must contain digits only";
  if (v.startsWith("0")) {
    if (v.length < 10) return "Too short — local number must be 10 digits";
    if (v.length > 10) return "Too long — local number must be 10 digits";
    return null;
  }
  if (v.startsWith("+94")) {
    if (v.length < 12) return "Too short — must be +94 followed by 9 digits";
    if (v.length > 12) return "Too long — must be +94 followed by 9 digits";
    return null;
  }
  return "Enter a number starting with 0 or +94";
}

function sanitizePhone(raw) {
  const hasPlus = raw.startsWith("+");
  const digitsOnly = raw.replace(/\D/g, "");
  return hasPlus ? "+" + digitsOnly : digitsOnly;
}

// Toast 
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold
      ${type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
    >
      <FontAwesomeIcon
        icon={type === "success" ? faCheckCircle : faTriangleExclamation}
      />
      {message}
    </div>
  );
}

// Confirm modal
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-red-500 text-xl"
          />
        </div>
        <p className="text-gray-800 font-bold text-center mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-700 font-bold rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-2.5 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Password strength
function getPasswordStrength(pw) {
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
      color: "bg-red-500",
      text: "text-red-600",
      width: "w-1/4",
    };
  if (s <= 2)
    return {
      label: "Fair",
      color: "bg-orange-400",
      text: "text-orange-600",
      width: "w-2/4",
    };
  if (s <= 3)
    return {
      label: "Good",
      color: "bg-yellow-400",
      text: "text-yellow-600",
      width: "w-3/4",
    };
  return {
    label: "Strong",
    color: "bg-emerald-500",
    text: "text-emerald-600",
    width: "w-full",
  };
}

// Password input field
function PwField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  showStrength,
}) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <FontAwesomeIcon
            icon={show ? faEyeSlash : faEye}
            className="text-sm"
          />
        </button>
      </div>
      {showStrength && value && strength && (
        <div className="mt-1">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
            />
          </div>
          <p className={`text-xs font-semibold mt-1 ${strength.text}`}>
            Password strength: {strength.label}
          </p>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

//  Read-only display field
function DisplayField({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl min-h-[44px]">
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="text-gray-300 text-sm shrink-0"
          />
        )}
        <span className="text-sm font-semibold text-gray-700 truncate">
          {value || (
            <span className="text-gray-300 font-normal italic">Not set</span>
          )}
        </span>
      </div>
    </div>
  );
}


function Profile() {
  const userId = getCurrentUserId();
  const userIdNum = userId ? Number(userId) : null;

  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editing, setEditing] = useState(false); // false = view, true = edit

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });
  const [savedForm, setSavedForm] = useState({ ...form }); // snapshot for cancel

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getUserById(userIdNum);
      if (data.success) {
        setUser(data.data);
        const loaded = {
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          city: data.data.city || "",
          address: data.data.address || "",
        };
        setForm(loaded);
        setSavedForm(loaded);
        setEditing(false);
      } else {
        showToast(data.message || "Failed to load profile", "error");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ ...savedForm });
    setFormErrors({});
    setEditing(false);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = await updateUser(userIdNum, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        city: form.city,
        address: form.address,
      });
      if (data.success) {
        setUser(data.data);
        const updated = {
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          city: data.data.city || "",
          address: data.data.address || "",
        };
        setForm(updated);
        setSavedForm(updated);
        setEditing(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(data.message || "Update failed", "error");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.currentPassword)
      e.currentPassword = "Current password is required";
    if (!pwForm.newPassword) e.newPassword = "New password is required";
    else if (pwForm.newPassword.length < 6)
      e.newPassword = "Minimum 6 characters";
    else if (pwForm.newPassword === pwForm.currentPassword)
      e.newPassword = "Must differ from current password";
    if (pwForm.newPassword !== pwForm.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePasswordChange = async () => {
    setPwSuccess(false);
    if (!validatePw()) return;
    setPwSaving(true);
    try {
      const data = await updateUser(userIdNum, {
        firstName: user.firstName,
        lastName: user.lastName,
        currentPassword: pwForm.currentPassword,
        password: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      });
      if (data.success) {
        setPwForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPwErrors({});
        setPwSuccess(true);
        showToast("Password changed successfully!", "success");
        setTimeout(() => setPwSuccess(false), 4000);
      } else {
        showToast(data.message || "Failed to update password", "error");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setPwSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    try {
      const data = await deleteUser(userIdNum);
      if (data.success) {
        sessionStorage.clear();
        showToast("Account deleted. Redirecting...", "success");
        setTimeout(() => (window.location.href = "/"), 2000);
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setDeleting(false);
    }
  };

  const showToast = (message, type) => setToast({ message, type });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (formErrors[name])
      setFormErrors((f) => {
        const n = { ...f };
        delete n[name];
        return n;
      });
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizePhone(e.target.value);
    setForm((f) => ({ ...f, phone: sanitized }));
    if (formErrors.phone)
      setFormErrors((f) => {
        const n = { ...f };
        delete n.phone;
        return n;
      });
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((f) => ({ ...f, [name]: value }));
    if (pwErrors[name])
      setPwErrors((f) => {
        const n = { ...f };
        delete n[name];
        return n;
      });
  };

  const TABS = [
    { id: "orders", label: "Purchase History", icon: faBoxOpen },
    { id: "reminders", label: "Service Reminders", icon: faBell },
    { id: "account", label: "Account Info", icon: faUser },
    { id: "security", label: "Security", icon: faLock },
  ];

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";
  const displayId = user?.id ? String(user.id) : "";

  return (
    <main className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md shrink-0">
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                initials
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-52 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-gray-900 font-extrabold text-xl tracking-tight truncate">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faIdBadge} className="text-xs" />
                      {user?.role || "USER"}
                    </span>
                    {user?.city && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="text-xs"
                        />{" "}
                        {user.city}
                      </span>
                    )}
                    {user?.phone && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faPhone} className="text-xs" />{" "}
                        {user.phone}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchUser}
              title="Refresh"
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors shrink-0"
            >
              <FontAwesomeIcon icon={faArrowsRotate} className="text-sm" />
            </button>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1.5 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap
                ${activeTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "orders" && <PurchaseHistory />}
        {activeTab === "reminders" && (
          <ServiceReminders
            userId={userIdNum}
            userPurchases={user?.purchases || []}
            onToast={(msg, type) => showToast(msg, type)}
          />
        )}

        {/* ACCOUNT INFO */}
        {activeTab === "account" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Header with Edit button */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                  Personal Information
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">ID: {displayId}</p>
              </div>
              {!loading && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-all"
                >
                  <FontAwesomeIcon icon={faPen} className="text-xs" /> Edit
                </button>
              )}
              {!loading && editing && (
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-all"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" /> Cancel
                </button>
              )}
            </div>

            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : !editing ? (
                // VIEW MODE - all fields read-only
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DisplayField
                      label="First Name"
                      value={form.firstName}
                      icon={faUser}
                    />
                    <DisplayField
                      label="Last Name"
                      value={form.lastName}
                      icon={faUser}
                    />
                  </div>
                  <DisplayField
                    label="Email Address"
                    value={form.email}
                    icon={null}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DisplayField
                      label="Phone"
                      value={form.phone}
                      icon={faPhone}
                    />
                    <DisplayField
                      label="City"
                      value={form.city}
                      icon={faLocationDot}
                    />
                  </div>
                  <DisplayField
                    label="Address"
                    value={form.address}
                    icon={faHome}
                  />
                  <p className="text-xs text-gray-400 pt-1">
                    Click <strong className="text-gray-500">Edit</strong> above
                    to update your information.
                  </p>
                </div>
              ) : (
                // EDIT MODE
                <div className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "First Name",
                        name: "firstName",
                        placeholder: "John",
                      },
                      {
                        label: "Last Name",
                        name: "lastName",
                        placeholder: "Doe",
                      },
                    ].map((f) => (
                      <div key={f.name} className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          {f.label}
                        </label>
                        <input
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                            ${formErrors[f.name] ? "border-red-400 bg-red-50" : "border-gray-200 text-gray-800"}`}
                        />
                        {formErrors[f.name] && (
                          <p className="text-xs text-red-500">
                            {formErrors[f.name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Email - read-only*/}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      value={form.email}
                      disabled
                      className="border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Phone
                      <span className="text-gray-400 font-normal normal-case tracking-normal ml-2 text-xs">
                        digits only
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        placeholder="0771234567 or +94771234567"
                        maxLength={12}
                        className={`w-full border rounded-xl px-4 py-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                          ${formErrors.phone ? "border-red-400 bg-red-50" : "border-gray-200 text-gray-800"}`}
                      />
                      {form.phone.length > 0 && (
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold pointer-events-none"
                          style={{
                            color:
                              form.phone.length === 10 ||
                              form.phone.length === 12
                                ? "#10b981"
                                : "#9ca3af",
                          }}
                        >
                          {form.phone.length}/
                          {form.phone.startsWith("+94") ? "12" : "10"}
                        </span>
                      )}
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-red-500">
                        ⚠ {formErrors.phone}
                      </p>
                    )}
                    {!formErrors.phone && !form.phone && (
                      <p className="text-xs text-gray-400">
                        Local: 10 digits starting with 0 · Intl: +94 + 9 digits
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      City
                    </label>
                    <div className="relative">
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">Select city</option>
                        {SRI_LANKA_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        ▾
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Address
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Your street address"
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Save / Cancel buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold tracking-widest text-sm rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="animate-spin"
                          />{" "}
                          SAVING...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faFloppyDisk} /> SAVE CHANGES
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="border border-gray-200 text-gray-600 font-bold text-sm rounded-xl px-6 py-3.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Account */}
              <div className="border-t border-red-100 pt-5 mt-6">
                <h3 className="font-extrabold text-red-600 text-sm mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} /> If you want to delete your account
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Once deleted, your account and all data will be permanently
                  removed.
                </p>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={deleting}
                  className="border border-red-300 text-red-600 hover:bg-red-600 hover:text-white font-bold text-sm rounded-xl px-6 py-2.5 transition-all"
                >
                  {deleting ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/*  SECURITY  */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faKey} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg">
                    Change Password
                  </h2>
                  <p className="text-xs text-gray-500">
                    Use a strong password with letters, numbers & symbols
                  </p>
                </div>
              </div>

              {pwSuccess && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-5">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Password changed successfully!
                </div>
              )}

              <div className="space-y-4 max-w-md mt-5">
                <PwField
                  label="Current Password"
                  name="currentPassword"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange}
                  placeholder="Enter your current password"
                  error={pwErrors.currentPassword}
                />
                <div className="border-t border-gray-100 pt-4" />
                <PwField
                  label="New Password"
                  name="newPassword"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  placeholder="Min. 6 characters"
                  error={pwErrors.newPassword}
                  showStrength
                />
                <PwField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={pwForm.confirmPassword}
                  onChange={handlePwChange}
                  placeholder="Repeat new password"
                  error={pwErrors.confirmPassword}
                />

                {pwForm.newPassword && pwForm.confirmPassword && (
                  <p
                    className={`text-xs font-semibold flex items-center gap-1.5 ${pwForm.newPassword === pwForm.confirmPassword ? "text-emerald-600" : "text-red-500"}`}
                  >
                    <FontAwesomeIcon
                      icon={
                        pwForm.newPassword === pwForm.confirmPassword
                          ? faCheckCircle
                          : faTriangleExclamation
                      }
                    />
                    {pwForm.newPassword === pwForm.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}

                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="text-xs font-bold text-gray-600 mb-2">
                    Password requirements:
                  </p>
                  {[
                    {
                      rule: "At least 6 characters",
                      ok: pwForm.newPassword.length >= 6,
                    },
                    {
                      rule: "Contains uppercase letter",
                      ok: /[A-Z]/.test(pwForm.newPassword),
                    },
                    {
                      rule: "Contains a number",
                      ok: /[0-9]/.test(pwForm.newPassword),
                    },
                    {
                      rule: "Contains special character",
                      ok: /[^A-Za-z0-9]/.test(pwForm.newPassword),
                    },
                  ].map(({ rule, ok }) => (
                    <div
                      key={rule}
                      className={`flex items-center gap-2 text-xs font-medium transition-colors
                      ${pwForm.newPassword ? (ok ? "text-emerald-600" : "text-gray-400") : "text-gray-400"}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold
                        ${pwForm.newPassword ? (ok ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400") : "bg-gray-100 text-gray-400"}`}
                      >
                        {ok && pwForm.newPassword ? "✓" : "○"}
                      </span>
                      {rule}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={
                    pwSaving ||
                    !pwForm.currentPassword ||
                    !pwForm.newPassword ||
                    !pwForm.confirmPassword
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold tracking-widest text-sm rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2"
                >
                  {pwSaving ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />{" "}
                      UPDATING...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faShield} /> UPDATE PASSWORD
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="font-extrabold text-gray-700 text-sm mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdBadge} className="text-gray-400" />{" "}
                Account Details
              </h3>
              <div className="space-y-0">
                {[
                  { label: "Account ID", value: displayId },
                  { label: "Role", value: user?.role || "USER" },
                  { label: "Email", value: user?.email || "—" },
                  { label: "City", value: user?.city || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm py-3 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-500 font-medium">
                      {item.label}
                    </span>
                    <span className="font-bold text-gray-800 font-mono text-xs bg-gray-50 px-2.5 py-1 rounded-lg">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default transition(Profile);
