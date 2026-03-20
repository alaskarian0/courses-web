export type RequestStatus = "قيد المراجعة" | "مقبول" | "مرفوض" | "ملغي"
export type AnnouncementType = "دورة" | "ورشة عمل"

export interface Announcement {
  id: number
  title: string
  type: AnnouncementType
  instructor: string
  category: string
  duration: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  registered: number
  description: string
  status: "مفتوح" | "مغلق"
  linkedProgramId: number | null
  linkedProgramTitle: string
}

export interface EnrollmentRequest {
  id: number
  announcementId: number
  announcementTitle: string
  announcementType: AnnouncementType
  employeeName: string
  employeeDepartment: string
  requestDate: string
  status: RequestStatus
  notes: string
  reviewedBy: string
  reviewDate: string
}

export interface EnrollmentFilters {
  status: string
  type: string
  department: string
}
