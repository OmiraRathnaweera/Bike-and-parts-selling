import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { can } from "./rbac";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faPlus,
  faTrash,
  faPen,
  faXmark,
  faCheckCircle,
  faTriangleExclamation,
  faEye,
  faEyeSlash,
  faBolt,
  faGaugeHigh,
  faCog,
  faImage,
  faTag,
  faArrowUp,
  faArrowDown,
  faSpinner,
  faGripVertical,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";
const CATEGORIES = ["SCOOTER", "PREMIUM", "MOTORCYCLE"];
const CAT_COLORS = {
  SCOOTER: "#2563eb",
  PREMIUM: "#7c3aed",
  MOTORCYCLE: "#dc2626",
};

const MAX_COLORS = 4;
// Validation limits
const MAX_NAME_LEN = 60;
const MAX_TAGLINE_LEN = 50;
const MAX_SLUG_LEN = 80;
const MAX_SPEC_LEN = 100;
const MAX_PRICE = 99_999_999;
const SLUG_PATTERN = /^[a-z0-9-]+$/;

const EMPTY_FORM = {
  name: "",
  tagline: "",
  category: "SCOOTER",
  price: "",
  color: "#e63946",
  image: null,
  slug: "",
  stock: true,
  specPower: "",
  specTorque: "",
  specEngine: "",
  groups: [],
  colors: [{ hex: "#e63946", image: null }],
};

const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Toast
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
        zIndex: 9999,
        padding: "12px 18px",
        borderRadius: 12,
        background: type === "success" ? "#10b981" : "#dc2626",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      <FontAwesomeIcon
        icon={type === "success" ? faCheckCircle : faTriangleExclamation}
      />
      {message}
    </div>
  );
}

// Confirm Delete
function ConfirmModal({ bike, onConfirm, onCancel }) {
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
          background: "#fff",
          borderRadius: 18,
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
          <FontAwesomeIcon
            icon={faTrash}
            style={{ color: "#dc2626", fontSize: 20 }}
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
          Delete Bike?
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            lineHeight: 1.6,
            margin: "0 0 22px",
          }}
        >
          Permanently remove{" "}
          <strong style={{ color: "#111827" }}>{bike?.name}</strong>?<br />
          This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
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
              background: "#dc2626",
              color: "#fff",
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

