"use client";

import type { FlatRecord } from "@/types";
import {
  doctorPhone, doctorRating, doctorReviewCount, specialtyColor,
  consultationFee, experienceYears, availabilityLabel,
} from "@/lib/doctors";
import Button from "../ui/Button";
import RatingWidget from "../ui/RatingWidget";
import { IconPhone, IconWhatsApp, IconMapPin, IconClock, IconHeart, IconChevron, IconX } from "../ui/Icons";

interface DoctorDetailViewProps {
  doctor: FlatRecord;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose: () => void;
  onBook: () => void;
}

export default function DoctorDetailView({ doctor, isFavorite, onToggleFavorite, onClose, onBook }: DoctorDetailViewProps) {
  const color = specialtyColor(doctor._category);
  const initial = doctor.name.replace(/^د\.?\s*/, "").charAt(0);
  const phone = doctorPhone(doctor);
  const rating = doctorRating(doctor);
  const reviews = doctorReviewCount(doctor);
  const fee = consultationFee(doctor);

  const sections = [
    { title: "نبذة", content: doctor.qualifications ?? doctor.services ?? `طبيب متخصص في ${doctor._categoryLabel}` },
    { title: "الخبرة", content: experienceYears(doctor) + (doctor.services ? ` — ${doctor.services}` : "") },
    { title: "المؤهلات", content: doctor.qualifications },
    { title: "الخدمات", content: doctor.services },
  ].filter((s) => s.content);

  const reviewsMock = rating ? [
    { name: "مريض", text: "طبيب ممتاز وخدمة رائعة", stars: 5 },
    { name: "مراجع", text: "تجربة جيدة وأنصح به", stars: rating >= 4.5 ? 5 : 4 },
  ] : [];

  return (
    <div className="fixed inset-0 z-[250] flex items-end lg:items-center justify-center lg:p-4">
      <div className="absolute inset-0 bg-gray-900/55 animate-fade-in" onClick={onClose} aria-hidden />

      <div className="modal-panel relative animate-slide-up lg:animate-scale-in safe-bottom">
        {/* Header */}
        <div
          className="flex-shrink-0 px-4 pt-4 pb-4 text-white"
          style={{ background: `linear-gradient(160deg, ${color} 0%, ${color}dd 100%)` }}
        >
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <IconChevron dir="left" size={22} />
            </button>
            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button type="button" onClick={onToggleFavorite}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <IconHeart size={20} filled={isFavorite} className={isFavorite ? "text-red-300" : "text-white"} />
                </button>
              )}
              <button type="button" onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white lg:hidden">
                <IconX size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-[28px] font-display font-extrabold text-white flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)" }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[18px] font-bold leading-snug text-white">{doctor.name}</h1>
              <p className="text-white/90 text-[13px] font-medium mt-1">{doctor._categoryLabel}</p>
              {rating && (
                <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                  <RatingWidget rating={rating} count={reviews} size="sm" light />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="modal-panel-body bg-white px-4 py-5">
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "الخبرة", val: experienceYears(doctor).replace(" سنوات", "") },
              { label: "التقييم", val: rating?.toFixed(1) ?? "—" },
              { label: "الكشف", val: fee ? `${(fee / 1000).toFixed(0)}k` : "—" },
            ].map(({ label, val }) => (
              <div key={label} className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="font-display font-bold text-[15px] text-gray-900">{val}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-primary-50 rounded-[var(--radius-card)] p-4 mb-5 border border-primary-100">
            <h3 className="font-display font-bold text-[14px] text-gray-900 mb-2">معلومات العيادة</h3>
            {doctor.clinic && <InfoRow icon={<IconMapPin size={16} />} text={doctor.clinic} />}
            {doctor.address && <InfoRow icon={<IconMapPin size={16} />} text={doctor.address} sub />}
            <InfoRow icon={<IconClock size={16} />} text={availabilityLabel(doctor)} />
            {doctor.hours && <InfoRow icon={<IconClock size={16} />} text={doctor.hours} sub />}
            {doctor.days && <InfoRow icon={<IconClock size={16} />} text={doctor.days} sub />}
            {!doctor.clinic && !doctor.address && !doctor.hours && (
              <p className="text-[13px] text-gray-500">لا توجد معلومات إضافية للعيادة</p>
            )}
          </div>

          {sections.map(({ title, content }) => (
            <div key={title} className="mb-5">
              <h3 className="font-display font-bold text-[14px] text-gray-900 mb-2">{title}</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}

          {reviewsMock.length > 0 && (
            <div className="mb-2">
              <h3 className="font-display font-bold text-[14px] text-gray-900 mb-3">آراء المرضى</h3>
              <div className="space-y-2">
                {reviewsMock.map((r, i) => (
                  <div key={i} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-semibold text-gray-800">{r.name}</span>
                      <span className="text-amber-400 text-[12px]">{"★".repeat(r.stars)}</span>
                    </div>
                    <p className="text-[12.5px] text-gray-500">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="modal-panel-footer px-4 py-3 safe-bottom lg:rounded-b-2xl">
          <Button full size="lg" onClick={onBook}>احجز موعد</Button>
          <div className="flex gap-2 mt-2">
            {phone && (
              <Button variant="outline" full size="md" onClick={() => { window.location.href = `tel:${phone}`; }}>
                <IconPhone size={16} /> اتصال
              </Button>
            )}
            {phone && (
              <Button variant="success" full size="md"
                onClick={() => window.open(`https://wa.me/964${phone.replace(/^0/, "")}`, "_blank")}>
                <IconWhatsApp size={16} /> WhatsApp
              </Button>
            )}
            {doctor.gps && (
              <Button variant="outline" size="md"
                onClick={() => window.open(`https://maps.google.com/?q=${doctor.gps!.lat},${doctor.gps!.lng}`, "_blank")}>
                <IconMapPin size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, text, sub }: { icon: React.ReactNode; text: string; sub?: boolean }) {
  return (
    <div className={`flex items-start gap-2 ${sub ? "mt-1.5 mr-6" : "mt-2 first:mt-0"}`}>
      <span className="text-primary-500 mt-0.5 flex-shrink-0">{icon}</span>
      <span className={`text-[13px] leading-relaxed ${sub ? "text-gray-500" : "text-gray-700 font-medium"}`}>{text}</span>
    </div>
  );
}
