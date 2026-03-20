"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { AlertTriangle } from "lucide-react"
import type { ClassSession, TrainingHall, SessionStatus, TimeSlot } from "./scheduling-types"
import { PROGRAM_OPTIONS, INSTRUCTOR_OPTIONS, TIME_SLOTS, SESSION_STATUSES, getDayOfWeek } from "./scheduling-data"

interface SessionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ClassSession | null
  halls: TrainingHall[]
  sessions: ClassSession[]
  onSave: (session: Omit<ClassSession, "id">) => void
}

export default function SessionsModal({ open, onOpenChange, editing, halls, sessions, onSave }: SessionsModalProps) {
  const [programTitle, setProgramTitle] = useState("")
  const [instructorName, setInstructorName] = useState("")
  const [hallId, setHallId] = useState("")
  const [date, setDate] = useState("")
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(TIME_SLOTS[0])
  const [status, setStatus] = useState<SessionStatus>("مجدولة")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [conflict, setConflict] = useState("")

  const availableHalls = halls.filter(h => h.status !== "صيانة")

  useEffect(() => {
    if (editing) {
      setProgramTitle(editing.programTitle)
      setInstructorName(editing.instructorName)
      setHallId(String(editing.hallId))
      setDate(editing.date)
      setTimeSlot(editing.timeSlot)
      setStatus(editing.status)
    } else {
      setProgramTitle("")
      setInstructorName("")
      setHallId("")
      setDate("")
      setTimeSlot(TIME_SLOTS[0])
      setStatus("مجدولة")
    }
    setErrors({})
    setConflict("")
  }, [editing, open])

  // Check conflict when hall/date/timeSlot changes
  useEffect(() => {
    if (!hallId || !date || !timeSlot) { setConflict(""); return }
    const existing = sessions.find(s =>
      s.hallId === Number(hallId) &&
      s.date === date &&
      s.timeSlot === timeSlot &&
      (!editing || s.id !== editing.id)
    )
    if (existing) {
      setConflict(`تعارض: القاعة محجوزة لـ "${existing.programTitle}" في نفس الوقت`)
    } else {
      setConflict("")
    }
  }, [hallId, date, timeSlot, sessions, editing])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!programTitle) errs.programTitle = "البرنامج مطلوب"
    if (!instructorName) errs.instructorName = "المدرب مطلوب"
    if (!hallId) errs.hallId = "القاعة مطلوبة"
    if (!date) errs.date = "التاريخ مطلوب"
    if (conflict) errs.conflict = "يوجد تعارض في الجدول"
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const hall = halls.find(h => h.id === Number(hallId))!
    const dayOfWeek = getDayOfWeek(date)

    onSave({
      programTitle,
      instructorName,
      hallId: Number(hallId),
      hallName: hall.name,
      date,
      dayOfWeek,
      timeSlot,
      capacity: hall.capacity,
      assignedCount: editing?.assignedCount ?? 0,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editing ? "تعديل الجلسة" : "إضافة جلسة تدريبية"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>البرنامج التدريبي</Label>
            <Select value={programTitle || "placeholder"} onValueChange={(v) => { setProgramTitle(v === "placeholder" ? "" : v); if (errors.programTitle) setErrors(p => ({ ...p, programTitle: "" })) }}>
              <SelectTrigger><SelectValue placeholder="اختر البرنامج..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>اختر البرنامج...</SelectItem>
                {PROGRAM_OPTIONS.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
              </SelectContent>
            </Select>
            {errors.programTitle && <p className="text-sm text-destructive">{errors.programTitle}</p>}
          </div>

          <div className="space-y-1">
            <Label>المدرب</Label>
            <Select value={instructorName || "placeholder"} onValueChange={(v) => { setInstructorName(v === "placeholder" ? "" : v); if (errors.instructorName) setErrors(p => ({ ...p, instructorName: "" })) }}>
              <SelectTrigger><SelectValue placeholder="اختر المدرب..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>اختر المدرب...</SelectItem>
                {INSTRUCTOR_OPTIONS.map(i => (<SelectItem key={i} value={i}>{i}</SelectItem>))}
              </SelectContent>
            </Select>
            {errors.instructorName && <p className="text-sm text-destructive">{errors.instructorName}</p>}
          </div>

          <div className="space-y-1">
            <Label>القاعة</Label>
            <Select value={hallId || "placeholder"} onValueChange={(v) => { setHallId(v === "placeholder" ? "" : v); if (errors.hallId) setErrors(p => ({ ...p, hallId: "" })) }}>
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
            {errors.hallId && <p className="text-sm text-destructive">{errors.hallId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="session-date">التاريخ</Label>
              <Input
                id="session-date"
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors(p => ({ ...p, date: "" })) }}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              {date && (
                <p className="text-xs text-muted-foreground">{getDayOfWeek(date)}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>الوقت</Label>
              <Select value={timeSlot} onValueChange={(v) => setTimeSlot(v as TimeSlot)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
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

          <div className="space-y-1">
            <Label>الحالة</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as SessionStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SESSION_STATUSES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={!!conflict}>{editing ? "تحديث" : "إضافة الجلسة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
