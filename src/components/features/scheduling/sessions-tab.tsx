"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  ArrowRight,
  AlertTriangle,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import type { ClassSession, TrainingHall, SessionStatus, TimeSlot, SessionFilters } from "./scheduling-types"
import { SESSION_STATUSES, PROGRAM_OPTIONS, INSTRUCTOR_OPTIONS, TIME_SLOTS, getDayOfWeek } from "@/mock-data/scheduling-data"
import { useConfirmModal } from "@/components/common/confirm-modal"

const sessionStatusColor: Record<SessionStatus, string> = {
  "مجدولة": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  "جارية": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  "مكتملة": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "ملغاة": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const emptyFilters: SessionFilters = { hall: "", date: "", status: "" }

type FormState = {
  programTitle: string
  instructorName: string
  hallId: string
  date: string
  timeSlot: TimeSlot
  status: SessionStatus
}

const emptyForm: FormState = {
  programTitle: "",
  instructorName: "",
  hallId: "",
  date: "",
  timeSlot: TIME_SLOTS[0],
  status: "مجدولة",
}

interface SessionsTabProps {
  sessions: ClassSession[]
  halls: TrainingHall[]
  onUpdateSessions: (sessions: ClassSession[]) => void
  onNavigateToDistribution: (sessionId: number) => void
}

export default function SessionsTab({ sessions, halls, onUpdateSessions, onNavigateToDistribution }: SessionsTabProps) {
  // ── list state ──
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<SessionFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<SessionFilters>(emptyFilters)

  // ── form state ──
  const [view, setView] = useState<"list" | "form">("list")
  const [editing, setEditing] = useState<ClassSession | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { openConfirm, ConfirmModal } = useConfirmModal()

  const availableHalls = halls.filter(h => h.status !== "صيانة")

  const conflict = useMemo(() => {
    if (!form.hallId || !form.date || !form.timeSlot) return ""
    const existing = sessions.find(s =>
      s.hallId === Number(form.hallId) &&
      s.date === form.date &&
      s.timeSlot === form.timeSlot &&
      (!editing || s.id !== editing.id)
    )
    return existing ? `تعارض: القاعة محجوزة لـ "${existing.programTitle}" في نفس الوقت` : ""
  }, [form.hallId, form.date, form.timeSlot, sessions, editing])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
    setView("form")
  }

  const openEdit = (session: ClassSession) => {
    setEditing(session)
    setForm({
      programTitle: session.programTitle,
      instructorName: session.instructorName,
      hallId: String(session.hallId),
      date: session.date,
      timeSlot: session.timeSlot,
      status: session.status,
    })
    setFormErrors({})
    setView("form")
  }

  const backToList = () => {
    setView("list")
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (formErrors[key]) setFormErrors(prev => ({ ...prev, [key]: "" }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.programTitle) errs.programTitle = "البرنامج مطلوب"
    if (!form.instructorName) errs.instructorName = "المدرب مطلوب"
    if (!form.hallId) errs.hallId = "القاعة مطلوبة"
    if (!form.date) errs.date = "التاريخ مطلوب"
    if (conflict) errs.conflict = "يوجد تعارض في الجدول"
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    const hall = halls.find(h => h.id === Number(form.hallId))!
    const data: Omit<ClassSession, "id"> = {
      programTitle: form.programTitle,
      instructorName: form.instructorName,
      hallId: Number(form.hallId),
      hallName: hall.name,
      date: form.date,
      dayOfWeek: getDayOfWeek(form.date),
      timeSlot: form.timeSlot,
      capacity: hall.capacity,
      assignedCount: editing?.assignedCount ?? 0,
      status: form.status,
    }

    if (editing) {
      onUpdateSessions(sessions.map(s => s.id === editing.id ? { ...s, ...data } : s))
      toast.success("تم تحديث الجلسة بنجاح")
    } else {
      const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
      onUpdateSessions([...sessions, { id: newId, ...data }])
      toast.success("تم إضافة الجلسة بنجاح")
    }
    backToList()
  }

  const handleDelete = (session: ClassSession) => {
    openConfirm({
      title: "حذف الجلسة",
      message: `هل أنت متأكد من حذف جلسة "${session.programTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: "destructive",
      confirmText: "حذف",
      onConfirm: () => {
        onUpdateSessions(sessions.filter(s => s.id !== session.id))
        toast.success(`تم حذف الجلسة "${session.programTitle}"`)
      },
    })
  }

  const filtered = useMemo(() => sessions.filter((s) => {
    const q = search.toLowerCase()
    return (
      (!q || s.programTitle.includes(q) || s.instructorName.includes(q) || s.hallName.includes(q)) &&
      (!filters.hall || s.hallName === filters.hall) &&
      (!filters.date || s.date === filters.date) &&
      (!filters.status || s.status === filters.status)
    )
  }), [sessions, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const activeFilterCount = [filters.hall, filters.date, filters.status].filter(Boolean).length
  const hallNames = [...new Set(sessions.map(s => s.hallName))]

  // ════════════════════════════════════════════
  // FORM VIEW
  // ════════════════════════════════════════════
  if (view === "form") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={backToList}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {editing ? "تعديل الجلسة" : "إضافة جلسة تدريبية"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editing ? `تعديل بيانات جلسة: ${editing.programTitle}` : "أدخل بيانات الجلسة التدريبية الجديدة"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">بيانات الجلسة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>البرنامج التدريبي</Label>
                  <Select value={form.programTitle || "placeholder"} onValueChange={(v) => setField("programTitle", v === "placeholder" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="اختر البرنامج..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder" disabled>اختر البرنامج...</SelectItem>
                      {PROGRAM_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {formErrors.programTitle && <p className="text-sm text-destructive">{formErrors.programTitle}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>المدرب</Label>
                  <Select value={form.instructorName || "placeholder"} onValueChange={(v) => setField("instructorName", v === "placeholder" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="اختر المدرب..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder" disabled>اختر المدرب...</SelectItem>
                      {INSTRUCTOR_OPTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {formErrors.instructorName && <p className="text-sm text-destructive">{formErrors.instructorName}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">الموعد والمكان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>القاعة</Label>
                  <Select value={form.hallId || "placeholder"} onValueChange={(v) => setField("hallId", v === "placeholder" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="اختر القاعة..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placeholder" disabled>اختر القاعة...</SelectItem>
                      {availableHalls.map(h => (
                        <SelectItem key={h.id} value={String(h.id)}>
                          {h.name} — {h.capacity} مقعد
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.hallId && <p className="text-sm text-destructive">{formErrors.hallId}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>الوقت</Label>
                  <Select value={form.timeSlot} onValueChange={(v) => setField("timeSlot", v as TimeSlot)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="session-date">التاريخ</Label>
                  <Input
                    id="session-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                  />
                  {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
                  {form.date && <p className="text-xs text-muted-foreground">{getDayOfWeek(form.date)}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>الحالة</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v as SessionStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SESSION_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {conflict && (
                <div className="flex items-center gap-2 rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {conflict}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={!!conflict}>
              {editing ? "حفظ التعديلات" : "إضافة الجلسة"}
            </Button>
            <Button type="button" variant="outline" onClick={backToList}>إلغاء</Button>
          </div>
        </form>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50">
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
              paginated.map((session, idx) => {
                const pct = session.capacity > 0 ? Math.round((session.assignedCount / session.capacity) * 100) : 0
                const isNearFull = pct >= 85
                return (
                  <TableRow key={session.id} className="transition-colors hover:bg-accent/50">
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium max-w-45 truncate">{session.programTitle}</TableCell>
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
                              <BookOpen className="h-4 w-4 text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>تفاصيل الدورة</TooltipContent>
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

      <ConfirmModal />

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-100" dir="rtl">
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
                  {hallNames.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
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
                  {SESSION_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
