import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faTruck,
  faGears,
  faCircleXmark,
  faReceipt,
  faLocationDot,
  faCreditCard,
  faCircleCheck,
  faChevronRight,
  faFilter,
  faInbox,
  faCalendarDays,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";

const ORDER_STATUS = {
  Delivered: {
    tw:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: faCircleCheck,
    iconColor: "text-emerald-500",
  },
  Shipped: {
    tw:   "bg-blue-100 text-blue-700 border border-blue-200",
    icon: faTruck,
    iconColor: "text-blue-500",
  },
  Processing: {
    tw:   "bg-amber-100 text-amber-700 border border-amber-200",
    icon: faGears,
    iconColor: "text-amber-500",
  },
  Cancelled: {
    tw:   "bg-red-100 text-red-700 border border-red-200",
    icon: faCircleXmark,
    iconColor: "text-red-400",
  },
};

export const MOCK_ORDERS = [
  {
    id: "#ORD-10452",
    date: "Feb 20, 2026",
    status: "Delivered",
    total: "Rs. 14,999",
    subtotal: "Rs. 13,499",
    shipping: "Rs. 1,500",
    address: "123 Main St, Colombo",
    payment: "Visa •••• 4242",
    items: [
      { name: "Brake Pads (x2)",    qty: 2, price: "Rs. 6,500", icon: faGears },
      { name: "Brake Fluid 500ml",  qty: 1, price: "Rs. 6,999", icon: faGears },
    ],
  },
  {
    id: "#ORD-10381",
    date: "Jan 15, 2026",
    status: "Shipped",
    total: "Rs. 8,950",
    subtotal: "Rs. 7,950",
    shipping: "Rs. 1,000",
    address: "45 Hill Rd, Kandy",
    payment: "Cash on Delivery",
    items: [
      { name: "Air Filter", qty: 1, price: "Rs. 4,200", icon: faGears },
      { name: "Oil Filter", qty: 1, price: "Rs. 3,750", icon: faGears },
    ],
  },
  {
    id: "#ORD-10290",
    date: "Dec 5, 2025",
    status: "Processing",
    total: "Rs. 32,000",
    subtotal: "Rs. 30,500",
    shipping: "Rs. 1,500",
    address: "22 Sea St, Negombo",
    payment: "Bank Transfer",
    items: [
      { name: "Suspension Kit", qty: 1, price: "Rs. 30,500", icon: faGears },
    ],
  },
  {
    id: "#ORD-10188",
    date: "Oct 12, 2025",
    status: "Cancelled",
    total: "Rs. 5,400",
    subtotal: "Rs. 4,900",
    shipping: "Rs. 500",
    address: "78 Beach Ave, Galle",
    payment: "Visa •••• 4242",
    items: [
      { name: "Spark Plugs (x4)", qty: 4, price: "Rs. 4,900", icon: faGears },
    ],
  },
];

const TIMELINE_STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

