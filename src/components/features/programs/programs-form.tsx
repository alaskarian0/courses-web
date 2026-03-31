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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProgramRecord, ProgramType, ProgramCategory, ProgramStatus } from "./programs-types"
import { instructors as INSTRUCTORS_LIST } from "@/mock-data/programs-mock"

interface ProgramsFormProps {
  initialData?: ProgramRecord
  onSubmit: (data: Omit<ProgramRecord, "id" | "createdAt" | "registered">) => void
}

const types: ProgramType[] = ["دورة", "ورشة عمل"]
const categories: ProgramCategory[] = ["تقنية", "إدارية", "مالية", "قانونية", "تطوير ذاتي", "صحة وسلامة"]
const statuses: ProgramStatus[] = ["مفتوح", "جاري", "مكتمل", "ملغي"]

export default function ProgramsForm({ initialData, onSubmit }: ProgramsFormProps) {
  const router = useRouter()

  const [instructorOpen, setInstructorOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<string>(types[0])
  const [instructor, setInstructor] = useState(INSTRUCTORS_LIST[0])
  const [category, setCategory] = useState<string>(categories[0])
  const [duration, setDuration] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [status, setStatus] = useState<string>(statuses[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setType(initialData.type)
      setInstructor(initialData.instructor)
      setCategory(initialData.category)
      setDuration(initialData.duration.replace(/[^\d]/g, ""))
      setStartDate(initialData.startDate)
      setEndDate(initialData.endDate)
      setLocation(initialData.location)
      setCapacity(String(initialData.capacity))
      setStatus(initialData.status)
    } else {
      const today = new Date().toISOString().split("T")[0]
      setTitle("")
      setType(types[0])
      setInstructor(INSTRUCTORS_LIST[0])
      setCategory(categories[0])
      setDuration("1")
      setStartDate(today)
      setEndDate(addDays(today, 7))
      setLocation("")
      setCapacity("")
      setStatus(statuses[0])
      setErrors({})
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "هذا الحقل مطلوب"
    if (!instructor) newErrors.instructor = "هذا الحقل مطلوب"
    if (!type) newErrors.type = "هذا الحقل مطلوب"
    if (!category) newErrors.category = "هذا الحقل مطلوب"
    if (!status) newErrors.status = "هذا الحقل مطلوب"
    if (!duration || Number(duration) <= 0) newErrors.duration = "هذا الحقل مطلوب"
    if (!location.trim()) newErrors.location = "هذا الحقل مطلوب"
    if (!startDate) newErrors.startDate = "هذا الحقل مطلوب"
    if (!endDate) newErrors.endDate = "هذا الحقل مطلوب"
    if (!capacity || Number(capacity) <= 0) newErrors.capacity = "هذا الحقل مطلوب"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      title: title.trim(),
      type: type as ProgramType,
      instructor: instructor.trim(),
      category: category as ProgramCategory,
      duration: `${duration} ساعة`,
      startDate,
      endDate,
      location: location.trim(),
      capacity: Number(capacity),
      status: status as ProgramStatus,
    })
  }

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }))

  const addDays = (dateStr: string, days: number): string => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  const daysBetween = (from: string, to: string): number | null => {
    if (!from || !to) return null
    const diff = new Date(to).getTime() - new Date(from).getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    clearError("startDate")
    if (value) {
      const newEnd = addDays(value, 7)
      setEndDate(newEnd)
      clearError("endDate")
    }
  }

  const daysCount = daysBetween(startDate, endDate)

  const handleDaysChange = (value: string) => {
    const days = parseInt(value)
    if (!isNaN(days) && days >= 0 && startDate) {
      setEndDate(addDays(startDate, days))
      clearError("endDate")
    }
  }

  return (
    <div className="w-full" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "تعديل البرنامج التدريبي" : "إضافة برنامج تدريبي جديد"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-1">
              <Label htmlFor="title">اسم البرنامج</Label>
              <Input
                id="title"
                placeholder="أدخل اسم البرنامج التدريبي..."
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearError("title") }}
                className="text-right"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1 col-span-2">
                <Label>نوع البرنامج</Label>
                <Select value={type} onValueChange={(v) => { setType(v); clearError("type") }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label>المدرب</Label>
                <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between font-normal", !instructor && "text-muted-foreground")}
                    >
                      {instructor || "اختر المدرب..."}
                      <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="ابحث عن مدرب..." className="text-right" />
                      <CommandList>
                        <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                        <CommandGroup>
                          {INSTRUCTORS_LIST.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={(val) => {
                                setInstructor(val)
                                clearError("instructor")
                                setInstructorOpen(false)
                              }}
                            >
                              <Check className={cn("ml-2 h-4 w-4", instructor === name ? "opacity-100" : "opacity-0")} />
                              {name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.instructor && <p className="text-sm text-destructive">{errors.instructor}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1 col-span-2">
                <Label>التصنيف</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v); clearError("category") }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2">
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
              <div className="space-y-1">
                <Label htmlFor="duration">ساعات اليوم</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="0"
                    value={duration}
                    onChange={(e) => { setDuration(e.target.value); clearError("duration") }}
                    className="text-right"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">ساعة</span>
                </div>
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>
              <div className="space-y-1">
                <Label>إجمالي ساعات الدورة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={
                      daysCount !== null && daysCount >= 0 && duration && Number(duration) > 0
                        ? daysCount * Number(duration)
                        : ""
                    }
                    placeholder="—"
                    className="text-right bg-muted cursor-default"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">ساعة</span>
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  placeholder="مثال: قاعة التدريب 1"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); clearError("location") }}
                  className="text-right"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="daysCount">عدد الأيام</Label>
                <Input
                  id="daysCount"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={daysCount !== null && daysCount >= 0 ? daysCount : ""}
                  onChange={(e) => handleDaysChange(e.target.value)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => { setEndDate(e.target.value); clearError("endDate") }}
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="capacity">السعة</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={capacity}
                  onChange={(e) => { setCapacity(e.target.value); clearError("capacity") }}
                  className="text-right"
                />
                {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">{initialData ? "حفظ التعديلات" : "إضافة البرنامج"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/programs")}>
                إلغاء
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
