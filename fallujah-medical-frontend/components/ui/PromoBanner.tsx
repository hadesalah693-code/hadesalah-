"use client";

import VideoBackground from "./VideoBackground";

export interface PromoBannerData {
  title: string;
  sub: string;
  cta: string;
  href: string;
  badge: string;
  img: string;
  video?: string;
  overlay: string;
}

export default function PromoBanner({ banner }: { banner: PromoBannerData }) {
  const isVideo = Boolean(banner.video);

  return (
    <a
      href={banner.href}
      className={[
        "group flex-shrink-0 w-[calc(100vw-2.5rem)] max-w-[320px] lg:w-auto lg:max-w-none",
        "relative overflow-hidden rounded-2xl card-hover shadow-[var(--shadow-card)]",
        "block banner-card",
      ].join(" ")}
      style={{ minHeight: 190 }}
    >
      {isVideo ? (
        <VideoBackground
          src={banner.video!}
          poster={banner.img}
          overlay={banner.overlay}
        />
      ) : (
        <>
          <img
            src={banner.img}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover banner-ken-burns"
          />
          <div className="absolute inset-0" style={{ background: banner.overlay }} />
        </>
      )}

      <div className="relative z-10 p-4 h-full min-h-[190px] flex flex-col justify-end text-right">
        <span className="self-end mb-2 text-[10px] font-bold text-white px-2.5 py-1 rounded-full banner-badge">
          {banner.badge}
        </span>
        <p className="font-display font-extrabold text-white text-[16px] leading-tight drop-shadow-sm">
          {banner.title}
        </p>
        <p className="text-white/85 text-[11.5px] mt-1">{banner.sub}</p>
        <span className="inline-flex self-end items-center mt-3 text-white text-[11.5px] font-bold px-3.5 py-2 rounded-xl banner-cta transition-transform group-active:scale-95">
          {banner.cta} ←
        </span>
      </div>

      {isVideo && (
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 text-[9px] font-bold text-white/90 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </span>
      )}
    </a>
  );
}
