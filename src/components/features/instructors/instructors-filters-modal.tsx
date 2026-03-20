"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import type { InstructorFilters } from "./instructors-types"

interface InstructorFiltersModalProps {
  filters: InstructorFilters
  onApply: (filters: InstructorFilters) => void
  onReset: () => void
}

const types = ["داخلي", "خارجي"]
const statuses = ["نشط", "غير نشط"]
const specialties = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]

export default function InstructorFiltersModal({ filters, onApply, onReset }: InstructorFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<InstructorFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: InstructorFilters = { type: "", specialty: "", status: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const hasActive = filters.type || filters.specialty || filters.status

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="relative">
        <SlidersHorizontal className="ml-2 h-4 w-4" />
        تصفية
        {hasActive && (
          <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-primary" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية المدربين</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select
                value={local.type}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, type: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {types.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>التخصص</Label>
              <Select
                value={local.specialty}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, specialty: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {specialties.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select
                value={local.status}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, status: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start gap-2 pt-2">
              <Button onClick={handleApply}>تطبيق</Button>
              <Button variant="outline" onClick={handleReset}>إعادة تعيين</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
