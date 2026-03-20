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
import type { ProgramRecord, ProgramType, ProgramCategory, ProgramStatus } from "./programs-types"

interface ProgramsModalProps {
  open: boolean
  onClose: () => void
  onSave: (program: ProgramRecord) => void
  editingProgram: ProgramRecord | null
  nextId: number
}

const types: ProgramType[] = ["دورة", "ورشة عمل"]
const categories: ProgramCategory[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const statuses: ProgramStatus[] = ["مفتوح", "جاري", "مكتمل", "ملغي"]

export default function ProgramsModal({ open, onClose, onSave, editingProgram, nextId }: ProgramsModalProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<string>("دورة")
  const [instructor, setInstructor] = useState("")
  const [category, setCategory] = useState<string>("تقنية")
  const [duration, setDuration] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [status, setStatus] = useState<string>("مفتوح")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingProgram) {
      setTitle(editingProgram.title)
      setType(editingProgram.type)
      setInstructor(editingProgram.instructor)
      setCategory(editingProgram.category)
      setDuration(editingProgram.duration)
      setStartDate(editingProgram.startDate)
      setEndDate(editingProgram.endDate)
      setLocation(editingProgram.location)
      setCapacity(String(editingProgram.capacity))
      setStatus(editingProgram.status)
    } else if (open) {
      setTitle("")
      setType("دورة")
      setInstructor("")
      setCategory("تقنية")
      setDuration("")
      setStartDate("")
      setEndDate("")
      setLocation("")
      setCapacity("")
      setStatus("مفتوح")
    }
    setErrors({})
  }, [open, editingProgram])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "اسم البرنامج مطلوب"
    if (!instructor.trim()) newErrors.instructor = "اسم المدرب مطلوب"
    if (!duration.trim()) newErrors.duration = "المدة مطلوبة"
    if (!startDate) newErrors.startDate = "تاريخ البداية مطلوب"
    if (!endDate) newErrors.endDate = "تاريخ النهاية مطلوب"
    if (!location.trim()) newErrors.location = "الموقع مطلوب"
    if (!capacity || Number(capacity) <= 0) newErrors.capacity = "السعة مطلوبة"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave({
      id: editingProgram ? editingProgram.id : nextId,
      title: title.trim(),
      type: type as ProgramType,
      instructor: instructor.trim(),
      category: category as ProgramCategory,
      duration: duration.trim(),
      startDate,
      endDate,
      location: location.trim(),
      capacity: Number(capacity),
      registered: editingProgram ? editingProgram.registered : 0,
      status: status as ProgramStatus,
    })
    handleClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editingProgram ? "تعديل البرنامج" : "إضافة برنامج تدريبي جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <Label htmlFor="prog-title">اسم البرنامج</Label>
              <Input
                id="prog-title"
                placeholder="أدخل اسم البرنامج التدريبي..."
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: "" })) }}
                className="text-right"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>نوع البرنامج</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {types.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="prog-instructor">المدرب</Label>
              <Input
                id="prog-instructor"
                placeholder="أدخل اسم المدرب..."
                value={instructor}
                onChange={(e) => { setInstructor(e.target.value); if (errors.instructor) setErrors((p) => ({ ...p, instructor: "" })) }}
                className="text-right"
              />
              {errors.instructor && <p className="text-sm text-destructive">{errors.instructor}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="prog-duration">المدة</Label>
              <Input
                id="prog-duration"
                placeholder="مثال: 40 ساعة"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); if (errors.duration) setErrors((p) => ({ ...p, duration: "" })) }}
                className="text-right"
              />
              {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="prog-location">الموقع</Label>
              <Input
                id="prog-location"
                placeholder="مثال: قاعة التدريب 1"
                value={location}
                onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors((p) => ({ ...p, location: "" })) }}
                className="text-right"
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="prog-startDate">تاريخ البداية</Label>
              <Input
                id="prog-startDate"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" })) }}
              />
              {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="prog-endDate">تاريخ النهاية</Label>
              <Input
                id="prog-endDate"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" })) }}
              />
              {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="prog-capacity">السعة</Label>
              <Input
                id="prog-capacity"
                type="number"
                min="1"
                placeholder="0"
                value={capacity}
                onChange={(e) => { setCapacity(e.target.value); if (errors.capacity) setErrors((p) => ({ ...p, capacity: "" })) }}
                className="text-right"
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
            </div>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>إلغاء</Button>
            <Button type="submit">{editingProgram ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
