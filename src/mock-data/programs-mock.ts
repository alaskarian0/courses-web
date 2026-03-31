import type { ProgramRecord, ProgramType, ProgramCategory, ProgramStatus } from "@/components/features/programs/programs-types"

export const courseTitles = [
  "تطوير تطبيقات الويب",
  "إدارة المشاريع الاحترافية PMP",
  "المحاسبة المالية المتقدمة",
  "القانون التجاري والعقود",
  "مهارات القيادة والإدارة",
  "أمن المعلومات والشبكات",
  "تحليل البيانات باستخدام Python",
  "إدارة الموارد البشرية",
  "التسويق الرقمي",
  "السلامة المهنية في بيئة العمل",
  "تطوير تطبيقات الجوال",
  "إدارة سلسلة الإمداد",
  "التخطيط المالي والميزانيات",
  "الامتثال والحوكمة المؤسسية",
  "مهارات التفاوض والإقناع",
  "الذكاء الاصطناعي والتعلم الآلي",
  "إدارة الجودة الشاملة TQM",
  "إعداد التقارير المالية IFRS",
  "حماية البيانات الشخصية",
  "تطوير الذات والإنتاجية",
]

export const workshopTitles = [
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
]

export const instructors = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
]

export const locations = [
  "قاعة التدريب 1", "قاعة التدريب 2", "قاعة المؤتمرات",
  "مختبر الحاسوب", "القاعة الرئيسية", "غرفة الاجتماعات أ", "غرفة الاجتماعات ب",
]

export const categoryList: ProgramCategory[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
export const statusList: ProgramStatus[] = ["مفتوح", "جاري", "مكتمل", "ملغي"]
export const durations = ["10 ساعات", "15 ساعة", "20 ساعة", "25 ساعة", "30 ساعة", "35 ساعة", "40 ساعة", "50 ساعة"]

export const DUMMY_PROGRAMS: ProgramRecord[] = [
  ...courseTitles.map((title, i) => {
    const startMonth = (i % 12) + 1
    const startDay = (i % 28) + 1
    const endMonth = Math.min(startMonth + 1, 12)
    const cap = 20 + ((i * 7) % 40)
    return {
      id: i + 1,
      title,
      type: "دورة" as ProgramType,
      instructor: instructors[i % instructors.length],
      category: categoryList[i % categoryList.length],
      duration: durations[i % durations.length],
      startDate: `2025-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`,
      endDate: `2025-${String(endMonth).padStart(2, "0")}-${String(Math.min(startDay + 15, 28)).padStart(2, "0")}`,
      location: locations[i % locations.length],
      capacity: cap,
      registered: Math.min(cap, 5 + ((i * 3) % cap)),
      status: statusList[i % statusList.length],
      createdAt: `2025-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}T08:00:00.000Z`,
    }
  }),
  ...workshopTitles.map((title, i) => {
    const month = ((i + 3) % 12) + 1
    const day = ((i * 2) % 28) + 1
    const cap = 15 + ((i * 5) % 30)
    return {
      id: courseTitles.length + i + 1,
      title,
      type: "ورشة عمل" as ProgramType,
      instructor: instructors[(i + 3) % instructors.length],
      category: categoryList[(i + 2) % categoryList.length],
      duration: `${3 + (i % 5)} ساعات`,
      startDate: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      endDate: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      location: locations[(i + 1) % locations.length],
      capacity: cap,
      registered: Math.min(cap, 3 + ((i * 4) % cap)),
      status: statusList[(i + 1) % statusList.length],
      createdAt: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T08:00:00.000Z`,
    }
  }),
]
