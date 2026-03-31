import type { WorkshopRecord, WorkshopStatus } from "@/components/features/workshops/workshops-types"

const workshopTitles = [
  "التفكير الإبداعي وحل المشكلات",
  "أمن المعلومات للموظفين",
  "كتابة التقارير الفنية",
  "إدارة الوقت والأولويات",
  "العمل الجماعي وبناء الفرق",
  "مهارات التواصل الفعّال",
  "أساسيات Excel المتقدم",
  "التعامل مع ضغوط العمل",
  "خدمة العملاء المتميزة",
  "أساسيات إدارة المشاريع",
  "التحول الرقمي في المؤسسات",
  "مهارات كتابة المراسلات الرسمية",
  "إدارة الاجتماعات بفاعلية",
  "التخطيط الشخصي والمهني",
  "مهارات التفاوض في بيئة العمل",
  "الذكاء العاطفي في القيادة",
  "إعداد العروض التقديمية الاحترافية",
  "أساسيات الأمن السيبراني",
  "التعامل مع التغيير المؤسسي",
  "بناء ثقافة الابتكار",
  "أخلاقيات العمل المهنية",
  "مهارات حل النزاعات",
  "إدارة المعرفة المؤسسية",
  "التفكير الاستراتيجي",
  "السلامة والصحة المهنية",
]

const facilitators = [
  "نور الهاشمي", "علي الموسوي", "حسن الربيعي", "زينب العامري", "أحمد الكاظمي",
  "سارة العلي", "عمر الشمري", "ريم السعدي", "فاطمة الموسوي", "محمد الحسيني",
]

export const WORKSHOP_LOCATIONS = [
  "قاعة التدريب 1", "قاعة التدريب 2", "قاعة المؤتمرات",
  "مختبر الحاسوب", "القاعة الرئيسية", "غرفة الاجتماعات أ", "غرفة الاجتماعات ب",
]

const locationsList = WORKSHOP_LOCATIONS

const timeSlots = [
  "09:00 - 12:00", "10:00 - 13:00", "13:00 - 16:00",
  "14:00 - 17:00", "09:00 - 15:00", "08:30 - 11:30",
]

export const WORKSHOP_STATUSES: WorkshopStatus[] = ["قادم", "جاري", "منتهي", "ملغي"]

export const DUMMY_WORKSHOPS: WorkshopRecord[] = workshopTitles.map((title, i) => {
  const month = (i % 12) + 1
  const day = (i % 28) + 1
  const cap = 15 + ((i * 5) % 35)
  const reg = Math.min(cap, 5 + ((i * 3) % cap))
  return {
    id: i + 1,
    title,
    facilitator: facilitators[i % facilitators.length],
    location: locationsList[i % locationsList.length],
    date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    timeSlot: timeSlots[i % timeSlots.length],
    capacity: cap,
    registered: reg,
    status: WORKSHOP_STATUSES[i % WORKSHOP_STATUSES.length],
  }
})
