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
import type { UserRecord, UserRole, UserStatus } from "./users-types"

interface UsersModalProps {
  open: boolean
  onClose: () => void
  onSave: (user: UserRecord) => void
  editingUser: UserRecord | null
  nextId: number
}

const roles: UserRole[] = ["مشرف", "مدرب", "موظف", "مدير"]
const statuses: UserStatus[] = ["نشط", "معطل"]
const departments = [
  "تقنية المعلومات",
  "الموارد البشرية",
  "المالية",
  "التسويق",
  "الشؤون القانونية",
  "العمليات",
  "خدمة العملاء",
  "الإدارة العليا",
]

export default function UsersModal({ open, onClose, onSave, editingUser, nextId }: UsersModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("موظف")
  const [department, setDepartment] = useState<string>("")
  const [joinDate, setJoinDate] = useState("")
  const [status, setStatus] = useState<string>("نشط")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingUser) {
      setName(editingUser.name)
      setEmail(editingUser.email)
      setRole(editingUser.role)
      setDepartment(editingUser.department)
      setJoinDate(editingUser.joinDate)
      setStatus(editingUser.status)
    } else if (open) {
      setName("")
      setEmail("")
      setRole("موظف")
      setDepartment("")
      setJoinDate("")
      setStatus("نشط")
    }
    setErrors({})
  }, [open, editingUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "الاسم مطلوب"
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
    if (!department) newErrors.department = "القسم مطلوب"
    if (!joinDate) newErrors.joinDate = "تاريخ الانضمام مطلوب"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave({
      id: editingUser ? editingUser.id : nextId,
      name: name.trim(),
      email: email.trim(),
      role: role as UserRole,
      department,
      joinDate,
      status: status as UserStatus,
      coursesCount: editingUser ? editingUser.coursesCount : 0,
      workshopsCount: editingUser ? editingUser.workshopsCount : 0,
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
          <DialogTitle>{editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="user-name">الاسم</Label>
            <Input
              id="user-name"
              placeholder="أدخل اسم المستخدم..."
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }}
              className="text-right"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="user-email">البريد الإلكتروني</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })) }}
              className="text-left"
              dir="ltr"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>الدور</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
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
              <Label>القسم</Label>
              <Select value={department} onValueChange={(val) => { setDepartment(val); if (errors.department) setErrors((p) => ({ ...p, department: "" })) }}>
                <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="user-joinDate">تاريخ الانضمام</Label>
              <Input
                id="user-joinDate"
                type="date"
                value={joinDate}
                onChange={(e) => { setJoinDate(e.target.value); if (errors.joinDate) setErrors((p) => ({ ...p, joinDate: "" })) }}
              />
              {errors.joinDate && <p className="text-sm text-destructive">{errors.joinDate}</p>}
            </div>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>إلغاء</Button>
            <Button type="submit">{editingUser ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
