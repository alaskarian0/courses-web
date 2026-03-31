"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InstructorRecord, InstructorType, InstructorStatus, InstructorSpecialty } from "./instructors-types"

interface InstructorsFormProps {
  initialData?: InstructorRecord
  onSubmit: (data: Omit<InstructorRecord, "id" | "createdAt" | "coursesCount" | "workshopsCount" | "rating">) => void
}

const types: InstructorType[] = ["داخلي", "خارجي"]
const statuses: InstructorStatus[] = ["نشط", "غير نشط"]
const specialties: InstructorSpecialty[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]

export default function InstructorsForm({ initialData, onSubmit }: InstructorsFormProps) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [type, setType] = useState<string>(types[0])
  const [organization, setOrganization] = useState("")
  const [specialty, setSpecialty] = useState<string>(specialties[0])
  const [status, setStatus] = useState<string>(statuses[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setEmail(initialData.email)
      setPhone(initialData.phone)
      setType(initialData.type)
      setOrganization(initialData.organization)
      setSpecialty(initialData.specialty)
      setStatus(initialData.status)
    } else {
      setName("")
      setEmail("")
      setPhone("")
      setType(types[0])
      setOrganization("")
      setSpecialty(specialties[0])
      setStatus(statuses[0])
      setErrors({})
    }
  }, [initialData])

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "هذا الحقل مطلوب"
    if (!email.trim()) newErrors.email = "هذا الحقل مطلوب"
    if (!phone.trim()) newErrors.phone = "هذا الحقل مطلوب"
    if (!specialty) newErrors.specialty = "هذا الحقل مطلوب"
    if (type === "خارجي" && !organization.trim()) newErrors.organization = "هذا الحقل مطلوب للمدرب الخارجي"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type: type as InstructorType,
      organization: type === "داخلي" ? "المؤسسة" : organization.trim(),
      specialty: specialty as InstructorSpecialty,
      status: status as InstructorStatus,
    })
  }

  return (
    <div className="w-full" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "تعديل بيانات المدرب" : "إضافة مدرب جديد"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسم المدرب..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError("name") }}
                  className="text-right"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label>النوع</Label>
                <Select value={type} onValueChange={(v) => { setType(v); clearError("type") }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>الحالة</Label>
                <Select value={status} onValueChange={(v) => { setStatus(v); clearError("status") }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email") }}
                  className="text-left"
                  dir="ltr"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  placeholder="05xxxxxxxx"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError("phone") }}
                  className="text-left"
                  dir="ltr"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-1">
                <Label>التخصص</Label>
                <Select value={specialty} onValueChange={(v) => { setSpecialty(v); clearError("specialty") }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.specialty && <p className="text-sm text-destructive">{errors.specialty}</p>}
              </div>
            </div>

            {type === "خارجي" && (
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="organization">الجهة / المؤسسة</Label>
                  <Input
                    id="organization"
                    placeholder="أدخل اسم الجهة أو المؤسسة..."
                    value={organization}
                    onChange={(e) => { setOrganization(e.target.value); clearError("organization") }}
                    className="text-right"
                  />
                  {errors.organization && <p className="text-sm text-destructive">{errors.organization}</p>}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit">{initialData ? "حفظ التعديلات" : "إضافة المدرب"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/instructors")}>
                إلغاء
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
