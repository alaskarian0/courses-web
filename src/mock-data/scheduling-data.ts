import type { TrainingHall, ClassSession, AssignedStudent, Equipment, SessionStatus, TimeSlot, DayOfWeek } from "@/components/features/scheduling/scheduling-types"

// ─── Training Halls ─────────────────────────────────────────────────────────

export const DUMMY_HALLS: TrainingHall[] = [
  { id: 1, name: "قاعة التدريب 1", building: "المبنى الرئيسي", floor: "الطابق الأرضي", capacity: 30, equipment: ["بروجكتر", "سبورة ذكية", "نظام صوتي"], status: "متاحة" },
  { id: 2, name: "قاعة التدريب 2", building: "مبنى التدريب", floor: "الطابق الأول", capacity: 25, equipment: ["بروجكتر", "شاشة عرض"], status: "متاحة" },
  { id: 3, name: "قاعة التدريب 3", building: "مبنى التدريب", floor: "الطابق الثاني", capacity: 20, equipment: ["بروجكتر", "سبورة ذكية"], status: "صيانة" },
  { id: 4, name: "قاعة المؤتمرات", building: "المبنى الرئيسي", floor: "الطابق الأول", capacity: 60, equipment: ["بروجكتر", "سبورة ذكية", "نظام صوتي", "كاميرا", "شاشة عرض"], status: "متاحة" },
  { id: 5, name: "مختبر الحاسوب", building: "مبنى التدريب", floor: "الطابق الأرضي", capacity: 25, equipment: ["حواسيب", "بروجكتر", "شاشة عرض"], status: "مشغولة" },
  { id: 6, name: "القاعة الرئيسية", building: "المبنى الرئيسي", floor: "الطابق الأرضي", capacity: 50, equipment: ["بروجكتر", "نظام صوتي", "كاميرا", "شاشة عرض"], status: "متاحة" },
  { id: 7, name: "غرفة الاجتماعات أ", building: "مبنى الإدارة", floor: "الطابق الأول", capacity: 15, equipment: ["بروجكتر", "شاشة عرض"], status: "متاحة" },
  { id: 8, name: "غرفة الاجتماعات ب", building: "مبنى الإدارة", floor: "الطابق الثاني", capacity: 15, equipment: ["بروجكتر"], status: "متاحة" },
]

// ─── Class Sessions ─────────────────────────────────────────────────────────

