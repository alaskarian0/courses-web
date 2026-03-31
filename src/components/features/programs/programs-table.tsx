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
import type { ProgramRecord, ProgramStatus, ProgramType } from "./programs-types"
import { useConfirmModal } from "@/components/common/confirm-modal"

interface ProgramsTableProps {
  records: ProgramRecord[]
  onEdit: (program: ProgramRecord) => void
  onDelete: (program: ProgramRecord) => void
}

const statusColor: Record<ProgramStatus, string> = {
  "مفتوح": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "جاري": "bg-blue-100 text-blue-800 border-blue-300",
  "مكتمل": "bg-green-100 text-green-800 border-green-300",
  "ملغي": "bg-red-100 text-red-800 border-red-300",
}

const typeColor: Record<ProgramType, string> = {
  "دورة": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "ورشة عمل": "bg-teal-100 text-teal-800 border-teal-300",
}

const headers = ["#", "اسم البرنامج", "النوع", "المدرب", "التصنيف", "المدة", "تاريخ البداية", "الموقع", "السعة", "الحالة", "الإجراءات"]

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

export default function ProgramsTable({ records, onEdit, onDelete }: ProgramsTableProps) {
  const { openConfirm, ConfirmModal } = useConfirmModal()

  const handleDeleteClick = (program: ProgramRecord) => {
    openConfirm({
      title: "حذف البرنامج",
      message: `هل أنت متأكد من حذف "${program.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "destructive",
      onConfirm: () => onDelete(program),
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
                لا توجد برامج تدريبية.
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
          {records.map((program, idx) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium">{program.title}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColor[program.type]}`}>
                  {program.type}
                </span>
              </TableCell>
              <TableCell>{program.instructor}</TableCell>
              <TableCell>
                <Badge variant="outline">{program.category}</Badge>
              </TableCell>
              <TableCell>{program.duration}</TableCell>
              <TableCell>{program.startDate}</TableCell>
              <TableCell>{program.location}</TableCell>
              <TableCell>
                <span className="text-sm">
                  {program.registered}/{program.capacity}
                </span>
                <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, (program.registered / program.capacity) * 100)}%` }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[program.status]}`}>
                  {program.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(program)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(program)}>
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
