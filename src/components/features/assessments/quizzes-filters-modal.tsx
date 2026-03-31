"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import { SlidersHorizontal } from "lucide-react"
import type { QuizFilters } from "./assessments-types"
import { PROGRAM_LIST, QUIZ_STATUSES } from "@/mock-data/assessments-data"

interface QuizzesFiltersModalProps {
  filters: QuizFilters
  onApply: (f: QuizFilters) => void
  onReset: () => void
}

export default function QuizzesFiltersModal({ filters, onApply, onReset }: QuizzesFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<QuizFilters>(filters)

  const activeCount = [filters.program, filters.status].filter((v) => v !== "all").length

  const handleOpen = () => {
    setLocalFilters(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(localFilters)
    setOpen(false)
  }

  const handleReset = () => {
    onReset()
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="relative">
        <SlidersHorizontal className="h-4 w-4 ml-1" />
        تصفية
        {activeCount > 0 && (
          <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {activeCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية الاختبارات</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>البرنامج</Label>
              <Select
                value={localFilters.program}
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, program: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {PROGRAM_LIST.map((p) => (
                    <SelectItem key={p.id} value={p.title}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={localFilters.status}
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, status: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {QUIZ_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleReset}>
              إعادة تعيين
            </Button>
            <Button onClick={handleApply}>تطبيق</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
