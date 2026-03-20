"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import InstructorsTable from "./instructors-table"
import InstructorsModal from "./instructors-modal"
import InstructorFiltersModal from "./instructors-filters-modal"
import DataPagination from "../data/data-pagination"
import type { InstructorRecord, InstructorFilters, InstructorType, InstructorStatus, InstructorSpecialty } from "./instructors-types"

const internalNames = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
]

const externalNames = [
  "د. خالد المنصور", "م. ليلى الأحمد", "أ. سعيد الغامدي", "د. منى الشريف",
  "م. طارق العبدالله", "أ. هناء الدوسري", "د. فهد القحطاني", "م. رنا الحربي",
  "أ. ناصر العتيبي", "د. سمية البلوشي", "م. عادل الزهراني", "أ. وفاء المطيري",
  "د. بدر الشهري", "م. أمينة الراشدي", "أ. يزيد الحارثي",
]

const externalOrgs = [
  "معهد التطوير المهني", "أكاديمية القيادة", "مركز الخبراء للتدريب",
  "شركة المعرفة للاستشارات", "معهد الإبداع التقني", "مركز التميز الإداري",
  "أكاديمية المستقبل", "معهد الجودة الشاملة",
]

const specialties: InstructorSpecialty[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]

const DUMMY_INSTRUCTORS: InstructorRecord[] = [
  ...internalNames.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.split(" ")[0].toLowerCase()}${i + 1}@company.com`,
    phone: `0599${String(1000000 + i * 111111).slice(0, 6)}`,
    type: "داخلي" as InstructorType,
    organization: "المؤسسة",
    specialty: specialties[i % specialties.length],
    coursesCount: (i * 3) % 10 + 1,
    workshopsCount: (i * 2) % 7,
    rating: Math.round((3.5 + (i % 4) * 0.4) * 10) / 10,
    status: (i % 8 === 0 ? "غير نشط" : "نشط") as InstructorStatus,
  })),
  ...externalNames.map((name, i) => ({
    id: internalNames.length + i + 1,
    name,
    email: `${name.split(" ").pop()?.toLowerCase()}${i + 1}@external.com`,
    phone: `0555${String(2000000 + i * 123456).slice(0, 6)}`,
    type: "خارجي" as InstructorType,
    organization: externalOrgs[i % externalOrgs.length],
    specialty: specialties[(i + 2) % specialties.length],
    coursesCount: (i * 2) % 8 + 1,
    workshopsCount: (i * 3) % 5 + 1,
    rating: Math.round((3.2 + (i % 5) * 0.35) * 10) / 10,
    status: (i % 6 === 0 ? "غير نشط" : "نشط") as InstructorStatus,
  })),
]

const emptyFilters: InstructorFilters = { type: "", specialty: "", status: "" }

export default function InstructorsList() {
  const [records, setRecords] = useState<InstructorRecord[]>(DUMMY_INSTRUCTORS)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<InstructorFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<InstructorRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.organization.includes(q) ||
        r.specialty.includes(q)

      const matchesType = !filters.type || r.type === filters.type
      const matchesSpecialty = !filters.specialty || r.specialty === filters.specialty
      const matchesStatus = !filters.status || r.status === filters.status

      return matchesSearch && matchesType && matchesSpecialty && matchesStatus
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleSave = (instructor: InstructorRecord) => {
    if (editingInstructor) {
      setRecords((prev) => prev.map((r) => (r.id === instructor.id ? instructor : r)))
    } else {
      setRecords((prev) => [...prev, instructor])
    }
    setEditingInstructor(null)
  }

  const handleEdit = (instructor: InstructorRecord) => {
    setEditingInstructor(instructor)
    setIsModalOpen(true)
  }

  const handleDelete = (instructor: InstructorRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== instructor.id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingInstructor(null)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">إدارة المدربين</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو البريد أو الجهة أو التخصص..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>

        <InstructorFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مدرب
        </Button>
      </div>

      <InstructorsTable records={paginated} onEdit={handleEdit} onDelete={handleDelete} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <InstructorsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingInstructor={editingInstructor}
        nextId={records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1}
      />
    </div>
  )
}
