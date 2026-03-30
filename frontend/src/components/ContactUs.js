import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import transition from "../transition";
import {
  faPhone,
  faEnvelope,
  faClock,
  faCircleCheck,
  faPaperPlane,
  faSpinner,
  faTriangleExclamation,
  faUser,
  faTag,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8080/api";

const CONTACT_INFO = [
  { icon: faPhone, label: "Phone", value: "076 122 9147" },
  {
    icon: faEnvelope,
    label: "Email",
    value: "whalegallem@gmail.com",
    href: "mailto:whalegallem@gmail.com",
  },
  { icon: faClock, label: "Hours", value: "Mon–Fri  9 am – 6 pm" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function ContactInfoCards() {
  return (
    <motion.div
      className="grid grid-cols-3 gap-4 mt-8"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {CONTACT_INFO.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeUp}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition-colors"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FontAwesomeIcon
              icon={item.icon}
              className="text-blue-500 text-base"
            />
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            {item.label}
          </div>
          {item.href ? (
            <a
              href={item.href}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors break-all"
            >
              {item.value}
            </a>
          ) : (
            <div className="text-xs font-semibold text-gray-700">
              {item.value}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Failed to send. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Cannot connect to server. Please try again later.");
    }
  };

  if (status === "success")
    return (
      <main className="max-w-screen-xl mx-auto px-5 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-emerald-600 text-3xl"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-500 text-sm mb-1">
              Your message has been delivered to our team.
            </p>
            <p className="text-gray-400 text-xs mb-7">
              We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
          <ContactInfoCards />
        </div>
      </main>
    );

  return (
    <main className="max-w-screen-xl mx-auto px-5 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Contact Us
          </h1>
          <p className="text-gray-500 text-sm">
            Have a question or need help? We're here for you.
          </p>
        </motion.div>

        {/* Error banner */}
        {status === "error" && (
          <motion.div
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mb-5 text-sm text-red-700 font-semibold"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="mt-0.5 shrink-0"
            />
            {errorMsg}
          </motion.div>
        )}

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-5 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.05,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-400 text-xs"
                />{" "}
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-gray-400 text-xs"
                />{" "}
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <FontAwesomeIcon icon={faTag} className="text-gray-400 text-xs" />{" "}
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="How can we help?"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <FontAwesomeIcon
                icon={faMessage}
                className="text-gray-400 text-xs"
              />{" "}
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us more about your issue or question..."
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:scale-[0.99] text-white font-extrabold tracking-widest text-sm rounded-xl py-4 transition-all flex items-center justify-center gap-2"
          >
            {status === "sending" ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />{" "}
                SENDING...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} /> SEND MESSAGE
              </>
            )}
          </button>
        </motion.form>

        <ContactInfoCards />
      </div>
    </main>
  );
}

export default transition(ContactUs);
