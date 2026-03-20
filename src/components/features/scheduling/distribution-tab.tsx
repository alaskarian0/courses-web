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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import {
  Plus,
  Trash2,
  Armchair,
  Users,
  CalendarDays,
  MapPin,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import type { ClassSession, AssignedStudent, TrainingHall } from "./scheduling-types"
import DistributionModal from "./distribution-modal"

interface DistributionTabProps {
  sessions: ClassSession[]
  halls: TrainingHall[]
  assignedStudents: AssignedStudent[]
  onUpdateStudents: (students: AssignedStudent[]) => void
  onUpdateSessions: (sessions: ClassSession[]) => void
  initialSessionId?: number | null
}

export default function DistributionTab({
  sessions,
  halls,
  assignedStudents,
  onUpdateStudents,
  onUpdateSessions,
  initialSessionId,
}: DistributionTabProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId ? String(initialSessionId) : ""
  )
  const [showSeating, setShowSeating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null
    return sessions.find(s => s.id === Number(selectedSessionId)) || null
  }, [selectedSessionId, sessions])

  const sessionStudents = useMemo(() => {
    if (!selectedSession) return []
    return assignedStudents.filter(s => s.sessionId === selectedSession.id)
  }, [selectedSession, assignedStudents])

  const hall = useMemo(() => {
    if (!selectedSession) return null
    return halls.find(h => h.id === selectedSession.hallId) || null
  }, [selectedSession, halls])

  const capacityPct = selectedSession && selectedSession.capacity > 0
    ? Math.round((sessionStudents.length / selectedSession.capacity) * 100)
    : 0

  const handleAssign = (name: string, department: string, seatNumber: number | null) => {
    if (!selectedSession) return
    const newId = assignedStudents.length > 0 ? Math.max(...assignedStudents.map(s => s.id)) + 1 : 1
    const newStudent: AssignedStudent = {
      id: newId,
      employeeName: name,
      employeeDepartment: department,
      sessionId: selectedSession.id,
      seatNumber,
    }
    onUpdateStudents([...assignedStudents, newStudent])
    onUpdateSessions(sessions.map(s =>
      s.id === selectedSession.id ? { ...s, assignedCount: s.assignedCount + 1 } : s
    ))
    toast.success(`تم تعيين "${name}" في الجلسة`)
  }

  const handleRemove = (student: AssignedStudent) => {
    onUpdateStudents(assignedStudents.filter(s => s.id !== student.id))
    if (selectedSession) {
      onUpdateSessions(sessions.map(s =>
        s.id === selectedSession.id ? { ...s, assignedCount: Math.max(0, s.assignedCount - 1) } : s
      ))
    }
    toast.success(`تم إلغاء تعيين "${student.employeeName}"`)
  }

  const handleSeatClick = (seatNum: number) => {
    if (!selectedSession) return
    const occupant = sessionStudents.find(s => s.seatNumber === seatNum)
    if (occupant) {
      // Remove seat assignment
      onUpdateStudents(assignedStudents.map(s =>
        s.id === occupant.id ? { ...s, seatNumber: null } : s
      ))
      toast.info(`تم إلغاء تعيين المقعد ${seatNum}`)
    } else {
      // Find first student without a seat
      const unseated = sessionStudents.find(s => s.seatNumber === null)
      if (unseated) {
        onUpdateStudents(assignedStudents.map(s =>
          s.id === unseated.id ? { ...s, seatNumber: seatNum } : s
        ))
        toast.success(`تم تعيين "${unseated.employeeName}" للمقعد ${seatNum}`)
      } else {
        toast.info("لا يوجد متدربون بدون مقعد")
      }
    }
  }

  // Seating grid dimensions
  const gridCols = selectedSession ? Math.ceil(Math.sqrt(selectedSession.capacity)) : 0
  const gridRows = selectedSession ? Math.ceil(selectedSession.capacity / gridCols) : 0
  const totalSeats = selectedSession ? selectedSession.capacity : 0

  return (
    <div className="space-y-4">
      {/* Session Selector */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="space-y-1 flex-1 min-w-[250px]">
          <Label>اختر الجلسة التدريبية</Label>
          <Select value={selectedSessionId || "placeholder"} onValueChange={(v) => { setSelectedSessionId(v === "placeholder" ? "" : v); setShowSeating(false) }}>
            <SelectTrigger><SelectValue placeholder="اختر جلسة..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>اختر جلسة...</SelectItem>
              {sessions.map(s => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.programTitle} — {s.date} ({s.timeSlot})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedSession && (
        <>
          {/* Session Info + Capacity */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedSession.programTitle}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedSession.hallName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {selectedSession.date} ({selectedSession.dayOfWeek})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedSession.timeSlot}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {sessionStudents.length}/{selectedSession.capacity} متدرب
                    </span>
                  </div>
                  <Progress value={Math.min(capacityPct, 100)} className="h-2 w-48" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSeating(!showSeating)}
                  >
                    <Armchair className="ml-2 h-4 w-4" />
                    {showSeating ? "إخفاء المقاعد" : "ترتيب المقاعد"}
                  </Button>
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="ml-2 h-4 w-4" />
                    تعيين متدرب
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seating Grid */}
          {showSeating && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Armchair className="h-4 w-4" />
                  مخطط المقاعد — {selectedSession.hallName}
                  <span className="text-xs text-muted-foreground font-normal mr-2">
                    (اضغط على مقعد فارغ لتعيين أول متدرب بدون مقعد)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Instructor Area */}
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-8 py-2 text-sm text-primary font-medium">
                    المدرب
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Seats Grid */}
                <div
                  className="grid gap-2 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    maxWidth: `${gridCols * 80}px`,
                    direction: "rtl",
                  }}
                >
                  {Array.from({ length: totalSeats }, (_, i) => {
                    const seatNum = i + 1
                    const occupant = sessionStudents.find(s => s.seatNumber === seatNum)
                    return (
                      <Tooltip key={seatNum}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleSeatClick(seatNum)}
                            className={`
                              flex flex-col items-center justify-center rounded-md border p-1.5 text-[10px] min-h-[52px] transition-all cursor-pointer
                              ${occupant
                                ? "bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
                                : "border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/30 text-muted-foreground"
                              }
                            `}
                          >
                            <Armchair className="h-3.5 w-3.5 mb-0.5" />
                            <span className="font-medium">{seatNum}</span>
                            {occupant && (
                              <span className="truncate max-w-full text-[9px] leading-tight">
                                {occupant.employeeName.split(" ")[0]}
                              </span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-right">
                          {occupant ? (
                            <div>
                              <p className="font-medium">{occupant.employeeName}</p>
                              <p className="text-xs opacity-70">{occupant.employeeDepartment}</p>
                              <p className="text-xs opacity-70">اضغط لإلغاء التعيين</p>
                            </div>
                          ) : (
                            <span>مقعد {seatNum} — فارغ</span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border-dashed border border-muted-foreground/30" />
                    فارغ
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-primary/10 border border-primary/30" />
                    مشغول
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Students Table */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                المتدربين المعينين ({sessionStudents.length})
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-right">#</TableHead>
                  <TableHead className="text-right">اسم الموظف</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">رقم المقعد</TableHead>
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
                        {student.seatNumber !== null ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Armchair className="h-3 w-3" />
                            {student.seatNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">غير محدد</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleRemove(student)}>
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

          {/* Assign Modal */}
          <DistributionModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            session={selectedSession}
            assignedStudents={assignedStudents}
            onAssign={handleAssign}
          />
        </>
      )}

      {!selectedSession && (
        <Card className="p-10 text-center text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>اختر جلسة تدريبية لعرض وإدارة توزيع المتدربين</p>
        </Card>
      )}
    </div>
  )
}
