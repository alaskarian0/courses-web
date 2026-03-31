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
import { Trash2, Edit, Star } from "lucide-react"
import type { InstructorRecord, InstructorStatus, InstructorType } from "./instructors-types"
import { useConfirmModal } from "@/components/common/confirm-modal"

interface InstructorsTableProps {
  records: InstructorRecord[]
  onEdit: (instructor: InstructorRecord) => void
  onDelete: (instructor: InstructorRecord) => void
}

const statusColor: Record<InstructorStatus, string> = {
  "نشط": "bg-green-100 text-green-800 border-green-300",
  "غير نشط": "bg-red-100 text-red-800 border-red-300",
}

const typeColor: Record<InstructorType, string> = {
  "داخلي": "bg-blue-100 text-blue-800 border-blue-300",
  "خارجي": "bg-orange-100 text-orange-800 border-orange-300",
}

const headers = ["#", "الاسم", "النوع", "الجهة", "التخصص", "البريد", "الهاتف", "الدورات", "الورش", "التقييم", "الحالة", "الإجراءات"]

function TableHeaderRow() {
  return (
    <TableRow>
      {headers.map((h, i) => (
        <TableHead key={i} className={`text-right ${i === 0 ? "w-16" : ""} ${i === headers.length - 1 ? "w-24" : ""}`}>
          {h}
        </TableHead>
      ))}
    </TableRow>
  )
}

export default function InstructorsTable({ records, onEdit, onDelete }: InstructorsTableProps) {
  const { openConfirm, ConfirmModal } = useConfirmModal()

  const handleDeleteClick = (inst: InstructorRecord) => {
    openConfirm({
      title: "حذف المدرب",
      message: `هل أنت متأكد من حذف "${inst.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "destructive",
      onConfirm: () => onDelete(inst),
    })
  }

  if (records.length === 0) {
    return (
      <Card className="overflow-hidden" dir="rtl">
        <Table>
          <TableHeader><TableHeaderRow /></TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center py-10 text-muted-foreground">
                لا يوجد مدربين.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <>
    <Card className="overflow-hidden" dir="rtl">
      <Table>
        <TableHeader><TableHeaderRow /></TableHeader>
        <TableBody>
          {records.map((inst, idx) => (
            <TableRow key={inst.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium">{inst.name}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColor[inst.type]}`}>
                  {inst.type}
                </span>
              </TableCell>
              <TableCell>{inst.organization}</TableCell>
              <TableCell>{inst.specialty}</TableCell>
              <TableCell className="text-muted-foreground" dir="ltr">{inst.email}</TableCell>
              <TableCell dir="ltr">{inst.phone}</TableCell>
              <TableCell>{inst.coursesCount}</TableCell>
              <TableCell>{inst.workshopsCount}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{inst.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[inst.status]}`}>
                  {inst.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(inst)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(inst)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
    <ConfirmModal />
    </>
  )
}
