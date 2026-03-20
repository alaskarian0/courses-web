"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import MarksTable from "./marks-table"
import MarksFiltersModal from "./marks-filters-modal"
import MarkEntryModal from "./mark-entry-modal"
import type { StudentQuizMark, Quiz, MarksFilters } from "./assessments-types"

interface MarksTabProps {
  marks: StudentQuizMark[]
  quizzes: Quiz[]
  onUpdateMarks: (marks: StudentQuizMark[]) => void
  initialQuizId: number | null
}

const emptyFilters: MarksFilters = { program: "", quiz: "", status: "" }

export default function MarksTab({ marks, quizzes, onUpdateMarks, initialQuizId }: MarksTabProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<MarksFilters>(() => ({
    ...emptyFilters,
    quiz: initialQuizId !== null ? String(initialQuizId) : "",
  }))
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingMark, setEditingMark] = useState<StudentQuizMark | null>(null)

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      quiz: initialQuizId !== null ? String(initialQuizId) : "",
    }))
    setCurrentPage(1)
  }, [initialQuizId])

  const filtered = useMemo(() => {
    return marks.filter((m) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        m.studentName.includes(q) ||
        m.quizTitle.includes(q) ||
        m.studentDepartment.includes(q)
      const matchesProgram = !filters.program || m.programTitle === filters.program
      const matchesQuiz = !filters.quiz || String(m.quizId) === filters.quiz
      const matchesStatus = !filters.status || m.status === filters.status
      return matchesSearch && matchesProgram && matchesQuiz && matchesStatus
    })
  }, [marks, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleEditMark = (mark: StudentQuizMark) => {
    setEditingMark(mark)
    setEditModalOpen(true)
  }

  const handleSaveMark = (updated: StudentQuizMark) => {
    onUpdateMarks(marks.map((m) => (m.id === updated.id ? updated : m)))
    toast.success("تم تحديث الدرجة بنجاح")
  }

  const handleApplyFilters = (f: MarksFilters) => {
    setFilters(f)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setFilters(emptyFilters)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم الطالب أو الاختبار أو القسم..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>
        <MarksFiltersModal
          filters={filters}
          quizzes={quizzes}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </div>

      <MarksTable marks={paginated} onEditMark={handleEditMark} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <MarkEntryModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveMark}
        editingMark={editingMark}
      />
    </>
  )
}
