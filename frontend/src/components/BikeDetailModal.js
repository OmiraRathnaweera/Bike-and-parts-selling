import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faTag,
  faBolt,
  faFire,
  faGasPump,
  faGears,
  faShieldHalved,
  faRoad,
  faWeight,
  faRuler,
  faCar,
  faCircleCheck,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faMotorcycle,
  faCartShopping,
  faPhoneVolume,
  faPalette,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { formatPrice, getDiscount } from "../data/BIKES_DATA";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => {
          const full = rating >= s;
          const half = !full && rating >= s - 0.5;
          return (
            <FontAwesomeIcon
              key={s}
              icon={full ? faStar : half ? faStarHalfAlt : faStarEmpty}
              className={`text-sm ${full || half ? "text-amber-400" : "text-gray-300"}`}
            />
          );
        })}
      </div>
      <span className="font-bold text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">({count} reviews)</span>
    </div>
  );
}

function BikeDetailModal({ bike, onClose, onEnquire }) {
  const [imgIdx,         setImgIdx]         = useState(0);
  const [activeTab,      setActiveTab]       = useState("specs");
  const [selectedColor,  setSelectedColor]   = useState(0);

  const discount  = getDiscount(bike.price, bike.originalPrice);
  const gallery   = bike.gallery?.length ? bike.gallery : [bike.image];

  const prevImg = () => setImgIdx((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const nextImg = () => setImgIdx((i) => (i === gallery.length - 1 ? 0 : i + 1));

  const TABS = [
    { id: "specs",    label: "Specifications", icon: faListCheck  },
    { id: "engine",   label: "Engine",         icon: faGears      },
    { id: "features", label: "Features",       icon: faCircleCheck},
  ];

  const specRows = [
    { icon: faGasPump,     label: "Fuel Capacity / Range",  value: bike.specs.fuelCapacity  },
    { icon: faRoad,        label: "Mileage",                value: bike.specs.mileage       },
    { icon: faWeight,      label: "Kerb Weight",            value: bike.specs.kerbWeight    },
    { icon: faRuler,       label: "Wheelbase",              value: bike.specs.wheelbase     },
    { icon: faCar,         label: "Ground Clearance",       value: bike.specs.groundClearance},
    { icon: faMotorcycle,  label: "Seat Height",            value: bike.specs.seatHeight    },
    { icon: faShieldHalved,label: "Front Brake",            value: bike.specs.brakeFront    },
    { icon: faShieldHalved,label: "Rear Brake",             value: bike.specs.brakeRear     },
    { icon: faRoad,        label: "Front Tyre",             value: bike.specs.tyresFront    },
    { icon: faRoad,        label: "Rear Tyre",              value: bike.specs.tyresRear     },
  ];

  const engineRows = [
    { label: "Displacement",  value: bike.engine.displacement },
    { label: "Engine Type",   value: bike.engine.type         },
    { label: "Max Power",     value: bike.engine.maxPower     },
    { label: "Max Torque",    value: bike.engine.maxTorque    },
    { label: "Gearbox",       value: bike.engine.gearbox      },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">

        {/* ── Modal header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faMotorcycle} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg leading-tight">
                Hero {bike.name}
              </h2>
              <p className="text-xs text-gray-400 italic">{bike.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bike.isNew && (
              <span className="hidden sm:flex bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="text-[10px]" /> NEW
              </span>
            )}
            {bike.isBestseller && (
              <span className="hidden sm:flex bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full items-center gap-1">
                <FontAwesomeIcon icon={faFire} className="text-[10px]" /> BESTSELLER
              </span>
            )}
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Left: image gallery + price ── */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">

              {/* Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] mb-4 group">
                <img
                  src={gallery[imgIdx]}
                  alt={`Hero ${bike.name}`}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600&q=80";
                  }}
                />

                {/* Nav arrows */}
                {gallery.length > 1 && (
                  <>
                    <button onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-all">
                      <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                    </button>
                    <button onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-all">
                      <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {gallery.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white w-5" : "bg-white/50 hover:bg-white/70"}`} />
                      ))}
                    </div>
                  </>
                )}

                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {bike.category === "Electric" && (
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <FontAwesomeIcon icon={faBolt} /> ELECTRIC
                    </span>
                  )}
                  {discount && (
                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <FontAwesomeIcon icon={faTag} /> {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Stock warning */}
                {bike.inStock && bike.stockCount <= 5 && (
                  <span className="absolute bottom-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Only {bike.stockCount} left
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {gallery.length > 1 && (
                <div className="flex gap-2 mb-4">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0
                        ${i === imgIdx ? "border-blue-500" : "border-gray-200 opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600&q=80"; }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Price block */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Price (Ex-showroom)</p>
                    <p className="font-extrabold text-gray-900 text-3xl leading-none">{formatPrice(bike.price)}</p>
                    {bike.originalPrice && (
                      <p className="text-sm text-gray-400 line-through mt-1">{formatPrice(bike.originalPrice)}</p>
                    )}
                  </div>
                  {discount && (
                    <div className="bg-red-600 text-white text-center rounded-xl px-3 py-2">
                      <p className="font-extrabold text-xl leading-none">{discount}%</p>
                      <p className="text-[10px] font-bold">OFF</p>
                    </div>
                  )}
                </div>

                <StarRating rating={bike.rating} count={bike.reviews} />

                <div className="flex items-center gap-2 mt-3 text-xs text-blue-700">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  <span className="font-semibold">Warranty: {bike.warranty}</span>
                </div>
              </div>

              {/* Colour picker */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faPalette} className="text-gray-400 text-sm" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Colour: <span className="text-gray-800 normal-case tracking-normal font-extrabold">{bike.colorNames[selectedColor]}</span>
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {bike.colors.map((c, i) => (
                    <button key={i} title={bike.colorNames[i]} onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm
                        ${selectedColor === i ? "border-blue-500 scale-125" : "border-white hover:scale-110"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  onClick={() => onEnquire?.(bike)}
                  disabled={!bike.inStock}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold tracking-wide py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faCartShopping} />
                  {bike.inStock ? "Enquire / Book Now" : "Out of Stock"}
                </button>
                <button className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faPhoneVolume} />
                  Contact Dealer
                </button>
              </div>
            </div>

            {/* ── Right: specs tabs ── */}
            <div className="p-6">

              {/* Tab bar */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg transition-all
                      ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <FontAwesomeIcon icon={tab.icon} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Specs tab */}
              {activeTab === "specs" && (
                <div className="space-y-2">
                  {specRows.map((row) => (
                    <div key={row.label}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5 font-medium">
                        <FontAwesomeIcon icon={row.icon} className="text-blue-300 w-4 text-xs" />
                        {row.label}
                      </span>
                      <span className="text-sm font-extrabold text-gray-800">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Engine tab */}
              {activeTab === "engine" && (
                <div className="space-y-2">
                  {engineRows.map((row) => (
                    <div key={row.label}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">{row.label}</span>
                      <span className="text-sm font-extrabold text-gray-800 sm:text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}

                  {/* Engine visual card */}
                  <div className="mt-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <FontAwesomeIcon icon={faGears} className="text-blue-400 text-lg" />
                      <p className="font-extrabold text-sm tracking-wide">PERFORMANCE</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-2xl font-extrabold text-white leading-none">{bike.engine.maxPower.split("@")[0].trim()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Peak Power</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-white leading-none">{bike.engine.maxTorque.split("@")[0].trim()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Peak Torque</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features tab */}
              {activeTab === "features" && (
                <div className="space-y-2">
                  {bike.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{f}</span>
                    </div>
                  ))}

                  {/* Category-specific callout */}
                  {bike.category === "Electric" && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faBolt} className="text-emerald-600" />
                        <p className="font-extrabold text-emerald-700 text-sm">Zero Emission · Zero Fuel Cost</p>
                      </div>
                      <p className="text-xs text-emerald-600 leading-relaxed">
                        This electric model produces zero tailpipe emissions. Charging costs are a fraction of petrol equivalent.
                      </p>
                    </div>
                  )}
                  {bike.category === "Adventure" && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faRoad} className="text-amber-600" />
                        <p className="font-extrabold text-amber-700 text-sm">Off-Road Ready</p>
                      </div>
                      <p className="text-xs text-amber-600 leading-relaxed">
                        High ground clearance and long-travel suspension make this bike ready for any terrain.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FontAwesomeIcon icon={faShieldHalved} className="text-blue-400" />
            <span>Authorised Hero dealership · All prices ex-showroom</span>
          </div>
          <button onClick={onClose}
            className="border border-gray-200 text-gray-700 font-bold text-sm rounded-xl px-5 py-2 hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BikeDetailModal;