import { specialtyColor } from "@/lib/doctors";

interface SpecialtyCardProps {
  label: string;
  icon?: string;
  count?: number;
  categoryKey: string;
  img?: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "grid" | "scroll" | "photo";
  size?: "sm" | "md" | "lg";
}

export default function SpecialtyCard({
  label, icon, count, categoryKey, img, active, onClick, variant = "photo", size = "md",
}: SpecialtyCardProps) {
  const color = specialtyColor(categoryKey);

  const circleSize = size === "sm" ? "w-[64px] h-[64px]" : size === "lg" ? "w-[88px] h-[88px]" : "w-[72px] h-[72px]";
  const ringWidth = active ? "3px" : "2.5px";

  if (variant === "photo" && img) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group flex flex-col items-center gap-2 w-full transition-transform active:scale-95"
      >
        <div
          className={[
            "relative rounded-full p-[2.5px] transition-all duration-200",
            "group-hover:scale-105 group-hover:shadow-lg",
            active ? "shadow-[var(--shadow-float)]" : "shadow-[var(--shadow-soft)]",
          ].join(" ")}
          style={{
            background: active
              ? `linear-gradient(145deg,${color},${color}88)`
              : `linear-gradient(145deg,${color},${color}44)`,
          }}
        >
          <div className={`${circleSize} rounded-full overflow-hidden bg-gray-100 ring-2 ring-white`}>
            <img
              src={img}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {icon && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[13px] shadow-md ring-2 ring-white"
              style={{ background: color }}
            >
              {icon}
            </span>
          )}
        </div>

        <div className="text-center px-0.5 w-full">
          <span className={`text-[10.5px] font-bold leading-tight line-clamp-2 block ${active ? "text-primary-700" : "text-gray-700"}`}>
            {label}
          </span>
          {count != null && count > 0 && (
            <span className="text-[10px] font-semibold mt-0.5 block" style={{ color }}>
              {count.toLocaleString("ar-EG")} {count === 1 ? "طبيب" : ""}
            </span>
          )}
        </div>
      </button>
    );
  }

  if (variant === "scroll") {
    return (
      <button type="button" onClick={onClick}
        className="flex flex-col items-center gap-2 flex-shrink-0 w-[76px] group transition-transform active:scale-95"
      >
        <div
          className={`${circleSize} rounded-full overflow-hidden flex items-center justify-center shadow-md transition-all group-hover:scale-105`}
          style={{
            border: `${ringWidth} solid ${color}`,
            background: img ? undefined : `${color}14`,
          }}
        >
          {img
            ? <img src={img} alt="" className="w-full h-full object-cover" />
            : <span className="text-2xl">{icon}</span>}
        </div>
        <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 ${active ? "text-primary-700" : "text-gray-600"}`}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick}
      className={[
        "flex flex-col items-center gap-2 p-3 rounded-[var(--radius-card)] border transition-all active:scale-[0.97]",
        active
          ? "border-primary-300 bg-primary-50 shadow-[var(--shadow-soft)]"
          : "border-transparent bg-white hover:border-gray-100 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-110"
        style={{ background: `${color}14`, color }}
      >
        {icon}
      </div>
      <span className="text-[11px] font-bold text-gray-700 text-center leading-tight line-clamp-2">{label}</span>
      {count != null && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}12` }}>
          {count}
        </span>
      )}
    </button>
  );
}
