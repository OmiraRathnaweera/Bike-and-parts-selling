import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import transition from "../transition";
import Oldstory from "../assets/Old-pic.png";

import {
  faGem,
  faHeadset,
  faTruck,
  faTags,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function AboutUs() {
  const STATS = [
    { label: "Products Available", value: "1K+" },
    { label: "Years in Business", value: "25+" },
  ];

  const VALUES = [
    {
      icon: faGem,
      title: "Quality First",
      description:
        "We source only premium parts from trusted manufacturers to ensure your vehicle performs at its best.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: faHeadset,
      title: "Expert Support",
      description:
        "Our knowledgeable team is ready to help you find the perfect parts for your specific needs.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: faTruck,
      title: "Fast Shipping",
      description:
        "Get your parts delivered quickly with our efficient logistics network across the country.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: faTags,
      title: "Best Prices",
      description:
        "Competitive pricing without compromising on quality. We believe in fair value for all.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <main className="w-full">
      {/* HERO */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-5 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Your Trusted Vehicle Parts{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Partner
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-8">
            Since 1998, we've been delivering premium automotive parts and
            accessories to enthusiasts and professionals worldwide.
          </p>
          <Link to="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-widest text-base rounded-lg py-4 px-8 transition-all hover:shadow-xl hover:shadow-blue-500/50">
              START SHOPPING
            </button>
          </Link>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {STATS.map((stat, idx) => (
              <motion.div key={idx} variants={fadeUp} className="text-center">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-semibold text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-gray-50 py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 font-medium leading-relaxed">
                <p>
                  M&J Enterprises was founded in 1998 by Mahinda Hennadige, a
                  passionate automotive enthusiast with over two decades of
                  industry experience. What started as a small garage operation
                  has grown into a thriving online marketplace.
                </p>
                <p>
                  We recognized a gap in the market: customers needed access to
                  quality parts, competitive pricing, and expert advice all in
                  one place. That vision drives everything we do today.
                </p>
                <p>
                  Our commitment to excellence has earned us the trust of over
                  20,000 customers and partnerships with the world's leading
                  automotive manufacturers.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-blue-600 text-sm"
                    />
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                      Founded
                    </p>
                  </div>
                  <p className="text-2xl font-black text-gray-900">1998</p>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-cyan-500 text-sm"
                    />
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                      Location
                    </p>
                  </div>
                  <p className="text-2xl font-black text-gray-900">Matara</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${Oldstory})` }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-200 opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These principles guide every decision we make and every
              interaction with our customers.
            </p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`${value.bgColor} rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-colors duration-300 cursor-pointer`}
              >
                <div className={`text-5xl mb-4 ${value.color}`}>
                  <FontAwesomeIcon icon={value.icon} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white py-16 px-5 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-black text-gray-900 text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: faEnvelope,
                color: "text-blue-600",
                title: "Email",
                content: (
                  <a
                    href="mailto:tdhennadige@gmail.com"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    tdhennadige@gmail.com
                  </a>
                ),
              },
              {
                icon: faPhone,
                color: "text-cyan-600",
                title: "Phone",
                content: (
                  <a
                    href="tel:+94761229147"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    +94 (76) 122-9147
                  </a>
                ),
              },
              {
                icon: faMapMarkerAlt,
                color: "text-indigo-600",
                title: "Address",
                content: (
                  <p className="text-gray-600 font-medium">
                    29 Akuressa Rd, Matara,
                    <br />
                    Sri Lanka
                  </p>
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center group"
              >
                <div
                  className={`text-4xl mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                {item.content}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default transition(AboutUs);
