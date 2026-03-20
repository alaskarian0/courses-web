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
import type { ProgramGrade, GradeLevel } from "./assessments-types"

interface GradesTableProps {
  grades: ProgramGrade[]
}

const gradeColor: Record<GradeLevel, string> = {
  "ممتاز": "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  "جيد جداً": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  "جيد": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800",
  "مقبول": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800",
  "راسب": "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
}

const progressColor: Record<GradeLevel, string> = {
  "ممتاز": "bg-green-500",
  "جيد جداً": "bg-blue-500",
  "جيد": "bg-yellow-500",
  "مقبول": "bg-orange-500",
  "راسب": "bg-red-500",
}

const headers = [
  "#",
  "الطالب",
  "القسم",
  "البرنامج",
  "الاختبارات",
  "الدرجة",
  "النسبة",
  "التقدير",
]

function TableHeaderRow() {
  return (
    <TableRow>
      {headers.map((h, i) => (
        <TableHead
          key={i}
          className={`text-right ${i === 0 ? "w-16" : ""}`}
        >
          {h}
        </TableHead>
      ))}
    </TableRow>
  )
}

export default function GradesTable({ grades }: GradesTableProps) {
  if (grades.length === 0) {
    return (
      <Card dir="rtl">
        <Table>
          <TableHeader>
            <TableHeaderRow />
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                لا توجد تقييمات.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card dir="rtl">
      <Table>
        <TableHeader>
          <TableHeaderRow />
        </TableHeader>
        <TableBody>
          {grades.map((grade) => {
            const pct = grade.totalPossible > 0
              ? Math.round((grade.totalObtained / grade.totalPossible) * 100)
              : 0
            return (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{grade.id}</TableCell>
                <TableCell className="font-medium">{grade.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{grade.studentDepartment}</TableCell>
                <TableCell className="text-muted-foreground">{grade.programTitle}</TableCell>
                <TableCell className="text-muted-foreground">
                  {grade.completedQuizzes}/{grade.totalQuizzes}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span className="text-xs font-medium">
                      {grade.totalObtained}/{grade.totalPossible}
                    </span>
                    <div className="w-14 h-1.5 bg-muted rounded-full">
                      <div
                        className={`h-full rounded-full ${progressColor[grade.gradeLevel]}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {grade.averagePercentage}%
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${gradeColor[grade.gradeLevel]}`}
                  >
                    {grade.gradeLevel}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
