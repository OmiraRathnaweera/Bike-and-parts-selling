import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { can, WEEKLY_SALES } from "./rbac";
import transition from "../transition"

import BusinessLogo from '../assets/BusinessLogo.jpeg';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { faFilePdf, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChartTooltip({ active, payload, label, showProfit }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          fontWeight: 700,
          fontSize: 12,
          margin: "0 0 4px",
        }}
      >
        {label}
      </p>
      <p style={{ color: "#2563eb", fontWeight: 700, fontSize: 13, margin: 0 }}>
        Sales: Rs. {payload[0]?.value?.toLocaleString()}
      </p>
      {showProfit && payload[1] && (
        <p
          style={{
            color: "#10b981",
            fontWeight: 700,
            fontSize: 13,
            margin: "2px 0 0",
          }}
        >
          Profit: Rs. {payload[1]?.value?.toLocaleString()}
        </p>
      )}
    </div>
  );
}

function AdminReport() {
  const [role, setRole] = useState("OWNER");

  const showProfit = can(role, "VIEW_PROFIT");
  const canPDF = can(role, "GENERATE_PDF");

  const totSales = WEEKLY_SALES.reduce((a, b) => a + b.sales, 0);
  const totProfit = WEEKLY_SALES.reduce((a, b) => a + b.profit, 0);
  const avgSales = Math.round(totSales / 7);
  const margin = ((totProfit / totSales) * 100).toFixed(1);
  const bestDay = WEEKLY_SALES.reduce((a, b) => (b.sales > a.sales ? b : a));

  // PDF
  const handleGeneratePDF = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>M&J Enterprises — Weekly Sales Report</title>
        <link rel="icon" type="image/svg+xml" href="${BusinessLogo}">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #111827; margin: 0; background: #ffffff; }
        .header { border-bottom: 3px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { 
          width: 100px;
          height: auto;
          margin-bottom: 15px;
        }
        .title { color: #1d4ed8; font-size: 28px; font-weight: 900; margin: 0; }
        .subtitle { color: #6b7280; font-size: 14px; margin: 0; }
          .meta { color: #9ca3af; font-size: 12px; margin-top: 8px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(${showProfit ? 4 : 2}, 1fr); gap: 16px; margin-bottom: 30px; }
          .kpi { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
          .kpi-val { font-size: 22px; font-weight: 900; color: #1d4ed8; margin: 0 0 4px; }
          .kpi-label { font-size: 12px; color: #6b7280; font-weight: 600; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #1d4ed8; color: white; padding: 12px 14px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 11px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151; }
          tr:nth-child(even) td { background: #f9fafb; }
          .total td { font-weight: 800; background: #eff6ff; border-top: 2px solid #1d4ed8; color: #1d4ed8; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
        <img src="${BusinessLogo}" alt="M&J Enterprises Logo" class="logo">
        <h1 class="title">M&J Enterprises</h1>
        <p class="subtitle">Weekly Sales Report — Mar 1–7, 2026</p>
      </div>

        <div class="kpi-grid">
          <div class="kpi"><p class="kpi-val">Rs. ${(totSales / 1000).toFixed(0)}K</p><p class="kpi-label">Weekly Sales</p></div>
          <div class="kpi"><p class="kpi-val">Rs. ${(avgSales / 1000).toFixed(0)}K</p><p class="kpi-label">Daily Average</p></div>
          ${showProfit ? `<div class="kpi"><p class="kpi-val">Rs. ${(totProfit / 1000).toFixed(0)}K</p><p class="kpi-label">Net Profit</p></div>` : ""}
          ${showProfit ? `<div class="kpi"><p class="kpi-val">${margin}%</p><p class="kpi-label">Profit Margin</p></div>` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Sales (Rs.)</th>
              ${showProfit ? "<th>Profit (Rs.)</th>" : ""}
              <th>Share %</th>
            </tr>
          </thead>
          <tbody>
            ${WEEKLY_SALES.map(
              (d) => `
              <tr>
                <td>${d.day}</td>
                <td>${d.sales.toLocaleString()}</td>
                ${showProfit ? `<td>${d.profit.toLocaleString()}</td>` : ""}
                <td>${((d.sales / totSales) * 100).toFixed(1)}%</td>
              </tr>
            `,
            ).join("")}
            <tr class="total">
              <td>TOTAL</td>
              <td>${totSales.toLocaleString()}</td>
              ${showProfit ? `<td>${totProfit.toLocaleString()}</td>` : ""}
              <td>100%</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Best day: <strong>${bestDay.day}</strong> with Rs. ${bestDay.sales.toLocaleString()} in sales.
          ${showProfit ? ` &nbsp;|&nbsp; Profit margin: <strong>${margin}%</strong>` : ""}
          </p>
          <p>This report was auto-generated by M&J Enterprises Admin Console.</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  if (!can(role, "VIEW_SALES"))
    return (
      <AdminLayout currentPage="report" role={role} onRoleChange={setRole}>
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
            access Sales Reports.
          </p>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout currentPage="report" role={role} onRoleChange={setRole}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
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
              Sales Report
            </h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
              Week of March 1–7, 2026
              {!showProfit && (
                <span style={{ color: "#f59e0b", marginLeft: 8, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faLock} /> Profit data hidden for your
                  role
                </span>
              )}
            </p>
          </div>
          {canPDF ? (
            <button
              onClick={handleGeneratePDF}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "10px 15px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#3555f0,#5d54f4)",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} />
              Export PDF
            </button>
          ) : (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                color: "#6b7280",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <FontAwesomeIcon icon={faLock} /> PDF export requires OWNER or
              ACCOUNTANT
            </div>
          )}
        </div>

        {/* KPI Cards and Calculations*/}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showProfit ? "repeat(4,1fr)" : "repeat(2,1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Weekly Sales",
              val: `Rs. ${(totSales / 1000).toFixed(0)}K`,
              color: "#3b82f6",
              rgb: "59,130,246",
              show: true,
            },
            {
              label: "Daily Average",
              val: `Rs. ${(avgSales / 1000).toFixed(0)}K`,
              color: "#8b5cf6",
              rgb: "139,92,246",
              show: true,
            },
            {
              label: "Net Profit",
              val: `Rs. ${(totProfit / 1000).toFixed(0)}K`,
              color: "#10b981",
              rgb: "16,185,129",
              show: showProfit,
            },
            {
              label: "Profit Margin",
              val: `${margin}%`,
              color: "#f59e0b",
              rgb: "245,158,11",
              show: showProfit,
            },
          ]
            .filter((c) => c.show)
            .map((c) => (
              <div
                key={c.label}
                style={{
                  background: `rgba(${c.rgb},0.05)`,
                  border: `1px solid rgba(${c.rgb},0.2)`,
                  borderRadius: 16,
                  padding: "18px 20px",
                }}
              >
                <p
                  style={{
                    color: c.color,
                    fontWeight: 800,
                    fontSize: 28,
                    margin: "0 0 4px",
                  }}
                >
                  {c.val}
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

        {/* Bar Chart */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 20,
            marginBottom: 14,
          }}
        >
          <p
            style={{
              color: "#6b7280",
              fontWeight: 700,
              fontSize: 14,
              margin: "0 0 16px",
            }}
          >
            Daily Revenue Breakdown
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_SALES} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<ChartTooltip showProfit={showProfit} />} />
              <Bar
                dataKey="sales"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
              {showProfit && (
                <Bar
                  dataKey="profit"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
          {showProfit && (
            <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#3b82f6",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#6b7280", fontSize: 12 }}>Sales</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#6b7280", fontSize: 12 }}>Profit</span>
              </div>
            </div>
          )}
        </div>

        {/* Line Chart */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 20,
            marginBottom: 14,
          }}
        >
          <p
            style={{
              color: "#6b7280",
              fontWeight: 700,
              fontSize: 14,
              margin: "0 0 16px",
            }}
          >
            Sales Trend
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEKLY_SALES}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<ChartTooltip showProfit={false} />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data table */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: showProfit
                ? "1fr 1.5fr 1.5fr 1.5fr"
                : "1fr 1.5fr 1.5fr",
              padding: "10px 20px",
              borderBottom: "1px solid #e5e7eb",
              color: "#6b7280",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            <span>Day</span>
            <span>Sales</span>
            {showProfit && <span>Profit</span>}
            <span>Share</span>
          </div>
          {WEEKLY_SALES.map((d) => (
            <div
              key={d.day}
              style={{
                display: "grid",
                gridTemplateColumns: showProfit
                  ? "1fr 1.5fr 1.5fr 1.5fr"
                  : "1fr 1.5fr 1.5fr",
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
              <span style={{ color: "#374151", fontWeight: 700, fontSize: 13 }}>
                {d.day}
              </span>
              <span style={{ color: "#2563eb", fontWeight: 700, fontSize: 13 }}>
                Rs. {d.sales.toLocaleString()}
              </span>
              {showProfit && (
                <span
                  style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}
                >
                  Rs. {d.profit.toLocaleString()}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "#e5e7eb",
                    maxWidth: 100,
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: "#3b82f6",
                      width: `${((d.sales / totSales) * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
                <span style={{ color: "#9ca3af", fontSize: 12, minWidth: 32 }}>
                  {((d.sales / totSales) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
          {/* Total row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: showProfit
                ? "1fr 1.5fr 1.5fr 1.5fr"
                : "1fr 1.5fr 1.5fr",
              padding: "12px 20px",
              alignItems: "center",
              borderTop: "1px solid #e5e7eb",
              background: "#eff6ff",
            }}
          >
            <span style={{ color: "#6b7280", fontWeight: 800, fontSize: 13 }}>
              TOTAL
            </span>
            <span style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 13 }}>
              Rs. {totSales.toLocaleString()}
            </span>
            {showProfit && (
              <span style={{ color: "#059669", fontWeight: 800, fontSize: 13 }}>
                Rs. {totProfit.toLocaleString()}
              </span>
            )}
            <span style={{ color: "#6b7280", fontSize: 12 }}>100%</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default transition(AdminReport);
