"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Quiz, QuizStatus } from "./assessments-types"
import { PROGRAM_LIST, QUIZ_STATUSES } from "./assessments-data"

interface QuizModalProps {
  open: boolean
  onClose: () => void
  onSave: (quiz: Quiz) => void
  editingQuiz: Quiz | null
  nextId: number
}

const emptyForm = {
  programId: "",
  instructorName: "",
  title: "",
  description: "",
  totalMarks: "",
  passingMarks: "",
  duration: "",
  dueDate: "",
  status: "مسودة" as QuizStatus,
}

export default function QuizModal({ open, onClose, onSave, editingQuiz, nextId }: QuizModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (open) {
      if (editingQuiz) {
        setForm({
          programId: String(editingQuiz.programId),
          instructorName: editingQuiz.instructorName,
          title: editingQuiz.title,
          description: editingQuiz.description,
          totalMarks: String(editingQuiz.totalMarks),
          passingMarks: String(editingQuiz.passingMarks),
          duration: String(editingQuiz.duration),
          dueDate: editingQuiz.dueDate,
          status: editingQuiz.status,
        })
      } else {
        setForm(emptyForm)
      }
      setErrors({})
    }
  }, [open, editingQuiz])

  const handleProgramChange = (val: string) => {
    const program = PROGRAM_LIST.find((p) => String(p.id) === val)
    setForm((prev) => ({
      ...prev,
      programId: val,
      instructorName: program?.instructor ?? "",
    }))
  }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.programId) newErrors.programId = true
    if (!form.title.trim()) newErrors.title = true
    if (!form.totalMarks || Number(form.totalMarks) <= 0) newErrors.totalMarks = true
    if (!form.passingMarks || Number(form.passingMarks) <= 0) newErrors.passingMarks = true
    if (!form.duration || Number(form.duration) <= 0) newErrors.duration = true
    if (!form.dueDate) newErrors.dueDate = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const program = PROGRAM_LIST.find((p) => String(p.id) === form.programId)

    const quiz: Quiz = {
      id: editingQuiz?.id ?? nextId,
      programId: Number(form.programId),
      programTitle: program?.title ?? "",
      instructorName: form.instructorName,
      title: form.title,
      description: form.description,
      totalMarks: Number(form.totalMarks),
      passingMarks: Number(form.passingMarks),
      duration: Number(form.duration),
      status: form.status,
      createdDate: editingQuiz?.createdDate ?? new Date().toISOString().split("T")[0],
      dueDate: form.dueDate,
      questionsCount: editingQuiz?.questionsCount ?? 0,
    }

    onSave(quiz)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editingQuiz ? "تعديل الاختبار" : "إضافة اختبار جديد"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* البرنامج التدريبي */}
          <div className="space-y-2">
            <Label>البرنامج التدريبي</Label>
            <Select value={form.programId} onValueChange={handleProgramChange}>
              <SelectTrigger className={errors.programId ? "border-destructive" : ""}>
                <SelectValue placeholder="اختر البرنامج" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_LIST.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* عنوان الاختبار */}
          <div className="space-y-2">
            <Label>عنوان الاختبار</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className={errors.title ? "border-destructive" : ""}
            />
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <Label>الوصف</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Grid 3 cols */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>الدرجة الكلية</Label>
              <Input
                type="number"
                value={form.totalMarks}
                onChange={(e) => setForm((prev) => ({ ...prev, totalMarks: e.target.value }))}
                className={errors.totalMarks ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>درجة النجاح</Label>
              <Input
                type="number"
                value={form.passingMarks}
                onChange={(e) => setForm((prev) => ({ ...prev, passingMarks: e.target.value }))}
                className={errors.passingMarks ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>المدة بالدقائق</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                className={errors.duration ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Grid 2 cols */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تاريخ التسليم</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                className={errors.dueDate ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm((prev) => ({ ...prev, status: val as QuizStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUIZ_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            {editingQuiz ? "تحديث" : "إنشاء"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
