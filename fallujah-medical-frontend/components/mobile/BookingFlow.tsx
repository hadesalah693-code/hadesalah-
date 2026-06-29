"use client";

import { useState } from "react";
import type { FlatRecord } from "@/types";
import {
  doctorPhone, consultationFee, generateTimeSlots, nextDays,
} from "@/lib/doctors";
import Button from "../ui/Button";
import { IconX, IconPhone, IconChevron } from "../ui/Icons";

type Step = "date" | "time" | "confirm" | "success";

interface BookingFlowProps {
  doctor: FlatRecord;
  onClose: () => void;
}

export default function BookingFlow({ doctor, onClose }: BookingFlowProps) {
  const days = nextDays(10);
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState(days[0].key);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const slots = generateTimeSlots(doctor.name + selectedDate);
  const fee = consultationFee(doctor);
  const dayLabel = days.find((d) => d.key === selectedDate);

  function confirm() {
    try {
      const appts = JSON.parse(localStorage.getItem("daleelAppointments") || "[]");
      appts.unshift({
        doctor: doctor.name,
        specialty: doctor._categoryLabel,
        date: selectedDate,
        time: selectedTime,
        created: new Date().toISOString(),
      });
      localStorage.setItem("daleelAppointments", JSON.stringify(appts.slice(0, 20)));
    } catch {}
    setStep("success");
  }

  function goBack() {
    if (step === "date") onClose();
    else if (step === "time") setStep("date");
    else setStep("time");
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center lg:p-4">
        <div className="absolute inset-0 bg-gray-900/55 animate-fade-in" onClick={onClose} aria-hidden />
        <div className="modal-panel modal-panel-lg relative animate-slide-up lg:animate-scale-in safe-bottom">
          <div className="modal-panel-body p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" aria-hidden>
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display text-[22px] font-bold text-gray-900">تم الحجز بنجاح!</h2>
            <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">
              موعدك مع {doctor.name}<br />
              {dayLabel?.label} — {selectedTime}
            </p>
          </div>
          <div className="modal-panel-footer px-4 py-3 space-y-2 lg:rounded-b-2xl">
            <Button full size="lg" onClick={onClose}>تم</Button>
            {doctorPhone(doctor) && (
              <Button full variant="outline" size="md" onClick={() => { window.location.href = `tel:${doctorPhone(doctor)}`; }}>
                <IconPhone size={16} /> اتصل بالعيادة
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-end lg:items-center justify-center lg:p-4">
      <div className="absolute inset-0 bg-gray-900/55 animate-fade-in" onClick={onClose} aria-hidden />

      <div className="modal-panel modal-panel-lg relative animate-slide-up lg:animate-scale-in safe-bottom">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
          <button type="button" onClick={goBack}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <IconChevron dir="left" size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-[16px] text-gray-900">حجز موعد</h2>
            <p className="text-[12px] text-gray-500 truncate">{doctor.name}</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <IconX size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex-shrink-0 flex gap-1 px-4 py-3 bg-white">
          {(["date", "time", "confirm"] as const).map((s, i) => {
            const active =
              step === s ||
              (step === "confirm" && i < 2) ||
              (step === "time" && i === 0);
            return (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${active ? "bg-primary-500" : "bg-gray-200"}`} />
            );
          })}
        </div>

        {/* Body */}
        <div className="modal-panel-body px-4 py-4 bg-white">
          {step === "date" && (
            <div className="animate-fade-in-up">
              <h3 className="font-display font-bold text-[15px] text-gray-800 mb-3">اختر التاريخ</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDate(d.key)}
                    className={[
                      "flex-shrink-0 w-[64px] py-3 rounded-xl border text-center transition-all",
                      selectedDate === d.key
                        ? "bg-primary-600 border-primary-600 text-white shadow-md"
                        : "bg-white border-gray-200 text-gray-700",
                    ].join(" ")}
                  >
                    <div className="text-[10px] font-medium opacity-80">{d.label}</div>
                    <div className="text-[20px] font-bold leading-tight">{d.day}</div>
                    <div className="text-[10px] opacity-70">{d.month}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "time" && (
            <div className="animate-fade-in-up">
              <h3 className="font-display font-bold text-[15px] text-gray-800 mb-3">اختر الوقت</h3>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={[
                      "py-3 rounded-xl border text-[13px] font-semibold transition-all",
                      selectedTime === t
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "border-gray-200 text-gray-700 hover:border-primary-300",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="animate-fade-in-up">
              <h3 className="font-display font-bold text-[15px] text-gray-800 mb-4">تأكيد الحجز</h3>
              <div className="bg-gray-50 rounded-[var(--radius-card)] p-4 space-y-3 border border-gray-100">
                <Row label="الطبيب" value={doctor.name} />
                <Row label="التخصص" value={doctor._categoryLabel} />
                <Row label="التاريخ" value={`${dayLabel?.label} ${dayLabel?.day} ${dayLabel?.month}`} />
                <Row label="الوقت" value={selectedTime ?? ""} />
                {doctor.clinic && <Row label="العيادة" value={doctor.clinic} />}
                {fee && <Row label="رسوم الكشف" value={`${fee.toLocaleString("ar-EG")} د.ع`} highlight />}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-panel-footer px-4 py-3 lg:rounded-b-2xl">
          {step === "date" && (
            <Button full size="lg" onClick={() => setStep("time")}>التالي</Button>
          )}
          {step === "time" && (
            <Button full size="lg" disabled={!selectedTime} onClick={() => setStep("confirm")}>التالي</Button>
          )}
          {step === "confirm" && (
            <Button full size="lg" onClick={confirm}>تأكيد الحجز</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-[13px]">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className={`font-semibold text-right ${highlight ? "text-primary-600" : "text-gray-800"}`}>{value}</span>
    </div>
  );
}
