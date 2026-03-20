"use client"

import { useState, useEffect, useMemo } from "react"
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
import type { ClassSession, AssignedStudent } from "./scheduling-types"
import { AVAILABLE_EMPLOYEES } from "./scheduling-data"

interface DistributionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: ClassSession | null
  assignedStudents: AssignedStudent[]
  onAssign: (employeeName: string, employeeDepartment: string, seatNumber: number | null) => void
}

export default function DistributionModal({ open, onOpenChange, session, assignedStudents, onAssign }: DistributionModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [seatNumber, setSeatNumber] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setSelectedEmployee("")
    setSeatNumber("")
    setError("")
  }, [open])

  const sessionStudents = useMemo(() => {
    if (!session) return []
    return assignedStudents.filter(s => s.sessionId === session.id)
  }, [session, assignedStudents])

  const availableEmployees = useMemo(() => {
    const assignedNames = new Set(sessionStudents.map(s => s.employeeName))
    return AVAILABLE_EMPLOYEES.filter(e => !assignedNames.has(e.name))
  }, [sessionStudents])

  const usedSeats = useMemo(() => {
    return new Set(sessionStudents.filter(s => s.seatNumber !== null).map(s => s.seatNumber))
  }, [sessionStudents])

  const isFull = session ? sessionStudents.length >= session.capacity : false

  const handleSave = () => {
    if (!selectedEmployee) { setError("الموظف مطلوب"); return }
    const emp = AVAILABLE_EMPLOYEES.find(e => e.name === selectedEmployee)
    if (!emp) return

    const seat = seatNumber ? Number(seatNumber) : null
    if (seat !== null && usedSeats.has(seat)) {
      setError("هذا المقعد محجوز بالفعل")
      return
    }

    onAssign(emp.name, emp.department, seat)
    onOpenChange(false)
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعيين متدرب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Session Info */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <p className="text-sm font-medium">{session.programTitle}</p>
            <p className="text-xs text-muted-foreground">
              {session.hallName} • {session.date} • {session.timeSlot}
            </p>
            <p className="text-xs text-muted-foreground">
              المقاعد: {sessionStudents.length}/{session.capacity}
            </p>
          </div>

          {isFull ? (
            <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm text-amber-800 dark:text-amber-300">
              الجلسة ممتلئة — لا يمكن إضافة متدربين جدد.
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label>الموظف</Label>
                <Select value={selectedEmployee || "placeholder"} onValueChange={(v) => { setSelectedEmployee(v === "placeholder" ? "" : v); setError("") }}>
                  <SelectTrigger><SelectValue placeholder="اختر الموظف..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>اختر الموظف...</SelectItem>
                    {availableEmployees.map(e => (
                      <SelectItem key={e.name} value={e.name}>
                        {e.name} — {e.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="seat-num">رقم المقعد (اختياري)</Label>
                <Input
                  id="seat-num"
                  type="number"
                  min="1"
                  max={session.capacity}
                  placeholder="اتركه فارغاً للتعيين لاحقاً"
                  value={seatNumber}
                  onChange={(e) => { setSeatNumber(e.target.value); setError("") }}
                  className="text-right"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-start gap-2 pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                <Button onClick={handleSave}>تعيين</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
