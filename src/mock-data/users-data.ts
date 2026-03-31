import type { UserRecord, UserRole, UserStatus } from "@/components/features/users/users-types"

const names = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
  "يوسف الخزاعي", "مريم الطائي", "كريم البغدادي", "هدى النجفي", "سامر الكربلائي",
  "لمياء الحلي", "طارق البصري", "دعاء الكوفي", "رائد السماوي", "أمل الديوانية",
  "باسم العمارة", "سلمى الناصرية", "جاسم الموصلي", "نادية الأربيلي", "وليد السليمانية",
]

export const USER_ROLES: UserRole[] = ["مشرف", "مدرب", "موظف", "مدير"]
export const USER_STATUSES: UserStatus[] = ["نشط", "معطل"]
export const USER_DEPARTMENTS = [
  "تقنية المعلومات", "الموارد البشرية", "المالية", "التسويق",
  "الشؤون القانونية", "العمليات", "خدمة العملاء", "الإدارة العليا",
]

export const DUMMY_USERS: UserRecord[] = names.map((name, i) => {
  const month = ((i * 3) % 12) + 1
  const day = (i % 28) + 1
  const nameParts = name.split(" ")
  const emailName = nameParts[0].toLowerCase()
  return {
    id: i + 1,
    name,
    email: `${emailName}${i + 1}@company.com`,
    role: USER_ROLES[i % USER_ROLES.length],
    department: USER_DEPARTMENTS[i % USER_DEPARTMENTS.length],
    joinDate: `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    status: i % 7 === 0 ? "معطل" : "نشط" as UserStatus,
    coursesCount: (i * 3) % 8,
    workshopsCount: (i * 2) % 6,
  }
})
