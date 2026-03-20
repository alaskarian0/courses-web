export type WorkshopStatus = "قادم" | "جاري" | "منتهي" | "ملغي"

export interface WorkshopRecord {
  id: number
  title: string
  facilitator: string
  location: string
  date: string
  timeSlot: string
  capacity: number
  registered: number
  status: WorkshopStatus
}

export interface WorkshopFilters {
  dateFrom: string
  dateTo: string
  status: string
}
