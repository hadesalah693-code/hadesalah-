import type { FlatRecord } from "@/types";
import { CATEGORIES } from "@/data/directory";
import { specialtyImage } from "@/lib/specialtyImages";

export const NON_CLINICAL = ["pharmacies", "labs", "medical_complexes"];

export type SpecialtyItem = {
  key: string;
  label: string;
  icon: string;
  count: number;
  color: string;
  img: string;
  clinical: boolean;
};

export const SPECIALTY_COLORS: Record<string, string> = {
  obgyn: "#6366f1", urology: "#0ea5e9", dermatology: "#f97316",
  psychiatry: "#8b5cf6", pediatrics: "#eab308", ophthalmology: "#14b8a6",
  orthopedics: "#d97706", internal_cardio: "#ef4444", neurosurgery: "#dc2626",
  general_surgery: "#22c55e", ent: "#f59e0b", dentistry: "#06b6d4",
  ultrasound_xray: "#6366f1", wound_care: "#ec4899", physiotherapy: "#059669",
  audiology: "#2563eb", pharmacies: "#84cc16", labs: "#a855f7", medical_complexes: "#0891b2",
};

export function specialtyColor(key: string) {
  return SPECIALTY_COLORS[key] ?? "#2563eb";
}

function buildSpecialtyList(clinicalOnly: boolean): SpecialtyItem[] {
  return Object.entries(CATEGORIES)
    .filter(([k]) => clinicalOnly ? !NON_CLINICAL.includes(k) : true)
    .map(([key, cat]) => ({
      key,
      label: cat.label,
      icon: cat.icon,
      count: (cat.doctors ?? cat.items ?? []).length,
      color: specialtyColor(key),
      img: specialtyImage(key),
      clinical: !NON_CLINICAL.includes(key),
    }))
    .sort((a, b) => b.count - a.count);
}

/** All medical specialties (excludes pharmacies, labs, complexes) */
export const CLINICAL_SPECIALTIES = buildSpecialtyList(true);

/** All categories including services */
export const ALL_SPECIALTIES = buildSpecialtyList(false);

export const ALL_RECORDS: FlatRecord[] = Object.entries(CATEGORIES).flatMap(([key, cat]) =>
  (cat.doctors ?? cat.items ?? []).map((doc) => ({
    ...doc,
    _category: key,
    _categoryLabel: cat.label,
    _categoryIcon: cat.icon,
  }))
);

export const DOCTORS = ALL_RECORDS.filter((r) => !NON_CLINICAL.includes(r._category));
export const CLINICS = ALL_RECORDS.filter((r) => NON_CLINICAL.includes(r._category) || r.clinic);

export const FEATURED = [...DOCTORS]
  .filter((d) => d.is_featured || d.gmap_rating)
  .sort((a, b) => (b.gmap_rating ?? 0) - (a.gmap_rating ?? 0))
  .slice(0, 8);

export const POPULAR_SPECIALTIES = CLINICAL_SPECIALTIES.slice(0, 8);

export function doctorPhone(r: FlatRecord) {
  return r.phones?.[0] ?? r.gmap_phone;
}

export function doctorRating(r: FlatRecord) {
  return r.gmap_rating ?? r.rating;
}

export function doctorReviewCount(r: FlatRecord) {
  return r.gmap_count ?? r.review_count;
}

/** Stable pseudo fee from name (for demo UI) */
export function consultationFee(r: FlatRecord): number | null {
  if (NON_CLINICAL.includes(r._category)) return null;
  let h = 0;
  for (const c of r.name) h = (h * 31 + c.charCodeAt(0)) % 1000;
  return 15000 + (h % 12) * 2500;
}

export function experienceYears(r: FlatRecord): string {
  const q = r.qualifications ?? "";
  const m = q.match(/(\d{1,2})\s*سنة|(\d{1,2})\s*عام|خبرة\s*(\d{1,2})/);
  if (m) return `${m[1] ?? m[2] ?? m[3]}+ سنوات`;
  if (q.includes("أستاذ") || q.includes("استاذ")) return "15+ سنوات";
  if (q.includes("بورد")) return "10+ سنوات";
  return "خبرة موثقة";
}