export const DUMMY_SESSIONS: ClassSession[] = [
  // تطوير تطبيقات الويب — Apr 5–9 (5 أيام)
  { id: 1,  programTitle: "تطوير تطبيقات الويب",              instructorName: "أحمد الكاظمي",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-04-05", dayOfWeek: "الأحد",     timeSlot: "08:00 - 10:00", capacity: 30, assignedCount: 18, status: "مجدولة" },
  { id: 2,  programTitle: "تطوير تطبيقات الويب",              instructorName: "أحمد الكاظمي",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-04-07", dayOfWeek: "الثلاثاء",  timeSlot: "08:00 - 10:00", capacity: 30, assignedCount: 18, status: "مجدولة" },
  { id: 21, programTitle: "تطوير تطبيقات الويب",              instructorName: "أحمد الكاظمي",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-04-09", dayOfWeek: "الخميس",    timeSlot: "08:00 - 10:00", capacity: 30, assignedCount: 18, status: "مجدولة" },

  // إدارة المشاريع PMP — Apr 12–16 (5 أيام)
  { id: 3,  programTitle: "إدارة المشاريع الاحترافية PMP",   instructorName: "سارة العلي",      hallId: 4, hallName: "قاعة المؤتمرات",   date: "2026-04-12", dayOfWeek: "الأحد",     timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 22, status: "مجدولة" },
  { id: 4,  programTitle: "إدارة المشاريع الاحترافية PMP",   instructorName: "سارة العلي",      hallId: 4, hallName: "قاعة المؤتمرات",   date: "2026-04-14", dayOfWeek: "الثلاثاء",  timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 22, status: "مجدولة" },
  { id: 22, programTitle: "إدارة المشاريع الاحترافية PMP",   instructorName: "سارة العلي",      hallId: 4, hallName: "قاعة المؤتمرات",   date: "2026-04-16", dayOfWeek: "الخميس",    timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 22, status: "مجدولة" },

  // التفكير الإبداعي — Apr 19–23 (5 أيام)
  { id: 5,  programTitle: "التفكير الإبداعي وحل المشكلات",  instructorName: "نور الهاشمي",     hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-19", dayOfWeek: "الأحد",     timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 8,  status: "مجدولة" },
  { id: 23, programTitle: "التفكير الإبداعي وحل المشكلات",  instructorName: "نور الهاشمي",     hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-21", dayOfWeek: "الثلاثاء",  timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 8,  status: "مجدولة" },
  { id: 24, programTitle: "التفكير الإبداعي وحل المشكلات",  instructorName: "نور الهاشمي",     hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-23", dayOfWeek: "الخميس",    timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 8,  status: "مجدولة" },

  // مهارات القيادة — Apr 26–30 (5 أيام)
  { id: 18, programTitle: "مهارات القيادة والإدارة",          instructorName: "علي الجبوري",    hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-26", dayOfWeek: "الأحد",     timeSlot: "14:30 - 16:30", capacity: 25, assignedCount: 20, status: "جارية"   },
  { id: 25, programTitle: "مهارات القيادة والإدارة",          instructorName: "علي الجبوري",    hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-28", dayOfWeek: "الثلاثاء",  timeSlot: "14:30 - 16:30", capacity: 25, assignedCount: 20, status: "جارية"   },
  { id: 26, programTitle: "مهارات القيادة والإدارة",          instructorName: "علي الجبوري",    hallId: 2, hallName: "قاعة التدريب 2",    date: "2026-04-30", dayOfWeek: "الخميس",    timeSlot: "14:30 - 16:30", capacity: 25, assignedCount: 20, status: "جارية"   },

  // المحاسبة المالية — May 3–7 (5 أيام)
  { id: 6,  programTitle: "المحاسبة المالية المتقدمة",        instructorName: "محمد الحسيني",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-05-03", dayOfWeek: "الأحد",     timeSlot: "10:00 - 12:00", capacity: 20, assignedCount: 15, status: "مجدولة" },
  { id: 7,  programTitle: "المحاسبة المالية المتقدمة",        instructorName: "محمد الحسيني",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-05-05", dayOfWeek: "الثلاثاء",  timeSlot: "10:00 - 12:00", capacity: 20, assignedCount: 15, status: "مجدولة" },
  { id: 27, programTitle: "المحاسبة المالية المتقدمة",        instructorName: "محمد الحسيني",   hallId: 1, hallName: "قاعة التدريب 1",    date: "2026-05-07", dayOfWeek: "الخميس",    timeSlot: "10:00 - 12:00", capacity: 20, assignedCount: 15, status: "مجدولة" },

  // أمن المعلومات للموظفين — May 10–14 (5 أيام)
  { id: 8,  programTitle: "أمن المعلومات للموظفين",          instructorName: "علي الموسوي",    hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-05-10", dayOfWeek: "الأحد",     timeSlot: "08:00 - 10:00", capacity: 25, assignedCount: 12, status: "مجدولة" },
  { id: 28, programTitle: "أمن المعلومات للموظفين",          instructorName: "علي الموسوي",    hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-05-14", dayOfWeek: "الخميس",    timeSlot: "08:00 - 10:00", capacity: 25, assignedCount: 12, status: "مجدولة" },

  // الذكاء الاصطناعي — May 17–21 (5 أيام)
  { id: 9,  programTitle: "الذكاء الاصطناعي والتعلم الآلي", instructorName: "فاطمة الموسوي",  hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-05-17", dayOfWeek: "الأحد",     timeSlot: "14:30 - 16:30", capacity: 20, assignedCount: 19, status: "مجدولة" },
  { id: 10, programTitle: "الذكاء الاصطناعي والتعلم الآلي", instructorName: "فاطمة الموسوي",  hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-05-19", dayOfWeek: "الثلاثاء",  timeSlot: "14:30 - 16:30", capacity: 20, assignedCount: 19, status: "مجدولة" },
  { id: 29, programTitle: "الذكاء الاصطناعي والتعلم الآلي", instructorName: "فاطمة الموسوي",  hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-05-21", dayOfWeek: "الخميس",    timeSlot: "14:30 - 16:30", capacity: 20, assignedCount: 19, status: "مجدولة" },

  // مهارات التواصل — May 24–28 (5 أيام)
  { id: 11, programTitle: "مهارات التواصل الفعّال",           instructorName: "زينب العامري",   hallId: 6, hallName: "القاعة الرئيسية",  date: "2026-05-24", dayOfWeek: "الأحد",     timeSlot: "08:00 - 10:00", capacity: 40, assignedCount: 25, status: "مجدولة" },
  { id: 30, programTitle: "مهارات التواصل الفعّال",           instructorName: "زينب العامري",   hallId: 6, hallName: "القاعة الرئيسية",  date: "2026-05-28", dayOfWeek: "الخميس",    timeSlot: "08:00 - 10:00", capacity: 40, assignedCount: 25, status: "مجدولة" },

  // القانون التجاري — May 31–Jun 4 (5 أيام)
  { id: 12, programTitle: "القانون التجاري والعقود",          instructorName: "حسن الربيعي",    hallId: 4, hallName: "قاعة المؤتمرات",   date: "2026-05-31", dayOfWeek: "الأحد",     timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 20, status: "مكتملة" },
  { id: 31, programTitle: "القانون التجاري والعقود",          instructorName: "حسن الربيعي",    hallId: 4, hallName: "قاعة المؤتمرات",   date: "2026-06-04", dayOfWeek: "الخميس",    timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 20, status: "مكتملة" },

  // السلامة والصحة المهنية — Jun 7–11 (5 أيام)
  { id: 13, programTitle: "السلامة والصحة المهنية",           instructorName: "عمر الشمري",     hallId: 6, hallName: "القاعة الرئيسية",  date: "2026-06-07", dayOfWeek: "الأحد",     timeSlot: "10:00 - 12:00", capacity: 50, assignedCount: 30, status: "جارية"   },
  { id: 32, programTitle: "السلامة والصحة المهنية",           instructorName: "عمر الشمري",     hallId: 6, hallName: "القاعة الرئيسية",  date: "2026-06-09", dayOfWeek: "الثلاثاء",  timeSlot: "10:00 - 12:00", capacity: 50, assignedCount: 30, status: "جارية"   },
  { id: 33, programTitle: "السلامة والصحة المهنية",           instructorName: "عمر الشمري",     hallId: 6, hallName: "القاعة الرئيسية",  date: "2026-06-11", dayOfWeek: "الخميس",    timeSlot: "10:00 - 12:00", capacity: 50, assignedCount: 30, status: "جارية"   },

  // إدارة الوقت — Jun 14–18 (5 أيام)
  { id: 14, programTitle: "إدارة الوقت والأولويات",           instructorName: "ريم السعدي",     hallId: 7, hallName: "غرفة الاجتماعات أ", date: "2026-06-14", dayOfWeek: "الأحد",    timeSlot: "08:00 - 10:00", capacity: 15, assignedCount: 10, status: "مجدولة" },
  { id: 34, programTitle: "إدارة الوقت والأولويات",           instructorName: "ريم السعدي",     hallId: 7, hallName: "غرفة الاجتماعات أ", date: "2026-06-18", dayOfWeek: "الخميس",   timeSlot: "08:00 - 10:00", capacity: 15, assignedCount: 10, status: "مجدولة" },

  // تحليل البيانات Python — Jun 21–25 (5 أيام)
  { id: 15, programTitle: "تحليل البيانات باستخدام Python",  instructorName: "أحمد الكاظمي",   hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-06-21", dayOfWeek: "الأحد",     timeSlot: "08:00 - 10:00", capacity: 25, assignedCount: 5,  status: "مجدولة" },
  { id: 16, programTitle: "تحليل البيانات باستخدام Python",  instructorName: "أحمد الكاظمي",   hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-06-23", dayOfWeek: "الثلاثاء",  timeSlot: "08:00 - 10:00", capacity: 25, assignedCount: 5,  status: "مجدولة" },
  { id: 35, programTitle: "تحليل البيانات باستخدام Python",  instructorName: "أحمد الكاظمي",   hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-06-25", dayOfWeek: "الخميس",    timeSlot: "08:00 - 10:00", capacity: 25, assignedCount: 5,  status: "مجدولة" },

  // إدارة الموارد البشرية — Jun 28–Jul 2 (5 أيام)
  { id: 17, programTitle: "إدارة الموارد البشرية",            instructorName: "سارة العلي",      hallId: 1, hallName: "قاعة التدريب 1",   date: "2026-06-28", dayOfWeek: "الأحد",     timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 0,  status: "مجدولة" },
  { id: 36, programTitle: "إدارة الموارد البشرية",            instructorName: "سارة العلي",      hallId: 1, hallName: "قاعة التدريب 1",   date: "2026-07-02", dayOfWeek: "الخميس",    timeSlot: "12:30 - 14:30", capacity: 20, assignedCount: 0,  status: "مجدولة" },

  // التسويق الرقمي — Jul 5–9 (5 أيام)
  { id: 19, programTitle: "التسويق الرقمي",                   instructorName: "عمر الشمري",     hallId: 7, hallName: "غرفة الاجتماعات أ", date: "2026-07-05", dayOfWeek: "الأحد",    timeSlot: "10:00 - 12:00", capacity: 15, assignedCount: 12, status: "مجدولة" },
  { id: 37, programTitle: "التسويق الرقمي",                   instructorName: "عمر الشمري",     hallId: 7, hallName: "غرفة الاجتماعات أ", date: "2026-07-09", dayOfWeek: "الخميس",   timeSlot: "10:00 - 12:00", capacity: 15, assignedCount: 12, status: "مجدولة" },

  // أمن المعلومات والشبكات — Jul 12–16 (5 أيام)
  { id: 20, programTitle: "أمن المعلومات والشبكات",           instructorName: "نور الهاشمي",    hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-07-12", dayOfWeek: "الأحد",     timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 18, status: "مجدولة" },
  { id: 38, programTitle: "أمن المعلومات والشبكات",           instructorName: "نور الهاشمي",    hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-07-14", dayOfWeek: "الثلاثاء",  timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 18, status: "مجدولة" },
  { id: 39, programTitle: "أمن المعلومات والشبكات",           instructorName: "نور الهاشمي",    hallId: 5, hallName: "مختبر الحاسوب",    date: "2026-07-16", dayOfWeek: "الخميس",    timeSlot: "10:00 - 12:00", capacity: 25, assignedCount: 18, status: "مجدولة" },
]

// ─── Assigned Students ──────────────────────────────────────────────────────

export const DUMMY_STUDENTS: AssignedStudent[] = [
  { id: 1, employeeName: "يوسف الخزاعي", employeeDepartment: "تقنية المعلومات", sessionId: 1 },
  { id: 2, employeeName: "باسم العمارة", employeeDepartment: "تقنية المعلومات", sessionId: 1 },
  { id: 3, employeeName: "طارق البصري", employeeDepartment: "خدمة العملاء", sessionId: 1 },
  { id: 4, employeeName: "سارة العلي", employeeDepartment: "الموارد البشرية", sessionId: 3 },
  { id: 5, employeeName: "مريم الطائي", employeeDepartment: "الموارد البشرية", sessionId: 3 },
  { id: 6, employeeName: "كريم البغدادي", employeeDepartment: "المالية", sessionId: 5 },
  { id: 7, employeeName: "جاسم الموصلي", employeeDepartment: "المالية", sessionId: 6 },
  { id: 8, employeeName: "هدى النجفي", employeeDepartment: "التسويق", sessionId: 6 },
  { id: 9, employeeName: "علي الجبوري", employeeDepartment: "الشؤون القانونية", sessionId: 8 },
  { id: 10, employeeName: "سامر الكربلائي", employeeDepartment: "الشؤون القانونية", sessionId: 8 },
  { id: 11, employeeName: "نور الهاشمي", employeeDepartment: "العمليات", sessionId: 9 },
  { id: 12, employeeName: "لمياء الحلي", employeeDepartment: "العمليات", sessionId: 9 },
  { id: 13, employeeName: "رائد السماوي", employeeDepartment: "العمليات", sessionId: 9 },
  { id: 14, employeeName: "حسن الربيعي", employeeDepartment: "خدمة العملاء", sessionId: 11 },
  { id: 15, employeeName: "دعاء الكوفي", employeeDepartment: "الإدارة العليا", sessionId: 14 },
  { id: 16, employeeName: "منى الشريف", employeeDepartment: "تقنية المعلومات", sessionId: 15 },
  { id: 17, employeeName: "فهد القحطاني", employeeDepartment: "تقنية المعلومات", sessionId: 1 },
  { id: 18, employeeName: "رنا الحربي", employeeDepartment: "الموارد البشرية", sessionId: 3 },
  { id: 19, employeeName: "ناصر العتيبي", employeeDepartment: "تقنية المعلومات", sessionId: 15 },
  { id: 20, employeeName: "عادل الزهراني", employeeDepartment: "المالية", sessionId: 6 },
  { id: 21, employeeName: "وفاء المطيري", employeeDepartment: "الشؤون القانونية", sessionId: 12 },
  { id: 22, employeeName: "بدر الشهري", employeeDepartment: "تطوير ذاتي", sessionId: 13 },
  { id: 23, employeeName: "أمينة الراشدي", employeeDepartment: "العمليات", sessionId: 13 },
  { id: 24, employeeName: "يزيد الحارثي", employeeDepartment: "تقنية المعلومات", sessionId: 20 },
  { id: 25, employeeName: "خالد المنصور", employeeDepartment: "إدارية", sessionId: 18 },
  { id: 26, employeeName: "ليلى الأحمد", employeeDepartment: "تطوير ذاتي", sessionId: 18 },
  { id: 27, employeeName: "سعيد الغامدي", employeeDepartment: "صحة وسلامة", sessionId: 13 },
  { id: 28, employeeName: "هناء الدوسري", employeeDepartment: "الشؤون القانونية", sessionId: 12 },
  { id: 29, employeeName: "طارق العبدالله", employeeDepartment: "المالية", sessionId: 19 },
  { id: 30, employeeName: "سمية البلوشي", employeeDepartment: "إدارية", sessionId: 19 },
]

// ─── Reference Data ─────────────────────────────────────────────────────────

export const BUILDINGS = ["المبنى الرئيسي", "مبنى التدريب", "مبنى الإدارة"]
export const FLOORS = ["الطابق الأرضي", "الطابق الأول", "الطابق الثاني"]
export const ALL_EQUIPMENT: Equipment[] = ["بروجكتر", "سبورة ذكية", "حواسيب", "نظام صوتي", "كاميرا", "شاشة عرض"]
export const TIME_SLOTS: TimeSlot[] = ["08:00 - 10:00", "10:00 - 12:00", "12:30 - 14:30", "14:30 - 16:30"]
export const DAYS_OF_WEEK: DayOfWeek[] = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]
export const SESSION_STATUSES: SessionStatus[] = ["مجدولة", "جارية", "مكتملة", "ملغاة"]

export const PROGRAM_OPTIONS = [
  "تطوير تطبيقات الويب", "إدارة المشاريع الاحترافية PMP", "التفكير الإبداعي وحل المشكلات",
  "المحاسبة المالية المتقدمة", "أمن المعلومات للموظفين", "الذكاء الاصطناعي والتعلم الآلي",
  "مهارات التواصل الفعّال", "القانون التجاري والعقود", "السلامة والصحة المهنية",
  "إدارة الوقت والأولويات", "تحليل البيانات باستخدام Python", "إدارة الموارد البشرية",
  "مهارات القيادة والإدارة", "التسويق الرقمي", "أمن المعلومات والشبكات",
]

export const INSTRUCTOR_OPTIONS = [
  "أحمد الكاظمي", "سارة العلي", "نور الهاشمي", "محمد الحسيني",
  "علي الموسوي", "فاطمة الموسوي", "زينب العامري", "حسن الربيعي",
  "عمر الشمري", "ريم السعدي", "علي الجبوري",
]

export const AVAILABLE_EMPLOYEES = [
  { name: "يوسف الخزاعي", department: "تقنية المعلومات" },
  { name: "باسم العمارة", department: "تقنية المعلومات" },
  { name: "سارة العلي", department: "الموارد البشرية" },
  { name: "كريم البغدادي", department: "المالية" },
  { name: "هدى النجفي", department: "التسويق" },
  { name: "علي الجبوري", department: "الشؤون القانونية" },
  { name: "نور الهاشمي", department: "العمليات" },
  { name: "حسن الربيعي", department: "خدمة العملاء" },
  { name: "مريم الطائي", department: "الموارد البشرية" },
  { name: "لمياء الحلي", department: "العمليات" },
  { name: "طارق البصري", department: "خدمة العملاء" },
  { name: "دعاء الكوفي", department: "الإدارة العليا" },
  { name: "رائد السماوي", department: "العمليات" },
  { name: "سامر الكربلائي", department: "الشؤون القانونية" },
  { name: "جاسم الموصلي", department: "المالية" },
  { name: "فهد القحطاني", department: "تقنية المعلومات" },
  { name: "رنا الحربي", department: "الموارد البشرية" },
  { name: "ناصر العتيبي", department: "تقنية المعلومات" },
  { name: "عادل الزهراني", department: "المالية" },
  { name: "منى الشريف", department: "تقنية المعلومات" },
  { name: "وفاء المطيري", department: "الشؤون القانونية" },
  { name: "بدر الشهري", department: "تطوير ذاتي" },
  { name: "أمينة الراشدي", department: "العمليات" },
  { name: "يزيد الحارثي", department: "تقنية المعلومات" },
  { name: "خالد المنصور", department: "إدارية" },
  { name: "ليلى الأحمد", department: "تطوير ذاتي" },
  { name: "سعيد الغامدي", department: "صحة وسلامة" },
  { name: "هناء الدوسري", department: "الشؤون القانونية" },
  { name: "طارق العبدالله", department: "المالية" },
  { name: "سمية البلوشي", department: "إدارية" },
]

export function getDayOfWeek(dateStr: string): DayOfWeek {
  const date = new Date(dateStr)
  const dayIndex = date.getDay()
  const map: Record<number, DayOfWeek> = {
    0: "الأحد",
    1: "الاثنين",
    2: "الثلاثاء",
    3: "الأربعاء",
    4: "الخميس",
  }
  return map[dayIndex] || "الأحد"
}
