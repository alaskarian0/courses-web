import type { DataRecord } from "@/components/features/data/data-types"

const arabicValues = [
  "تقرير الميزانية",
  "بيانات الموظفين",
  "سجل المبيعات",
  "قائمة العملاء",
  "طلبات الشراء",
  "فواتير المورّدين",
  "كشف الرواتب",
  "تقرير المخزون",
  "بيانات المشاريع",
  "سجل العقود",
]

const arabicDates = [
  "2024-01-05",
  "2024-02-12",
  "2024-03-20",
  "2024-04-08",
  "2024-05-15",
  "2024-06-22",
  "2024-07-03",
  "2024-08-18",
  "2024-09-27",
  "2024-10-11",
  "2024-11-30",
  "2024-12-07",
]

export const DUMMY_DATA: DataRecord[] = Array.from({ length: 97 }, (_, i) => ({
  rowNumber: i + 1,
  value: arabicValues[i % arabicValues.length] + ` - ${i + 1}`,
  date: arabicDates[i % arabicDates.length],
}))
