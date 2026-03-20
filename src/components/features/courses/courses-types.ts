export type CourseStatus = "مفتوح" | "جاري" | "مكتمل" | "ملغي"
export type CourseCategory = "تقنية" | "إدارية" | "مالية" | "قانونية" | "تطوير ذاتي" | "صحة وسلامة"

export interface CourseRecord {
  id: number
  title: string
  instructor: string
  category: CourseCategory
  duration: string
  startDate: string
  endDate: string
  status: CourseStatus
  employeeCount: number
}

export interface CourseFilters {
  dateFrom: string
  dateTo: string
  category: string
  status: string
}
