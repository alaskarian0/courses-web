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
import type { MarksFilters, Quiz } from "./assessments-types"
import { PROGRAM_LIST, MARK_STATUSES } from "@/mock-data/assessments-data"

interface MarksFiltersModalProps {
  filters: MarksFilters
  quizzes: Quiz[]
  onApply: (f: MarksFilters) => void
  onReset: () => void
}

export default function MarksFiltersModal({ filters, quizzes, onApply, onReset }: MarksFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<MarksFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: MarksFilters = { program: "", quiz: "", status: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const activeCount = [filters.program, filters.quiz, filters.status].filter(Boolean).length

  const filteredQuizzes = local.program
    ? quizzes.filter((q) => q.programTitle === local.program)
    : quizzes

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="relative">
        <SlidersHorizontal className="ml-2 h-4 w-4" />
        تصفية
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تصفية الدرجات</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>البرنامج</Label>
              <Select
                value={local.program || "all"}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, program: val === "all" ? "" : val, quiz: "" }))}
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
              <Label>الاختبار</Label>
              <Select
                value={local.quiz || "all"}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, quiz: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {filteredQuizzes.map((q) => (
                    <SelectItem key={q.id} value={String(q.id)}>{q.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>الحالة</Label>
              <Select
                value={local.status || "all"}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, status: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {MARK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
