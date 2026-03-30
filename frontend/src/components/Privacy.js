import React from "react";
import { motion } from "framer-motion";
import transition from "../transition";

const SECTIONS = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, place an order, or contact our support team. This includes your name, email address, shipping address, payment information, and vehicle information.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to process your orders, send order confirmations and shipping updates, provide customer support, personalize your shopping experience, and send promotional communications (with your consent).",
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, processing payments, and delivering orders.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment data is encrypted using SSL technology.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications by clicking the unsubscribe link in any email we send.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at privacy@mjenterprises.com or write to us at M&J Enterprises, Privacy Department, 1 Auto Drive, Suite 100, NJ 08701.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">Last updated: January 1, 2026</p>
          <p className="text-gray-500 text-sm mt-3">
            At M&J Enterprises, we are committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your
            personal information.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {SECTIONS.map((section, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-colors"
            >
              <h2 className="text-base font-extrabold text-gray-900 mb-2 tracking-tight">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

export default transition(Privacy);
