"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import type { TrainingHall, HallStatus, Equipment, HallFilters } from "./scheduling-types"
import { BUILDINGS, FLOORS, ALL_EQUIPMENT } from "@/mock-data/scheduling-data"
import { useConfirmModal } from "@/components/common/confirm-modal"

const hallStatusColor: Record<HallStatus, string> = {
  "متاحة": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "مشغولة": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  "صيانة": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const HALL_STATUSES: HallStatus[] = ["متاحة", "مشغولة", "صيانة"]
const emptyFilters: HallFilters = { building: "", status: "" }

type FormState = {
  name: string
  building: string
  floor: string
  capacity: string
  equipment: Equipment[]
  status: HallStatus
}

const emptyForm: FormState = {
  name: "",
  building: BUILDINGS[0],
  floor: FLOORS[0],
  capacity: "",
  equipment: [],
  status: "متاحة",
}

interface HallsTabProps {
  halls: TrainingHall[]
  onUpdate: (halls: TrainingHall[]) => void
}

export default function HallsTab({ halls, onUpdate }: HallsTabProps) {
  // ── list state ──
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<HallFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<HallFilters>(emptyFilters)

  // ── form state ──
  const [view, setView] = useState<"list" | "form">("list")
  const [editing, setEditing] = useState<TrainingHall | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { openConfirm, ConfirmModal } = useConfirmModal()

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
    setView("form")
  }

  const openEdit = (hall: TrainingHall) => {
    setEditing(hall)
    setForm({
      name: hall.name,
      building: hall.building,
      floor: hall.floor,
      capacity: String(hall.capacity),
      equipment: [...hall.equipment],
      status: hall.status,
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

  const toggleEquipment = (item: Equipment) => {
    setForm(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item],
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "اسم القاعة مطلوب"
    if (!form.capacity || Number(form.capacity) <= 0) errs.capacity = "السعة مطلوبة"
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    const data: Omit<TrainingHall, "id"> = {
      name: form.name.trim(),
      building: form.building,
      floor: form.floor,
      capacity: Number(form.capacity),
      equipment: form.equipment,
      status: form.status,
    }

    if (editing) {
      onUpdate(halls.map(h => h.id === editing.id ? { ...h, ...data } : h))
      toast.success("تم تحديث القاعة بنجاح")
    } else {
      const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1
      onUpdate([...halls, { id: newId, ...data }])
      toast.success("تم إضافة القاعة بنجاح")
    }
    backToList()
  }

  const handleDelete = (hall: TrainingHall) => {
    openConfirm({
      title: "حذف القاعة",
      message: `هل أنت متأكد من حذف القاعة "${hall.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: "destructive",
      confirmText: "حذف",
      onConfirm: () => {
        onUpdate(halls.filter(h => h.id !== hall.id))
        toast.success(`تم حذف القاعة "${hall.name}"`)
      },
    })
  }

  const filtered = useMemo(() => halls.filter((h) => {
    const q = search.toLowerCase()
    return (
      (!q || h.name.includes(q) || h.building.includes(q)) &&
      (!filters.building || h.building === filters.building) &&
      (!filters.status || h.status === filters.status)
    )
  }), [halls, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const activeFilterCount = [filters.building, filters.status].filter(Boolean).length

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
              {editing ? "تعديل القاعة" : "إضافة قاعة تدريبية"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editing ? `تعديل بيانات: ${editing.name}` : "أدخل بيانات القاعة التدريبية الجديدة"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="hall-name">اسم القاعة</Label>
                <Input
                  id="hall-name"
                  placeholder="مثال: قاعة التدريب 1"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="text-right"
                />
                {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>المبنى</Label>
                  <Select value={form.building} onValueChange={(v) => setField("building", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BUILDINGS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>الطابق</Label>
                  <Select value={form.floor} onValueChange={(v) => setField("floor", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FLOORS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hall-capacity">السعة (عدد المقاعد)</Label>
                  <Input
                    id="hall-capacity"
                    type="number"
                    min="1"
                    placeholder="0"
                    value={form.capacity}
                    onChange={(e) => setField("capacity", e.target.value)}
                    className="text-right"
                  />
                  {formErrors.capacity && <p className="text-sm text-destructive">{formErrors.capacity}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>الحالة</Label>
                  <Select value={form.status} onValueChange={(v) => setField("status", v as HallStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {HALL_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المعدات المتوفرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_EQUIPMENT.map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox
                      checked={form.equipment.includes(item)}
                      onCheckedChange={() => toggleEquipment(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit">{editing ? "حفظ التعديلات" : "إضافة القاعة"}</Button>
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
              paginated.map((hall, idx) => (
                <TableRow key={hall.id} className="transition-colors hover:bg-accent/50">
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{hall.name}</TableCell>
                  <TableCell className="text-muted-foreground">{hall.building}</TableCell>
                  <TableCell className="text-muted-foreground">{hall.floor}</TableCell>
                  <TableCell>{hall.capacity} مقعد</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-50">
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

      <ConfirmModal />

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-100" dir="rtl">
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
                  {BUILDINGS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={localFilters.status || "all"} onValueChange={(v) => setLocalFilters(p => ({ ...p, status: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {HALL_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