// Spec Groups Editor
function SpecGroupsEditor({ groups, onChange }) {
  const addGroup = () =>
    onChange([...groups, { title: "", displayOrder: groups.length, rows: [] }]);
  const removeGroup = (gi) => onChange(groups.filter((_, i) => i !== gi));
  const updateTitle = (gi, title) =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, title } : g)));
  const addRow = (gi) =>
    onChange(
      groups.map((g, i) =>
        i === gi
          ? {
              ...g,
              rows: [
                ...g.rows,
                { label: "", value: "", displayOrder: g.rows.length },
              ],
            }
          : g,
      ),
    );
  const removeRow = (gi, ri) =>
    onChange(
      groups.map((g, i) =>
        i === gi ? { ...g, rows: g.rows.filter((_, j) => j !== ri) } : g,
      ),
    );
  const updateRow = (gi, ri, field, val) =>
    onChange(
      groups.map((g, i) =>
        i === gi
          ? {
              ...g,
              rows: g.rows.map((r, j) =>
                j === ri ? { ...r, [field]: val } : r,
              ),
            }
          : g,
      ),
    );

  const baseInp = {
    padding: "7px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 7,
    fontSize: 12,
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    color: "#374151",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((group, gi) => (
        <div
          key={gi}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <FontAwesomeIcon
              icon={faGripVertical}
              style={{ color: "#d1d5db", fontSize: 12 }}
            />
            <input
              value={group.title}
              onChange={(e) => updateTitle(gi, e.target.value.toUpperCase())}
              placeholder="GROUP NAME  (e.g. ENGINE)"
              style={{
                ...baseInp,
                flex: 1,
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontSize: 11,
              }}
            />
            <button
              type="button"
              onClick={() => removeGroup(gi)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 11 }} />
            </button>
          </div>
          <div
            style={{
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {group.rows.map((row, ri) => (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.6fr 26px",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <input
                  value={row.label}
                  onChange={(e) => updateRow(gi, ri, "label", e.target.value)}
                  placeholder="Label (e.g. Engine Type)"
                  style={baseInp}
                />
                <input
                  value={row.value}
                  onChange={(e) => updateRow(gi, ri, "value", e.target.value)}
                  placeholder="Value (e.g. 4 Stroke, Air-Cooled)"
                  style={baseInp}
                />
                <button
                  type="button"
                  onClick={() => removeRow(gi, ri)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    border: "none",
                    background: "#fee2e2",
                    color: "#dc2626",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} style={{ fontSize: 11 }} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addRow(gi)}
              style={{
                alignSelf: "flex-start",
                padding: "5px 12px",
                borderRadius: 7,
                border: "1px dashed #d1d5db",
                background: "transparent",
                color: "#6b7280",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 2,
              }}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} /> Add Row
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addGroup}
        style={{
          padding: "9px",
          borderRadius: 10,
          border: "2px dashed #d1d5db",
          background: "transparent",
          color: "#6b7280",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#d30000";
          e.currentTarget.style.color = "#d30000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#6b7280";
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Spec Group
      </button>
    </div>
  );
}

// Multi-Color Editor
// Color Editor - full add / edit hex / edit image / delete / reorder
function ColorEditor({ colors, onChange }) {
  const fileRefs = useRef([]);
  // hexInput tracks the live text the user is typing in the hex field before it's committed
  const [hexInputs, setHexInputs] = useState(() => colors.map((c) => c.hex));

  // Keep hexInputs in sync when colors array changes externally (e.g. on form open)
  useEffect(() => {
    setHexInputs(colors.map((c) => c.hex));
  }, [colors.length]);

  // Helpers

  const addColor = () => {
    if (colors.length >= MAX_COLORS) return;
    onChange([...colors, { hex: "#aaaaaa", image: null }]);
    setHexInputs((h) => [...h, "#aaaaaa"]);
  };

  // Delete — disabled when only 1 colour remains
  const removeColor = (ci) => {
    if (colors.length <= 1) return;
    onChange(colors.filter((_, i) => i !== ci));
    setHexInputs((h) => h.filter((_, i) => i !== ci));
  };

  // Move a colour up or down in the list (index 0 = primary)
  const moveColor = (ci, dir) => {
    const to = ci + dir;
    if (to < 0 || to >= colors.length) return;
    const next = [...colors];
    [next[ci], next[to]] = [next[to], next[ci]];
    onChange(next);
    setHexInputs((h) => {
      const nh = [...h];
      [nh[ci], nh[to]] = [nh[to], nh[ci]];
      return nh;
    });
  };

  // Promote any colour directly to primary (move to index 0)
  const makePrimary = (ci) => {
    if (ci === 0) return;
    const next = [colors[ci], ...colors.filter((_, i) => i !== ci)];
    onChange(next);
    setHexInputs((h) => [h[ci], ...h.filter((_, i) => i !== ci)]);
  };

  // Native colour-picker change
  const updateHexPicker = (ci, hex) => {
    onChange(colors.map((c, i) => (i === ci ? { ...c, hex } : c)));
    setHexInputs((h) => h.map((v, i) => (i === ci ? hex : v)));
  };

  // Free-text hex input: update live text while typing
  const handleHexTextChange = (ci, raw) => {
    const cleaned = raw.replace(/[^#0-9a-fA-F]/g, "").slice(0, 7);
    setHexInputs((h) => h.map((v, i) => (i === ci ? cleaned : v)));
    if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
      onChange(
        colors.map((c, i) =>
          i === ci ? { ...c, hex: cleaned.toLowerCase() } : c,
        ),
      );
    }
  };

  // On blur
  const handleHexBlur = (ci) => {
    setHexInputs((h) => h.map((v, i) => (i === ci ? colors[ci].hex : v)));
  };

  // Image file upload
  const handleImage = (ci, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      onChange(
        colors.map((c, i) =>
          i === ci ? { ...c, image: ev.target.result } : c,
        ),
      );
    reader.readAsDataURL(file);
  };

  const clearImage = (ci) =>
    onChange(colors.map((c, i) => (i === ci ? { ...c, image: null } : c)));

  // Render
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {colors.map((entry, ci) => {
        const isPrimary = ci === 0;
        return (
          <div
            key={ci}
            style={{
              border: `1.5px solid ${isPrimary ? "#fca5a5" : "#e5e7eb"}`,
              borderRadius: 12,
              background: isPrimary ? "#fff7f7" : "#f9fafb",
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderBottom: `1px solid ${isPrimary ? "#fecaca" : "#e5e7eb"}`,
              }}
            >
              {/* Colour swatch */}
              <div
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: entry.hex,
                    border: `2px solid ${isPrimary ? "#d30000" : "#d1d5db"}`,
                    cursor: "pointer",
                  }}
                  title="Click swatch to open colour picker"
                />
                <input
                  type="color"
                  value={entry.hex}
                  onChange={(e) => updateHexPicker(ci, e.target.value)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                />
              </div>

              {/* Editable hex text input */}
              <input
                value={hexInputs[ci] ?? entry.hex}
                onChange={(e) => handleHexTextChange(ci, e.target.value)}
                onBlur={() => handleHexBlur(ci)}
                spellCheck={false}
                placeholder="#rrggbb"
                style={{
                  width: 82,
                  padding: "5px 8px",
                  border: "1px solid #d1d5db",
                  borderRadius: 7,
                  fontSize: 12,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "#374151",
                  outline: "none",
                  background: "#fff",
                  flexShrink: 0,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#d30000")}
              />

              {/* Primary badge */}
              {isPrimary ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#d30000",
                    background: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: 999,
                    padding: "2px 8px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  Primary
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makePrimary(ci)}
                  title="Set as primary colour"
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#6b7280",
                    background: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: 999,
                    padding: "2px 8px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                    e.currentTarget.style.color = "#d30000";
                    e.currentTarget.style.borderColor = "#fecaca";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#6b7280";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  Set Primary
                </button>
              )}

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Move Up */}
              <button
                type="button"
                onClick={() => moveColor(ci, -1)}
                disabled={ci === 0}
                title="Move up"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: ci === 0 ? "#f9fafb" : "#fff",
                  color: ci === 0 ? "#d1d5db" : "#6b7280",
                  cursor: ci === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (ci !== 0) {
                    e.currentTarget.style.background = "#f0f9ff";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.color = "#3b82f6";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    ci === 0 ? "#f9fafb" : "#fff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color =
                    ci === 0 ? "#d1d5db" : "#6b7280";
                }}
              >
                <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: 10 }} />
              </button>

              {/* Move Down */}
              <button
                type="button"
                onClick={() => moveColor(ci, 1)}
                disabled={ci === colors.length - 1}
                title="Move down"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: ci === colors.length - 1 ? "#f9fafb" : "#fff",
                  color: ci === colors.length - 1 ? "#d1d5db" : "#6b7280",
                  cursor: ci === colors.length - 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (ci !== colors.length - 1) {
                    e.currentTarget.style.background = "#f0f9ff";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.color = "#3b82f6";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    ci === colors.length - 1 ? "#f9fafb" : "#fff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color =
                    ci === colors.length - 1 ? "#d1d5db" : "#6b7280";
                }}
              >
                <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: 10 }} />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeColor(ci)}
                disabled={colors.length <= 1}
                title={
                  colors.length <= 1
                    ? "Cannot remove the only colour"
                    : "Remove this colour variant"
                }
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: "none",
                  background: colors.length <= 1 ? "#f3f4f6" : "#fee2e2",
                  color: colors.length <= 1 ? "#d1d5db" : "#dc2626",
                  cursor: colors.length <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (colors.length > 1) {
                    e.currentTarget.style.background = "#dc2626";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    colors.length <= 1 ? "#f3f4f6" : "#fee2e2";
                  e.currentTarget.style.color =
                    colors.length <= 1 ? "#d1d5db" : "#dc2626";
                }}
              >
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: 10 }} />
              </button>
            </div>

            {/* Image upload row */}
            <div
              onClick={() => fileRefs.current[ci]?.click()}
              style={{
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = isPrimary
                  ? "#fee2e2"
                  : "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {entry.image ? (
                <>
                  <img
                    src={entry.image}
                    alt=""
                    style={{
                      height: 32,
                      maxWidth: 72,
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "#374151",
                        fontSize: 11,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      Image uploaded
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: 10, margin: 0 }}>
                      Click to replace
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage(ci);
                    }}
                    title="Remove image"
                    style={{
                      flexShrink: 0,
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid #fecaca",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#dc2626";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.color = "#dc2626";
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: 10 }} />{" "}
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 7,
                      background: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      style={{ color: "#9ca3af", fontSize: 13 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: 11,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      No image — click to upload
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: 10, margin: 0 }}>
                      PNG, JPG, WebP accepted
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      padding: "4px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      background: "#fff",
                    }}
                  >
                    Upload
                  </span>
                </>
              )}
              <input
                ref={(el) => (fileRefs.current[ci] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(ci, e)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        );
      })}

      {/* Add colour button */}
      {colors.length < MAX_COLORS ? (
        <button
          type="button"
          onClick={addColor}
          style={{
            padding: "9px",
            borderRadius: 10,
            border: "2px dashed #d1d5db",
            background: "transparent",
            color: "#6b7280",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#d30000";
            e.currentTarget.style.color = "#d30000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          <FontAwesomeIcon icon={faPalette} /> Add Colour Variant (
          {colors.length}/{MAX_COLORS})
        </button>
      ) : (
        <p
          style={{
            color: "#9ca3af",
            fontSize: 11,
            textAlign: "center",
            margin: 0,
          }}
        >
          Maximum {MAX_COLORS} colour variants reached.
        </p>
      )}
    </div>
  );
}

