"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { Quiz, QuizStatus } from "./assessments-types"
import { QUIZ_STATUSES } from "@/mock-data/assessments-data"

interface QuizFormProps {
  quiz: Quiz
  onSave: (quiz: Quiz) => void
  onCancel: () => void
}

export default function QuizForm({ quiz, onSave, onCancel }: QuizFormProps) {
  const [form, setForm] = useState({
    description: quiz.description,
    totalMarks: String(quiz.totalMarks),
    passingMarks: String(quiz.passingMarks),
    duration: String(quiz.duration),
    dueDate: quiz.dueDate,
    status: quiz.status as QuizStatus,
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: false }))

  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!form.totalMarks || Number(form.totalMarks) <= 0) e.totalMarks = true
    if (!form.passingMarks || Number(form.passingMarks) <= 0) e.passingMarks = true
    if (!form.duration || Number(form.duration) <= 0) e.duration = true
    if (!form.dueDate) e.dueDate = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...quiz,
      description: form.description,
      totalMarks: Number(form.totalMarks),
      passingMarks: Number(form.passingMarks),
      duration: Number(form.duration),
      dueDate: form.dueDate,
      status: form.status,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <h1 className="text-2xl font-bold">تعديل الاختبار</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── Read-only info ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              معلومات الاختبار
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">البرنامج التدريبي</Label>
              <p className="text-sm font-medium">{quiz.programTitle}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">المدرب</Label>
              <p className="text-sm font-medium">{quiz.instructorName}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">عنوان الاختبار</Label>
              <p className="text-sm font-medium">{quiz.title}</p>
            </div>
          </CardContent>
        </Card>

        {/* ── Editable fields ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تفاصيل الاختبار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الدرجة الكلية</Label>
                <Input
                  type="number"
                  value={form.totalMarks}
                  onChange={(e) => { setForm((prev) => ({ ...prev, totalMarks: e.target.value })); clearError("totalMarks") }}
                  className={errors.totalMarks ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>درجة النجاح</Label>
                <Input
                  type="number"
                  value={form.passingMarks}
                  onChange={(e) => { setForm((prev) => ({ ...prev, passingMarks: e.target.value })); clearError("passingMarks") }}
                  className={errors.passingMarks ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>المدة بالدقائق</Label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) => { setForm((prev) => ({ ...prev, duration: e.target.value })); clearError("duration") }}
                  className={errors.duration ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تاريخ التسليم</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => { setForm((prev) => ({ ...prev, dueDate: e.target.value })); clearError("dueDate") }}
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
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">حفظ التعديلات</Button>
              <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
