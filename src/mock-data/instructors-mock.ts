import type { InstructorRecord, InstructorType, InstructorStatus, InstructorSpecialty } from "@/components/features/instructors/instructors-types"

export const internalNames = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
]

export const externalNames = [
  "د. خالد المنصور", "م. ليلى الأحمد", "أ. سعيد الغامدي", "د. منى الشريف",
  "م. طارق العبدالله", "أ. هناء الدوسري", "د. فهد القحطاني", "م. رنا الحربي",
  "أ. ناصر العتيبي", "د. سمية البلوشي", "م. عادل الزهراني", "أ. وفاء المطيري",
  "د. بدر الشهري", "م. أمينة الراشدي", "أ. يزيد الحارثي",
]

export const externalOrgs = [
  "معهد التطوير المهني", "أكاديمية القيادة", "مركز الخبراء للتدريب",
  "شركة المعرفة للاستشارات", "معهد الإبداع التقني", "مركز التميز الإداري",
  "أكاديمية المستقبل", "معهد الجودة الشاملة",
]

export const specialties: InstructorSpecialty[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]

export const DUMMY_INSTRUCTORS: InstructorRecord[] = [
  ...internalNames.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.split(" ")[0].toLowerCase()}${i + 1}@company.com`,
    phone: `0599${String(1000000 + i * 111111).slice(0, 6)}`,
    type: "داخلي" as InstructorType,
    organization: "المؤسسة",
    specialty: specialties[i % specialties.length],
    coursesCount: (i * 3) % 10 + 1,
    workshopsCount: (i * 2) % 7,
    rating: Math.round((3.5 + (i % 4) * 0.4) * 10) / 10,
    status: (i % 8 === 0 ? "غير نشط" : "نشط") as InstructorStatus,
    createdAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T08:00:00.000Z`,
  })),
  ...externalNames.map((name, i) => ({
    id: internalNames.length + i + 1,
    name,
    email: `${name.split(" ").pop()?.toLowerCase()}${i + 1}@external.com`,
    phone: `0555${String(2000000 + i * 123456).slice(0, 6)}`,
    type: "خارجي" as InstructorType,
    organization: externalOrgs[i % externalOrgs.length],
    specialty: specialties[(i + 2) % specialties.length],
    coursesCount: (i * 2) % 8 + 1,
    workshopsCount: (i * 3) % 5 + 1,
    rating: Math.round((3.2 + (i % 5) * 0.35) * 10) / 10,
    status: (i % 6 === 0 ? "غير نشط" : "نشط") as InstructorStatus,
    createdAt: `2025-${String(((i + 3) % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T08:00:00.000Z`,
  })),
]
