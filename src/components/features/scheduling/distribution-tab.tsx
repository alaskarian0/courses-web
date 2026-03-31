"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
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
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Plus,
  Trash2,
  Users,
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import type { ClassSession, AssignedStudent, TrainingHall } from "./scheduling-types"
import DistributionModal from "./distribution-modal"
import { useConfirmModal } from "@/components/common/confirm-modal"

// ── Grades types ───────────────────────────────────────────────────────────────
interface StudentGrades { exam1: string; exam2: string; exam3: string }
type GradesMap = Record<number, StudentGrades>

// ── Calendar helpers ──────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
]

// Week displayed left-to-right: Sun → Sat
const DAY_LABELS = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]

const statusBorder: Record<string, string> = {
  "مجدولة": "border-blue-400  bg-blue-50/60  dark:bg-blue-950/20",
  "جارية":  "border-amber-400 bg-amber-50/60 dark:bg-amber-950/20",
  "مكتملة": "border-green-400 bg-green-50/60 dark:bg-green-950/20",
  "ملغاة":  "border-red-400   bg-red-50/60   dark:bg-red-950/20",
}

const statusDayNum: Record<string, string> = {
  "مجدولة": "bg-blue-400  text-white",
  "جارية":  "bg-amber-400 text-white",
  "مكتملة": "bg-green-400 text-white",
  "ملغاة":  "bg-red-400   text-white",
}


