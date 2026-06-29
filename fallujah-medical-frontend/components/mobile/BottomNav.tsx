"use client";

import { IconHome, IconSearch, IconCalendar, IconBookmark, IconUser } from "../ui/Icons";

export type TabId = "home" | "search" | "appointments" | "favorites" | "profile";

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "home",         label: "الرئيسية", Icon: IconHome },
  { id: "search",       label: "بحث",      Icon: IconSearch },
  { id: "appointments", label: "مواعيدي",  Icon: IconCalendar },
  { id: "favorites",    label: "المفضلة",  Icon: IconBookmark },
  { id: "profile",      label: "حسابي",    Icon: IconUser },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 safe-bottom"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(204,251,241,0.8)",
        boxShadow: "0 -4px 20px rgba(13,148,136,0.08)",
      }}
    >
      <div className="flex items-end justify-around px-0.5 pt-1.5 pb-0.5 max-w-lg mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} type="button" onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 flex-1 min-h-[52px] justify-end transition-all duration-200 active:scale-95"
            >
              <div
                className="flex items-center justify-center w-11 h-10 rounded-2xl transition-all duration-250"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(145deg,#0d9488,#0f766e)",
                        boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
                        transform: "translateY(-2px)",
                      }
                    : {}
                }
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              </div>
              <span
                className="text-[10px] font-bold transition-colors duration-200"
                style={{ color: isActive ? "#0d9488" : "#94a3b8" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
