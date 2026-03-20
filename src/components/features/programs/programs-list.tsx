"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import ProgramsTable from "./programs-table"
import ProgramsModal from "./programs-modal"
import ProgramFiltersModal from "./programs-filters-modal"
import DataPagination from "../data/data-pagination"
import type { ProgramRecord, ProgramFilters, ProgramType, ProgramCategory, ProgramStatus } from "./programs-types"

const courseTitles = [
  "تطوير تطبيقات الويب",
  "إدارة المشاريع الاحترافية PMP",
  "المحاسبة المالية المتقدمة",
  "القانون التجاري والعقود",
  "مهارات القيادة والإدارة",
  "أمن المعلومات والشبكات",
  "تحليل البيانات باستخدام Python",
  "إدارة الموارد البشرية",
  "التسويق الرقمي",
  "السلامة المهنية في بيئة العمل",
  "تطوير تطبيقات الجوال",
  "إدارة سلسلة الإمداد",
  "التخطيط المالي والميزانيات",
  "الامتثال والحوكمة المؤسسية",
  "مهارات التفاوض والإقناع",
  "الذكاء الاصطناعي والتعلم الآلي",
  "إدارة الجودة الشاملة TQM",
  "إعداد التقارير المالية IFRS",
  "حماية البيانات الشخصية",
  "تطوير الذات والإنتاجية",
]

const workshopTitles = [
  "التفكير الإبداعي وحل المشكلات",
  "أمن المعلومات للموظفين",
  "كتابة التقارير الفنية",
  "إدارة الوقت والأولويات",
  "العمل الجماعي وبناء الفرق",
  "مهارات التواصل الفعّال",
  "أساسيات Excel المتقدم",
  "التعامل مع ضغوط العمل",
  "خدمة العملاء المتميزة",
  "أساسيات إدارة المشاريع",
  "التحول الرقمي في المؤسسات",
  "مهارات كتابة المراسلات الرسمية",
  "إدارة الاجتماعات بفاعلية",
  "التخطيط الشخصي والمهني",
  "مهارات التفاوض في بيئة العمل",
]

const instructors = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
]

const locations = [
  "قاعة التدريب 1", "قاعة التدريب 2", "قاعة المؤتمرات",
  "مختبر الحاسوب", "القاعة الرئيسية", "غرفة الاجتماعات أ", "غرفة الاجتماعات ب",
]

const categoryList: ProgramCategory[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const statusList: ProgramStatus[] = ["مفتوح", "جاري", "مكتمل", "ملغي"]
const durations = ["10 ساعات", "15 ساعة", "20 ساعة", "25 ساعة", "30 ساعة", "35 ساعة", "40 ساعة", "50 ساعة"]

const DUMMY_PROGRAMS: ProgramRecord[] = [
  ...courseTitles.map((title, i) => {
    const startMonth = (i % 12) + 1
    const startDay = (i % 28) + 1
    const endMonth = Math.min(startMonth + 1, 12)
    const cap = 20 + ((i * 7) % 40)
    return {
      id: i + 1,
      title,
      type: "دورة" as ProgramType,
      instructor: instructors[i % instructors.length],
      category: categoryList[i % categoryList.length],
      duration: durations[i % durations.length],
      startDate: `2025-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`,
      endDate: `2025-${String(endMonth).padStart(2, "0")}-${String(Math.min(startDay + 15, 28)).padStart(2, "0")}`,
      location: locations[i % locations.length],
      capacity: cap,
      registered: Math.min(cap, 5 + ((i * 3) % cap)),
      status: statusList[i % statusList.length],
    }
  }),
  ...workshopTitles.map((title, i) => {
    const month = ((i + 3) % 12) + 1
    const day = ((i * 2) % 28) + 1
    const cap = 15 + ((i * 5) % 30)
    return {
      id: courseTitles.length + i + 1,
      title,
      type: "ورشة عمل" as ProgramType,
      instructor: instructors[(i + 3) % instructors.length],
      category: categoryList[(i + 2) % categoryList.length],
      duration: `${3 + (i % 5)} ساعات`,
      startDate: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      endDate: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      location: locations[(i + 1) % locations.length],
      capacity: cap,
      registered: Math.min(cap, 3 + ((i * 4) % cap)),
      status: statusList[(i + 1) % statusList.length],
    }
  }),
]

const emptyFilters: ProgramFilters = { type: "", dateFrom: "", dateTo: "", category: "", status: "" }

export default function ProgramsList() {
  const [records, setRecords] = useState<ProgramRecord[]>(DUMMY_PROGRAMS)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<ProgramFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<ProgramRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.instructor.toLowerCase().includes(q) ||
        r.category.includes(q) ||
        r.location.includes(q)

      const matchesType = !filters.type || r.type === filters.type
      const matchesFrom = !filters.dateFrom || r.startDate >= filters.dateFrom
      const matchesTo = !filters.dateTo || r.startDate <= filters.dateTo
      const matchesCategory = !filters.category || r.category === filters.category
      const matchesStatus = !filters.status || r.status === filters.status

      return matchesSearch && matchesType && matchesFrom && matchesTo && matchesCategory && matchesStatus
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleSave = (program: ProgramRecord) => {
    if (editingProgram) {
      setRecords((prev) => prev.map((r) => (r.id === program.id ? program : r)))
    } else {
      setRecords((prev) => [...prev, program])
    }
    setEditingProgram(null)
  }

  const handleEdit = (program: ProgramRecord) => {
    setEditingProgram(program)
    setIsModalOpen(true)
  }

  const handleDelete = (program: ProgramRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== program.id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProgram(null)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">البرامج التدريبية</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو المدرب أو التصنيف أو الموقع..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>

        <ProgramFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة برنامج
        </Button>
      </div>

      <ProgramsTable records={paginated} onEdit={handleEdit} onDelete={handleDelete} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <ProgramsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingProgram={editingProgram}
        nextId={records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1}
      />
    </div>
  )
}
