"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"
import type { CourseRecord, CourseStatus } from "./courses-types"

interface CoursesTableProps {
  records: CourseRecord[]
  onEdit: (course: CourseRecord) => void
  onDelete: (course: CourseRecord) => void
}

const statusVariant: Record<CourseStatus, "default" | "secondary" | "destructive" | "outline"> = {
  "مفتوح": "outline",
  "جاري": "default",
  "مكتمل": "secondary",
  "ملغي": "destructive",
}

const statusColor: Record<CourseStatus, string> = {
  "مفتوح": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "جاري": "bg-blue-100 text-blue-800 border-blue-300",
  "مكتمل": "bg-green-100 text-green-800 border-green-300",
  "ملغي": "bg-red-100 text-red-800 border-red-300",
}

export default function CoursesTable({ records, onEdit, onDelete }: CoursesTableProps) {
  if (records.length === 0) {
    return (
      <Card className="overflow-hidden" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">اسم الدورة</TableHead>
              <TableHead className="text-right">المدرب</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">المدة</TableHead>
              <TableHead className="text-right">تاريخ البداية</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المشتركين</TableHead>
              <TableHead className="w-24 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                لا توجد دورات.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-right">#</TableHead>
            <TableHead className="text-right">اسم الدورة</TableHead>
            <TableHead className="text-right">المدرب</TableHead>
            <TableHead className="text-right">التصنيف</TableHead>
            <TableHead className="text-right">المدة</TableHead>
            <TableHead className="text-right">تاريخ البداية</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">المشتركين</TableHead>
            <TableHead className="w-24 text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((course, idx) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>
                <Badge variant="outline">{course.category}</Badge>
              </TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>{course.startDate}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[course.status]}`}>
                  {course.status}
                </span>
              </TableCell>
              <TableCell>{course.employeeCount}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(course)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
