"use client";

import type { FlatRecord } from "@/types";
import {
  specialtyColor, doctorPhone, doctorRating, doctorReviewCount,
  consultationFee, availabilityLabel,
} from "@/lib/doctors";
import RatingWidget from "./RatingWidget";
import { IconHeart, IconMapPin, IconClock, IconPhone } from "./Icons";

interface DoctorCardProps {
  doctor: FlatRecord;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBook?: () => void;
  onOpen?: () => void;
  compact?: boolean;
}

export default function DoctorCard({
  doctor, isFavorite, onToggleFavorite, onBook, onOpen, compact,
}: DoctorCardProps) {
  const color   = specialtyColor(doctor._category);
  const fee     = consultationFee(doctor);
  const rating  = doctorRating(doctor);
  const reviews = doctorReviewCount(doctor);
  const phone   = doctorPhone(doctor);
  const avail   = availabilityLabel(doctor);
  const initial = doctor.name.replace(/^د\.?\s*/, "").charAt(0);

  /* ── Compact card (featured scroll) ──────────────────── */
  if (compact) {
    return (
      <button type="button" onClick={onOpen}
        className="flex-shrink-0 w-[132px] sm:w-[140px] lg:w-full bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden text-right group transition-all duration-200 hover:shadow-[var(--shadow-card)] active:scale-[0.97]"
      >
        {/* Gradient header with big initial */}
        <div className="h-[80px] lg:h-[88px] relative flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(145deg,${color}ee 0%,${color}77 100%)` }}>
          <span className="absolute text-[64px] font-display font-extrabold text-white/10 leading-none select-none top-1">
            {initial}
          </span>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white font-display font-extrabold text-[22px] shadow-lg z-10">
            {initial}
          </div>
          <span className="absolute bottom-2 right-2 text-[9px] font-bold text-white px-2 py-0.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.25)" }}>
            {doctor._categoryLabel}
          </span>
        </div>

        <div className="p-3">
          <p className="font-display font-bold text-[13px] text-gray-900 line-clamp-1">{doctor.name}</p>
          {rating
            ? <div className="mt-1.5"><RatingWidget rating={rating} count={reviews} /></div>
            : <p className="text-[11px] text-gray-400 mt-1">جديد</p>
          }
          {fee && (
            <p className="text-[11.5px] font-extrabold mt-2" style={{ color }}>
              {fee.toLocaleString("ar-EG")} <span className="font-normal text-gray-400 text-[10px]">د.ع</span>
            </p>
          )}
        </div>
      </button>
    );
  }

  /* ── Full card ──────────────────────────────────────────── */
  return (
    <article className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-card)] animate-fade-in-up">
      <div className="p-4">
        <div className="flex gap-3.5 items-start">

          {/* Avatar */}
          <button type="button" onClick={onOpen} className="flex-shrink-0">
            <div
              className="w-[64px] h-[64px] rounded-2xl flex items-center justify-center text-white font-display font-extrabold text-[26px] shadow-md relative"
              style={{ background: `linear-gradient(145deg,${color},${color}99)` }}
            >
              {initial}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <button type="button" onClick={onOpen} className="text-right flex-1 min-w-0">
                <h3 className="font-display font-bold text-[15px] text-gray-900 leading-snug line-clamp-1">
                  {doctor.name}
                </h3>
                <p className="text-[12px] font-bold mt-0.5" style={{ color }}>
                  {doctor._categoryLabel}
                </p>
              </button>

              {onToggleFavorite && (
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isFavorite ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-300 hover:text-red-400"
                  }`}
                >
                  <IconHeart size={16} filled={isFavorite} />
                </button>
              )}
            </div>

            {rating && (
              <div className="mt-1.5"><RatingWidget rating={rating} count={reviews} /></div>
            )}

            {(doctor.clinic || doctor.address) && (
              <p className="text-[11.5px] text-gray-500 mt-1.5 line-clamp-1 flex items-center gap-1">
                <IconMapPin size={12} className="text-gray-400 flex-shrink-0" />
                {doctor.clinic ?? doctor.address}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              <span className="chip bg-emerald-50 text-emerald-700 text-[11px]">
                <IconClock size={11} />
                {avail}
              </span>
              {fee && (
                <span className="text-[13px] font-extrabold text-gray-900">
                  {fee.toLocaleString("ar-EG")}
                  <span className="text-[10px] font-normal text-gray-400"> د.ع</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onBook ?? onOpen}
            className="flex-1 h-10 rounded-xl text-white text-[13px] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg,#0d9488,#0f766e)`, boxShadow: "0 4px 14px rgba(13,148,136,0.30)" }}
          >
            احجز الآن
          </button>
          {phone && (
            <a href={`tel:${phone}`}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <IconPhone size={17} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
