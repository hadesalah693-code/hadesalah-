"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  overlay?: string;
}

export default function VideoBackground({ src, poster, className = "", overlay }: VideoBackgroundProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!reduced && !saveData) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || failed) return;
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => setFailed(true));
  }, [enabled, failed]);

  if (!enabled || failed) {
    return poster ? (
      <img src={poster} alt="" className={`absolute inset-0 w-full h-full object-cover ${className}`} />
    ) : null;
  }

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden
        onError={() => setFailed(true)}
      />
      {overlay && <div className="absolute inset-0" style={{ background: overlay }} aria-hidden />}
    </>
  );
}
