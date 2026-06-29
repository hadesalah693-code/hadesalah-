/** Medical-themed photos — work well in circular crops (no faces) */
const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=300&q=80&auto=format&fit=crop&crop=entropy`;

export const SPECIALTY_IMAGES: Record<string, string> = {
  obgyn:             U("photo-1516549655169-df83a0774514"), // سونار ومتابعة حمل ومولود
  urology:           U("photo-1530026405186-ed1ea0ac7a63"), // فحص مجهري ومخبري دقيق
  dermatology:       U("photo-1522335789203-aabd1fc54bc9"), // عناية ونقاء بشرة
  psychiatry:        U("photo-1527137341206-1a2af2f4f8a2"), // رمز للهدوء والاتزان النفسي
  pediatrics:        U("photo-1622416011311-62d29cb1624c"), // فحص أطفال بدون إظهار ملامح واضحة
  ophthalmology:     U("photo-1576091160550-2173dba999ef"), // جهاز فحص العين المتطور
  orthopedics:       U("photo-1579154204601-01588f351167"), // هيكل عظمي ومفاصل وعظام
  internal_cardio:   U("photo-1537368910025-700350fe46c7"), // سماعة الطبيب وفحص القلب
  neurosurgery:      U("photo-1559757147-380b06b9cb8e"), // أشعة مقطعية للدماغ والأعصاب
  general_surgery:   U("photo-1579684389782-64d84b5e901a"), // أدوات وإضاءة غرفة العمليات
  ent:               U("photo-1606811971618-4486d14f3f99"), // جهاز فحص الأذن الدقيق
  dentistry:         U("photo-1588776814546-1ffcf47267a5"), // أدوات طبيب الأسنان والعيادة
  ultrasound_xray:   U("photo-1559757175-5700dde675bc"), // شاشة تحليل الأشعة والسونار
  wound_care:        U("photo-1603398938378-e54eab446dde"), // وضع ضمادة ومساعدة بلطف
  physiotherapy:     U("photo-1576091160399-112ba8d25d1d"), // أدوات وجلسة تأهيل حركي
  audiology:         U("photo-1516841273335-e39b37888115"), // أدوات فحص السمع والنطق
  pharmacies:        U("photo-1584308666744-24d5c474f2ae"), // صيدلية وأدوية
  labs:              U("photo-1576086213369-fb9929c4470b"), // أنابيب اختبار ومختبرات حديثة
  medical_complexes: U("photo-1586773860418-d3b3f9470023"), // مبنى أو ممر مجمع طبي حديث
};

export function specialtyImage(key: string): string {
  // الـ Fallback هنا صورة طبية عامة وأنيقة في حال لم يجد المفتاح
  return SPECIALTY_IMAGES[key] ?? U("photo-1576091160399-112ba8d25d1d");
}