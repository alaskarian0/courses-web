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
import type { CourseRecord, CourseCategory, CourseStatus } from "./courses-types"
import { COURSE_CATEGORIES, COURSE_STATUSES } from "@/mock-data/courses-data"

interface CoursesModalProps {
  open: boolean
  onClose: () => void
  onSave: (course: CourseRecord) => void
  editingCourse: CourseRecord | null
  nextId: number
}

export default function CoursesModal({ open, onClose, onSave, editingCourse, nextId }: CoursesModalProps) {
  const [title, setTitle] = useState("")
  const [instructor, setInstructor] = useState("")
  const [category, setCategory] = useState<string>("تقنية")
  const [duration, setDuration] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState<string>("مفتوح")
  const [employeeCount, setEmployeeCount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingCourse) {
      setTitle(editingCourse.title)
      setInstructor(editingCourse.instructor)
      setCategory(editingCourse.category)
      setDuration(editingCourse.duration)
      setStartDate(editingCourse.startDate)
      setEndDate(editingCourse.endDate)
      setStatus(editingCourse.status)
      setEmployeeCount(String(editingCourse.employeeCount))
    } else if (open) {
      setTitle("")
      setInstructor("")
      setCategory("تقنية")
      setDuration("")
      setStartDate("")
      setEndDate("")
      setStatus("مفتوح")
      setEmployeeCount("")
    }
    setErrors({})
  }, [open, editingCourse])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "اسم الدورة مطلوب"
    if (!instructor.trim()) newErrors.instructor = "اسم المدرب مطلوب"
    if (!duration.trim()) newErrors.duration = "المدة مطلوبة"
    if (!startDate) newErrors.startDate = "تاريخ البداية مطلوب"
    if (!endDate) newErrors.endDate = "تاريخ النهاية مطلوب"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave({
      id: editingCourse ? editingCourse.id : nextId,
      title: title.trim(),
      instructor: instructor.trim(),
      category: category as CourseCategory,
      duration: duration.trim(),
      startDate,
      endDate,
      status: status as CourseStatus,
      employeeCount: Number(employeeCount) || 0,
    })
    handleClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editingCourse ? "تعديل الدورة" : "إضافة دورة جديدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="title">اسم الدورة</Label>
            <Input
              id="title"
              placeholder="أدخل اسم الدورة..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: "" })) }}
              className="text-right"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="instructor">المدرب</Label>
            <Input
              id="instructor"
              placeholder="أدخل اسم المدرب..."
              value={instructor}
              onChange={(e) => { setInstructor(e.target.value); if (errors.instructor) setErrors((p) => ({ ...p, instructor: "" })) }}
              className="text-right"
            />
            {errors.instructor && <p className="text-sm text-destructive">{errors.instructor}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="duration">المدة</Label>
              <Input
                id="duration"
                placeholder="مثال: 40 ساعة"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); if (errors.duration) setErrors((p) => ({ ...p, duration: "" })) }}
                className="text-right"
              />
              {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="employeeCount">عدد المشتركين</Label>
              <Input
                id="employeeCount"
                type="number"
                min="0"
                placeholder="0"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate">تاريخ البداية</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" })) }}
              />
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate">تاريخ النهاية</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" })) }}
              />
              {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
            </div>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">{editingCourse ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