// Field Error Message
function FieldError({ msg }) {
  if (!msg) return null;
  return (
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
      <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: 10 }} />
      {msg}
    </p>
  );
}

// Character Counter
function CharCount({ current, max }) {
  const near = current >= max * 0.85;
  const over = current > max;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: over ? "#dc2626" : near ? "#f59e0b" : "#9ca3af",
        marginLeft: "auto",
      }}
    >
      {current}/{max}
    </span>
  );
}

// Bike Form Modal
function BikeForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    // clear error as soon as the user types a fix
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const touch = (k) => setTouched((t) => ({ ...t, [k]: true }));

  const handleNameChange = (val) => {
    // prevent pasting excessively long strings
    if (val.length > MAX_NAME_LEN) return;
    set("name", val);
    if (!initial.id) set("slug", toSlug(val));
  };

  // Validate all fields and return error map
  const runValidation = (f) => {
    const e = {};

    // Name
    if (!f.name.trim()) {
      e.name = "Bike name is required.";
    } else if (f.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    } else if (f.name.length > MAX_NAME_LEN) {
      e.name = `Name cannot exceed ${MAX_NAME_LEN} characters.`;
    }

    // Tagline
    if (!f.tagline.trim()) {
      e.tagline = "Tagline is required.";
    } else if (f.tagline.length > MAX_TAGLINE_LEN) {
      e.tagline = `Tagline cannot exceed ${MAX_TAGLINE_LEN} characters.`;
    }

    // Slug
    if (!f.slug.trim()) {
      e.slug = "URL slug is required.";
    } else if (!SLUG_PATTERN.test(f.slug)) {
      e.slug = "Only lowercase letters, numbers and hyphens (-) are allowed.";
    } else if (f.slug.startsWith("-") || f.slug.endsWith("-")) {
      e.slug = "Slug cannot start or end with a hyphen.";
    } else if (f.slug.length > MAX_SLUG_LEN) {
      e.slug = `Slug cannot exceed ${MAX_SLUG_LEN} characters.`;
    }

    // Price Validations
    const rawPrice = String(f.price).trim();
    if (!rawPrice) {
      e.price = "Price is required.";
    } else if (!/^\d+$/.test(rawPrice)) {
      e.price = "Price must be a whole number with no decimals or letters.";
    } else {
      const numPrice = Number(rawPrice);
      if (numPrice <= 0) {
        e.price = "Price must be greater than 0.";
      } else if (numPrice > MAX_PRICE) {
        e.price = `Price cannot exceed LKR ${MAX_PRICE.toLocaleString()}.`;
      }
    }

    // Quick Specs
    if (!f.specPower.trim()) {
      e.power = "Power spec is required.";
    } else if (f.specPower.length > MAX_SPEC_LEN) {
      e.power = `Cannot exceed ${MAX_SPEC_LEN} characters.`;
    }

    if (!f.specTorque.trim()) {
      e.torque = "Torque spec is required.";
    } else if (f.specTorque.length > MAX_SPEC_LEN) {
      e.torque = `Cannot exceed ${MAX_SPEC_LEN} characters.`;
    }

    if (!f.specEngine.trim()) {
      e.engine = "Engine spec is required.";
    } else if (f.specEngine.length > MAX_SPEC_LEN) {
      e.engine = `Cannot exceed ${MAX_SPEC_LEN} characters.`;
    }

    return e;
  };

  // Live-validate a single field on blur so errors appear only after the user leaves
  const handleBlurValidate = (key) => {
    touch(key);
    const e = runValidation(form);
    // Only surface the error for the field that was just blurred
    setErrors((prev) => ({ ...prev, [key]: e[key] || "" }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // Mark all fields as touched so errors show everywhere at once
    setTouched({
      name: true,
      tagline: true,
      slug: true,
      price: true,
      power: true,
      torque: true,
      engine: true,
    });
    const e = runValidation(form);
    setErrors(e);
    if (Object.keys(e).some((k) => e[k])) return;
    const primary = (form.colors && form.colors[0]) || {
      hex: "#e63946",
      image: null,
    };
    onSave({
      ...form,
      price: Number(String(form.price).trim()),
      color: primary.hex,
      image: primary.image,
    });
  };

  // Price input handler: strip anything that isn't a digit
  const handlePriceChange = (raw) => {
    // Allow only digit characters - silently drop letters, decimals, signs
    const cleaned = raw.replace(/[^0-9]/g, "");
    set("price", cleaned);
  };

  // Slug input handler: enforce slug rules in real time
  const handleSlugChange = (val) => {
    // Allow only valid slug characters while typing (lowercase, digits, hyphens)
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleaned.length <= MAX_SLUG_LEN) set("slug", cleaned);
  };

  const safeColors =
    form.colors && form.colors.length > 0
      ? form.colors
      : [{ hex: form.color || "#e63946", image: form.image || null }];

  // Helper to build input style with error state
  const inp = (key) => ({
    width: "100%",
    padding: "9px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    color: "#374151",
    border: `1px solid ${errors[key] ? "#fca5a5" : "#d1d5db"}`,
    borderRadius: 9,
    background: errors[key] ? "#fff7f7" : "#fff",
    transition: "border-color 0.15s",
  });

  const lbl = {
    color: "#374151",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "20px 16px",
        background: "rgba(0,0,0,0.35)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          marginTop: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #1f2937",
            background: "#111827",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "rgba(211,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faMotorcycle}
                style={{ color: "#ef4444", fontSize: 15 }}
              />
            </div>
            <div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                {initial.id ? "Edit Bike" : "Add New Bike"}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                {initial.id
                  ? "Update info and full specifications"
                  : "Fill in info and full specifications"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: 14 }} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxHeight: "78vh",
            overflowY: "auto",
          }}
        >
          {/* ── Basic Info ── */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                ...lbl,
                color: "#9ca3af",
                marginBottom: 14,
                fontSize: 11,
              }}
            >
              Basic Information
            </p>

            {/* Name + Tagline */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ ...lbl, justifyContent: "space-between" }}>
                  <span>Bike Name</span>
                  <CharCount current={form.name.length} max={MAX_NAME_LEN} />
                </div>
                <input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlurValidate("name")}
                  placeholder="e.g. Xoom 110"
                  maxLength={MAX_NAME_LEN}
                  style={inp("name")}
                />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <div style={{ ...lbl, justifyContent: "space-between" }}>
                  <span>
                    <FontAwesomeIcon icon={faTag} style={{ marginRight: 4 }} />
                    Tagline
                  </span>
                  <CharCount
                    current={form.tagline.length}
                    max={MAX_TAGLINE_LEN}
                  />
                </div>
                <input
                  value={form.tagline}
                  onChange={(e) => {
                    if (e.target.value.length > MAX_TAGLINE_LEN) return;
                    set("tagline", e.target.value.toUpperCase());
                  }}
                  onBlur={() => handleBlurValidate("tagline")}
                  placeholder="e.g. TRULY SMART"
                  maxLength={MAX_TAGLINE_LEN}
                  style={inp("tagline")}
                />
                <FieldError msg={errors.tagline} />
              </div>
            </div>

            {/* Slug + Category */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ ...lbl, justifyContent: "space-between" }}>
                  <span>URL Slug</span>
                  <CharCount current={form.slug.length} max={MAX_SLUG_LEN} />
                </div>
                <input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onBlur={() => handleBlurValidate("slug")}
                  placeholder="e.g. xoom-110"
                  maxLength={MAX_SLUG_LEN}
                  style={inp("slug")}
                />
                <FieldError msg={errors.slug} />
                {!errors.slug && (
                  <p style={{ color: "#9ca3af", fontSize: 10, marginTop: 3 }}>
                    Auto-generated. Only lowercase letters, numbers and hyphens.
                  </p>
                )}
              </div>
              <div>
                <label style={{ ...lbl, marginBottom: 5 }}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  style={{ ...inp(""), appearance: "none", cursor: "pointer" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price + Stock */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={{ ...lbl, marginBottom: 5 }}>Price (LKR)</label>
                <div style={{ position: "relative" }}>
                  {/* LKR prefix inside the input */}
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: 12,
                      fontWeight: 700,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    LKR
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    onBlur={() => handleBlurValidate("price")}
                    onKeyDown={(e) => {
                      const allowed = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                        "Home",
                        "End",
                      ];
                      if (!allowed.includes(e.key) && !/^\d$/.test(e.key))
                        e.preventDefault();
                    }}
                    placeholder="e.g. 349900"
                    style={{ ...inp("price"), paddingLeft: 44 }}
                  />
                </div>
                <FieldError msg={errors.price} />
                {!errors.price && form.price && (
                  <p style={{ color: "#6b7280", fontSize: 10, marginTop: 3 }}>
                    ≈ LKR {Number(form.price || 0).toLocaleString()}
                  </p>
                )}
              </div>
              <div>
                <label style={{ ...lbl, marginBottom: 5 }}>Availability</label>
                <button
                  type="button"
                  onClick={() => set("stock", !form.stock)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 12px",
                    border: `1px solid ${form.stock ? "#bbf7d0" : "#fecaca"}`,
                    borderRadius: 9,
                    background: form.stock ? "#f0fdf4" : "#fff5f5",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 12,
                    color: form.stock ? "#166534" : "#991b1b",
                    transition: "all 0.2s",
                  }}
                >
                  <FontAwesomeIcon
                    icon={form.stock ? faEye : faEyeSlash}
                    style={{ fontSize: 12 }}
                  />
                  {form.stock ? "In Stock" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>

          {/* Colour Variants */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                ...lbl,
                color: "#9ca3af",
                marginBottom: 6,
                fontSize: 11,
              }}
            >
              <FontAwesomeIcon icon={faPalette} style={{ marginRight: 5 }} />
              Colour Variants &amp; Images (up to {MAX_COLORS})
            </p>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 12px" }}>
              First colour is the primary. Each variant can have its own image —
              the customer sees the matching image when they click a colour
              swatch.
            </p>
            <ColorEditor
              colors={safeColors}
              onChange={(colors) => set("colors", colors)}
            />
          </div>

          {/* Quick Specs */}
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                ...lbl,
                color: "#9ca3af",
                marginBottom: 14,
                fontSize: 11,
              }}
            >
              <FontAwesomeIcon icon={faCog} style={{ marginRight: 5 }} />
              Quick Specs (shown on inventory card)
            </p>
            {[
              {
                key: "specPower",
                eKey: "power",
                label: "Power",
                icon: faBolt,
                ph: "e.g. 6.0kW (8.05 bhp) @ 7250rpm",
              },
              {
                key: "specTorque",
                eKey: "torque",
                label: "Torque",
                icon: faGaugeHigh,
                ph: "e.g. 8.70 Nm @ 5750rpm",
              },
              {
                key: "specEngine",
                eKey: "engine",
                label: "Engine",
                icon: faCog,
                ph: "e.g. 110cc, Air-cooled, 4-stroke",
              },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    ...lbl,
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span>
                    <FontAwesomeIcon
                      icon={f.icon}
                      style={{ marginRight: 4, color: "#9ca3af" }}
                    />
                    {f.label}
                  </span>
                  <CharCount
                    current={(form[f.key] || "").length}
                    max={MAX_SPEC_LEN}
                  />
                </div>
                <input
                  value={form[f.key]}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_SPEC_LEN)
                      set(f.key, e.target.value);
                  }}
                  onBlur={() => handleBlurValidate(f.eKey)}
                  placeholder={f.ph}
                  maxLength={MAX_SPEC_LEN}
                  style={inp(f.eKey)}
                />
                <FieldError msg={errors[f.eKey]} />
              </div>
            ))}
          </div>

          {/* Full Specifications */}
          <div>
            <p
              style={{
                ...lbl,
                color: "#9ca3af",
                marginBottom: 12,
                fontSize: 11,
              }}
            >
              Full Specifications (shown on Specs page — add groups like ENGINE,
              BRAKES, etc.)
            </p>
            <SpecGroupsEditor
              groups={form.groups}
              onChange={(groups) => set("groups", groups)}
            />
          </div>

          {/* Submit summary banner */}
          {Object.values(errors).some(Boolean) && touched.name && (
            <div
              style={{
                background: "#fff7f7",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ color: "#dc2626", fontSize: 15, flexShrink: 0 }}
              />
              <p
                style={{
                  color: "#991b1b",
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Please fix the highlighted errors before saving.
              </p>
            </div>
          )}

          {/* Submit */}
          <div
            style={{
              display: "flex",
              gap: 10,
              position: "sticky",
              bottom: 0,
              background: "#fff",
              padding: "8px 0 4px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: saving ? "#9ca3af" : "#d30000",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = "#b91c1c";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = "#d30000";
              }}
            >
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Saving…
                </>
              ) : initial.id ? (
                "Save Changes"
              ) : (
                "Add Bike"
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#6b7280",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Category Badge
function CatBadge({ cat }) {
  const c = CAT_COLORS[cat] || "#6b7280";
  return (
    <span
      style={{
        background: `${c}15`,
        color: c,
        border: `1px solid ${c}40`,
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 999,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
      }}
    >
      {cat}
    </span>
  );
}

// Color Swatches
function ColorSwatches({ colors, activeIdx, onSwitch }) {
  if (!colors || colors.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 2 }}>
      {colors.map((c, i) => (
        <button
          key={i}
          type="button"
          title={c.hex}
          onClick={(e) => {
            e.stopPropagation();
            onSwitch(i);
          }}
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: c.hex,
            border:
              i === activeIdx
                ? "2px solid #111827"
                : "1.5px solid rgba(0,0,0,0.15)",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "transform 0.15s",
            transform: i === activeIdx ? "scale(1.3)" : "scale(1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              i === activeIdx ? "scale(1.3)" : "scale(1)";
          }}
        />
      ))}
    </div>
  );
}

