import { IconStar } from "./Icons";

interface RatingWidgetProps {
  rating?: number;
  count?: number;
  size?: "sm" | "md";
  light?: boolean;
}

export default function RatingWidget({ rating, count, size = "sm", light }: RatingWidgetProps) {
  if (!rating) return null;
  const star = size === "sm" ? 14 : 16;
  const text = size === "sm" ? "text-[12px]" : "text-[13px]";
  return (
    <div className={`inline-flex items-center gap-1 ${text}`}>
      <IconStar size={star} className="text-amber-400" />
      <span className={`font-bold ${light ? "text-white" : "text-gray-800"}`}>{rating.toFixed(1)}</span>
      {count != null && count > 0 && (
        <span className={`font-normal ${light ? "text-white/75" : "text-gray-400"}`}>({count})</span>
      )}
    </div>
  );
}
