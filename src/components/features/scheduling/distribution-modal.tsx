"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ClassSession, AssignedStudent } from "./scheduling-types"
import { AVAILABLE_EMPLOYEES } from "@/mock-data/scheduling-data"

interface DistributionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: ClassSession | null
  assignedStudents: AssignedStudent[]
  onAssign: (employeeName: string, employeeDepartment: string) => void
}

export default function DistributionModal({ open, onOpenChange, session, assignedStudents, onAssign }: DistributionModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setSelectedEmployee("")
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

  const isFull = session ? sessionStudents.length >= session.capacity : false

  const handleSave = () => {
    if (!selectedEmployee) { setError("الموظف مطلوب"); return }
    const emp = AVAILABLE_EMPLOYEES.find(e => e.name === selectedEmployee)
    if (!emp) return
    onAssign(emp.name, emp.department)
    onOpenChange(false)
  }

  if (!session) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto" dir="rtl">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>تعيين متدرب</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6 pb-6">
          <Card>
            <CardContent className="pt-4 space-y-4">
              {/* Session Info */}
              <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
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

                  {error && <p className="text-sm text-destructive">{error}</p>}
                </>
              )}
            </CardContent>
          </Card>

          {!isFull && (
            <SheetFooter className="flex-row gap-2 p-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
              <Button onClick={handleSave}>تعيين</Button>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
