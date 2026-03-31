"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Quiz, QuizQuestion } from "./assessments-types"
import { DUMMY_QUIZZES, DUMMY_QUESTIONS } from "@/mock-data/assessments-data"
import QuizzesTab from "./quizzes-tab"

export default function QuizzesPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>(DUMMY_QUIZZES)
  const [questions, setQuestions] = useState<QuizQuestion[]>(DUMMY_QUESTIONS)

  const handleNavigateToMarks = (quizId: number) => {
    router.push(`/assessments/marks?quizId=${quizId}`)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">الاختبارات</h1>
      <QuizzesTab
        quizzes={quizzes}
        questions={questions}
        onUpdateQuizzes={setQuizzes}
        onUpdateQuestions={setQuestions}
        onNavigateToMarks={handleNavigateToMarks}
      />
    </div>
  )
}
