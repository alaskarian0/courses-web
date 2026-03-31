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
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { BarChart3, ListChecks, Edit, Trash2 } from "lucide-react"
import type { Quiz, QuizStatus } from "./assessments-types"

interface QuizzesTableProps {
  quizzes: Quiz[]
  onEdit: (q: Quiz) => void
  onDelete: (q: Quiz) => void
  onManageQuestions: (q: Quiz) => void
  onViewMarks: (quizId: number) => void
}

const statusColor: Record<QuizStatus, string> = {
  "مسودة": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  "منشور": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  "مغلق": "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
}

const headers = [
  "#",
  "العنوان",
  "البرنامج",
  "المدرب",
  "الدرجة الكلية",
  "درجة النجاح",
  "المدة",
  "عدد الأسئلة",
  "الحالة",
  "تاريخ التسليم",
  "الإجراءات",
]

function TableHeaderRow() {
  return (
    <TableRow>
      {headers.map((h, i) => (
        <TableHead
          key={i}
          className={`text-right ${i === 0 ? "w-16" : ""} ${i === headers.length - 1 ? "w-36" : ""}`}
        >
          {h}
        </TableHead>
      ))}
    </TableRow>
  )
}

export default function QuizzesTable({
  quizzes,
  onEdit,
  onDelete,
  onManageQuestions,
  onViewMarks,
}: QuizzesTableProps) {
  if (quizzes.length === 0) {
    return (
      <Card className="overflow-hidden" dir="rtl">
        <Table>
          <TableHeader>
            <TableHeaderRow />
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                لا توجد اختبارات.
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
          <TableHeaderRow />
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz, idx) => (
            <TableRow key={quiz.id}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell className="font-medium">{quiz.title}</TableCell>
              <TableCell>{quiz.programTitle}</TableCell>
              <TableCell>{quiz.instructorName}</TableCell>
              <TableCell>{quiz.totalMarks}</TableCell>
              <TableCell>{quiz.passingMarks}</TableCell>
              <TableCell>{quiz.duration} دقيقة</TableCell>
              <TableCell>{quiz.questionsCount}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[quiz.status]}`}
                >
                  {quiz.status}
                </span>
              </TableCell>
              <TableCell>{quiz.dueDate}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onViewMarks(quiz.id)}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>عرض الدرجات</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onManageQuestions(quiz)}>
                        <ListChecks className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>إدارة الأسئلة</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(quiz)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>تعديل</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(quiz)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>حذف</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
