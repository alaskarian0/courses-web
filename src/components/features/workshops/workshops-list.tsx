"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import WorkshopsTable from "./workshops-table"
import WorkshopsModal from "./workshops-modal"
import WorkshopFiltersModal from "./workshops-filters-modal"
import DataPagination from "../data/data-pagination"
import type { WorkshopRecord, WorkshopFilters } from "./workshops-types"
import { DUMMY_WORKSHOPS } from "@/mock-data/workshops-data"

const emptyFilters: WorkshopFilters = { dateFrom: "", dateTo: "", status: "" }

export default function WorkshopsList() {
  const [records, setRecords] = useState<WorkshopRecord[]>(DUMMY_WORKSHOPS)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<WorkshopFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.facilitator.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)

      const matchesFrom = !filters.dateFrom || r.date >= filters.dateFrom
      const matchesTo = !filters.dateTo || r.date <= filters.dateTo
      const matchesStatus = !filters.status || r.status === filters.status

      return matchesSearch && matchesFrom && matchesTo && matchesStatus
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleSave = (workshop: WorkshopRecord) => {
    if (editingWorkshop) {
      setRecords((prev) => prev.map((r) => (r.id === workshop.id ? workshop : r)))
    } else {
      setRecords((prev) => [...prev, workshop])
    }
    setEditingWorkshop(null)
  }

  const handleEdit = (workshop: WorkshopRecord) => {
    setEditingWorkshop(workshop)
    setIsModalOpen(true)
  }

  const handleDelete = (workshop: WorkshopRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== workshop.id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingWorkshop(null)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">ورش العمل</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو المُيسّر أو الموقع..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pr-8 text-right w-full"
          />
        </div>

        <WorkshopFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة ورشة
        </Button>
      </div>

      <WorkshopsTable
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

      <WorkshopsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingWorkshop={editingWorkshop}
        nextId={records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1}
      />
    </div>
  )
}
