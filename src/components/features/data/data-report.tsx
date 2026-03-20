"use client"

import { useState, useMemo, useRef } from "react"
import { flushSync } from "react-dom"
import { useReactToPrint } from "react-to-print"
import { ChevronDown, ChevronUp, Printer, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

// ─── Report data source type ────────────────────────────────────────────────

type DataSourceId = "courses" | "workshops" | "users"

interface ReportRow {
  [key: string]: string | number
}

// ─── Dummy data — Courses ───────────────────────────────────────────────────

const courseTitles = [
  "تطوير تطبيقات الويب", "إدارة المشاريع الاحترافية PMP", "المحاسبة المالية المتقدمة",
  "القانون التجاري والعقود", "مهارات القيادة والإدارة", "أمن المعلومات والشبكات",
  "تحليل البيانات باستخدام Python", "إدارة الموارد البشرية", "التسويق الرقمي",
  "السلامة المهنية في بيئة العمل", "تطوير تطبيقات الجوال", "إدارة سلسلة الإمداد",
  "التخطيط المالي والميزانيات", "الامتثال والحوكمة المؤسسية", "مهارات التفاوض والإقناع",
  "الذكاء الاصطناعي والتعلم الآلي", "إدارة الجودة الشاملة TQM", "إعداد التقارير المالية IFRS",
  "حماية البيانات الشخصية", "تطوير الذات والإنتاجية", "الحوسبة السحابية AWS",
  "التخطيط الاستراتيجي", "المراجعة الداخلية", "قانون العمل والتأمينات",
  "الإسعافات الأولية في العمل", "تصميم قواعد البيانات", "إدارة المخاطر المؤسسية",
  "التحليل المالي للمشاريع", "الأمن السيبراني المتقدم", "مهارات العرض والتقديم",
]
const instructorNames = ["أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري", "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي"]
const categoryNames = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const courseStatusNames = ["مفتوح", "جاري", "مكتمل", "ملغي"]

const COURSES_DATA: ReportRow[] = courseTitles.map((title, i) => ({
  id: i + 1,
  title,
  instructor: instructorNames[i % instructorNames.length],
  category: categoryNames[i % categoryNames.length],
  duration: ["10 ساعات", "15 ساعة", "20 ساعة", "25 ساعة", "30 ساعة", "40 ساعة"][i % 6],
  startDate: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  status: courseStatusNames[i % courseStatusNames.length],
  employeeCount: 5 + ((i * 7) % 40),
}))

// ─── Dummy data — Workshops ─────────────────────────────────────────────────

const workshopTitles = [
  "التفكير الإبداعي وحل المشكلات", "أمن المعلومات للموظفين", "كتابة التقارير الفنية",
  "إدارة الوقت والأولويات", "العمل الجماعي وبناء الفرق", "مهارات التواصل الفعّال",
  "أساسيات Excel المتقدم", "التعامل مع ضغوط العمل", "خدمة العملاء المتميزة",
  "أساسيات إدارة المشاريع", "التحول الرقمي في المؤسسات", "مهارات كتابة المراسلات الرسمية",
  "إدارة الاجتماعات بفاعلية", "التخطيط الشخصي والمهني", "مهارات التفاوض في بيئة العمل",
  "الذكاء العاطفي في القيادة", "إعداد العروض التقديمية الاحترافية", "أساسيات الأمن السيبراني",
  "التعامل مع التغيير المؤسسي", "بناء ثقافة الابتكار", "أخلاقيات العمل المهنية",
  "مهارات حل النزاعات", "إدارة المعرفة المؤسسية", "التفكير الاستراتيجي", "السلامة والصحة المهنية",
]
const facilitatorNames = ["نور الهاشمي", "علي الموسوي", "حسن الربيعي", "زينب العامري", "أحمد الكاظمي", "سارة العلي", "عمر الشمري", "ريم السعدي", "فاطمة الموسوي", "محمد الحسيني"]
const locationNames = ["قاعة التدريب 1", "قاعة التدريب 2", "قاعة المؤتمرات", "مختبر الحاسوب", "القاعة الرئيسية", "غرفة الاجتماعات أ", "غرفة الاجتماعات ب"]
const workshopStatusNames = ["قادم", "جاري", "منتهي", "ملغي"]

const WORKSHOPS_DATA: ReportRow[] = workshopTitles.map((title, i) => ({
  id: i + 1,
  title,
  facilitator: facilitatorNames[i % facilitatorNames.length],
  location: locationNames[i % locationNames.length],
  date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  timeSlot: ["09:00 - 12:00", "10:00 - 13:00", "13:00 - 16:00", "14:00 - 17:00"][i % 4],
  capacity: 15 + ((i * 5) % 35),
  registered: Math.min(15 + ((i * 5) % 35), 5 + ((i * 3) % 30)),
  status: workshopStatusNames[i % workshopStatusNames.length],
}))

// ─── Dummy data — Users ─────────────────────────────────────────────────────

const userNames = [
  "أحمد الكاظمي", "سارة العلي", "محمد الحسيني", "فاطمة الموسوي", "علي الجبوري",
  "نور الهاشمي", "حسن الربيعي", "زينب العامري", "عمر الشمري", "ريم السعدي",
  "يوسف الخزاعي", "مريم الطائي", "كريم البغدادي", "هدى النجفي", "سامر الكربلائي",
  "لمياء الحلي", "طارق البصري", "دعاء الكوفي", "رائد السماوي", "أمل الديوانية",
  "باسم العمارة", "سلمى الناصرية", "جاسم الموصلي", "نادية الأربيلي", "وليد السليمانية",
]
const roleNames = ["مشرف", "مدرب", "موظف", "مدير"]
const departmentNames = ["تقنية المعلومات", "الموارد البشرية", "المالية", "التسويق", "الشؤون القانونية", "العمليات", "خدمة العملاء", "الإدارة العليا"]

const USERS_DATA: ReportRow[] = userNames.map((name, i) => ({
  id: i + 1,
  name,
  email: `${name.split(" ")[0].toLowerCase()}${i + 1}@company.com`,
  role: roleNames[i % roleNames.length],
  department: departmentNames[i % departmentNames.length],
  joinDate: `2024-${String(((i * 3) % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  status: i % 7 === 0 ? "معطل" : "نشط",
  coursesCount: (i * 3) % 8,
  workshopsCount: (i * 2) % 6,
}))

// ─── Column definitions per data source ─────────────────────────────────────

interface ColDef { key: string; label: string; width?: number }

const DATA_SOURCES: Record<DataSourceId, { label: string; data: ReportRow[]; cols: ColDef[]; defaultTitle: string; searchKeys: string[] }> = {
  courses: {
    label: "الدورات التدريبية",
    data: COURSES_DATA,
    defaultTitle: "تقرير الدورات التدريبية",
    searchKeys: ["title", "instructor", "category"],
    cols: [
      { key: "id", label: "#", width: 8 },
      { key: "title", label: "اسم الدورة", width: 36 },
      { key: "instructor", label: "المدرب", width: 20 },
      { key: "category", label: "التصنيف", width: 14 },
      { key: "duration", label: "المدة", width: 12 },
      { key: "startDate", label: "تاريخ البداية", width: 16 },
      { key: "status", label: "الحالة", width: 10 },
      { key: "employeeCount", label: "المشتركين", width: 12 },
    ],
  },
  workshops: {
    label: "ورش العمل",
    data: WORKSHOPS_DATA,
    defaultTitle: "تقرير ورش العمل",
    searchKeys: ["title", "facilitator", "location"],
    cols: [
      { key: "id", label: "#", width: 8 },
      { key: "title", label: "اسم الورشة", width: 34 },
      { key: "facilitator", label: "المُيسّر", width: 20 },
      { key: "location", label: "الموقع", width: 18 },
      { key: "date", label: "التاريخ", width: 14 },
      { key: "timeSlot", label: "الوقت", width: 14 },
      { key: "capacity", label: "السعة", width: 8 },
      { key: "registered", label: "المسجلين", width: 10 },
      { key: "status", label: "الحالة", width: 10 },
    ],
  },
  users: {
    label: "المستخدمين",
    data: USERS_DATA,
    defaultTitle: "تقرير المستخدمين",
    searchKeys: ["name", "email", "department"],
    cols: [
      { key: "id", label: "#", width: 8 },
      { key: "name", label: "الاسم", width: 22 },
      { key: "email", label: "البريد الإلكتروني", width: 26 },
      { key: "role", label: "الدور", width: 10 },
      { key: "department", label: "القسم", width: 18 },
      { key: "joinDate", label: "تاريخ الانضمام", width: 16 },
      { key: "status", label: "الحالة", width: 10 },
      { key: "coursesCount", label: "الدورات", width: 10 },
      { key: "workshopsCount", label: "الورش", width: 10 },
    ],
  },
}

// ─── Page size constants ────────────────────────────────────────────────────

type PageSizeId  = "A4" | "A3" | "Letter"
type Orientation = "portrait" | "landscape"

const PAGE_SIZES: Record<PageSizeId, { label: string; w: number; h: number }> = {
  A4:     { label: "A4 (210×297mm)",     w: 210, h: 297 },
  A3:     { label: "A3 (297×420mm)",     w: 297, h: 420 },
  Letter: { label: "Letter (216×279mm)", w: 216, h: 279 },
}

const TEXT_SIZE_OPTIONS = [
  { value: "7px",  label: "صغير جداً" },
  { value: "9px",  label: "صغير"      },
  { value: "10px", label: "متوسط"     },
  { value: "12px", label: "كبير"      },
]

// ─── ToggleSection helper ───────────────────────────────────────────────────

function ToggleSection({ title, children, defaultOpen = false, badge }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badge && (
            <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-secondary text-[10px]">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
          : <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>}
    </div>
  )
}

// ─── Main report component ──────────────────────────────────────────────────

export default function DataReport() {
  // Data source
  const [dataSource, setDataSource] = useState<DataSourceId>("courses")
  const source = DATA_SOURCES[dataSource]

  // Pending filter state
  const [searchText, setSearchText] = useState("")
  const [dateFrom,   setDateFrom]   = useState("")
  const [dateTo,     setDateTo]     = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Active (applied) state
  const [activeSearch,  setActiveSearch]  = useState("")
  const [activeDateFrom, setActiveDateFrom] = useState("")
  const [activeDateTo,   setActiveDateTo]   = useState("")
  const [activeStatus, setActiveStatus] = useState("")
  const [hasApplied,    setHasApplied]    = useState(false)

  // Design state
  const [reportTitle,  setReportTitle]  = useState(source.defaultTitle)
  const [pageSize,     setPageSize]     = useState<PageSizeId>("A4")
  const [orientation,  setOrientation]  = useState<Orientation>("landscape")
  const [textSize,     setTextSize]     = useState("9px")
  const [selectedCols, setSelectedCols] = useState<string[]>(source.cols.map(c => c.key))

  // When data source changes, reset state
  function handleSourceChange(newSource: DataSourceId) {
    setDataSource(newSource)
    const s = DATA_SOURCES[newSource]
    setReportTitle(s.defaultTitle)
    setSelectedCols(s.cols.map(c => c.key))
    setSearchText("")
    setDateFrom("")
    setDateTo("")
    setStatusFilter("")
    setActiveSearch("")
    setActiveDateFrom("")
    setActiveDateTo("")
    setActiveStatus("")
    setHasApplied(false)
  }

  // Paper dimensions
  const paperW = orientation === "portrait" ? PAGE_SIZES[pageSize].w : PAGE_SIZES[pageSize].h
  const paperH = orientation === "portrait" ? PAGE_SIZES[pageSize].h : PAGE_SIZES[pageSize].w

  // Date key per source
  const dateKey = dataSource === "courses" ? "startDate" : dataSource === "workshops" ? "date" : "joinDate"

  // Status options per source
  const statusOptions = dataSource === "courses"
    ? ["مفتوح", "جاري", "مكتمل", "ملغي"]
    : dataSource === "workshops"
      ? ["قادم", "جاري", "منتهي", "ملغي"]
      : ["نشط", "معطل"]

  // Filtered data
  const filteredData = useMemo(() => source.data.filter(r => {
    if (activeSearch) {
      const q = activeSearch.toLowerCase()
      const matches = source.searchKeys.some(k => String(r[k]).toLowerCase().includes(q))
      if (!matches) return false
    }
    if (activeDateFrom && String(r[dateKey]) < activeDateFrom) return false
    if (activeDateTo   && String(r[dateKey]) > activeDateTo)   return false
    if (activeStatus   && r.status !== activeStatus) return false
    return true
  }), [activeSearch, activeDateFrom, activeDateTo, activeStatus, source, dateKey])

  const visibleCols = source.cols.filter(c => selectedCols.includes(c.key))

  // Auto-pagination
  const rowsPerPage = useMemo(() => {
    const px   = parseFloat(textSize)
    const rowH = (px * 1.4 + 10) * (25.4 / 96)
    return Math.max(5, Math.floor((paperH - 56) / rowH))
  }, [textSize, paperH])

  const pages = useMemo(() => {
    if (filteredData.length === 0) return [[]] as ReportRow[][]
    const result: ReportRow[][] = []
    for (let i = 0; i < filteredData.length; i += rowsPerPage)
      result.push(filteredData.slice(i, i + rowsPerPage))
    return result
  }, [filteredData, rowsPerPage])

  // Print
  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: reportTitle,
    pageStyle: `
      @page { size: ${paperW}mm ${paperH}mm; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; } .rp-gap { margin-bottom: 0 !important; } }
    `,
    onBeforePrint: async () => { flushSync(() => {}) },
  })

  // Cell styles
  const cellSt: React.CSSProperties = {
    padding: "4px 8px", border: "1px solid #d1d5db",
    textAlign: "right", verticalAlign: "middle",
    fontSize: textSize, color: "#111827", whiteSpace: "nowrap",
  }
  const headSt: React.CSSProperties = {
    ...cellSt, background: "#f3f4f6", fontWeight: 600, color: "#374151",
  }

  // Apply filters
  function handleApply() {
    setActiveSearch(searchText)
    setActiveDateFrom(dateFrom)
    setActiveDateTo(dateTo)
    setActiveStatus(statusFilter)
    setHasApplied(true)
  }

  // Excel export
  const [isExporting, setIsExporting] = useState(false)

  async function handleExcelExport() {
    if (isExporting || filteredData.length === 0) return
    setIsExporting(true)
    try {
      const wb = new ExcelJS.Workbook()
      wb.creator = "نظام إدارة الدورات"
      const ws = wb.addWorksheet(source.label, { views: [{ rightToLeft: true }] })

      ws.columns = visibleCols.map(col => ({
        key: col.key,
        header: col.label,
        width: col.width || 16,
      }))

      const headerRow = ws.getRow(1)
      headerRow.eachCell(cell => {
        cell.font      = { bold: true, color: { argb: "FF374151" } }
        cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } }
        cell.alignment = { horizontal: "center", vertical: "middle", readingOrder: "rtl" }
        cell.border    = {
          top: { style: "thin", color: { argb: "FFD1D5DB" } },
          bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
          left: { style: "thin", color: { argb: "FFD1D5DB" } },
          right: { style: "thin", color: { argb: "FFD1D5DB" } },
        }
      })
      headerRow.height = 22

      filteredData.forEach((r, idx) => {
        const rowData: Record<string, unknown> = {}
        visibleCols.forEach(col => { rowData[col.key] = r[col.key] })
        const row = ws.addRow(rowData)
        const bgColor = idx % 2 === 0 ? "FFFFFFFF" : "FFF9FAFB"
        row.eachCell(cell => {
          cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
          cell.alignment = { horizontal: "right", vertical: "middle", readingOrder: "rtl" }
          cell.border    = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          }
        })
        row.height = 18
      })

      const buffer = await wb.xlsx.writeBuffer()
      const blob   = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      saveAs(blob, `${reportTitle || "تقرير"}_${timestamp}.xlsx`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className="-mx-10 -mt-5 -mb-10 flex overflow-hidden bg-background"
      style={{ height: "calc(100vh - 56px)" }}
      dir="rtl"
    >
      {/* ── Sidebar ── */}
      <aside className="w-[280px] flex-shrink-0 h-full flex flex-col overflow-hidden bg-card border-e border-border shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold">إعداد التقرير</span>
          </div>
          {/* Data source selector */}
          <div className="space-y-1.5 mb-3">
            <Label className="text-xs text-muted-foreground">مصدر البيانات</Label>
            <Select value={dataSource} onValueChange={v => handleSourceChange(v as DataSourceId)}>
              <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="courses" className="text-xs">الدورات التدريبية</SelectItem>
                <SelectItem value="workshops" className="text-xs">ورش العمل</SelectItem>
                <SelectItem value="users" className="text-xs">المستخدمين</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">عنوان التقرير</Label>
          <Input
            value={reportTitle}
            onChange={e => setReportTitle(e.target.value)}
            className="text-sm h-8"
          />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Filters */}
          <ToggleSection title="الفلاتر" defaultOpen>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">بحث</Label>
              <Input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder={`ابحث في ${source.label}...`}
                className="text-xs h-8"
                onKeyDown={e => e.key === "Enter" && handleApply()}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">التاريخ من</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs h-8" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">التاريخ إلى</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs h-8" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">الحالة</Label>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v === "all" ? "" : v)}>
                <SelectTrigger className="text-xs h-8"><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">الكل</SelectItem>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="w-full h-8 text-xs" onClick={handleApply}>
              تطبيق الفلاتر
            </Button>
          </ToggleSection>

          {/* Columns */}
          <ToggleSection title="الأعمدة" badge={String(selectedCols.length)}>
            <div className="space-y-1.5">
              {source.cols.map(col => (
                <div key={col.key} className="flex items-center gap-2">
                  <Checkbox
                    id={`col-${col.key}`}
                    checked={selectedCols.includes(col.key)}
                    onCheckedChange={checked =>
                      setSelectedCols(prev =>
                        checked ? [...prev, col.key] : prev.filter(k => k !== col.key)
                      )
                    }
                    className="size-3.5"
                  />
                  <Label
                    htmlFor={`col-${col.key}`}
                    className="text-[11px] cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </ToggleSection>

          {/* Page design */}
          <ToggleSection title="تصميم الصفحة" defaultOpen>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">حجم الورقة</Label>
                <Select value={pageSize} onValueChange={v => setPageSize(v as PageSizeId)}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PAGE_SIZES) as PageSizeId[]).map(k => (
                      <SelectItem key={k} value={k} className="text-xs">{PAGE_SIZES[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">الاتجاه</Label>
                <Select value={orientation} onValueChange={v => setOrientation(v as Orientation)}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait" className="text-xs">عمودي (Portrait)</SelectItem>
                    <SelectItem value="landscape" className="text-xs">أفقي (Landscape)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">حجم النص</Label>
                <Select value={textSize} onValueChange={setTextSize}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEXT_SIZE_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md bg-muted/50 px-3 py-2 text-center">
                <span className="text-[10px] text-muted-foreground">{paperW}mm × {paperH}mm</span>
              </div>
            </div>
          </ToggleSection>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border bg-card p-3 flex flex-col gap-2">
          <Button
            className="w-full h-8 text-xs"
            onClick={() => handlePrint()}
            disabled={!hasApplied || filteredData.length === 0 || visibleCols.length === 0}
          >
            <Printer className="size-3.5 ml-1.5" />
            طباعة
          </Button>
          <Button
            variant="outline"
            className="w-full h-8 text-xs"
            onClick={handleExcelExport}
            disabled={!hasApplied || filteredData.length === 0 || isExporting}
          >
            {isExporting ? (
              <><Loader2 className="size-3.5 ml-1.5 animate-spin" />جاري التصدير...</>
            ) : (
              <><FileSpreadsheet className="size-3.5 ml-1.5" />تصدير Excel</>
            )}
          </Button>
        </div>
      </aside>

      {/* ── Paper viewer ── */}
      <main
        className="flex-1 overflow-auto flex flex-col items-center py-8 px-4"
        style={{ background: "#525659" }}
      >
        {/* Not yet applied */}
        {!hasApplied && (
          <div
            className="flex flex-col items-center justify-center gap-4"
            style={{
              width: `${paperW}mm`, minHeight: `${paperH}mm`,
              background: "white", padding: "15mm",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)", color: "#374151",
            }}
          >
            <FileText size={40} style={{ color: "#d1d5db" }} />
            <p style={{ fontSize: "14px", fontWeight: 600 }}>لم يتم تطبيق الفلاتر بعد</p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              اختر مصدر البيانات والفلاتر المطلوبة ثم اضغط &quot;تطبيق الفلاتر&quot;
            </p>
          </div>
        )}

        {/* No columns selected */}
        {hasApplied && visibleCols.length === 0 && (
          <div
            style={{
              width: `${paperW}mm`, minHeight: `${paperH}mm`,
              background: "white", padding: "15mm",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)", color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 600 }}>لا توجد أعمدة محددة</p>
          </div>
        )}

        {/* Multi-page paper */}
        {hasApplied && visibleCols.length > 0 && (
          <div ref={printRef} dir="rtl">
            {pages.map((pageRows, pi) => (
              <div
                key={pi}
                className="rp-gap"
                style={{
                  width: `${paperW}mm`, minHeight: `${paperH}mm`,
                  background: "white", color: "#111827",
                  padding: "12mm 15mm",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                  boxSizing: "border-box",
                  fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
                  breakAfter: pi < pages.length - 1 ? "page" : "auto",
                  pageBreakAfter: pi < pages.length - 1 ? "always" : "auto",
                  marginBottom: pi < pages.length - 1 ? "24px" : 0,
                }}
              >
                {/* Page header */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: "6mm",
                  borderBottom: "2px solid #e5e7eb", paddingBottom: "3mm",
                }}>
                  <div>
                    <h1 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{reportTitle}</h1>
                    <p style={{ fontSize: "10px", color: "#6b7280", margin: "2px 0 0 0" }}>
                      إجمالي السجلات: {filteredData.length} | المصدر: {source.label}
                    </p>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "10px", color: "#6b7280", margin: 0 }}>
                      صفحة {pi + 1} / {pages.length}
                    </p>
                    <p style={{ fontSize: "10px", color: "#6b7280", margin: "2px 0 0 0" }}>
                      {new Date().toLocaleDateString("ar-EN")}
                    </p>
                  </div>
                </div>

                {/* Table */}
                {pageRows.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "20mm" }}>
                    لا توجد بيانات مطابقة للفلاتر المحددة
                  </p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        {visibleCols.map(col => (
                          <th key={col.key} style={headSt}>{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, ri) => (
                        <tr
                          key={String(row.id)}
                          style={{
                            background: ri % 2 === 0 ? "#ffffff" : "#f9fafb",
                            breakInside: "avoid", pageBreakInside: "avoid",
                          }}
                        >
                          {visibleCols.map(col => (
                            <td key={col.key} style={cellSt}>{row[col.key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
