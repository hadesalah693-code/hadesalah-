"use client";

import { useState, useEffect, useCallback } from "react";
import type { FlatRecord } from "@/types";
import { DOCTORS } from "@/lib/doctors";
import BottomNav, { type TabId } from "./BottomNav";
import DesktopNav from "./DesktopNav";
import MobileHeader from "./MobileHeader";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import DoctorDetailView from "./DoctorDetailView";
import BookingFlow from "./BookingFlow";
import AppointmentCard from "../ui/AppointmentCard";
import DoctorCard from "../ui/DoctorCard";
import EmptyState from "../ui/EmptyState";
import { HomeSkeleton } from "../ui/Skeleton";
import { IconUser, IconBookmark } from "../ui/Icons";

function doctorId(d: FlatRecord) {
  return `${d._category}:${d.name}`;
}

function loadFavorites(): Set<string> {
  try {
    const raw: string[] = JSON.parse(localStorage.getItem("daleelFavorites") || "[]");
    return new Set(raw);
  } catch { return new Set(); }
}

function saveFavorites(fav: Set<string>) {
  localStorage.setItem("daleelFavorites", JSON.stringify([...fav]));
}

interface Appt { doctor: string; specialty: string; date: string; time: string; created: string; }

export default function MobileApp() {
  const [ready, setReady]           = useState(false);
  const [tab, setTab]               = useState<TabId>("home");
  const [search, setSearch]         = useState("");
  const [specialty, setSpecialty]   = useState<string | null>(null);
  const [searchTab, setSearchTab]   = useState("all");
  const [favorites, setFavorites]   = useState<Set<string>>(new Set());
  const [appointments, setAppts]    = useState<Appt[]>([]);
  const [selected, setSelected]     = useState<FlatRecord | null>(null);
  const [booking, setBooking]       = useState<FlatRecord | null>(null);

  useEffect(() => {
    setFavorites(loadFavorites());
    try {
      setAppts(JSON.parse(localStorage.getItem("daleelAppointments") || "[]"));
    } catch {}
    setReady(true);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavorites(next);
      return next;
    });
  }, []);

  const openDoctor = useCallback((d: FlatRecord) => setSelected(d), []);
  const startBook  = useCallback((d: FlatRecord) => { setSelected(null); setBooking(d); }, []);

  const pickSpecialty = useCallback((key: string) => {
    const tabMap: Record<string, string> = {
      all: "all",
      doctors: "doctors",
      pharmacies: "pharmacies",
      labs: "labs",
      clinics: "medical_complexes",
      emergency: "doctors",
    };
    if (key in tabMap) {
      setSpecialty(null);
      setSearchTab(tabMap[key]);
      setTab("search");
      return;
    }
    setSpecialty(key);
    setSearchTab("doctors");
    setTab("search");
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    if (v.trim()) setTab("search");
  }, []);

  const goToSearch = useCallback(() => setTab("search"), []);

  const handleBottomNav = useCallback((next: TabId) => {
    setTab(next);
    if (next === "search" && !search.trim() && !specialty) {
      setSearchTab("all");
    }
  }, [search, specialty]);

  const favDoctors = DOCTORS.filter((d) => favorites.has(doctorId(d)));

  if (!ready) {
    return (
      <div className="app-shell">
        <HomeSkeleton />
      </div>
    );
  }

  return (
    <div className="app-shell min-h-dvh bg-gray-50 lg:bg-transparent">
      <DesktopNav active={tab} onChange={setTab} search={search} onSearchChange={handleSearchChange} onSearchEnter={goToSearch} />
      <MobileHeader active={tab} onHome={() => setTab("home")} />

      <main className="main-content min-h-dvh">
        {tab === "home" && (
          <HomeScreen
            search={search}
            onSearchChange={handleSearchChange}
            onSearchFocus={() => setTab("search")}
            onSearchEnter={() => setTab("search")}
            onDoctorOpen={openDoctor}
            onDoctorBook={startBook}
            onSpecialtySelect={pickSpecialty}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {tab === "search" && (
          <SearchScreen
            search={search}
            onSearchChange={handleSearchChange}
            onSearchEnter={goToSearch}
            specialty={specialty}
            onSpecialtyChange={setSpecialty}
            tab={searchTab}
            onTabChange={setSearchTab}
            onDoctorOpen={openDoctor}
            onDoctorBook={startBook}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {tab === "appointments" && (
          <div className="page-container pt-3 lg:pt-4 animate-fade-in">
            <h1 className="hidden lg:block font-display text-[24px] font-bold text-gray-900 mb-6">مواعيدي</h1>
            {appointments.length === 0 ? (
              <EmptyState
                title="لا توجد مواعيد"
                description="احجز موعداً مع طبيبك المفضل وسيظهر هنا"
                icon={<IconUser size={28} />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {appointments.map((a, i) => (
                  <AppointmentCard
                    key={i}
                    date={a.date}
                    time={a.time}
                    doctorName={a.doctor}
                    specialty={a.specialty}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "favorites" && (
          <div className="page-container pt-3 lg:pt-4 animate-fade-in">
            <h1 className="hidden lg:block font-display text-[24px] font-bold text-gray-900 mb-6">المفضلة</h1>
            {favDoctors.length === 0 ? (
              <EmptyState
                title="قائمة فارغة"
                description="اضغط على ♥ لحفظ أطبائك المفضلين"
                icon={<IconBookmark size={28} />}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {favDoctors.map((d) => (
                  <DoctorCard
                    key={doctorId(d)}
                    doctor={d}
                    isFavorite
                    onToggleFavorite={() => toggleFavorite(doctorId(d))}
                    onOpen={() => openDoctor(d)}
                    onBook={() => startBook(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="page-container pt-3 lg:pt-4 animate-fade-in max-w-2xl">
            <h1 className="hidden lg:block font-display text-[24px] font-bold text-gray-900 mb-6">حسابي</h1>
            <div className="bg-white rounded-[var(--radius-card)] border border-gray-100 shadow-[var(--shadow-soft)] p-5 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
                <IconUser size={32} />
              </div>
              <p className="font-display font-bold text-[16px] text-gray-900">مرحباً بك</p>
              <p className="text-[13px] text-gray-500 mt-1">دليل الفلوجة الطبي</p>
            </div>
            <div className="bg-white rounded-[var(--radius-card)] border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {[
                { label: "مواعيدي", val: String(appointments.length), action: () => setTab("appointments") },
                { label: "المفضلة", val: String(favorites.size), action: () => setTab("favorites") },
                { label: "تواصل معنا", val: "", action: () => { window.location.hash = "contact"; } },
                { label: "أضف عيادتك", val: "", action: () => { window.location.hash = "contact"; } },
              ].map(({ label, val, action }) => (
                <button key={label} type="button" onClick={action} className="w-full flex items-center justify-between px-4 py-3.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>{label}</span>
                  {val && <span className="text-[12px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{val}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-6">دليل الفلوجة الطبي v4.0</p>
          </div>
        )}
      </main>

      <BottomNav active={tab} onChange={handleBottomNav} />

      {selected && (
        <DoctorDetailView
          doctor={selected}
          isFavorite={favorites.has(doctorId(selected))}
          onToggleFavorite={() => toggleFavorite(doctorId(selected))}
          onClose={() => setSelected(null)}
          onBook={() => startBook(selected)}
        />
      )}

      {booking && (
        <BookingFlow
          doctor={booking}
          onClose={() => { setBooking(null); try { setAppts(JSON.parse(localStorage.getItem("daleelAppointments") || "[]")); } catch {} }}
        />
      )}
    </div>
  );
}
