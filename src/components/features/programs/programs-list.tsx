"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import ProgramsTable from "./programs-table"
import ProgramFiltersModal from "./programs-filters-modal"
import DataPagination from "../data/data-pagination"
import type { ProgramFilters } from "./programs-types"
import { useProgramsStore } from "@/store/programs/programsStore"

const emptyFilters: ProgramFilters = { type: "", dateFrom: "", dateTo: "", category: "", status: "" }

export default function ProgramsList() {
  const router = useRouter()
  const records = useProgramsStore((s) => s.records)
  const remove = useProgramsStore((s) => s.remove)

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<ProgramFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    const result = records.filter((r) => {
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

    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

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

        <Button onClick={() => router.push("/programs/new")}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة برنامج
        </Button>
      </div>

      <ProgramsTable
        records={paginated}
        onEdit={(p) => router.push(`/programs/${p.id}/edit`)}
        onDelete={(p) => remove(p.id)}
      />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />
    </div>
  )
}
