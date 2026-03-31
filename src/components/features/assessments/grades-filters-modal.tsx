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
import type { GradesFilters } from "./assessments-types"
import { PROGRAM_LIST, GRADE_LEVELS } from "@/mock-data/assessments-data"

interface GradesFiltersModalProps {
  filters: GradesFilters
  onApply: (filters: GradesFilters) => void
  onReset: () => void
}

export default function GradesFiltersModal({ filters, onApply, onReset }: GradesFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<GradesFilters>(filters)

  const handleOpen = () => {
    setLocalFilters(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(localFilters)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: GradesFilters = { program: "", gradeLevel: "" }
    setLocalFilters(empty)
    onReset()
    setOpen(false)
  }

  const activeFilterCount = [filters.program, filters.gradeLevel].filter(Boolean).length

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="relative">
        <SlidersHorizontal className="ml-2 h-4 w-4" />
        تصفية
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية التقييمات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>البرنامج</Label>
              <Select
                value={localFilters.program || "all"}
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, program: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {PROGRAM_LIST.map((p) => (
                    <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>التقدير</Label>
              <Select
                value={localFilters.gradeLevel || "all"}
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, gradeLevel: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {GRADE_LEVELS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
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
