"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import type { WorkshopRecord, WorkshopStatus } from "./workshops-types"

interface WorkshopsTableProps {
  records: WorkshopRecord[]
  onEdit: (workshop: WorkshopRecord) => void
  onDelete: (workshop: WorkshopRecord) => void
}

const statusColor: Record<WorkshopStatus, string> = {
  "قادم": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "جاري": "bg-blue-100 text-blue-800 border-blue-300",
  "منتهي": "bg-green-100 text-green-800 border-green-300",
  "ملغي": "bg-red-100 text-red-800 border-red-300",
}

export default function WorkshopsTable({ records, onEdit, onDelete }: WorkshopsTableProps) {
  if (records.length === 0) {
    return (
      <div className="border rounded-md" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">اسم الورشة</TableHead>
              <TableHead className="text-right">المُيسّر</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">السعة</TableHead>
              <TableHead className="text-right">المسجلين</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-24 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                لا توجد ورش عمل.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border rounded-md" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-right">#</TableHead>
            <TableHead className="text-right">اسم الورشة</TableHead>
            <TableHead className="text-right">المُيسّر</TableHead>
            <TableHead className="text-right">الموقع</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الوقت</TableHead>
            <TableHead className="text-right">السعة</TableHead>
            <TableHead className="text-right">المسجلين</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="w-24 text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((ws) => {
            const capacityPercent = ws.capacity > 0 ? Math.round((ws.registered / ws.capacity) * 100) : 0
            return (
              <TableRow key={ws.id}>
                <TableCell className="font-medium">{ws.id}</TableCell>
                <TableCell className="font-medium">{ws.title}</TableCell>
                <TableCell>{ws.facilitator}</TableCell>
                <TableCell>{ws.location}</TableCell>
                <TableCell>{ws.date}</TableCell>
                <TableCell>{ws.timeSlot}</TableCell>
                <TableCell>{ws.capacity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{ws.registered}</span>
                    <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[ws.status]}`}>
                    {ws.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(ws)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(ws)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
