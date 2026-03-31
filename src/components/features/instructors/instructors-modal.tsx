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
import type { InstructorRecord, InstructorType, InstructorStatus, InstructorSpecialty } from "./instructors-types"

interface InstructorsModalProps {
  open: boolean
  onClose: () => void
  onSave: (instructor: InstructorRecord) => void
  editingInstructor: InstructorRecord | null
  nextId: number
}

const types: InstructorType[] = ["داخلي", "خارجي"]
const statuses: InstructorStatus[] = ["نشط", "غير نشط"]
const specialties: InstructorSpecialty[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]

export default function InstructorsModal({ open, onClose, onSave, editingInstructor, nextId }: InstructorsModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [type, setType] = useState<string>("داخلي")
  const [organization, setOrganization] = useState("")
  const [specialty, setSpecialty] = useState<string>("")
  const [status, setStatus] = useState<string>("نشط")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open && editingInstructor) {
      setName(editingInstructor.name)
      setEmail(editingInstructor.email)
      setPhone(editingInstructor.phone)
      setType(editingInstructor.type)
      setOrganization(editingInstructor.organization)
      setSpecialty(editingInstructor.specialty)
      setStatus(editingInstructor.status)
    } else if (open) {
      setName("")
      setEmail("")
      setPhone("")
      setType("داخلي")
      setOrganization("")
      setSpecialty("")
      setStatus("نشط")
    }
    setErrors({})
  }, [open, editingInstructor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "الاسم مطلوب"
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
    if (!phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    if (!specialty) newErrors.specialty = "التخصص مطلوب"
    if (type === "خارجي" && !organization.trim()) newErrors.organization = "الجهة مطلوبة للمدرب الخارجي"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave({
      id: editingInstructor ? editingInstructor.id : nextId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type: type as InstructorType,
      organization: type === "داخلي" ? "المؤسسة" : organization.trim(),
      specialty: specialty as InstructorSpecialty,
      status: status as InstructorStatus,
      coursesCount: editingInstructor ? editingInstructor.coursesCount : 0,
      workshopsCount: editingInstructor ? editingInstructor.workshopsCount : 0,
      rating: editingInstructor ? editingInstructor.rating : 0,
      createdAt: editingInstructor ? editingInstructor.createdAt : new Date().toISOString(),
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
          <DialogTitle>{editingInstructor ? "تعديل المدرب" : "إضافة مدرب جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="inst-name">الاسم</Label>
            <Input
              id="inst-name"
              placeholder="أدخل اسم المدرب..."
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }}
              className="text-right"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="inst-email">البريد الإلكتروني</Label>
              <Input
                id="inst-email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })) }}
                className="text-left"
                dir="ltr"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="inst-phone">رقم الهاتف</Label>
              <Input
                id="inst-phone"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((p) => ({ ...p, phone: "" })) }}
                className="text-left"
                dir="ltr"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>النوع</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {types.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>التخصص</Label>
              <Select value={specialty} onValueChange={(val) => { setSpecialty(val); if (errors.specialty) setErrors((p) => ({ ...p, specialty: "" })) }}>
                <SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
              {errors.specialty && <p className="text-sm text-destructive">{errors.specialty}</p>}
            </div>
          </div>
          {type === "خارجي" && (
            <div className="space-y-1">
              <Label htmlFor="inst-org">الجهة / المؤسسة</Label>
              <Input
                id="inst-org"
                placeholder="أدخل اسم الجهة أو المؤسسة..."
                value={organization}
                onChange={(e) => { setOrganization(e.target.value); if (errors.organization) setErrors((p) => ({ ...p, organization: "" })) }}
                className="text-right"
              />
              {errors.organization && <p className="text-sm text-destructive">{errors.organization}</p>}
            </div>
          )}
          <div className="space-y-1">
            <Label>الحالة</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-start gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>إلغاء</Button>
            <Button type="submit">{editingInstructor ? "تحديث" : "إضافة"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
