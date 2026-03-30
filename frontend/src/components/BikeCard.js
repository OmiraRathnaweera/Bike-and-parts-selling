import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalfAlt,
  faTag,
  faBolt,
  faFire,
  faStar,
  faCircleXmark,
  faGasPump,
  faGears,
  faShieldHalved,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { formatPrice, getDiscount } from "../data/BIKES_DATA";

// ── Star rating renderer ───────────────────────────────────────────────────────
function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => {
          const full = rating >= s;
          const half = !full && rating >= s - 0.5;
          return (
            <FontAwesomeIcon
              key={s}
              icon={full ? faStar : half ? faStarHalfAlt : faStarEmpty}
              className={`text-xs ${full || half ? "text-amber-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>
      <span className="text-xs text-gray-400 font-medium">({count})</span>
    </div>
  );
}

// ── Bike Card ──────────────────────────────────────────────────────────────────
function BikeCard({ bike, onViewDetails }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const discount = getDiscount(bike.price, bike.originalPrice);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col
        ${!bike.inStock ? "opacity-75" : "border-gray-200"}`}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3]">
        <img
          src={bike.image}
          alt={`Hero ${bike.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600&q=80";
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {bike.isNew && (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <FontAwesomeIcon icon={faStar} className="text-[10px]" />
              NEW
            </span>
          )}
          {bike.isBestseller && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <FontAwesomeIcon icon={faFire} className="text-[10px]" />
              BESTSELLER
            </span>
          )}
          {bike.category === "Electric" && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <FontAwesomeIcon icon={faBolt} className="text-[10px]" />
              ELECTRIC
            </span>
          )}
          {discount && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <FontAwesomeIcon icon={faTag} className="text-[10px]" />
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Out of stock */}
        {!bike.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-extrabold text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <FontAwesomeIcon icon={faCircleXmark} className="text-red-500" />
              Out of Stock
            </span>
          </div>
        )}

        {/* Stock count */}
        {bike.inStock && bike.stockCount <= 5 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Only {bike.stockCount} left
            </span>
          </div>
        )}

        {/* Category chip */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {bike.category}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Name + tagline */}
        <div>
          <h3 className="font-extrabold text-gray-900 text-lg leading-tight tracking-tight">
            Hero {bike.name}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5 italic">{bike.tagline}</p>
        </div>

        {/* Rating */}
        <StarRating rating={bike.rating} count={bike.reviews} />

        {/* Quick specs row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: faGasPump, label: bike.specs.mileage,     title: "Mileage"  },
            { icon: faGears,   label: bike.engine.displacement, title: "Engine"  },
            { icon: faShieldHalved, label: bike.warranty.split("/")[0].trim(), title: "Warranty" },
          ].map((s) => (
            <div key={s.title} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
              <FontAwesomeIcon icon={s.icon} className="text-blue-400 text-xs mb-1" />
              <p className="text-[10px] font-extrabold text-gray-700 leading-tight">{s.label}</p>
              <p className="text-[9px] text-gray-400 font-medium">{s.title}</p>
            </div>
          ))}
        </div>

        {/* Color swatches */}
        {bike.colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium shrink-0">Colour:</span>
            <div className="flex gap-1.5 flex-wrap">
              {bike.colors.map((c, i) => (
                <button
                  key={i}
                  title={bike.colorNames[i]}
                  onClick={() => setSelectedColorIdx(i)}
                  className={`w-5 h-5 rounded-full border-2 transition-all
                    ${selectedColorIdx === i
                      ? "border-blue-500 scale-125 shadow-md"
                      : "border-transparent hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium truncate">
              {bike.colorNames[selectedColorIdx]}
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="font-extrabold text-gray-900 text-xl leading-none">
              {formatPrice(bike.price)}
            </p>
            {bike.originalPrice && (
              <p className="text-xs text-gray-400 line-through mt-0.5">
                {formatPrice(bike.originalPrice)}
              </p>
            )}
          </div>

          <button
            onClick={() => onViewDetails(bike)}
            disabled={!bike.inStock}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 hover:gap-2.5"
          >
            View Details
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BikeCard;