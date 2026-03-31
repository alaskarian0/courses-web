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
import type { WorkshopFilters } from "./workshops-types"
import { WORKSHOP_STATUSES } from "@/mock-data/workshops-data"

interface WorkshopFiltersModalProps {
  filters: WorkshopFilters
  onApply: (filters: WorkshopFilters) => void
  onReset: () => void
}

export default function WorkshopFiltersModal({ filters, onApply, onReset }: WorkshopFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<WorkshopFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: WorkshopFilters = { dateFrom: "", dateTo: "", status: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const hasActive = filters.dateFrom || filters.dateTo || filters.status

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
        <DialogContent className="sm:max-w-[360px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية ورش العمل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="ws-dateFrom">من تاريخ</Label>
              <Input
                id="ws-dateFrom"
                type="date"
                value={local.dateFrom}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ws-dateTo">إلى تاريخ</Label>
              <Input
                id="ws-dateTo"
                type="date"
                value={local.dateTo}
                onChange={(e) => setLocal((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
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
                  {WORKSHOP_STATUSES.map((s) => (
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
