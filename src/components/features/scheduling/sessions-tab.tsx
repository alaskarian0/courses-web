"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import type { ClassSession, TrainingHall, SessionStatus, SessionFilters } from "./scheduling-types"
import { SESSION_STATUSES } from "./scheduling-data"
import SessionsModal from "./sessions-modal"

const sessionStatusColor: Record<SessionStatus, string> = {
  "مجدولة": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  "جارية": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  "مكتملة": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "ملغاة": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const emptyFilters: SessionFilters = { hall: "", date: "", status: "" }

interface SessionsTabProps {
  sessions: ClassSession[]
  halls: TrainingHall[]
  onUpdateSessions: (sessions: ClassSession[]) => void
  onNavigateToDistribution: (sessionId: number) => void
}

export default function SessionsTab({ sessions, halls, onUpdateSessions, onNavigateToDistribution }: SessionsTabProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<SessionFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ClassSession | null>(null)

  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<SessionFilters>(emptyFilters)

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || s.programTitle.includes(q) || s.instructorName.includes(q) || s.hallName.includes(q)
      const matchesHall = !filters.hall || s.hallName === filters.hall
      const matchesDate = !filters.date || s.date === filters.date
      const matchesStatus = !filters.status || s.status === filters.status
      return matchesSearch && matchesHall && matchesDate && matchesStatus
    })
  }, [sessions, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const activeFilterCount = [filters.hall, filters.date, filters.status].filter(Boolean).length

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (session: ClassSession) => { setEditing(session); setModalOpen(true) }

  const handleSave = (data: Omit<ClassSession, "id">) => {
    if (editing) {
      onUpdateSessions(sessions.map(s => s.id === editing.id ? { ...s, ...data } : s))
      toast.success("تم تحديث الجلسة بنجاح")
    } else {
      const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
      onUpdateSessions([...sessions, { id: newId, ...data }])
      toast.success("تم إضافة الجلسة بنجاح")
    }
  }

  const handleDelete = (session: ClassSession) => {
    onUpdateSessions(sessions.filter(s => s.id !== session.id))
    toast.success(`تم حذف الجلسة "${session.programTitle}"`)
  }

  const hallNames = [...new Set(sessions.map(s => s.hallName))]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالبرنامج أو المدرب أو القاعة..."
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
          إضافة جلسة
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">البرنامج</TableHead>
              <TableHead className="text-right">المدرب</TableHead>
              <TableHead className="text-right">القاعة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">اليوم</TableHead>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">المتدربين</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-28 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  لا توجد جلسات.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((session) => {
                const pct = session.capacity > 0 ? Math.round((session.assignedCount / session.capacity) * 100) : 0
                const isNearFull = pct >= 85
                return (
                  <TableRow key={session.id} className="transition-colors hover:bg-accent/50">
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell className="font-medium max-w-[180px] truncate">{session.programTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{session.instructorName}</TableCell>
                    <TableCell className="text-muted-foreground">{session.hallName}</TableCell>
                    <TableCell className="text-muted-foreground">{session.date}</TableCell>
                    <TableCell className="text-muted-foreground">{session.dayOfWeek}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{session.timeSlot}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`text-xs font-medium ${isNearFull ? "text-amber-600 dark:text-amber-400" : ""}`}>
                          {session.assignedCount}/{session.capacity}
                        </span>
                        <div className="w-14 h-1.5 bg-muted rounded-full">
                          <div
                            className={`h-full rounded-full ${isNearFull ? "bg-amber-500" : "bg-primary"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${sessionStatusColor[session.status]}`}>
                        {session.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => onNavigateToDistribution(session.id)}>
                              <UsersRound className="h-4 w-4 text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>توزيع المتدربين</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEdit(session)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>تعديل</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(session)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>حذف</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
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
      <SessionsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        halls={halls}
        sessions={sessions}
        onSave={handleSave}
      />

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تصفية الجلسات
              {activeFilterCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground mr-2">({activeFilterCount} فلاتر نشطة)</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>القاعة</Label>
              <Select value={localFilters.hall || "all"} onValueChange={(v) => setLocalFilters(p => ({ ...p, hall: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {hallNames.map(h => (<SelectItem key={h} value={h}>{h}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="filter-date">التاريخ</Label>
              <Input
                id="filter-date"
                type="date"
                value={localFilters.date}
                onChange={(e) => setLocalFilters(p => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={localFilters.status || "all"} onValueChange={(v) => setLocalFilters(p => ({ ...p, status: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {SESSION_STATUSES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
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
