export type ProgramType = "دورة" | "ورشة عمل"
export type ProgramStatus = "مفتوح" | "جاري" | "مكتمل" | "ملغي"
export type ProgramCategory = "تقنية" | "إدارية" | "مالية" | "قانونية" | "تطوير ذاتي" | "صحة وسلامة"

export interface ProgramRecord {
  id: number
  title: string
  type: ProgramType
  instructor: string
  category: ProgramCategory
  duration: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registered: number
  status: ProgramStatus
  createdAt: string
}

export interface ProgramFilters {
  type: string
  dateFrom: string
  dateTo: string
  category: string
  status: string
}
