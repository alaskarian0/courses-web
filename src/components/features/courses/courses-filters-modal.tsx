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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import type { CourseFilters } from "./courses-types"

interface CourseFiltersModalProps {
  filters: CourseFilters
  onApply: (filters: CourseFilters) => void
  onReset: () => void
}

const categories = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const statuses = ["مفتوح", "جاري", "مكتمل", "ملغي"]

export default function CourseFiltersModal({ filters, onApply, onReset }: CourseFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<CourseFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: CourseFilters = { dateFrom: "", dateTo: "", category: "", status: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const hasActive = filters.dateFrom || filters.dateTo || filters.category || filters.status

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
            <DialogTitle>تصفية الدورات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="dateFrom">من تاريخ</Label>
              <Input
                id="dateFrom"
                type="date"
                value={local.dateFrom}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dateTo">إلى تاريخ</Label>
              <Input
                id="dateTo"
                type="date"
                value={local.dateTo}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>التصنيف</Label>
              <Select
                value={local.category}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, category: val === "all" ? "" : val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select
                value={local.status}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, status: val === "all" ? "" : val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start gap-2 pt-2">
              <Button onClick={handleApply}>تطبيق</Button>
              <Button variant="outline" onClick={handleReset}>
                إعادة تعيين
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
