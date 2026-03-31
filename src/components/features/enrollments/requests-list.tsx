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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Search,
  Check,
  X,
  SlidersHorizontal,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import type { EnrollmentRequest, RequestStatus, EnrollmentFilters } from "./enrollments-types"
import { DUMMY_REQUESTS } from "@/mock-data/enrollments-data"

const statusDot: Record<RequestStatus, string> = {
  "قيد المراجعة": "bg-yellow-500",
  "مقبول": "bg-green-500",
  "مرفوض": "bg-red-500",
  "ملغي": "bg-slate-400",
}

const statusRowTint: Record<RequestStatus, string> = {
  "قيد المراجعة": "bg-yellow-50/50 dark:bg-yellow-950/10",
  "مقبول": "",
  "مرفوض": "bg-red-50/30 dark:bg-red-950/10",
  "ملغي": "bg-muted/30",
}

const emptyFilters: EnrollmentFilters = { status: "", type: "", department: "" }

const departmentsList = ["تقنية المعلومات", "الموارد البشرية", "المالية", "التسويق", "الشؤون القانونية", "العمليات", "خدمة العملاء", "الإدارة العليا"]

// ─── Component ──────────────────────────────────────────────────────────────

export default function RequestsList() {
  const [records, setRecords] = useState<EnrollmentRequest[]>(DUMMY_REQUESTS)
  const [search, setSearch] = useState("")
  const [statusTab, setStatusTab] = useState("all")
  const [filters, setFilters] = useState<EnrollmentFilters>(emptyFilters)

  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewItem, setReviewItem] = useState<EnrollmentRequest | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<EnrollmentFilters>(emptyFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        r.announcementTitle.toLowerCase().includes(q) ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeDepartment.includes(q)

      const matchesStatusTab = statusTab === "all" || r.status === statusTab
      const matchesType = !filters.type || r.announcementType === filters.type
      const matchesDept = !filters.department || r.employeeDepartment === filters.department

      return matchesSearch && matchesStatusTab && matchesType && matchesDept
    })
  }, [records, search, statusTab, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, safePage, perPage])

  const handleApprove = (req: EnrollmentRequest) => {
    setRecords(prev => prev.map(r => r.id === req.id ? { ...r, status: "مقبول" as RequestStatus, reviewedBy: "المشرف", reviewDate: new Date().toISOString().slice(0, 10) } : r))
    toast.success(`تم قبول طلب "${req.employeeName}"`)
  }

  const handleReject = (req: EnrollmentRequest) => {
    setReviewItem(req)
    setReviewNotes("")
    setReviewOpen(true)
  }

  const handleConfirmReject = () => {
    if (!reviewItem) return
    setRecords(prev => prev.map(r => r.id === reviewItem.id ? { ...r, status: "مرفوض" as RequestStatus, reviewedBy: "المشرف", reviewDate: new Date().toISOString().slice(0, 10), notes: reviewNotes || r.notes } : r))
    toast.error(`تم رفض طلب "${reviewItem.employeeName}"`)
    setReviewOpen(false)
  }

  const activeFilterCount = [filters.type, filters.department].filter(Boolean).length

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <h1 className="text-2xl font-bold">طلبات الالتحاق</h1>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الدورة أو القسم..."
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
            className="pr-8 text-right w-full"
          />
        </div>

        <Tabs value={statusTab} onValueChange={(v) => { setStatusTab(v) }}>
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="قيد المراجعة">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1.5" />
              قيد المراجعة
            </TabsTrigger>
            <TabsTrigger value="مقبول">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1.5" />
              مقبول
            </TabsTrigger>
            <TabsTrigger value="مرفوض">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 ml-1.5" />
              مرفوض
            </TabsTrigger>
            <TabsTrigger value="ملغي">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 ml-1.5" />
              ملغي
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
      </div>

      {/* ── Table ── */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">الدورة / الورشة</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الموظف</TableHead>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="text-right">تاريخ الطلب</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-28 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  لا توجد طلبات.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((req, idx) => (
                <TableRow key={req.id} className={`transition-colors hover:bg-accent/50 ${statusRowTint[req.status]}`}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{req.announcementTitle}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${req.announcementType === "دورة" ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800" : "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800"}`}>
                      {req.announcementType}
                    </span>
                  </TableCell>
                  <TableCell>{req.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{req.employeeDepartment}</TableCell>
                  <TableCell className="text-muted-foreground">{req.requestDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot[req.status]}`} />
                      <span className="text-xs font-medium">{req.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {req.status === "قيد المراجعة" ? (
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20" onClick={() => handleApprove(req)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>قبول الطلب</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleReject(req)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>رفض الطلب</TooltipContent>
                        </Tooltip>
                        {req.notes && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <MessageSquare className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-50 text-right">{req.notes}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {req.reviewedBy ? `${req.reviewedBy} - ${req.reviewDate}` : "—"}
                        </span>
                        {req.notes && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-muted-foreground h-6 w-6 p-0">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-50 text-right">{req.notes}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
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

      {/* ── Reject Confirmation Modal ── */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-100" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              رفض الطلب
            </DialogTitle>
          </DialogHeader>
          {reviewItem && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-3 space-y-1">
                <p className="text-sm font-medium">{reviewItem.employeeName}</p>
                <p className="text-xs text-muted-foreground">{reviewItem.announcementTitle} • {reviewItem.employeeDepartment}</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="reject-notes">سبب الرفض (اختياري)</Label>
                <Textarea
                  id="reject-notes"
                  placeholder="أدخل سبب الرفض..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="text-right min-h-20"
                />
              </div>
              <div className="flex justify-start gap-2 pt-2">
                <Button variant="outline" onClick={() => setReviewOpen(false)}>إلغاء</Button>
                <Button variant="destructive" onClick={handleConfirmReject}>تأكيد الرفض</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Filters Modal ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-100" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تصفية الطلبات
              {activeFilterCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground mr-2">({activeFilterCount} فلاتر نشطة)</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select value={localFilters.type} onValueChange={(v) => setLocalFilters(p => ({ ...p, type: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="دورة">دورة</SelectItem>
                  <SelectItem value="ورشة عمل">ورشة عمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>القسم</Label>
              <Select value={localFilters.department} onValueChange={(v) => setLocalFilters(p => ({ ...p, department: v === "all" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {departmentsList.map(d => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start gap-2 pt-2">
              <Button onClick={() => { setFilters(localFilters); setFilterOpen(false) }}>تطبيق</Button>
              <Button variant="outline" onClick={() => { setFilters(emptyFilters); setLocalFilters(emptyFilters); setFilterOpen(false) }}>إعادة تعيين</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
