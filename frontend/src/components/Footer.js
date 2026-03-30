import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  "Customer Service": [
    { label: "Track My Order", path: "/track-order" },
    { label: "Returns & Exchanges", path: "/returns" },
    { label: "Shipping Policy", path: "/shipping" },
  ],
  Company: [
    { label: "About Us", path: "/about" },
    { label: "Reviews", path: "/reviews" },
    {
      label: "About us Hero",
      href: "https://www.heromotocorp.com/en-in/company/about-us/overview.html",
    },
  ],
  Legal: [
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ],
  Connect: [
    { label: "Facebook", href: "https://www.facebook.com/share/1N231PhmPF/?mibextid=wwXIfr" },
    { label: "TikTok", href: "https://www.tiktok.com/@mjenterprises96?_r=1&_t=ZS-94zDTVFgP4r" },
    { label: "Contact us", path: "/contact" },
  ],
};

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 mt-10">
      <div className="max-w-screen-xl mx-auto px-5 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="bg-red-600 rounded-md w-8 h-8 flex items-center justify-center font-black text-white text-xs tracking-tight">
                MJ
              </div>
              <span className="font-black text-xl tracking-wide text-white">
                M&J Enterprises
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Your one-stop shop for car & bike parts, accessories, and
              everything automotive.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-3">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-white transition-colors no-underline"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-xs text-gray-500 hover:text-white transition-colors no-underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider and Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © 2026 M&J Enterprises · All Rights Reserved
          </p>
          <div className="flex gap-4">
            <Link
              to="/terms"
              className="text-xs text-gray-600 hover:text-white transition-colors no-underline"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-xs text-gray-600 hover:text-white transition-colors no-underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