// Main Component
function AdminBikeInventory() {
  const role = sessionStorage.getItem("adminRole") || "STAFF";

  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editBike, setEditBike] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeColorIdx, setActiveColorIdx] = useState({});

  const showToast = (msg, type = "success") => setToast({ msg, type });
  const canEdit = can(role, "EDIT_BIKES");

  const resolveColors = (bike) => {
    if (bike.colors && bike.colors.length > 0) return bike.colors;
    return [{ hex: bike.color || "#cccccc", image: bike.image || null }];
  };

  const getACI = (bike) => activeColorIdx[bike.id] ?? 0;
  const handleSwitch = (bikeId, idx) =>
    setActiveColorIdx((prev) => ({ ...prev, [bikeId]: idx }));

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bikes`);
      const data = await res.json();
      if (data.success) setBikes(data.data);
      else showToast("Failed to load bikes", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleOpenEdit = async (bike) => {
    try {
      const res = await fetch(`${API_BASE}/bikes/${bike.id}/specs`);
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        const colors =
          d.colors && d.colors.length > 0
            ? d.colors
            : [{ hex: d.color || "#e63946", image: d.image || null }];
        setEditBike({
          ...d,
          price: String(d.price),
          colors,
          groups: (d.groups || []).map((g) => ({
            title: g.title,
            displayOrder: g.displayOrder,
            rows: (g.rows || []).map((r) => ({
              label: r.label,
              value: r.value,
              displayOrder: r.displayOrder,
            })),
          })),
        });
      } else showToast("Failed to load specs", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/bikes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBikes();
        setShowForm(false);
        showToast(`${form.name} added successfully`);
      } else showToast(data.message || "Failed to add", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/bikes/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        await fetchBikes();
        setEditBike(null);
        showToast(`${form.name} updated`);
      } else showToast(data.message || "Update failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStock = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/bikes/${id}/stock`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success)
        setBikes((b) =>
          b.map((x) => (x.id === id ? { ...x, stock: data.data.stock } : x)),
        );
      else showToast("Toggle failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  const handleDelete = async () => {
    const bike = toDelete;
    setToDelete(null);
    try {
      const res = await fetch(`${API_BASE}/bikes/${bike.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBikes((b) => b.filter((x) => x.id !== bike.id));
        showToast(`${bike.name} deleted`, "error");
      } else showToast(data.message || "Delete failed", "error");
    } catch {
      showToast("Cannot connect to server", "error");
    }
  };

  const visible = bikes
    .filter((b) => filter === "ALL" || b.category === filter)
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va = a[sortField],
        vb = b[sortField];
      if (sortField === "price") {
        va = Number(va);
        vb = Number(vb);
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((v) => !v);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ field }) => (
    <FontAwesomeIcon
      icon={
        sortField === field ? (sortAsc ? faArrowUp : faArrowDown) : faArrowUp
      }
      style={{
        fontSize: 10,
        color: sortField === field ? "#d30000" : "#d1d5db",
      }}
    />
  );

  const stats = {
    total: bikes.length,
    inStock: bikes.filter((b) => b.stock).length,
    scooters: bikes.filter((b) => b.category === "SCOOTER").length,
    premium: bikes.filter((b) => b.category === "PREMIUM").length,
    moto: bikes.filter((b) => b.category === "MOTORCYCLE").length,
  };

  const th = {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  };
  const gridCols = canEdit
    ? "60px 2fr 1.2fr 1fr 1.4fr 100px 100px"
    : "60px 2fr 1.2fr 1fr 1.4fr 100px";

  return (
    <AdminLayout currentPage="bikes">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..900&display=swap');
        * { box-sizing:border-box; }
        select option { background:#fff; color:#111827; }
      `}</style>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showForm && canEdit && (
        <BikeForm
          initial={{ ...EMPTY_FORM }}
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}
      {editBike && canEdit && (
        <BikeForm
          initial={editBike}
          onSave={handleEdit}
          onCancel={() => setEditBike(null)}
          saving={saving}
        />
      )}
      {toDelete && canEdit && (
        <ConfirmModal
          bike={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 24,
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
              Bike Inventory
            </h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
              {canEdit
                ? "Manage all bikes, colour variants and full specifications"
                : "View-only — your role cannot add, edit or delete bikes"}
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: "#d30000",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(211,0,0,0.25)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#b91c1c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#d30000")
              }
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 13 }} /> Add New
              Bike
            </button>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Total Bikes",
              val: stats.total,
              color: "#3b82f6",
              rgb: "59,130,246",
            },
            {
              label: "In Stock",
              val: stats.inStock,
              color: "#10b981",
              rgb: "16,185,129",
            },
            {
              label: "Scooters",
              val: stats.scooters,
              color: "#2563eb",
              rgb: "37,99,235",
            },
            {
              label: "Premium",
              val: stats.premium,
              color: "#7c3aed",
              rgb: "124,58,237",
            },
            {
              label: "Motorcycles",
              val: stats.moto,
              color: "#dc2626",
              rgb: "220,38,38",
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                background: `rgba(${c.rgb},0.06)`,
                border: `1px solid rgba(${c.rgb},0.2)`,
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <p
                style={{
                  color: c.color,
                  fontWeight: 900,
                  fontSize: 26,
                  margin: "0 0 2px",
                }}
              >
                {loading ? "—" : c.val}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: 0,
                }}
              >
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bikes…"
              style={{
                width: "100%",
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "9px 14px 9px 36px",
                color: "#374151",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", "SCOOTER", "PREMIUM", "MOTORCYCLE"].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 10,
                  border: `1px solid ${filter === c ? "#d30000" : "#d1d5db"}`,
                  background: filter === c ? "#d30000" : "#fff",
                  color: filter === c ? "#fff" : "#6b7280",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.06em",
                  transition: "all 0.15s",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              padding: "10px 20px",
              borderBottom: "1px solid #e5e7eb",
              alignItems: "center",
            }}
          >
            <span style={th}>#</span>
            <span style={th} onClick={() => toggleSort("name")}>
              <FontAwesomeIcon icon={faMotorcycle} style={{ marginRight: 5 }} />
              Bike <SortIcon field="name" />
            </span>
            <span style={th}>Category</span>
            <span style={th} onClick={() => toggleSort("price")}>
              Price <SortIcon field="price" />
            </span>
            <span style={th}>Quick Specs</span>
            <span style={th}>Stock</span>
            {canEdit && (
              <span style={{ ...th, textAlign: "right" }}>Actions</span>
            )}
          </div>

          {/* Body */}
          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                style={{
                  fontSize: 28,
                  color: "#9ca3af",
                  marginBottom: 10,
                  display: "block",
                }}
              />
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading bikes…</p>
            </div>
          ) : visible.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <FontAwesomeIcon
                icon={faMotorcycle}
                style={{
                  fontSize: 36,
                  color: "#e5e7eb",
                  marginBottom: 12,
                  display: "block",
                }}
              />
              <p style={{ color: "#6b7280", fontWeight: 600, margin: 0 }}>
                {bikes.length === 0
                  ? 'No bikes yet — click "Add New Bike" to get started'
                  : "No bikes match your search"}
              </p>
            </div>
          ) : (
            visible.map((bike) => {
              const colors = resolveColors(bike);
              const aci = getACI(bike);
              const activeEntry = colors[aci] || colors[0];
              return (
                <div
                  key={bike.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    padding: "13px 20px",
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
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {bike.id}
                    </span>
                    <ColorSwatches
                      colors={colors}
                      activeIdx={aci}
                      onSwitch={(idx) => handleSwitch(bike.id, idx)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    {activeEntry.image ? (
                      <img
                        src={activeEntry.image}
                        alt={bike.name}
                        style={{
                          width: 40,
                          height: 28,
                          objectFit: "contain",
                          borderRadius: 4,
                          background: "#f3f4f6",
                          flexShrink: 0,
                          transition: "opacity 0.2s",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 28,
                          borderRadius: 4,
                          background: activeEntry.hex,
                          border: "1px solid #e5e7eb",
                          flexShrink: 0,
                          transition: "background 0.2s",
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          color: "#111827",
                          fontWeight: 700,
                          fontSize: 13,
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bike.name}
                      </p>
                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: 11,
                          margin: 0,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {bike.tagline}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CatBadge cat={bike.category} />
                  </div>
                  <span
                    style={{ color: "#374151", fontWeight: 700, fontSize: 13 }}
                  >
                    LKR {Number(bike.price).toLocaleString()}
                  </span>
                  <div>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: 11,
                        margin: "0 0 1px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bike.specPower || "—"}
                    </p>
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: 10,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bike.specEngine || "—"}
                    </p>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => handleToggleStock(bike.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 99,
                        border: `1px solid ${bike.stock ? "#bbf7d0" : "#fecaca"}`,
                        background: bike.stock ? "#f0fdf4" : "#fff5f5",
                        color: bike.stock ? "#166534" : "#991b1b",
                        fontWeight: 700,
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={bike.stock ? faEye : faEyeSlash}
                        style={{ fontSize: 10 }}
                      />
                      {bike.stock ? "In Stock" : "Out"}
                    </button>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        borderRadius: 99,
                        border: `1px solid ${bike.stock ? "#bbf7d0" : "#fecaca"}`,
                        background: bike.stock ? "#f0fdf4" : "#fff5f5",
                        color: bike.stock ? "#166534" : "#991b1b",
                        fontWeight: 700,
                        fontSize: 11,
                        fontFamily: "inherit",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={bike.stock ? faEye : faEyeSlash}
                        style={{ fontSize: 10 }}
                      />
                      {bike.stock ? "In Stock" : "Out"}
                    </span>
                  )}
                  {canEdit && (
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => handleOpenEdit(bike)}
                        title="Edit"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: "#f3f4f6",
                          border: "none",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => setToDelete(bike)}
                        title="Delete"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: "#f3f4f6",
                          border: "none",
                          cursor: "pointer",
                          color: "#6b7280",
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6";
                          e.currentTarget.style.color = "#6b7280";
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}

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
              {visible.length} of {bikes.length} bikes
            </p>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>
              {canEdit
                ? "Click colour swatches to preview variants · Edit pencil to update full specs"
                : "Read-only view — contact an admin to make changes"}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminBikeInventory;
