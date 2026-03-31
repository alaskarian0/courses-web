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
import type { WorkshopRecord, WorkshopStatus } from "./workshops-types"
import { WORKSHOP_STATUSES, WORKSHOP_LOCATIONS } from "@/mock-data/workshops-data"

interface WorkshopsModalProps {
  open: boolean
  onClose: () => void
  onSave: (workshop: WorkshopRecord) => void
  editingWorkshop: WorkshopRecord | null
  nextId: number
}

export default function WorkshopsModal({ open, onClose, onSave, editingWorkshop, nextId }: WorkshopsModalProps) {
  const [title, setTitle] = useState("")
  const [facilitator, setFacilitator] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [capacity, setCapacity] = useState("")
  const [registered, setRegistered] = useState("")
  const [status, setStatus] = useState<string>("قادم")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingWorkshop) {
      setTitle(editingWorkshop.title)
      setFacilitator(editingWorkshop.facilitator)
      setLocation(editingWorkshop.location)
      setDate(editingWorkshop.date)
      setTimeSlot(editingWorkshop.timeSlot)
      setCapacity(String(editingWorkshop.capacity))
      setRegistered(String(editingWorkshop.registered))
      setStatus(editingWorkshop.status)
    } else if (open) {
      setTitle("")
      setFacilitator("")
      setLocation("")
      setDate("")
      setTimeSlot("")
      setCapacity("")
      setRegistered("")
      setStatus("قادم")
    }
    setErrors({})
  }, [open, editingWorkshop])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "اسم الورشة مطلوب"
    if (!facilitator.trim()) newErrors.facilitator = "اسم المُيسّر مطلوب"
    if (!location.trim()) newErrors.location = "الموقع مطلوب"
    if (!date) newErrors.date = "التاريخ مطلوب"
    if (!timeSlot.trim()) newErrors.timeSlot = "الوقت مطلوب"
    if (!capacity) newErrors.capacity = "السعة مطلوبة"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave({
      id: editingWorkshop ? editingWorkshop.id : nextId,
      title: title.trim(),
      facilitator: facilitator.trim(),
      location: location.trim(),
      date,
      timeSlot: timeSlot.trim(),
      capacity: Number(capacity) || 0,
      registered: Number(registered) || 0,
      status: status as WorkshopStatus,
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
          <DialogTitle>{editingWorkshop ? "تعديل ورشة العمل" : "إضافة ورشة عمل جديدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="ws-title">اسم الورشة</Label>
            <Input
              id="ws-title"
              placeholder="أدخل اسم الورشة..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: "" })) }}
              className="text-right"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="ws-facilitator">المُيسّر</Label>
            <Input
              id="ws-facilitator"
              placeholder="أدخل اسم المُيسّر..."
              value={facilitator}
              onChange={(e) => { setFacilitator(e.target.value); if (errors.facilitator) setErrors((p) => ({ ...p, facilitator: "" })) }}
              className="text-right"
            />
            {errors.facilitator && <p className="text-sm text-destructive">{errors.facilitator}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الموقع</Label>
              <Select value={location} onValueChange={(val) => { setLocation(val); if (errors.location) setErrors((p) => ({ ...p, location: "" })) }}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الموقع" />
                </SelectTrigger>
                <SelectContent>
                  {WORKSHOP_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKSHOP_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ws-date">التاريخ</Label>
              <Input
                id="ws-date"
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors((p) => ({ ...p, date: "" })) }}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="ws-timeSlot">الوقت</Label>
              <Input
                id="ws-timeSlot"
                placeholder="مثال: 09:00 - 12:00"
                value={timeSlot}
                onChange={(e) => { setTimeSlot(e.target.value); if (errors.timeSlot) setErrors((p) => ({ ...p, timeSlot: "" })) }}
                className="text-right"
              />
              {errors.timeSlot && <p className="text-sm text-destructive">{errors.timeSlot}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="ws-capacity">السعة</Label>
              <Input
                id="ws-capacity"
                type="number"
                min="1"
                placeholder="0"
                value={capacity}
                onChange={(e) => { setCapacity(e.target.value); if (errors.capacity) setErrors((p) => ({ ...p, capacity: "" })) }}
                className="text-right"
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="ws-registered">المسجلين</Label>
              <Input
                id="ws-registered"
                type="number"
                min="0"
                placeholder="0"
                value={registered}
                onChange={(e) => setRegistered(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">{editingWorkshop ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