function OrderDetailModal({ order, onClose }) {
  const stepDone = {
    "Order Placed": true,
    Processing:     ["Processing", "Shipped", "Delivered"].includes(order.status),
    Shipped:        ["Shipped", "Delivered"].includes(order.status),
    Delivered:      order.status === "Delivered",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <FontAwesomeIcon icon={faReceipt} className="text-blue-500 text-sm" />
              <h3 className="font-extrabold text-gray-900 text-lg">{order.id}</h3>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
              Placed on {order.date}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${ORDER_STATUS[order.status].tw}`}>
              <FontAwesomeIcon icon={ORDER_STATUS[order.status].icon} className="text-xs" />
              {order.status}
            </span>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors font-bold text-sm">
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[68vh] overflow-y-auto">

          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBoxOpen} /> Items Ordered
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                    <FontAwesomeIcon icon={item.icon} className="text-blue-400 text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-extrabold text-gray-900 shrink-0">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faReceipt} /> Cost Breakdown
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-700">{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold text-gray-700">{order.shipping}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-extrabold text-gray-800">Total</span>
                <span className="font-extrabold text-blue-600 text-base">{order.total}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Delivery Address", value: order.address, icon: faLocationDot },
              { label: "Payment Method",   value: order.payment,  icon: faCreditCard  },
            ].map(c => (
              <div key={c.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={c.icon} className="text-xs" /> {c.label}
                </p>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">{c.value}</p>
              </div>
            ))}
          </div>

          {order.status !== "Cancelled" && (
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} /> Order Timeline
              </p>
              <div className="flex items-center">
                {TIMELINE_STEPS.map((step, i) => {
                  const done   = stepDone[step];
                  const isLast = i === TIMELINE_STEPS.length - 1;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${done ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                          {done
                            ? <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
                            : <span>{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-semibold text-center leading-tight max-w-[58px] ${done ? "text-blue-600" : "text-gray-400"}`}>
                          {step}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-0.5 mb-5 mx-1 transition-all ${done && stepDone[TIMELINE_STEPS[i + 1]] ? "bg-blue-500" : "bg-gray-200"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full border border-gray-200 text-gray-700 font-bold rounded-xl py-2.5 hover:bg-gray-50 transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PurchaseHistory({ orders = MOCK_ORDERS }) {
  const [filter,      setFilter]      = useState("All");
  const [activeOrder, setActiveOrder] = useState(null);

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const stats = [
    { label: "Total Orders",  val: orders.length,                                                       color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100",    icon: faHashtag     },
    { label: "Delivered",     val: orders.filter(o => o.status === "Delivered").length,                  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: faCircleCheck },
    { label: "In Progress",   val: orders.filter(o => ["Shipped","Processing"].includes(o.status)).length,color:"text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100",   icon: faTruck       },
    { label: "Cancelled",     val: orders.filter(o => o.status === "Cancelled").length,                  color: "text-red-600",     bg: "bg-red-50",     border: "border-red-100",     icon: faCircleXmark },
  ];

  const FILTERS = ["All", "Delivered", "Shipped", "Processing", "Cancelled"];

  return (
    <>
      {activeOrder && <OrderDetailModal order={activeOrder} onClose={() => setActiveOrder(null)} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
            <FontAwesomeIcon icon={s.icon} className={`${s.color} text-lg mb-1.5`} />
            <p className={`${s.color} font-extrabold text-2xl`}>{s.val}</p>
            <p className="text-gray-500 text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faBoxOpen} className="text-blue-500" />
          Order History
        </h2>
        <div className="flex items-center gap-1.5 flex-wrap">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-xs" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                ${filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <FontAwesomeIcon icon={faInbox} className="text-gray-300 text-5xl mb-3" />
            <p className="font-bold text-gray-400">
              No {filter !== "All" ? filter.toLowerCase() : ""} orders found
            </p>
          </div>
        ) : filtered.map(order => {
          const statusCfg = ORDER_STATUS[order.status];
          return (
            <div key={order.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${statusCfg.tw.split(" ").slice(0,1).join(" ")} border ${statusCfg.tw.split(" ").slice(-2).join(" ")}`}>
                    <FontAwesomeIcon icon={statusCfg.icon} className={`${statusCfg.iconColor} text-lg`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="font-extrabold text-gray-900 text-sm flex items-center gap-1">
                        <FontAwesomeIcon icon={faHashtag} className="text-gray-300 text-xs" />
                        {order.id.replace("#", "")}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${statusCfg.tw}`}>
                        <FontAwesomeIcon icon={statusCfg.icon} className="text-xs" />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.slice(0, 2).map(i => i.name).join(", ")}
                      {order.items.length > 2 && <span className="text-gray-400"> +{order.items.length - 2} more</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                      {order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:shrink-0">
                  <span className="font-extrabold text-gray-900">{order.total}</span>
                  <button onClick={() => setActiveOrder(order)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                    View Details
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                  </button>
                </div>
              </div>

              {order.items.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 font-semibold">
                      <FontAwesomeIcon icon={item.icon} className="text-blue-300 text-xs" />
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PurchaseHistory;