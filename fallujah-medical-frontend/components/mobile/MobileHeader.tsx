"use client";

import { IconCross } from "../ui/Icons";
import type { TabId } from "./BottomNav";

const TITLES: Record<TabId, string> = {
  home: "دليل الفلوجة الطبي",
  search: "البحث",
  appointments: "مواعيدي",
  favorites: "المفضلة",
  profile: "حسابي",
};

interface MobileHeaderProps {
  active: TabId;
  onHome: () => void;
  variant?: "solid" | "transparent";
}

export default function MobileHeader({ active, onHome, variant = "solid" }: MobileHeaderProps) {
  if (active === "home") return null;

  const solid = variant === "solid";

  return (
    <header
      className={[
        "lg:hidden sticky top-0 z-40 safe-top",
        solid ? "bg-white/95 border-b border-teal-100/80 shadow-[0_2px_12px_rgba(13,148,136,0.06)]" : "",
      ].join(" ")}
      style={solid ? { backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" } : undefined}
    >
      <div className="mobile-header-inner">
        <button type="button" onClick={onHome} className="flex items-center gap-2 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: "linear-gradient(145deg,#0f766e,#0d9488)" }}
          >
            <IconCross size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[16px] text-gray-900 truncate">
            {TITLES[active]}
          </span>
        </button>
      </div>
    </header>
  );
}
