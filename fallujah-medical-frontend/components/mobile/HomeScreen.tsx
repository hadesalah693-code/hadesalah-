"use client";

import type { FlatRecord } from "@/types";
import { FEATURED, CLINICAL_SPECIALTIES, DOCTORS, filterRecords } from "@/lib/doctors";
import { HERO_VIDEO, PROMO_VIDEOS } from "@/lib/media";
import SearchBar from "../ui/SearchBar";
import DoctorCard from "../ui/DoctorCard";
import ClinicCard from "../ui/ClinicCard";
import SpecialtyCard from "../ui/SpecialtyCard";
import VideoBackground from "../ui/VideoBackground";
import PromoBanner, { type PromoBannerData } from "../ui/PromoBanner";
import { IconCross, IconStethoscope, IconAlert, IconPill, IconFlask, IconShield } from "../ui/Icons";

interface HomeScreenProps {
  search: string;
  onSearchChange: (v: string) => void;
  onSearchFocus?: () => void;
  onSearchEnter?: () => void;
  onDoctorOpen: (d: FlatRecord) => void;
  onDoctorBook: (d: FlatRecord) => void;
  onSpecialtySelect: (key: string) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

function doctorId(d: FlatRecord) {
  return `${d._category}:${d.name}`;
}

const QUICK = [
  { label: "أطباء",    key: "doctors",    from: "#0d9488", to: "#0f766e", Icon: IconStethoscope },
  { label: "طوارئ",   key: "emergency",  from: "#ef4444", to: "#b91c1c", Icon: IconAlert },
  { label: "صيدليات", key: "pharmacies", from: "#7c3aed", to: "#5b21b6", Icon: IconPill },
  { label: "مختبرات", key: "labs",       from: "#d97706", to: "#b45309", Icon: IconFlask },
];

const BANNERS: PromoBannerData[] = [
  {
    title: "عيادات طب الأسنان",
    sub: "تقويم • زراعة • تجميل",
    cta: "احجز الآن",
    href: "tel:+9647700000000",
    badge: "✦ مميز",
    video: PROMO_VIDEOS.dental,
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(7,89,79,0.88) 0%,rgba(13,148,136,0.72) 55%,rgba(13,148,136,0.15) 100%)",
  },
  {
    title: "استشارة طبية فورية",
    sub: "أطباء متخصصون ٢٤/٧",
    cta: "تواصل الآن",
    href: "tel:+9647700000000",
    badge: "⚡ متاح",
    video: PROMO_VIDEOS.consult,
    img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(29,78,216,0.88) 0%,rgba(79,70,229,0.72) 55%,rgba(79,70,229,0.12) 100%)",
  },
  {
    title: "أضف عيادتك",
    sub: "تواصل مع آلاف المرضى",
    cta: "سجّل مجاناً",
    href: "#contact",
    badge: "★ مجاني",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(109,40,217,0.88) 0%,rgba(139,92,246,0.72) 55%,rgba(139,92,246,0.12) 100%)",
  },
];

const STATS = [
  { n: "+٢٠٠", label: "طبيب" },
  { n: String(CLINICAL_SPECIALTIES.length), label: "تخصص" },
  { n: "٤.٨",  label: "★" },
  { n: "٢٤",   label: "ساعة" },
];

const TRUST = [
  { icon: IconShield, label: "دليل موثوق" },
  { icon: IconStethoscope, label: "+٢٠٠ طبيب" },
  { icon: IconCross, label: "مجاني ١٠٠٪" },
];

