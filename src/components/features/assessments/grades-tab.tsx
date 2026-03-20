"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import DataPagination from "../data/data-pagination"
import GradesTable from "./grades-table"
import GradesFiltersModal from "./grades-filters-modal"
import type { ProgramGrade, GradesFilters } from "./assessments-types"

interface GradesTabProps {
  grades: ProgramGrade[]
}

const emptyFilters: GradesFilters = { program: "", gradeLevel: "" }

export default function GradesTab({ grades }: GradesTabProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<GradesFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return grades.filter((g) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        g.studentName.includes(q) ||
        g.studentDepartment.includes(q) ||
        g.programTitle.includes(q)
      const matchesProgram = !filters.program || g.programTitle === filters.program
      const matchesGrade = !filters.gradeLevel || g.gradeLevel === filters.gradeLevel
      return matchesSearch && matchesProgram && matchesGrade
    })
  }, [grades, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالطالب أو القسم أو البرنامج..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>
        <GradesFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />
      </div>

      <GradesTable grades={paginated} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />
    </>
  )
}
