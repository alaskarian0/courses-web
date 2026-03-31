"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import InstructorsTable from "./instructors-table"
import InstructorFiltersModal from "./instructors-filters-modal"
import DataPagination from "../data/data-pagination"
import type { InstructorFilters } from "./instructors-types"
import { useInstructorsStore } from "@/store/instructors/instructorsStore"

const emptyFilters: InstructorFilters = { type: "", specialty: "", status: "" }

export default function InstructorsList() {
  const router = useRouter()
  const records = useInstructorsStore((s) => s.records)
  const remove = useInstructorsStore((s) => s.remove)

  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<InstructorFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    const result = records.filter((r) => {
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

        <Button onClick={() => router.push("/instructors/new")}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مدرب
        </Button>
      </div>

      <InstructorsTable
        records={paginated}
        onEdit={(i) => router.push(`/instructors/${i.id}/edit`)}
        onDelete={(i) => remove(i.id)}
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