export default function HomeScreen({
  search, onSearchChange, onSearchFocus, onSearchEnter,
  onDoctorOpen, onDoctorBook, onSpecialtySelect, favorites, onToggleFavorite,
}: HomeScreenProps) {
  const topDoctors = filterRecords(DOCTORS, search, null, "doctors").slice(0, 6);
  const featured   = FEATURED.length ? FEATURED : DOCTORS.slice(0, 8);
  const nearby     = DOCTORS.filter((d) => d.address || d.clinic).slice(0, 3);
  const hour       = new Date().getHours();
  const greeting   = hour < 12 ? "صباح النور 🌅" : hour < 18 ? "مساء النور ☀️" : "مساء الخير 🌙";

  return (
    <div className="animate-fade-in">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden pb-0 lg:pb-24">
        {/* Desktop video */}
        <div className="hidden lg:block absolute inset-0">
          <VideoBackground src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} className="scale-105" />
          <div className="absolute inset-0 hero-video-overlay pointer-events-none" />
        </div>
        {/* Mobile gradient */}
        <div className="lg:hidden absolute inset-0 hero-mobile-bg" />
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle,rgba(45,212,191,0.15),transparent 70%)" }} />
        </div>

        <div className="relative page-container pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-6 lg:pt-16 lg:pb-0">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-5 lg:hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(145deg,#14b8a6,#0f766e)" }}>
                <IconCross size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-extrabold text-white text-[16px] leading-tight">دليل الفلوجة الطبي</p>
                <p className="text-teal-200/75 text-[10px] font-semibold">Fallujah Health Guide</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-100 bg-white/15 px-2.5 py-1 rounded-full border border-white/20">
              {greeting.replace(/[^\u0600-\u06FF\s]/g, "").trim()}
            </span>
          </div>

          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="lg:flex-1">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-teal-200 text-[12px] font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                {greeting}
              </span>
              <h1 className="font-display text-[24px] lg:text-[44px] font-extrabold text-white leading-tight tracking-tight">
                <span className="lg:hidden">ابحث عن </span>
                <span className="text-teal-300">طبيبك</span>
                <span className="lg:hidden"> بسهولة</span>
                <span className="hidden lg:inline"><br />في الفلوجة</span>
              </h1>
              <p className="text-teal-100/75 text-[13px] lg:text-[16px] mt-2 lg:mt-3 max-w-md hidden lg:block">
                أطباء • عيادات • صيدليات • مختبرات
              </p>

              <div className="hidden lg:flex flex-wrap gap-2 mt-4">
                {TRUST.map(({ icon: Icon, label }) => (
                  <span key={label} className="trust-pill">
                    <Icon size={13} className="text-teal-200" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="hidden lg:block mt-6 max-w-lg">
                <SearchBar value={search} onChange={onSearchChange}
                  onFocus={onSearchFocus} onEnter={onSearchEnter}
                  large placeholder="ابحث عن طبيب، تخصص، عيادة..." />
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-4 gap-2 flex-shrink-0 w-[340px]">
              {STATS.map((s) => (
                <div key={s.label}
                  className="flex flex-col items-center justify-center h-16 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <span className="font-display font-extrabold text-[16px] text-white leading-none">{s.n}</span>
                  <span className="text-teal-200 text-[10px] mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: search + stats inside hero */}
          <div className="lg:hidden mt-5 hero-mobile-panel rounded-2xl p-3 space-y-3">
            <SearchBar value={search} onChange={onSearchChange}
              onFocus={onSearchFocus} onEnter={onSearchEnter}
              large placeholder="ابحث عن طبيب، تخصص، عيادة..." />
            <div className="grid grid-cols-4 gap-1.5">
              {STATS.map((s) => (
                <div key={s.label} className="hero-stat-chip">
                  <span className="font-display font-extrabold text-[13px] text-primary-700 leading-none">{s.n}</span>
                  <span className="text-gray-400 text-[9px] font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg"
          className="relative lg:absolute lg:bottom-0 left-0 w-full pointer-events-none mt-4 lg:mt-0" preserveAspectRatio="none" style={{ height: 40 }}>
          <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f0fdf9" />
        </svg>
      </div>

      {/* Content — mobile starts right after hero wave */}
      <div className="page-container pt-4 lg:pt-0 pb-5 lg:py-8 mobile-section-gap">

        {/* Quick actions */}
        <section>
          <div className="grid grid-cols-4 gap-2 lg:gap-5">
            {QUICK.map(({ label, key, from, to, Icon }) => (
              <button key={key} type="button"
                onClick={() => onSpecialtySelect(key)}
                className="group flex flex-col items-center gap-1.5 lg:gap-2.5 transition-transform active:scale-95"
              >
                <div
                  className="w-14 h-14 lg:w-[76px] lg:h-[76px] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-md transition-all group-hover:scale-105"
                  style={{ background: `linear-gradient(145deg,${from},${to})` }}
                >
                  <Icon size={24} className="text-white lg:hidden" />
                  <Icon size={28} className="text-white hidden lg:block" />
                </div>
                <span className="text-[11px] lg:text-[13px] font-bold text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Specialties */}
        <section>
          <div className="section-head">
            <h2 className="section-title">التخصصات</h2>
            <button type="button" onClick={() => onSpecialtySelect("all")} className="section-link">الكل ←</button>
          </div>
          <div className="scroll-row lg:hidden">
            {CLINICAL_SPECIALTIES.map((s) => (
              <div key={s.key} className="flex-shrink-0 w-[72px]">
                <SpecialtyCard
                  label={s.label}
                  icon={s.icon}
                  count={s.count}
                  categoryKey={s.key}
                  img={s.img}
                  variant="photo"
                  size="sm"
                  onClick={() => onSpecialtySelect(s.key)}
                />
              </div>
            ))}
          </div>
          <div className="hidden lg:grid lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-6">
            {CLINICAL_SPECIALTIES.map((s) => (
              <SpecialtyCard
                key={s.key}
                label={s.label}
                icon={s.icon}
                count={s.count}
                categoryKey={s.key}
                img={s.img}
                variant="photo"
                onClick={() => onSpecialtySelect(s.key)}
              />
            ))}
          </div>
        </section>

        {/* Video & image banners */}
        <section>
          <div className="section-head">
            <h2 className="section-title">عروض وخدمات</h2>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">🎬 فيديو حي</span>
          </div>
          <div className="scroll-row mt-3.5 lg:mt-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:gap-5 lg:mx-0 lg:px-0">
            {BANNERS.map((b) => (
              <PromoBanner key={b.title} banner={b} />
            ))}
          </div>
        </section>

        {/* Featured doctors */}
        <section>
          <div className="section-head">
            <h2 className="section-title">أطباء مميزون</h2>
            <button type="button" onClick={() => onSpecialtySelect("doctors")} className="section-link">عرض الكل ←</button>
          </div>
          <div className="scroll-row lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:overflow-visible lg:gap-4 lg:mx-0 lg:px-0">
            {featured.map((d) => (
              <DoctorCard key={doctorId(d)} doctor={d} compact onOpen={() => onDoctorOpen(d)} />
            ))}
          </div>
        </section>

        {/* Best doctors */}
        <section>
          <div className="section-head">
            <h2 className="section-title">أفضل الأطباء</h2>
            <button type="button" onClick={() => onSpecialtySelect("doctors")} className="section-link">الكل ←</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {topDoctors.map((d) => (
              <DoctorCard key={doctorId(d)} doctor={d}
                isFavorite={favorites.has(doctorId(d))}
                onToggleFavorite={() => onToggleFavorite(doctorId(d))}
                onOpen={() => onDoctorOpen(d)} onBook={() => onDoctorBook(d)} />
            ))}
          </div>
        </section>

        <section className="hidden lg:block">
          <h2 className="section-title mb-4">عيادات قريبة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {nearby.map((d) => (
              <ClinicCard key={doctorId(d)} clinic={d} onOpen={() => onDoctorOpen(d)} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
