"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Eye,
  GraduationCap,
  Presentation,
  Link2,
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import { useConfirmModal } from "@/components/common/confirm-modal"
import type { Announcement, AnnouncementType } from "./enrollments-types"
import { AVAILABLE_PROGRAMS, DUMMY_ANNOUNCEMENTS } from "@/mock-data/enrollments-data"

const categoriesList = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const typesList: AnnouncementType[] = ["دورة", "ورشة عمل"]
const statusesList: ("مفتوح" | "مغلق")[] = ["مفتوح", "مغلق"]

const statusColor: Record<string, string> = {
  "مفتوح": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "مغلق": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const typeColor: Record<string, string> = {
  "دورة": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  "ورشة عمل": "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800",
}

interface AnnouncementFilters {
  type: string
  category: string
  status: string
}

const emptyFilters: AnnouncementFilters = { type: "", category: "", status: "" }

// ─── Component ──────────────────────────────────────────────────────────────

export default function AnnouncementsList() {
  const { openConfirm, ConfirmModal } = useConfirmModal()
  const [records, setRecords] = useState<Announcement[]>(DUMMY_ANNOUNCEMENTS)
  const [search, setSearch] = useState("")
  const [typeTab, setTypeTab] = useState("all")
  const [filters, setFilters] = useState<AnnouncementFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Add/Edit modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)

  // Details modal
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<Announcement | null>(null)

  // Filter modal
  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<AnnouncementFilters>(emptyFilters)

  // Form state
  const [form, setForm] = useState({
    title: "", type: "دورة" as AnnouncementType, instructor: "", category: "تقنية",
    duration: "", startDate: "", endDate: "", location: "", capacity: "",
    description: "", status: "مفتوح" as "مفتوح" | "مغلق",
    linkedProgramId: "" as string,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || r.title.includes(q) || r.instructor.includes(q) || r.category.includes(q) || r.location.includes(q)
      const matchesType = typeTab === "all" || r.type === typeTab
      const matchesCategory = !filters.category || r.category === filters.category
      const matchesStatus = !filters.status || r.status === filters.status
      return matchesSearch && matchesType && matchesCategory && matchesStatus
    })
  }, [records, search, typeTab, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const activeFilterCount = [filters.category, filters.status].filter(Boolean).length

  const openAddModal = () => {
    setEditing(null)
    setForm({ title: "", type: "دورة", instructor: "", category: "تقنية", duration: "", startDate: "", endDate: "", location: "", capacity: "", description: "", status: "مفتوح", linkedProgramId: "" })
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (ann: Announcement) => {
    setEditing(ann)
    setForm({
      title: ann.title, type: ann.type, instructor: ann.instructor, category: ann.category,
      duration: ann.duration, startDate: ann.startDate, endDate: ann.endDate,
      location: ann.location, capacity: String(ann.capacity), description: ann.description, status: ann.status,
      linkedProgramId: ann.linkedProgramId ? String(ann.linkedProgramId) : "",
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "العنوان مطلوب"
    if (!form.instructor.trim()) errs.instructor = "المدرب مطلوب"
    if (!form.duration.trim()) errs.duration = "المدة مطلوبة"
    if (!form.startDate) errs.startDate = "تاريخ البداية مطلوب"
    if (!form.endDate) errs.endDate = "تاريخ النهاية مطلوب"
    if (!form.location.trim()) errs.location = "الموقع مطلوب"
    if (!form.capacity || Number(form.capacity) <= 0) errs.capacity = "السعة مطلوبة"
    if (!form.description.trim()) errs.description = "الوصف مطلوب"
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    const selectedProgram = form.linkedProgramId
      ? AVAILABLE_PROGRAMS.find(p => p.id === Number(form.linkedProgramId))
      : null

    if (editing) {
      setRecords(prev => prev.map(r => r.id === editing.id ? {
        ...r, title: form.title.trim(), type: form.type, instructor: form.instructor.trim(),
        category: form.category, duration: form.duration.trim(), startDate: form.startDate,
        endDate: form.endDate, location: form.location.trim(), capacity: Number(form.capacity),
        description: form.description.trim(), status: form.status,
        linkedProgramId: selectedProgram ? selectedProgram.id : null,
        linkedProgramTitle: selectedProgram ? selectedProgram.title : "",
      } : r))
      toast.success("تم تحديث الإعلان بنجاح")
    } else {
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1
      setRecords(prev => [...prev, {
        id: newId, title: form.title.trim(), type: form.type, instructor: form.instructor.trim(),
        category: form.category, duration: form.duration.trim(), startDate: form.startDate,
        endDate: form.endDate, location: form.location.trim(), capacity: Number(form.capacity),
        registered: 0, description: form.description.trim(), status: form.status,
        linkedProgramId: selectedProgram ? selectedProgram.id : null,
        linkedProgramTitle: selectedProgram ? selectedProgram.title : "",
      }])
      toast.success("تم إنشاء الإعلان بنجاح")
    }
    setModalOpen(false)
  }

  const handleDelete = (ann: Announcement) => {
    openConfirm({
      title: "حذف الإعلان التدريبي",
      message: `هل أنت متأكد من حذف "${ann.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "destructive",
      onConfirm: () => {
        setRecords(prev => prev.filter(r => r.id !== ann.id))
        toast.success(`تم حذف الإعلان "${ann.title}"`)
      },
    })
  }

  const handleOpenDetails = (ann: Announcement) => {
    setDetailsItem(ann)
    setDetailsOpen(true)
  }

  const capacityPercent = (a: Announcement) => a.capacity > 0 ? Math.round((a.registered / a.capacity) * 100) : 0

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <h1 className="text-2xl font-bold">الإعلانات التدريبية</h1>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالعنوان أو المدرب أو التصنيف..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pr-8 text-right w-full"
          />
        </div>

        <Tabs value={typeTab} onValueChange={(v) => { setTypeTab(v); setCurrentPage(1) }}>
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="دورة">
              <GraduationCap className="h-3.5 w-3.5 ml-1" />
              دورات
            </TabsTrigger>
            <TabsTrigger value="ورشة عمل">
              <Presentation className="h-3.5 w-3.5 ml-1" />
              ورش عمل
            </TabsTrigger>
          </TabsList>
        </Tabs>

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

        <Button onClick={openAddModal}>
          <Plus className="ml-2 h-4 w-4" />
          إعلان جديد
        </Button>
      </div>

      {/* ── Table ── */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">المدرب</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">السعة</TableHead>
              <TableHead className="text-right">البرنامج المرتبط</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-28 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                  لا توجد إعلانات.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((ann) => {
                const pct = capacityPercent(ann)
                const isNearFull = pct >= 85
                return (
                  <TableRow key={ann.id} className="transition-colors hover:bg-accent/50">
                    <TableCell className="font-medium">{ann.id}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{ann.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeColor[ann.type]}`}>
                        {ann.type}
                      </span>
                    </TableCell>
                    <TableCell>{ann.instructor}</TableCell>
                    <TableCell className="text-muted-foreground">{ann.category}</TableCell>
                    <TableCell className="text-muted-foreground">{ann.startDate}</TableCell>
                    <TableCell className="text-muted-foreground">{ann.location}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className={`text-xs font-medium ${isNearFull ? "text-amber-600 dark:text-amber-400" : ""}`}>
                          {ann.registered}/{ann.capacity}
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
                      {ann.linkedProgramTitle ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-xs text-primary cursor-default">
                              <Link2 className="h-3 w-3" />
                              <span className="max-w-[120px] truncate">{ann.linkedProgramTitle}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="text-right">{ann.linkedProgramTitle}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[ann.status]}`}>
                        {ann.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenDetails(ann)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>عرض التفاصيل</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(ann)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>تعديل</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(ann)}>
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

      {/* ── Add/Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الإعلان" : "إنشاء إعلان تدريبي جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* ── Link to Program ── */}
            <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Link2 className="h-4 w-4" />
                ربط ببرنامج تدريبي
              </div>
              <p className="text-xs text-muted-foreground">
                اختر البرنامج التدريبي الذي سيتم توجيه طلبات الالتحاق إليه
              </p>
              <Select
                value={form.linkedProgramId || "none"}
                onValueChange={(v) => setForm(p => ({ ...p, linkedProgramId: v === "none" ? "" : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر برنامج تدريبي..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون ربط</SelectItem>
                  {AVAILABLE_PROGRAMS.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      <span className="flex items-center gap-2">
                        {p.type === "دورة" ? (
                          <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <Presentation className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                        )}
                        {p.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="ann-title">عنوان البرنامج التدريبي</Label>
              <Input id="ann-title" placeholder="أدخل عنوان الدورة أو الورشة..." value={form.title} onChange={(e) => updateField("title", e.target.value)} className="text-right" />
              {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v as AnnouncementType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {typesList.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>التصنيف</Label>
                <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoriesList.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ann-instructor">المدرب</Label>
                <Input id="ann-instructor" placeholder="أدخل اسم المدرب..." value={form.instructor} onChange={(e) => updateField("instructor", e.target.value)} className="text-right" />
                {formErrors.instructor && <p className="text-sm text-destructive">{formErrors.instructor}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="ann-duration">المدة</Label>
                <Input id="ann-duration" placeholder="مثال: 40 ساعة" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} className="text-right" />
                {formErrors.duration && <p className="text-sm text-destructive">{formErrors.duration}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ann-startDate">تاريخ البداية</Label>
                <Input id="ann-startDate" type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
                {formErrors.startDate && <p className="text-sm text-destructive">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="ann-endDate">تاريخ النهاية</Label>
                <Input id="ann-endDate" type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} />
                {formErrors.endDate && <p className="text-sm text-destructive">{formErrors.endDate}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="ann-capacity">السعة</Label>
                <Input id="ann-capacity" type="number" min="1" placeholder="0" value={form.capacity} onChange={(e) => updateField("capacity", e.target.value)} className="text-right" />
                {formErrors.capacity && <p className="text-sm text-destructive">{formErrors.capacity}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ann-location">الموقع</Label>
                <Input id="ann-location" placeholder="مثال: قاعة التدريب 1" value={form.location} onChange={(e) => updateField("location", e.target.value)} className="text-right" />
                {formErrors.location && <p className="text-sm text-destructive">{formErrors.location}</p>}
              </div>
              <div className="space-y-1">
                <Label>الحالة</Label>
                <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v as "مفتوح" | "مغلق" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusesList.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ann-description">الوصف</Label>
              <Textarea id="ann-description" placeholder="أدخل وصف البرنامج التدريبي..." value={form.description} onChange={(e) => updateField("description", e.target.value)} className="text-right min-h-[80px]" />
              {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
            </div>

            <div className="flex justify-start gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>إلغاء</Button>
              <Button type="submit">{editing ? "تحديث" : "إنشاء الإعلان"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Details Modal ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]" dir="rtl">
          {detailsItem && (
            <>
              <div
                className="absolute top-0 left-0 right-0 h-16 rounded-t-lg"
                style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--brand-gradient-a) 8%, transparent), color-mix(in oklch, var(--brand-gradient-b) 12%, transparent))" }}
              />
              <DialogHeader className="relative">
                <DialogTitle className="flex items-center gap-2.5 text-lg">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${detailsItem.type === "دورة" ? "bg-primary/10" : "bg-violet-500/10"}`}>
                    {detailsItem.type === "دورة" ? (
                      <GraduationCap className="h-4 w-4 text-primary" />
                    ) : (
                      <Presentation className="h-4 w-4 text-violet-600" />
                    )}
                  </div>
                  {detailsItem.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground leading-relaxed">{detailsItem.description}</p>

                {detailsItem.linkedProgramTitle && (
                  <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                    <Link2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">البرنامج المرتبط:</span>
                    <span className="font-medium text-primary">{detailsItem.linkedProgramTitle}</span>
                  </div>
                )}

                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["النوع", detailsItem.type],
                    ["التصنيف", detailsItem.category],
                    ["المدرب", detailsItem.instructor],
                    ["المدة", detailsItem.duration],
                    ["تاريخ البداية", detailsItem.startDate],
                    ["تاريخ النهاية", detailsItem.endDate],
                    ["الموقع", detailsItem.location],
                    ["الحالة", detailsItem.status],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-0.5">
                      <span className="text-[11px] text-muted-foreground">{label}</span>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">السعة</span>
                    <span className="font-semibold">{detailsItem.registered}/{detailsItem.capacity} ({capacityPercent(detailsItem)}%)</span>
                  </div>
                  <Progress value={Math.min(capacityPercent(detailsItem), 100)} className="h-2" />
                </div>
                <div className="flex justify-start gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDetailsOpen(false)}>إغلاق</Button>
                  <Button onClick={() => { setDetailsOpen(false); openEditModal(detailsItem) }}>
                    <Edit className="ml-1.5 h-4 w-4" />
                    تعديل
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Filters Modal ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تصفية الإعلانات
              {activeFilterCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground mr-2">({activeFilterCount} فلاتر نشطة)</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select value={localFilters.category} onValueChange={(v) => setLocalFilters(p => ({ ...p, category: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {categoriesList.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={localFilters.status} onValueChange={(v) => setLocalFilters(p => ({ ...p, status: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {statusesList.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
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

      <ConfirmModal />
    </div>
  )
}