export function availabilityLabel(r: FlatRecord): string {
  if (r.days) return r.days.split(/[/،,]/)[0]?.trim() ?? "متاح";
  if (r.hours) return "اليوم";
  if (r.off) return `مغلق ${r.off}`;
  return "اتصل للمواعيد";
}

export function filterRecords(
  records: FlatRecord[],
  search: string,
  specialty: string | null,
  tab: string
): FlatRecord[] {
  let res = records;
  if (specialty) res = res.filter((r) => r._category === specialty);
  else if (tab === "doctors") res = res.filter((r) => !NON_CLINICAL.includes(r._category));
  else if (tab === "pharmacies") res = res.filter((r) => r._category === "pharmacies");
  else if (tab === "labs") res = res.filter((r) => r._category === "labs");
  else if (tab === "clinics") res = res.filter((r) => r._category === "medical_complexes");

  const q = normalizeSearchText(search);
  if (q) {
    res = res.filter((r) => recordSearchText(r).includes(q));
  }
  return [...res].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return (a.priority ?? 99) - (b.priority ?? 99);
  });
}

function normalizeSearchText(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\u0600-\u06FFa-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function recordSearchText(r: FlatRecord): string {
  return normalizeSearchText(
    [
      r.name,
      r.qualifications,
      r.clinic,
      r.address,
      r.services,
      r.notes,
      r.days,
      r.hours,
      r._categoryLabel,
      ...(r.phones ?? []),
      r.gmap_phone,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

/* Stable doctor photo from Unsplash (seeded by name) */
const MALE_PHOTOS = [
  "photo-1612349317150-e413f6a5b16d",
  "photo-1582750433449-648ed127bb54",
  "photo-1537368910025-700350fe46c7",
  "photo-1559839734-2b71ea197ec2",
  "photo-1622253692010-333f2da6031d",
  "photo-1638202993928-7267aad84c31",
  "photo-1607990281513-2c110a25bd8c",
  "photo-1594824476967-48c8b964273f",
];
const FEMALE_PHOTOS = [
  "photo-1594824476967-48c8b964273f",
  "photo-1559839734-2b71ea197ec2",
  "photo-1584467735867-4297ae2ebcee",
  "photo-1527613426441-4da17471b66d",
  "photo-1651008376811-b90baee60c1f",
  "photo-1624727828489-a1e03b79bba8",
  "photo-1614608682850-e0d6ed316d47",
];
export function doctorPhoto(r: FlatRecord): string {
  const name = r.name ?? "";
  const isFemale = name.includes("د.") && ["إيمان","لقاء","رغد","شيماء","أمل","إبتسام","سوزان","خالدة","نادية","هبة","سهى","عبير","منال","زينب","فاطمة","مريم","سارة","نور","هناء","ريم","دعاء","سحر","رنا","ميساء","روان"].some(f => name.includes(f));
  const pool = isFemale ? FEMALE_PHOTOS : MALE_PHOTOS;
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % pool.length;
  return `https://images.unsplash.com/${pool[h]}?w=200&q=80&auto=format&fit=crop&crop=face`;
}

export function generateTimeSlots(seed: string): string[] {
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "12:00", "14:00", "14:30", "15:00", "16:00", "17:00", "18:00"];
  let h = 0;
  for (const c of seed) h = (h + c.charCodeAt(0)) % 997;
  const skip = h % 4;
  return slots.filter((_, i) => i % (skip + 2) !== 0).slice(0, 8);
}

export function nextDays(count = 14): { key: string; label: string; day: string; month: string }[] {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const out = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "اليوم" : days[d.getDay()],
      day: String(d.getDate()),
      month: d.toLocaleDateString("ar-EG", { month: "short" }),
    });
  }
  return out;
}
