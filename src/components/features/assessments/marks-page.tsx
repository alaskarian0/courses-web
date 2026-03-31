"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Quiz, StudentQuizMark } from "./assessments-types"
import { DUMMY_QUIZZES, DUMMY_MARKS } from "@/mock-data/assessments-data"
import MarksTab from "./marks-tab"

export default function MarksPage() {
  const searchParams = useSearchParams()
  const quizId = searchParams.get("quizId")

  const [quizzes] = useState<Quiz[]>(DUMMY_QUIZZES)
  const [marks, setMarks] = useState<StudentQuizMark[]>(DUMMY_MARKS)

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">درجات الطلاب</h1>
      <MarksTab
        marks={marks}
        quizzes={quizzes}
        onUpdateMarks={setMarks}
        initialQuizId={quizId ? Number(quizId) : null}
      />
    </div>
  )
}
