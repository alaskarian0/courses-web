export type UserRole = "مشرف" | "مدرب" | "موظف" | "مدير"
export type UserStatus = "نشط" | "معطل"

export interface UserRecord {
  id: number
  name: string
  email: string
  role: UserRole
  department: string
  joinDate: string
  status: UserStatus
  coursesCount: number
  workshopsCount: number
}

export interface UserFilters {
  role: string
  department: string
  status: string
}
