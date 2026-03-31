"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StudentQuizMark } from "./assessments-types"
import { MARK_STATUSES } from "@/mock-data/assessments-data"

interface MarkEntryModalProps {
  open: boolean
  onClose: () => void
  onSave: (mark: StudentQuizMark) => void
  editingMark: StudentQuizMark | null
}

export default function MarkEntryModal({ open, onClose, onSave, editingMark }: MarkEntryModalProps) {
  const [obtainedMarks, setObtainedMarks] = useState(0)
  const [status, setStatus] = useState<string>("لم يقدم")

  useEffect(() => {
    if (open && editingMark) {
      setObtainedMarks(editingMark.obtainedMarks)
      setStatus(editingMark.status)
    }
  }, [open, editingMark])

  if (!editingMark) return null

  const handleSave = () => {
    const clamped = Math.max(0, Math.min(obtainedMarks, editingMark.totalMarks))
    const percentage = Math.round((clamped / editingMark.totalMarks) * 100)
    const today = new Date().toISOString().split("T")[0]

    const updated: StudentQuizMark = {
      ...editingMark,
      obtainedMarks: clamped,
      percentage,
      status: status as StudentQuizMark["status"],
      gradedDate: status === "مصحح" ? today : editingMark.gradedDate,
      submittedDate: clamped > 0 && editingMark.submittedDate === null ? today : editingMark.submittedDate,
    }

    onSave(updated)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل الدرجة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="font-medium">{editingMark.studentName}</p>
            <p className="text-xs text-muted-foreground">{editingMark.quizTitle} &middot; {editingMark.studentDepartment}</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="mark-obtained">الدرجة المحصلة</Label>
            <Input
              id="mark-obtained"
              type="number"
              min={0}
              max={editingMark.totalMarks}
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(Number(e.target.value))}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground">من {editingMark.totalMarks}</p>
          </div>

          <div className="space-y-1">
            <Label>الحالة</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MARK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-start gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
