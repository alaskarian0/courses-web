"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import UsersTable from "./users-table"
import UsersModal from "./users-modal"
import UserFiltersModal from "./users-filters-modal"
import DataPagination from "../data/data-pagination"
import type { UserRecord, UserFilters } from "./users-types"
import { DUMMY_USERS } from "@/mock-data/users-data"

const emptyFilters: UserFilters = { role: "", department: "", status: "" }

export default function UsersList() {
  const [records, setRecords] = useState<UserRecord[]>(DUMMY_USERS)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<UserFilters>(emptyFilters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department.includes(q)

      const matchesRole = !filters.role || r.role === filters.role
      const matchesDept = !filters.department || r.department === filters.department
      const matchesStatus = !filters.status || r.status === filters.status

      return matchesSearch && matchesRole && matchesDept && matchesStatus
    })
  }, [records, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleSave = (user: UserRecord) => {
    if (editingUser) {
      setRecords((prev) => prev.map((r) => (r.id === user.id ? user : r)))
    } else {
      setRecords((prev) => [...prev, user])
    }
    setEditingUser(null)
  }

  const handleEdit = (user: UserRecord) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = (user: UserRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== user.id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو البريد أو القسم..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>

        <UserFiltersModal
          filters={filters}
          onApply={(f) => { setFilters(f); setCurrentPage(1) }}
          onReset={() => { setFilters(emptyFilters); setCurrentPage(1) }}
        />

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      <UsersTable records={paginated} onEdit={handleEdit} onDelete={handleDelete} />

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <UsersModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingUser={editingUser}
        nextId={records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1}
      />
    </div>
  )
}
