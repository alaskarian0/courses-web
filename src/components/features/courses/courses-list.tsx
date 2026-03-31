"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import CoursesTable from "./courses-table"
import CoursesModal from "./courses-modal"
import CourseFiltersModal from "./courses-filters-modal"
import DataPagination from "../data/data-pagination"
import type { CourseRecord, CourseFilters } from "./courses-types"
import { DUMMY_COURSES } from "@/mock-data/courses-data"

const emptyFilters: CourseFilters = { dateFrom: "", dateTo: "", category: "", status: "" }

export default function CoursesList() {
  const [records, setRecords] = useState<CourseRecord[]>(DUMMY_COURSES)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<CourseFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.instructor.toLowerCase().includes(q) ||
        r.category.includes(q)

      const matchesFrom = !filters.dateFrom || r.startDate >= filters.dateFrom
      const matchesTo = !filters.dateTo || r.startDate <= filters.dateTo
      const matchesCategory = !filters.category || r.category === filters.category
      const matchesStatus = !filters.status || r.status === filters.status

      return matchesSearch && matchesFrom && matchesTo && matchesCategory && matchesStatus
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleSave = (course: CourseRecord) => {
    if (editingCourse) {
      setRecords((prev) => prev.map((r) => (r.id === course.id ? course : r)))
    } else {
      setRecords((prev) => [...prev, course])
    }
    setEditingCourse(null)
  }

  const handleEdit = (course: CourseRecord) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  const handleDelete = (course: CourseRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== course.id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCourse(null)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">الدورات التدريبية</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو المدرب أو التصنيف..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pr-8 text-right w-full"
          />
        </div>

        <CourseFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة دورة
        </Button>
      </div>

      <CoursesTable
        records={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <CoursesModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingCourse={editingCourse}
        nextId={records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1}
      />
    </div>
  )
}
