"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import type { TrainingHall, HallStatus, HallFilters } from "./scheduling-types"
import { BUILDINGS } from "./scheduling-data"
import HallsModal from "./halls-modal"

const hallStatusColor: Record<HallStatus, string> = {
  "متاحة": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "مشغولة": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  "صيانة": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const emptyFilters: HallFilters = { building: "", status: "" }

interface HallsTabProps {
  halls: TrainingHall[]
  onUpdate: (halls: TrainingHall[]) => void
}

export default function HallsTab({ halls, onUpdate }: HallsTabProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<HallFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TrainingHall | null>(null)

  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<HallFilters>(emptyFilters)

  const filtered = useMemo(() => {
    return halls.filter((h) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || h.name.includes(q) || h.building.includes(q)
      const matchesBuilding = !filters.building || h.building === filters.building
      const matchesStatus = !filters.status || h.status === filters.status
      return matchesSearch && matchesBuilding && matchesStatus
    })
  }, [halls, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const activeFilterCount = [filters.building, filters.status].filter(Boolean).length

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (hall: TrainingHall) => { setEditing(hall); setModalOpen(true) }

  const handleSave = (data: Omit<TrainingHall, "id">) => {
    if (editing) {
      onUpdate(halls.map(h => h.id === editing.id ? { ...h, ...data } : h))
      toast.success("تم تحديث القاعة بنجاح")
    } else {
      const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1
      onUpdate([...halls, { id: newId, ...data }])
      toast.success("تم إضافة القاعة بنجاح")
    }
  }

  const handleDelete = (hall: TrainingHall) => {
    onUpdate(halls.filter(h => h.id !== hall.id))
    toast.success(`تم حذف القاعة "${hall.name}"`)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم القاعة أو المبنى..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>
        <Button
          variant="outline"
          className="relative"
          onClick={() => { setLocalFilters(filters); setFilterOpen(true) }}
        >
          <SlidersHorizontal className="ml-2 h-4 w-4" />
          تصفية
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Button onClick={openAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة قاعة
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">اسم القاعة</TableHead>
              <TableHead className="text-right">المبنى</TableHead>
              <TableHead className="text-right">الطابق</TableHead>
              <TableHead className="text-right">السعة</TableHead>
              <TableHead className="text-right">المعدات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-24 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  لا توجد قاعات.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((hall) => (
                <TableRow key={hall.id} className="transition-colors hover:bg-accent/50">
                  <TableCell className="font-medium">{hall.id}</TableCell>
                  <TableCell className="font-medium">{hall.name}</TableCell>
                  <TableCell className="text-muted-foreground">{hall.building}</TableCell>
                  <TableCell className="text-muted-foreground">{hall.floor}</TableCell>
                  <TableCell>{hall.capacity} مقعد</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {hall.equipment.map(eq => (
                        <Badge key={eq} variant="outline" className="text-[10px] px-1.5 py-0">
                          {eq}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${hallStatusColor[hall.status]}`}>
                      {hall.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(hall)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>تعديل</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(hall)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>حذف</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      {/* Add/Edit Modal */}
      <HallsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        onSave={handleSave}
      />

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تصفية القاعات
              {activeFilterCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground mr-2">({activeFilterCount} فلاتر نشطة)</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>المبنى</Label>
              <Select value={localFilters.building || "all"} onValueChange={(v) => setLocalFilters(p => ({ ...p, building: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {BUILDINGS.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={localFilters.status || "all"} onValueChange={(v) => setLocalFilters(p => ({ ...p, status: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="متاحة">متاحة</SelectItem>
                  <SelectItem value="مشغولة">مشغولة</SelectItem>
                  <SelectItem value="صيانة">صيانة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start gap-2 pt-2">
              <Button onClick={() => { setFilters(localFilters); setCurrentPage(1); setFilterOpen(false) }}>تطبيق</Button>
              <Button variant="outline" onClick={() => { setFilters(emptyFilters); setLocalFilters(emptyFilters); setCurrentPage(1); setFilterOpen(false) }}>إعادة تعيين</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
