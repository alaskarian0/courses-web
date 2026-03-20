export type HallStatus = "متاحة" | "مشغولة" | "صيانة"
export type Equipment = "بروجكتر" | "سبورة ذكية" | "حواسيب" | "نظام صوتي" | "كاميرا" | "شاشة عرض"

export interface TrainingHall {
  id: number
  name: string
  building: string
  floor: string
  capacity: number
  equipment: Equipment[]
  status: HallStatus
}

export type SessionStatus = "مجدولة" | "جارية" | "مكتملة" | "ملغاة"
export type TimeSlot = "08:00 - 10:00" | "10:00 - 12:00" | "12:30 - 14:30" | "14:30 - 16:30"
export type DayOfWeek = "الأحد" | "الاثنين" | "الثلاثاء" | "الأربعاء" | "الخميس"

export interface ClassSession {
  id: number
  programTitle: string
  instructorName: string
  hallId: number
  hallName: string
  date: string
  dayOfWeek: DayOfWeek
  timeSlot: TimeSlot
  capacity: number
  assignedCount: number
  status: SessionStatus
}

export interface AssignedStudent {
  id: number
  employeeName: string
  employeeDepartment: string
  sessionId: number
  seatNumber: number | null
}

export interface HallFilters {
  building: string
  status: string
}

export interface SessionFilters {
  hall: string
  date: string
  status: string
}
