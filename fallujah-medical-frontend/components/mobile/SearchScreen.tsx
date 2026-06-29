"use client";

import type { FlatRecord } from "@/types";
import { ALL_RECORDS, ALL_SPECIALTIES, CLINICAL_SPECIALTIES, filterRecords } from "@/lib/doctors";
import SearchBar from "../ui/SearchBar";
import DoctorCard from "../ui/DoctorCard";
import SpecialtyCard from "../ui/SpecialtyCard";
import EmptyState from "../ui/EmptyState";

interface SearchScreenProps {
  search: string;
  onSearchChange: (v: string) => void;
  onSearchEnter?: () => void;
  specialty: string | null;
  onSpecialtyChange: (key: string | null) => void;
  tab: string;
  onTabChange: (tab: string) => void;
  onDoctorOpen: (d: FlatRecord) => void;
  onDoctorBook: (d: FlatRecord) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

function doctorId(d: FlatRecord) {
  return `${d._category}:${d.name}`;
}

const TABS = [
  { id: "all", label: "الكل" },
  { id: "doctors", label: "أطباء" },
  { id: "pharmacies", label: "صيدليات" },
  { id: "labs", label: "مختبرات" },
  { id: "clinics", label: "مراكز" },
];

export default function SearchScreen({
  search, onSearchChange, onSearchEnter, specialty, onSpecialtyChange, tab, onTabChange,
  onDoctorOpen, onDoctorBook, favorites, onToggleFavorite,
}: SearchScreenProps) {
  const results = filterRecords(ALL_RECORDS, search, specialty, tab);
  const activeSpecialty = ALL_SPECIALTIES.find((s) => s.key === specialty);
  const hasQuery = search.trim().length > 0;
  const hasCategoryTab = tab !== "all";
  const showResults = hasQuery || specialty !== null || hasCategoryTab;
  const showBrowse = !showResults;

  function selectSpecialty(key: string, tabOverride?: string) {
    onSpecialtyChange(key);
    if (tabOverride) onTabChange(tabOverride);
  }

  function clearFilters() {
    onSearchChange("");
    onSpecialtyChange(null);
    onTabChange("all");
  }

  return (
    <div className="page-container pt-3 lg:pt-4 animate-fade-in pb-6">
      <h1 className="hidden lg:block font-display text-[24px] font-bold text-gray-900 mb-6">البحث</h1>

      {/* Search input — always visible */}
      <div className="mb-3">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onEnter={onSearchEnter}
          large
          placeholder="ابحث بالاسم، التخصص، العيادة، العنوان..."
        />
      </div>

      {/* Category tabs */}
      <div className="scroll-row gap-1.5 lg:flex lg:flex-wrap lg:mx-0 lg:px-0 lg:overflow-visible">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => { onTabChange(id); onSpecialtyChange(null); }}
            className={[
              "flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all",
              tab === id && !specialty ? "bg-primary-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {showResults && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[12px] font-semibold"
            >
              «{search.trim()}» <span className="text-primary-400">×</span>
            </button>
          )}
          {activeSpecialty && (
            <button
              type="button"
              onClick={() => onSpecialtyChange(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-[12px] font-semibold"
            >
              {activeSpecialty.icon} {activeSpecialty.label} <span className="text-primary-400">×</span>
            </button>
          )}
          {(hasQuery || specialty || hasCategoryTab) && (
            <button type="button" onClick={clearFilters} className="text-[12px] font-bold text-gray-500 hover:text-primary-600">
              مسح الكل
            </button>
          )}
        </div>
      )}

      {/* Browse mode — specialties only when no active search/filter */}
      {showBrowse && (
        <section className="mt-4 lg:mt-5">
          <p className="text-[13px] text-gray-500 mb-4">ابحث بالاسم أو اختر تخصصاً للبدء</p>
          <h2 className="section-title mb-3">تصفّح حسب التخصص</h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 lg:gap-x-3 lg:gap-y-5">
            {CLINICAL_SPECIALTIES.map((s) => (
              <SpecialtyCard
                key={s.key}
                label={s.label}
                icon={s.icon}
                count={s.count}
                categoryKey={s.key}
                img={s.img}
                variant="photo"
                onClick={() => selectSpecialty(s.key, "doctors")}
              />
            ))}
          </div>

          <h3 className="text-[13px] font-bold text-gray-700 mt-5 lg:mt-6 mb-3">خدمات أخرى</h3>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-5 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-5">
            {ALL_SPECIALTIES.filter((s) => !s.clinical).map((s) => (
              <SpecialtyCard
                key={s.key}
                label={s.label}
                icon={s.icon}
                count={s.count}
                categoryKey={s.key}
                img={s.img}
                variant="photo"
                onClick={() => selectSpecialty(s.key, s.key === "medical_complexes" ? "clinics" : s.key)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Results mode */}
      {showResults && (
        <>
          <p className="text-[12.5px] text-gray-500 mt-4 mb-3">
            {results.length.toLocaleString("ar-EG")} نتيجة
            {activeSpecialty ? ` — ${activeSpecialty.label}` : ""}
            {hasQuery && !activeSpecialty ? ` — «${search.trim()}»` : ""}
          </p>

          {results.length === 0 ? (
            <EmptyState
              title="لا توجد نتائج"
              description="جرّب كلمة بحث مختلفة أو امسح الفلاتر"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {results.slice(0, 80).map((d) => (
                <DoctorCard
                  key={doctorId(d)}
                  doctor={d}
                  isFavorite={favorites.has(doctorId(d))}
                  onToggleFavorite={() => onToggleFavorite(doctorId(d))}
                  onOpen={() => onDoctorOpen(d)}
                  onBook={() => onDoctorBook(d)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
