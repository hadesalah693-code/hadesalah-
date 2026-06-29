import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دليل الفلوجة الطبي | أطباء وصيدليات ومختبرات الفلوجة",
  description:
    "الدليل الطبي الشامل لمدينة الفلوجة — أطباء متخصصون، صيدليات، مختبرات، مراكز طبية. أكثر من 440 سجلاً طبياً محدَّثاً.",
  authors: [{ name: "د. أحمد عبيد المحمدي" }],
  keywords: ["دليل طبي", "فلوجة", "أطباء الفلوجة", "صيدليات", "مختبرات"],
  openGraph: {
    title: "دليل الفلوجة الطبي",
    description: "الدليل الطبي الشامل لمدينة الفلوجة",
    locale: "ar_IQ",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