function buildCalendar(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DistributionTabProps {
  sessions: ClassSession[]
  halls: TrainingHall[]
  assignedStudents: AssignedStudent[]
  onUpdateStudents: (students: AssignedStudent[]) => void
  onUpdateSessions: (sessions: ClassSession[]) => void
  initialSessionId: number
  onBack: () => void
}

export default function DistributionTab({
  sessions,
  halls,
  assignedStudents,
  onUpdateStudents,
  onUpdateSessions,
  initialSessionId,
  onBack,
}: DistributionTabProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [gradesMap, setGradesMap] = useState<GradesMap>({})
  const [gradesStudent, setGradesStudent] = useState<AssignedStudent | null>(null)
  const [gradesDraft, setGradesDraft] = useState<StudentGrades>({ exam1: "", exam2: "", exam3: "" })
  const { openConfirm, ConfirmModal } = useConfirmModal()

  const session = useMemo(
    () => sessions.find(s => s.id === initialSessionId) ?? null,
    [sessions, initialSessionId]
  )

  // Calendar state: starts at the month of this session
  const [calMonth, setCalMonth] = useState(() => {
    if (!session) return { year: new Date().getFullYear(), month: new Date().getMonth() }
    const d = new Date(session.date)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  // All sessions of the same program (for calendar)
  const programSessions = useMemo(
    () => session ? sessions.filter(s => s.programTitle === session.programTitle) : [],
    [sessions, session]
  )

  // All students enrolled in ANY session of the same program
  const sessionStudents = useMemo(() => {
    const programSessionIds = new Set(programSessions.map(s => s.id))
    return assignedStudents.filter(s => programSessionIds.has(s.sessionId))
  }, [assignedStudents, programSessions])

  // Map: dateStr → ClassSession[] for calendar lookup
  const dateSessionMap = useMemo(() => {
    const map = new Map<string, ClassSession[]>()
    programSessions.forEach(s => {
      const list = map.get(s.date) ?? []
      map.set(s.date, [...list, s])
    })
    return map
  }, [programSessions])

  // Full duration range: from earliest to latest session date
  const durationRange = useMemo(() => {
    if (programSessions.length === 0) return null
    const sorted = [...programSessions].map(s => s.date).sort()
    return { start: sorted[0], end: sorted[sorted.length - 1] }
  }, [programSessions])

  const isInRange = (dateStr: string) => {
    if (!durationRange) return false
    return dateStr >= durationRange.start && dateStr <= durationRange.end
  }

  const capacityPct = session && session.capacity > 0
    ? Math.round((sessionStudents.length / session.capacity) * 100)
    : 0

  const calCells = useMemo(
    () => buildCalendar(calMonth.year, calMonth.month),
    [calMonth]
  )

  const prevMonth = () => {
    setCalMonth(prev =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    )
  }

  const nextMonth = () => {
    setCalMonth(prev =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    )
  }

  const openGrades = (student: AssignedStudent) => {
    setGradesStudent(student)
    setGradesDraft(gradesMap[student.id] ?? { exam1: "", exam2: "", exam3: "" })
  }

  const saveGrades = () => {
    if (!gradesStudent) return
    setGradesMap(prev => ({ ...prev, [gradesStudent.id]: gradesDraft }))
    toast.success(`تم حفظ درجات "${gradesStudent.employeeName}"`)
    setGradesStudent(null)
  }

  const gradeValue = (v: string) => {
    const n = Number(v)
    return v === "" ? null : isNaN(n) ? null : Math.min(100, Math.max(0, n))
  }

  const handleAssign = (name: string, department: string) => {
    if (!session) return
    const newId = assignedStudents.length > 0 ? Math.max(...assignedStudents.map(s => s.id)) + 1 : 1
    onUpdateStudents([...assignedStudents, {
      id: newId,
      employeeName: name,
      employeeDepartment: department,
      sessionId: session.id,
    }])
    onUpdateSessions(sessions.map(s =>
      s.id === session.id ? { ...s, assignedCount: s.assignedCount + 1 } : s
    ))
    toast.success(`تم تعيين "${name}" في الجلسة`)
  }

  const handleRemove = (student: AssignedStudent) => {
    onUpdateStudents(assignedStudents.filter(s => s.id !== student.id))
    if (session) {
      onUpdateSessions(sessions.map(s =>
        s.id === session.id ? { ...s, assignedCount: Math.max(0, s.assignedCount - 1) } : s
      ))
    }
    toast.success(`تم إلغاء تعيين "${student.employeeName}"`)
  }

  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  if (!session) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">تفاصيل الدورة</h2>
        </div>
        <Card className="p-10 text-center text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>لم يتم العثور على الجلسة</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">تفاصيل الدورة</h2>
          <p className="text-sm text-muted-foreground">{session.programTitle}</p>
        </div>
      </div>

      {/* ── Session Info ── */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{session.programTitle}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {session.hallName}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {session.date} ({session.dayOfWeek})
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {session.timeSlot}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {sessionStudents.length}/{session.capacity} متدرب
                </span>
              </div>
              <Progress value={Math.min(capacityPct, 100)} className="h-2 w-48" />
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              تعيين متدرب
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Calendar ── */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              أيام الدورة — {session.programTitle}
              <span className="text-xs font-normal text-muted-foreground">
                ({programSessions.length} {programSessions.length === 1 ? "جلسة" : "جلسات"})
              </span>
            </CardTitle>
            {/* Month navigation */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-28 text-center">
                {MONTH_NAMES[calMonth.month]} {calMonth.year}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calCells.map((day, idx) => {
              if (!day) return <div key={idx} />

              const dateStr = toDateStr(calMonth.year, calMonth.month, day)
              const daySessions = dateSessionMap.get(dateStr) ?? []
              const isToday = dateStr === todayStr
              const inRange = isInRange(dateStr)
              const isRangeStart = dateStr === durationRange?.start
              const isRangeEnd = dateStr === durationRange?.end

              return (
                <div
                  key={idx}
                  className={`
                    relative min-h-16 p-1.5 flex flex-col gap-1 transition-colors
                    ${isRangeStart || isRangeEnd
                      ? `border-2 rounded-xl ${statusBorder[session.status] ?? "border-primary/60 bg-primary/15"}`
                      : inRange
                        ? "bg-primary/[0.035]"
                        : ""
                    }
                  `}
                >
                  {/* Day number */}
                  <span
                    className={`
                      text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full self-end
                      ${isToday
                        ? "bg-primary text-primary-foreground"
                        : isRangeStart || isRangeEnd
                          ? statusDayNum[session.status] ?? "bg-primary text-primary-foreground"
                          : inRange
                            ? "text-primary/50"
                            : "text-muted-foreground"
                      }
                    `}
                  >
                    {day}
                  </span>

                  {/* Time badge — all days in range */}
                  {inRange && (
                    <div className="rounded px-1 py-0.5 border border-primary/20 bg-primary/6 text-[9px] leading-tight">
                      <span className="truncate text-primary/70 block">{session.timeSlot}</span>
                      <span className="truncate text-muted-foreground block mt-0.5">{session.instructorName.split(" ")[0]}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t text-xs text-muted-foreground">
            {durationRange && (
              <span className="flex items-center gap-1.5 text-primary font-medium ml-2">
                <CalendarDays className="h-3 w-3" />
                مدة الدورة: {durationRange.start} — {durationRange.end}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-4 h-3 rounded-sm border-2 border-blue-400  bg-blue-50/60"  /> مجدولة
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-3 rounded-sm border-2 border-amber-400 bg-amber-50/60" /> جارية
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-3 rounded-sm border-2 border-green-400 bg-green-50/60" /> مكتملة
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-3 rounded-sm border-2 border-red-400   bg-red-50/60"   /> ملغاة
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-3 rounded bg-primary/[0.035] border border-primary/10" />
              أيام المدة
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Assigned Students Table ── */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            متدربو الدورة ({sessionStudents.length})
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">اسم الموظف</TableHead>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="w-24 text-right">الدرجات</TableHead>
              <TableHead className="w-20 text-right">إزالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  لم يتم تعيين متدربين بعد.
                </TableCell>
              </TableRow>
            ) : (
              sessionStudents.map((student, idx) => (
                <TableRow key={student.id} className="transition-colors hover:bg-accent/50">
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{student.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{student.employeeDepartment}</TableCell>
                  <TableCell>
                    {(() => {
                      const g = gradesMap[student.id]
                      const vals = g ? [gradeValue(g.exam1), gradeValue(g.exam2), gradeValue(g.exam3)].filter(v => v !== null) as number[] : []
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openGrades(student)}>
                              <ClipboardList className="h-4 w-4 text-primary" />
                              {vals.length > 0 && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                  {Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)}%
                                </Badge>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>إدخال الدرجات</TooltipContent>
                        </Tooltip>
                      )
                    })()}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openConfirm({
                            title: "إزالة المتدرب",
                            message: `هل أنت متأكد من إزالة "${student.employeeName}" من الدورة؟`,
                            confirmText: "إزالة",
                            variant: "destructive",
                            onConfirm: () => handleRemove(student),
                          })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>إزالة</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── Grades Dialog ── */}
      <Dialog open={!!gradesStudent} onOpenChange={open => { if (!open) setGradesStudent(null) }}>
        <DialogContent className="sm:max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {gradesStudent?.employeeName}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{session.programTitle}</p>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">درجات الامتحانات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(["exam1", "exam2", "exam3"] as const).map((key, i) => {
                  const val = gradesDraft[key]
                  const num = gradeValue(val)
                  const color = num === null ? "" : num >= 90 ? "text-green-600" : num >= 60 ? "text-blue-600" : "text-amber-600"
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label>الامتحان {["الأول", "الثاني", "الثالث"][i]}</Label>
                        {num !== null && <span className={`text-xs font-semibold ${color}`}>{num}/100</span>}
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0 — 100"
                          value={val}
                          onChange={e => setGradesDraft(prev => ({ ...prev, [key]: e.target.value }))}
                          className="text-right pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                      </div>
                      {num !== null && <Progress value={num} className="h-1.5" />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {(() => {
              const vals = [gradesDraft.exam1, gradesDraft.exam2, gradesDraft.exam3]
                .map(gradeValue).filter(v => v !== null) as number[]
              if (vals.length === 0) return null
              const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
              const color = avg >= 90
                ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                : avg >= 60
                  ? "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                  : "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
              return (
                <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium ${color}`}>
                  <span>المعدل العام ({vals.length}/3 امتحانات)</span>
                  <span className="text-base font-bold">{avg}%</span>
                </div>
              )
            })()}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setGradesStudent(null)}>إلغاء</Button>
              <Button className="flex-1" onClick={saveGrades}>حفظ الدرجات</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DistributionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        session={session}
        assignedStudents={assignedStudents}
        onAssign={handleAssign}
      />

      <ConfirmModal />
    </div>
  )
}
