"use client";

import type { FlatRecord } from "@/types";
import { FEATURED, CLINICAL_SPECIALTIES, DOCTORS, filterRecords } from "@/lib/doctors";
import SearchBar from "../ui/SearchBar";
import DoctorCard from "../ui/DoctorCard";
import ClinicCard from "../ui/ClinicCard";
import SpecialtyCard from "../ui/SpecialtyCard";
import { IconCross, IconStethoscope, IconAlert, IconPill, IconFlask } from "../ui/Icons";

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

const BANNERS = [
  { title: "عيادات طب الأسنان", sub: "تقويم • زراعة • تجميل",
    cta: "احجز الآن", href: "tel:+9647700000000", badge: "✦ مميز",
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(7,89,79,0.93) 0%,rgba(13,148,136,0.80) 50%,rgba(13,148,136,0.05) 100%)" },
  { title: "استشارة طبية فورية", sub: "أطباء متخصصون ٢٤/٧",
    cta: "تواصل الآن", href: "tel:+9647700000000", badge: "⚡ متاح",
    img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(29,78,216,0.93) 0%,rgba(79,70,229,0.80) 50%,rgba(79,70,229,0.05) 100%)" },
  { title: "أضف عيادتك", sub: "تواصل مع آلاف المرضى",
    cta: "سجّل مجاناً", href: "#contact", badge: "★ مجاني",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop",
    overlay: "linear-gradient(140deg,rgba(109,40,217,0.93) 0%,rgba(139,92,246,0.80) 50%,rgba(139,92,246,0.05) 100%)" },
];

const STATS = [
  { n: "+٢٠٠", label: "طبيب" },
  { n: String(CLINICAL_SPECIALTIES.length), label: "تخصص" },
  { n: "٤.٨",  label: "★" },
  { n: "٢٤",   label: "ساعة" },
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
      <div className="relative overflow-hidden pb-14 lg:pb-24"
        style={{ background: "linear-gradient(160deg,#0a2e2a 0%,#0f766e 50%,#0d9488 100%)" }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-56 h-56 lg:w-72 lg:h-72 rounded-full"
            style={{ background: "radial-gradient(circle,rgba(45,212,191,0.18),transparent 70%)" }} />
          <div className="absolute bottom-10 -left-10 w-40 h-40 lg:w-56 lg:h-56 rounded-full"
            style={{ background: "radial-gradient(circle,rgba(250,204,21,0.10),transparent 70%)" }} />
        </div>

        <div className="relative page-container pt-[calc(0.75rem+env(safe-area-inset-top,0px))] lg:pt-16">
          {/* Mobile app bar */}
          <div className="flex items-center gap-2.5 mb-4 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <IconCross size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-extrabold text-white text-[15px] leading-tight truncate">دليل الفلوجة الطبي</p>
              <p className="text-teal-200/80 text-[10px] font-semibold tracking-wide">FALLUJAH HEALTH</p>
            </div>
          </div>

          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="lg:flex-1">
              <span className="inline-flex items-center gap-1.5 text-teal-200 text-[12px] font-semibold mb-2 lg:mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                {greeting}
              </span>
              <h1 className="font-display text-[22px] sm:text-[26px] lg:text-[44px] font-extrabold text-white leading-tight tracking-tight">
                ابحث عن طبيب<br className="lg:hidden" />
                <span className="text-teal-300"> في الفلوجة</span>
              </h1>
              <p className="text-teal-100/70 text-[13px] lg:text-[16px] mt-1.5 lg:mt-3 max-w-md">
                أطباء • عيادات • صيدليات • مختبرات
              </p>
              <div className="hidden lg:block mt-6 max-w-lg">
                <SearchBar value={search} onChange={onSearchChange}
                  onFocus={onSearchFocus} onEnter={onSearchEnter}
                  large placeholder="ابحث عن طبيب، تخصص، عيادة..." />
              </div>
            </div>

            <div className="hidden lg:block flex-shrink-0">
              <div className="relative w-[300px] h-[220px] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.40)]"
                style={{ border: "2px solid rgba(255,255,255,0.15)" }}>
                <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&q=85&auto=format&fit=crop"
                  alt="طبيب" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-3"
                  style={{ background: "linear-gradient(to top,rgba(7,89,79,0.95),transparent)" }}>
                  <p className="font-display font-bold text-white text-[13px]">+٢٠٠ طبيب متخصص</p>
                  <p className="text-teal-200 text-[11px] mt-0.5">دليل الفلوجة الطبي ✓</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {STATS.map((s) => (
                  <div key={s.label}
                    className="flex flex-col items-center justify-center flex-1 h-14 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <span className="font-display font-extrabold text-[16px] text-white leading-none">{s.n}</span>
                    <span className="text-teal-200 text-[10px] mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none" style={{ height: 48 }}>
          <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f0fdf9" />
        </svg>
      </div>

      {/* Mobile search + stats */}
      <div className="page-container -mt-7 lg:hidden space-y-2.5">
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(13,148,136,0.14)] p-2.5 border border-teal-100">
          <SearchBar value={search} onChange={onSearchChange}
            onFocus={onSearchFocus} onEnter={onSearchEnter}
            large placeholder="ابحث عن طبيب، تخصص..." />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-xl py-2 text-center shadow-[var(--shadow-soft)] border border-teal-50">
              <span className="font-display font-extrabold text-[14px] text-primary-700 block leading-none">{s.n}</span>
              <span className="text-gray-400 text-[9px] font-medium mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-5 lg:py-8 mobile-section-gap">

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

        {/* Banners */}
        <section>
          <h2 className="section-title">عروض وخدمات</h2>
          <div className="scroll-row mt-3.5 lg:mt-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:gap-5 lg:mx-0 lg:px-0">
            {BANNERS.map((b) => (
              <a key={b.title} href={b.href}
                className="flex-shrink-0 w-[calc(100vw-2.5rem)] max-w-[300px] lg:w-auto lg:max-w-none relative overflow-hidden rounded-2xl card-hover shadow-[var(--shadow-card)]"
                style={{ minHeight: 168 }}
              >
                <img src={b.img} alt={b.title}
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: b.overlay }} />
                <div className="relative z-10 p-4 h-full flex flex-col justify-end text-right">
                  <span className="self-end mb-1.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)" }}>
                    {b.badge}
                  </span>
                  <p className="font-display font-extrabold text-white text-[15px] leading-tight">{b.title}</p>
                  <p className="text-white/80 text-[11px] mt-0.5">{b.sub}</p>
                  <span className="inline-flex self-end items-center mt-2 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.22)" }}>
                    {b.cta} ←
                  </span>
                </div>
              </a>
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

        {/* Desktop-only extra sections */}
        <section className="hidden lg:block">
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
