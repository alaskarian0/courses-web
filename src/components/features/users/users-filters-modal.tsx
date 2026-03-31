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
import type { UserFilters } from "./users-types"
import { USER_ROLES, USER_STATUSES, USER_DEPARTMENTS } from "@/mock-data/users-data"

interface UserFiltersModalProps {
  filters: UserFilters
  onApply: (filters: UserFilters) => void
  onReset: () => void
}

export default function UserFiltersModal({ filters, onApply, onReset }: UserFiltersModalProps) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<UserFilters>(filters)

  const handleOpen = () => {
    setLocal(filters)
    setOpen(true)
  }

  const handleApply = () => {
    onApply(local)
    setOpen(false)
  }

  const handleReset = () => {
    const empty: UserFilters = { role: "", department: "", status: "" }
    setLocal(empty)
    onReset()
    setOpen(false)
  }

  const hasActive = filters.role || filters.department || filters.status

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
            <DialogTitle>تصفية المستخدمين</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>الدور</Label>
              <Select
                value={local.role}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, role: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {USER_ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>القسم</Label>
              <Select
                value={local.department}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, department: val === "all" ? "" : val }))}
              >
                <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {USER_DEPARTMENTS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
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
                  {USER_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
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
