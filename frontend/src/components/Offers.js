import React, { useState } from "react";
import { Link } from "react-router-dom";
import discountImage from "../assets/Discount.jpg";
import partsImage from "../assets/Parts.jpg";
import MostSelling from "../assets/MostSelling.jpg";
import NewArrival from "../assets/BikeSideImage.jpg";

function Offers() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const OFFERS = [
    {
      id: 1,
      image: partsImage,
      type: "DEAL OF THE WEEK",
      typeColor: "#fff",
      typeBg: "rgba(230,57,70,0.15)",
      title: "Up to 40% OFF",
      sub: "Premium Braking Systems",
      description:
        "Upgrade to high-performance brake pads and rotors. Engineered for safety and durability.",
      discount: "40%",
      originalPrice: "$299",
      salePrice: "$179",
      badge: "Hot Deal",
      category: "brakes",
      validTill: "Dec 25, 2024",
      bg: "from-[#1a1a2e] to-[#2d0a0a]",
      accent: "#e63946",
      cta: "Shop Brakes",
      path: "",
    },
    {
      id: 2,
      type: "MOST SELLING",
      image: MostSelling,
      typeColor: "#FFD77A",
      typeBg: "rgba(244,162,97,0.15)",
      title: "#1 This Week",
      sub: "Engine Performance Kit",
      description:
        "Boost your engine's performance with our comprehensive tuning kit. Top-rated by professionals.",
      discount: "25%",
      originalPrice: "$499",
      salePrice: "$374",
      badge: "Best Seller",
      category: "engine",
      validTill: "Dec 28, 2024",
      bg: "from-[#1b1b1b] to-[#2d2010]",
      accent: "#FFD77A",
      cta: "View Product",
      path: "",
    },
    {
      id: 3,
      image: NewArrival,
      type: "NEW ARRIVAL",
      typeColor: "#7B7F85",
      typeBg: "#C1C4C8",
      title: "Just Dropped",
      sub: "Advanced LED Lighting",
      description:
        "Latest generation LED headlights and taillights. Energy-efficient and ultra-bright.",
      discount: "20%",
      originalPrice: "$399",
      salePrice: "$319",
      badge: "New",
      category: "lighting",
      validTill: "Dec 30, 2024",
      bg: "from-[#023e8a] to-[#03045e]",
      accent: "#FFF8E7",
      cta: "Explore Now",
      path: "",
    },
    {
      id: 4,
      image: discountImage,
      type: "RECOMMENDATION",
      typeColor: "#C1C4C8",
      typeBg: "#2B2E33",
      title: "Top Rated",
      sub: "Suspension Upgrade Kit",
      description:
        "Complete suspension overhaul kit. Improve handling and comfort with premium components.",
      discount: "35%",
      originalPrice: "$799",
      salePrice: "$519",
      badge: "Recommended",
      category: "suspension",
      validTill: "Dec 26, 2024",
      bg: "from-[#0a1a0a] to-[#1a2e1a]",
      accent: "#7B7F85",
      cta: "Shop Now",
      path: "",
    },
    {
      id: 5,
      image: partsImage,
      type: "LIMITED TIME",
      typeColor: "#fff",
      typeBg: "rgba(230,57,70,0.15)",
      title: "Flash Sale",
      sub: "Exhaust System Bundle",
      description:
        "Complete exhaust system with advanced sound dampening technology. Limited stock available.",
      discount: "45%",
      originalPrice: "$599",
      salePrice: "$329",
      badge: "Flash Sale",
      category: "exhaust",
      validTill: "Dec 22, 2024",
      bg: "from-[#2d0a0a] to-[#1a1a2e]",
      accent: "#e63946",
      cta: "Buy Now",
      path: "",
    },
    {
      id: 6,
      image: MostSelling,
      type: "EXCLUSIVE",
      typeColor: "#FFD77A",
      typeBg: "rgba(244,162,97,0.15)",
      title: "VIP Only",
      sub: "Premium Wheel Sets",
      description:
        "Exclusive alloy wheels designed for style and performance. Members-only pricing available.",
      discount: "30%",
      originalPrice: "$1299",
      salePrice: "$909",
      badge: "Exclusive",
      category: "wheels",
      validTill: "Dec 31, 2024",
      bg: "from-[#2d2010] to-[#1b1b1b]",
      accent: "#FFD77A",
      cta: "Join Now",
      path: "",
    },
  ];

  const FILTERS = [
    { id: "all", label: "All Deals" },
    { id: "brakes", label: "Brakes" },
    { id: "engine", label: "Engine" },
    { id: "lighting", label: "Lighting" },
    { id: "suspension", label: "Suspension" },
    { id: "exhaust", label: "Exhaust" },
    { id: "wheels", label: "Wheels" },
  ];

  const filteredOffers =
    selectedFilter === "all"
      ? OFFERS
      : OFFERS.filter((offer) => offer.category === selectedFilter);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-blue-900 py-20 px-5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            M&J Offers & Deals
          </h1>
          <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto mb-8">
            Save big on premium automotive parts and accessories. Limited-time
            offers you won't want to miss.
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
            <span className="text-white font-bold">
              Deals updated daily - Check back often!
            </span>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white sticky top-0 z-20 shadow-sm py-6 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-2.5 rounded-full font-bold tracking-wide transition-all duration-200 text-sm uppercase ${
                  selectedFilter === filter.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Showing {filteredOffers.length} offer{filteredOffers.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Link
              key={offer.id}
              to={offer.path}
              className="group relative rounded-2xl overflow-hidden cursor-pointer no-underline transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div
                className="relative min-h-[380px] flex flex-col justify-between p-6 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 rounded-2xl" />

                <div className="relative z-10 flex items-start justify-between">
                  <span
                    className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full uppercase backdrop-blur-sm"
                    style={{ color: offer.typeColor, background: offer.typeBg }}
                  >
                    {offer.type}
                  </span>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-white/90 backdrop-blur-sm bg-black/30 px-2.5 py-1 rounded-full">
                      {offer.badge}
                    </span>
                    <span className="text-xs font-extrabold text-white bg-red-600 px-2.5 py-1 rounded-full">
                      -{offer.discount}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 space-y-3">
                  <div>
                    <div
                      className="font-black text-3xl leading-none mb-1 drop-shadow"
                      style={{ color: offer.accent }}
                    >
                      {offer.title}
                    </div>
                    <p className="text-white/90 text-sm font-semibold drop-shadow">
                      {offer.sub}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-xs font-medium leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-2xl font-black text-white">
                      {offer.salePrice}
                    </span>
                    <span className="text-sm font-semibold text-white/60 line-through">
                      {offer.originalPrice}
                    </span>
                  </div>

                  {/* Valid Till */}
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest pt-1">
                    Valid till {offer.validTill}
                  </p>

                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase py-2 px-4 rounded-lg transition-all group-hover:gap-2.5 backdrop-blur-sm mt-3"
                    style={{ background: offer.typeBg, color: offer.accent }}
                  >
                    {offer.cta}
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              No Offers Found
            </h3>
            <p className="text-gray-600 font-medium mb-8">
              Try selecting a different category
            </p>
            <button
              onClick={() => setSelectedFilter("all")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold tracking-widest text-sm rounded-lg py-3 px-6 transition-colors"
            >
              VIEW ALL DEALS
            </button>
          </div>
        )}
      </section>

      {/* Additional Info Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Why Shop Our Deals?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                Guaranteed Authenticity
              </h3>
              <p className="text-gray-300 font-medium">
                All products are 100% genuine and directly from manufacturers.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fast & Free Shipping
              </h3>
              <p className="text-gray-300 font-medium">
                Free shipping on orders over $50. Express options available.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                100% Money Back
              </h3>
              <p className="text-gray-300 font-medium">
                Not satisfied? Full refund within 30 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Offers;