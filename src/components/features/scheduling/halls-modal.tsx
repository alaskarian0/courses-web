"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { TrainingHall, HallStatus, Equipment } from "./scheduling-types"
import { BUILDINGS, FLOORS, ALL_EQUIPMENT } from "./scheduling-data"

interface HallsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: TrainingHall | null
  onSave: (hall: Omit<TrainingHall, "id">) => void
}

const HALL_STATUSES: HallStatus[] = ["متاحة", "مشغولة", "صيانة"]

export default function HallsModal({ open, onOpenChange, editing, onSave }: HallsModalProps) {
  const [name, setName] = useState("")
  const [building, setBuilding] = useState(BUILDINGS[0])
  const [floor, setFloor] = useState(FLOORS[0])
  const [capacity, setCapacity] = useState("")
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [status, setStatus] = useState<HallStatus>("متاحة")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setBuilding(editing.building)
      setFloor(editing.floor)
      setCapacity(String(editing.capacity))
      setEquipment([...editing.equipment])
      setStatus(editing.status)
    } else {
      setName("")
      setBuilding(BUILDINGS[0])
      setFloor(FLOORS[0])
      setCapacity("")
      setEquipment([])
      setStatus("متاحة")
    }
    setErrors({})
  }, [editing, open])

  const toggleEquipment = (item: Equipment) => {
    setEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "اسم القاعة مطلوب"
    if (!capacity || Number(capacity) <= 0) errs.capacity = "السعة مطلوبة"
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    onSave({
      name: name.trim(),
      building,
      floor,
      capacity: Number(capacity),
      equipment,
      status,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editing ? "تعديل القاعة" : "إضافة قاعة تدريبية"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="hall-name">اسم القاعة</Label>
            <Input
              id="hall-name"
              placeholder="مثال: قاعة التدريب 1"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })) }}
              className="text-right"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>المبنى</Label>
              <Select value={building} onValueChange={setBuilding}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BUILDINGS.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الطابق</Label>
              <Select value={floor} onValueChange={setFloor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FLOORS.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="hall-capacity">السعة</Label>
              <Input
                id="hall-capacity"
                type="number"
                min="1"
                placeholder="0"
                value={capacity}
                onChange={(e) => { setCapacity(e.target.value); if (errors.capacity) setErrors(p => ({ ...p, capacity: "" })) }}
                className="text-right"
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as HallStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HALL_STATUSES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>المعدات المتوفرة</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_EQUIPMENT.map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={equipment.includes(item)}
                    onCheckedChange={() => toggleEquipment(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit">{editing ? "تحديث" : "إضافة القاعة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
