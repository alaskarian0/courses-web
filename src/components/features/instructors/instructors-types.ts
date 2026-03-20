export type InstructorType = "داخلي" | "خارجي"
export type InstructorStatus = "نشط" | "غير نشط"
export type InstructorSpecialty = "تقنية" | "إدارية" | "مالية" | "قانونية" | "تطوير ذاتي" | "صحة وسلامة"

export interface InstructorRecord {
  id: number
  name: string
  email: string
  phone: string
  type: InstructorType
  organization: string
  specialty: InstructorSpecialty
  coursesCount: number
  workshopsCount: number
  rating: number
  status: InstructorStatus
}

export interface InstructorFilters {
  type: string
  specialty: string
  status: string
}
