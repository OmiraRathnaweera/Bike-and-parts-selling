import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPlus,
  faMotorcycle,
  faCalendarAlt,
  faGauge,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faTrash,
  faTimes,
  faOilCan,
  faBolt,
  faFilter,
  faFire,
  faWrench,
  faBatteryHalf,
  faSnowflake,
  faCircleInfo,
  faRobot,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const SERVICE_SCHEDULE = [
  { type: "Oil Change", icon: faOilCan, km: 3000, color: "amber" },
  { type: "Air Filter", icon: faFilter, km: 6000, color: "blue" },
  { type: "Spark Plug", icon: faBolt, km: 6000, color: "yellow" },
  { type: "Brake Inspection", icon: faFire, km: 5000, color: "red" },
  { type: "General Service", icon: faWrench, km: 10000, color: "purple" },
  { type: "Battery Check", icon: faBatteryHalf, km: 12000, color: "green" },
  { type: "Fuel System", icon: faGauge, km: 15000, color: "orange" },
  { type: "Cooling Check", icon: faSnowflake, km: 20000, color: "cyan" },
];

const AVG_KM_PER_MONTH = 1000;

function generateReminders(purchase) {
  const purchaseDate = new Date(
    purchase.date || purchase.purchaseDate || Date.now(),
  );
  const monthsOwned = Math.max(
    0,
    Math.floor(
      (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
    ),
  );
  const estimatedKm = monthsOwned * AVG_KM_PER_MONTH;

  return SERVICE_SCHEDULE.map((svc, i) => {
    const monthsToService = Math.ceil(svc.km / AVG_KM_PER_MONTH);
    const dueDate = new Date(purchaseDate);
    dueDate.setMonth(dueDate.getMonth() + monthsToService);

    const msUntilDue = dueDate.getTime() - Date.now();
    const daysUntilDue = Math.ceil(msUntilDue / (1000 * 60 * 60 * 24));
    const kmUntilDue = Math.max(0, svc.km - estimatedKm);

    let status = "Upcoming";
    if (daysUntilDue < 0) status = "Overdue";
    else if (daysUntilDue <= 14 || kmUntilDue <= 300) status = "Due";

    return {
      id: `auto_${purchase.id || purchase.orderId}_${i}`,
      auto: true,
      bikeName: purchase.bikeName || purchase.name,
      serviceType: svc.type,
      icon: svc.icon,
      color: svc.color,
      kmInterval: svc.km,
      estimatedKm: Math.round(estimatedKm),
      kmUntilDue: Math.round(kmUntilDue),
      dueDate: dueDate.toISOString().split("T")[0],
      purchaseDate: purchaseDate.toISOString().split("T")[0],
      status,
      notes: `Auto-scheduled based on purchase date (${purchaseDate.toLocaleDateString("en-LK")})`,
      lastServiced: null,
    };
  });
}

const MOCK_PURCHASES = [
  {
    id: "ord_001",
    bikeName: "Hero Splendor Plus",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 3 months ago
    price: 285000,
  },
];

const STATUS_STYLES = {
  Overdue: {
    border: "border-red-400",
    badge: "bg-red-100 text-red-700",
    icon: faExclamationTriangle,
    dot: "bg-red-500",
  },
  Due: {
    border: "border-amber-400",
    badge: "bg-amber-100 text-amber-700",
    icon: faClock,
    dot: "bg-amber-500",
  },
  Upcoming: {
    border: "border-blue-300",
    badge: "bg-blue-50 text-blue-700",
    icon: faCircleInfo,
    dot: "bg-blue-400",
  },
  Completed: {
    border: "border-emerald-300",
    badge: "bg-emerald-50 text-emerald-700",
    icon: faCheckCircle,
    dot: "bg-emerald-400",
  },
};

const COLOR_CLASSES = {
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  yellow: "bg-yellow-100 text-yellow-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  cyan: "bg-cyan-100 text-cyan-600",
};

function ManualModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    bikeName: "",
    serviceType: "Oil Change",
    dueDate: "",
    notes: "",
    kmInterval: 3000,
  });
  const handleSave = () => {
    if (!form.bikeName.trim() || !form.dueDate) return;
    onSave({
      ...form,
      id: `manual_${Date.now()}`,
      auto: false,
      status: "Upcoming",
      estimatedKm: 0,
      kmUntilDue: form.kmInterval,
      icon:
        SERVICE_SCHEDULE.find((s) => s.type === form.serviceType)?.icon ||
        faWrench,
      color:
        SERVICE_SCHEDULE.find((s) => s.type === form.serviceType)?.color ||
        "blue",
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-gray-900 text-lg">
            Add Manual Reminder
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
              Bike Name
            </label>
            <input
              value={form.bikeName}
              onChange={(e) =>
                setForm((f) => ({ ...f, bikeName: e.target.value }))
              }
              placeholder="e.g. Hero Splendor Plus"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
              Service Type
            </label>
            <select
              value={form.serviceType}
              onChange={(e) =>
                setForm((f) => ({ ...f, serviceType: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {SERVICE_SCHEDULE.map((s) => (
                <option key={s.type}>{s.type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, dueDate: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
              KM Interval
            </label>
            <input
              type="number"
              value={form.kmInterval}
              onChange={(e) =>
                setForm((f) => ({ ...f, kmInterval: Number(e.target.value) }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={2}
              placeholder="Optional notes..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 font-bold rounded-xl py-2.5 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-2.5"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ReminderCard({ reminder, onDone, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_STYLES[reminder.status] || STATUS_STYLES.Upcoming;
  const cc = COLOR_CLASSES[reminder.color] || COLOR_CLASSES.blue;
  const kmPct =
    reminder.kmInterval > 0
      ? Math.min(
          100,
          Math.round(
            ((reminder.kmInterval - reminder.kmUntilDue) /
              reminder.kmInterval) *
              100,
          ),
        )
      : 0;

  return (
    <div
      className={`bg-white border-l-4 ${s.border} rounded-xl shadow-sm overflow-hidden transition-all`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Service icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cc}`}
            >
              <FontAwesomeIcon icon={reminder.icon || faWrench} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-gray-900 text-sm">
                  {reminder.serviceType}
                </h4>
                {reminder.auto && (
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FontAwesomeIcon icon={faRobot} className="text-[9px]" />{" "}
                    Auto
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${s.badge}`}
                >
                  <FontAwesomeIcon icon={s.icon} className="text-[9px]" />
                  {reminder.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faMotorcycle}
                  className="text-gray-400"
                />
                {reminder.bikeName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-400"
                />
                Due:{" "}
                <strong className="text-gray-700">{reminder.dueDate}</strong>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
            >
              <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
            </button>
            {reminder.status !== "Completed" && (
              <button
                onClick={() => onDone(reminder.id)}
                title="Mark as Done"
                className="w-7 h-7 rounded-lg hover:bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
              </button>
            )}
            {!reminder.auto && (
              <button
                onClick={() => onDelete(reminder.id)}
                title="Delete"
                className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center text-xs"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>

        {/* KM progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
            <span>Progress to service</span>
            <span>
              ~{reminder.estimatedKm?.toLocaleString()} km /{" "}
              {reminder.kmInterval?.toLocaleString()} km
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                reminder.status === "Overdue"
                  ? "bg-red-500"
                  : reminder.status === "Due"
                    ? "bg-amber-500"
                    : reminder.status === "Completed"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
              }`}
              style={{ width: `${kmPct}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {reminder.kmUntilDue > 0
              ? `~${reminder.kmUntilDue.toLocaleString()} km remaining`
              : "Service due now"}
          </p>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
            {reminder.purchaseDate && (
              <p className="text-xs text-gray-500">
                <strong>Purchase Date:</strong> {reminder.purchaseDate}
              </p>
            )}
            {reminder.lastServiced && (
              <p className="text-xs text-gray-500">
                <strong>Last Serviced:</strong> {reminder.lastServiced}
              </p>
            )}
            {reminder.notes && (
              <p className="text-xs text-gray-500 italic">"{reminder.notes}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Manual Reminders
function ServiceReminders({ userId, userPurchases = [], onToast }) {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showAutoInfo, setShowAutoInfo] = useState(true);

  useEffect(() => {
    const purchases = userPurchases.length > 0 ? userPurchases : MOCK_PURCHASES;

    const autoReminders = purchases.flatMap((p) => generateReminders(p));

    const saved = JSON.parse(
      localStorage.getItem(`reminders_${userId}`) || "[]",
    );
    const manualReminders = saved.filter((r) => !r.auto);

    setReminders([...autoReminders, ...manualReminders]);
  }, [userId, userPurchases]);

  const saveManual = useCallback(
    (all) => {
      const manual = all.filter((r) => !r.auto);
      localStorage.setItem(`reminders_${userId}`, JSON.stringify(manual));
    },
    [userId],
  );

  const handleAdd = (reminder) => {
    const updated = [...reminders, reminder];
    setReminders(updated);
    saveManual(updated);
    setShowModal(false);
    onToast?.("Reminder added!", "success");
  };

  const handleDone = (id) => {
    const updated = reminders.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "Completed",
            lastServiced: new Date().toISOString().split("T")[0],
          }
        : r,
    );
    setReminders(updated);
    saveManual(updated);
    onToast?.("Marked as completed!", "success");
  };

  const handleDelete = (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveManual(updated);
    onToast?.("Reminder removed", "success");
  };

  const FILTERS = ["All", "Overdue", "Due", "Upcoming", "Completed"];
  const filtered =
    filter === "All" ? reminders : reminders.filter((r) => r.status === filter);

  const counts = {
    Overdue: reminders.filter((r) => r.status === "Overdue").length,
    Due: reminders.filter((r) => r.status === "Due").length,
    Upcoming: reminders.filter((r) => r.status === "Upcoming").length,
    Completed: reminders.filter((r) => r.status === "Completed").length,
  };

  const urgent = counts.Overdue + counts.Due;

  return (
    <div className="space-y-5">
      {showModal && (
        <ManualModal onSave={handleAdd} onClose={() => setShowModal(false)} />
      )}

      {/* ── Auto-generation info banner ── */}
      {showAutoInfo && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5">
          <FontAwesomeIcon
            icon={faRobot}
            className="text-blue-500 mt-0.5 shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-800">
              Reminders Auto-Generated
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Service reminders below are automatically calculated from your
              bike purchase date, based on Hero's recommended service intervals
              and average Sri Lankan riding distance (~1,000 km/month).
            </p>
          </div>
          <button
            onClick={() => setShowAutoInfo(false)}
            className="text-blue-400 hover:text-blue-600 text-xs mt-0.5"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* ── Urgent alert ── */}
      {urgent > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 shrink-0"
          />
          <p className="text-sm font-bold text-red-700">
            {urgent} service{urgent > 1 ? "s" : ""} need
            {urgent === 1 ? "s" : ""} attention!
            {counts.Overdue > 0 && ` (${counts.Overdue} overdue)`}
          </p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} className="text-blue-500" />
            Service Reminders
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {reminders.length} total reminders
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} /> Add Manual
        </button>
      </div>

      {/* ── Stat chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Overdue",
            count: counts.Overdue,
            color: "bg-red-50 border-red-200 text-red-700",
          },
          {
            label: "Due Soon",
            count: counts.Due,
            color: "bg-amber-50 border-amber-200 text-amber-700",
          },
          {
            label: "Upcoming",
            count: counts.Upcoming,
            color: "bg-blue-50 border-blue-200 text-blue-700",
          },
          {
            label: "Completed",
            count: counts.Completed,
            color: "bg-emerald-50 border-emerald-200 text-emerald-700",
          },
        ].map((c) => (
          <div
            key={c.label}
            className={`border rounded-xl p-3 text-center ${c.color}`}
          >
            <div className="text-2xl font-black">{c.count}</div>
            <div className="text-xs font-bold mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filter chips ── */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all
              ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
          >
            {f} {f !== "All" && counts[f] > 0 && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* ── Reminder cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
          <FontAwesomeIcon
            icon={faBell}
            className="text-gray-300 text-4xl mb-3"
          />
          <p className="text-gray-500 font-semibold">
            No {filter !== "All" ? filter.toLowerCase() : ""} reminders
          </p>
          {filter === "All" && (
            <p className="text-xs text-gray-400 mt-1">
              Purchase a Hero bike to auto-generate service reminders
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDone={handleDone}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceReminders;
