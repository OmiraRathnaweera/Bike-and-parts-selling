import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import transition from "../transition";

const TERMS = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using the M&J Enterprises website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.",
  },
  {
    title: "Use of the Website",
    content:
      "You agree to use this website only for lawful purposes. You must not use it in any way that violates applicable local, national, or international law or regulation, or to transmit any unsolicited or unauthorized advertising material.",
  },
  {
    title: "Account Registration",
    content:
      "To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
  },
  {
    title: "Orders & Payments",
    content:
      "All orders are subject to product availability and acceptance. We reserve the right to refuse or cancel any order. Prices are subject to change without notice. Full payment is required before orders are processed.",
  },
  {
    title: "Returns & Refunds",
    content:
      "We accept returns within 30 days of delivery for most items in original condition. Some products may be subject to restocking fees. Shipping costs for returns are the responsibility of the customer unless the item is defective.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on this website, including text, graphics, logos, and images, is the property of M&J Enterprises and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.",
  },
  {
    title: "Limitation of Liability",
    content:
      "M&J Enterprises shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or any products purchased through it, even if we have been advised of the possibility of such damages.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website following any changes constitutes your acceptance of the new terms.",
  },
];

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function Terms() {
  const [open, setOpen] = useState(null);

  return (
    <main className="max-w-screen-xl mx-auto px-5 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">Last updated: January 1, 2026</p>
          <p className="text-gray-500 text-sm mt-3">
            Please read these Terms of Service carefully before using M&J
            Enterprises. These terms govern your use of our website and
            services.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {TERMS.map((term, i) => (
            <motion.div
              key={i}
              variants={itemVariant}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-sm">
                  {term.title}
                </span>
                <motion.svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="shrink-0 text-gray-400"
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {term.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-xs text-gray-400 text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          Questions about our terms?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </a>
        </motion.p>
      </div>
    </main>
  );
}

export default transition(Terms);
