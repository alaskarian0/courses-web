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
import { Edit } from "lucide-react"
import type { StudentQuizMark, MarkStatus } from "./assessments-types"

interface MarksTableProps {
  marks: StudentQuizMark[]
  onEditMark: (mark: StudentQuizMark) => void
}

const statusDotColor: Record<MarkStatus, string> = {
  "لم يقدم": "bg-slate-400",
  "قيد التصحيح": "bg-yellow-500",
  "مصحح": "bg-green-500",
}

const headers = ["#", "الطالب", "القسم", "الاختبار", "الدرجة", "النسبة", "الحالة", "تاريخ التقديم", "الإجراءات"]

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

export default function MarksTable({ marks, onEditMark }: MarksTableProps) {
  return (
    <Card className="overflow-hidden" dir="rtl">
      <Table>
        <TableHeader><TableHeaderRow /></TableHeader>
        <TableBody>
          {marks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                لا توجد درجات.
              </TableCell>
            </TableRow>
          ) : (
            marks.map((mark) => (
              <TableRow key={mark.id} className="transition-colors hover:bg-accent/50">
                <TableCell className="font-medium">{mark.id}</TableCell>
                <TableCell className="font-medium">{mark.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{mark.studentDepartment}</TableCell>
                <TableCell>{mark.quizTitle}</TableCell>
                <TableCell>
                  <span className="text-sm">{mark.obtainedMarks}/{mark.totalMarks}</span>
                  <div className="w-14 h-1.5 bg-muted rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${mark.percentage >= 60 ? "bg-primary" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, mark.percentage)}%` }}
                    />
                  </div>
                </TableCell>
                <TableCell>{mark.percentage}%</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className={`h-2 w-2 rounded-full ${statusDotColor[mark.status]}`} />
                    {mark.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{mark.submittedDate ?? "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onEditMark(mark)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
