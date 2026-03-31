import type { CourseRecord, CourseCategory, CourseStatus } from "@/components/features/courses/courses-types"

const courseTitles = [
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
  "الحوسبة السحابية AWS",
  "التخطيط الاستراتيجي",
  "المراجعة الداخلية",
  "قانون العمل والتأمينات",
  "الإسعافات الأولية في العمل",
  "تصميم قواعد البيانات",
  "إدارة المخاطر المؤسسية",
  "التحليل المالي للمشاريع",
  "الأمن السيبراني المتقدم",
  "مهارات العرض والتقديم",
]

const instructors = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
]

export const COURSE_CATEGORIES: CourseCategory[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
export const COURSE_STATUSES: CourseStatus[] = ["مفتوح", "جاري", "مكتمل", "ملغي"]
export const COURSE_DURATIONS = ["10 ساعات", "15 ساعة", "20 ساعة", "25 ساعة", "30 ساعة", "35 ساعة", "40 ساعة", "50 ساعة", "60 ساعة"]

export const DUMMY_COURSES: CourseRecord[] = courseTitles.map((title, i) => {
  const startMonth = (i % 12) + 1
  const startDay = (i % 28) + 1
  const endMonth = Math.min(startMonth + 1, 12)
  return {
    id: i + 1,
    title,
    instructor: instructors[i % instructors.length],
    category: COURSE_CATEGORIES[i % COURSE_CATEGORIES.length],
    duration: COURSE_DURATIONS[i % COURSE_DURATIONS.length],
    startDate: `2025-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`,
    endDate: `2025-${String(endMonth).padStart(2, "0")}-${String(Math.min(startDay + 15, 28)).padStart(2, "0")}`,
    status: COURSE_STATUSES[i % COURSE_STATUSES.length],
    employeeCount: 5 + ((i * 7) % 40),
  }
})
