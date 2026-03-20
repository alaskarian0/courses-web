"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileQuestion, PenLine, Award } from "lucide-react"
import type { Quiz, QuizQuestion, StudentQuizMark, ProgramGrade } from "./assessments-types"
import { DUMMY_QUIZZES, DUMMY_QUESTIONS, DUMMY_MARKS, DUMMY_GRADES } from "./assessments-data"
import QuizzesTab from "./quizzes-tab"
import MarksTab from "./marks-tab"
import GradesTab from "./grades-tab"

export default function AssessmentsList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(DUMMY_QUIZZES)
  const [questions, setQuestions] = useState<QuizQuestion[]>(DUMMY_QUESTIONS)
  const [marks, setMarks] = useState<StudentQuizMark[]>(DUMMY_MARKS)
  const [grades] = useState<ProgramGrade[]>(DUMMY_GRADES)
  const [activeTab, setActiveTab] = useState("quizzes")
  const [navigateToMarksQuizId, setNavigateToMarksQuizId] = useState<number | null>(null)

  const handleNavigateToMarks = (quizId: number) => {
    setNavigateToMarksQuizId(quizId)
    setActiveTab("marks")
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">التقييمات</h1>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v !== "marks") setNavigateToMarksQuizId(null) }}>
        <TabsList>
          <TabsTrigger value="quizzes">
            <FileQuestion className="h-3.5 w-3.5 ml-1.5" />
            الاختبارات
          </TabsTrigger>
          <TabsTrigger value="marks">
            <PenLine className="h-3.5 w-3.5 ml-1.5" />
            درجات الطلاب
          </TabsTrigger>
          <TabsTrigger value="grades">
            <Award className="h-3.5 w-3.5 ml-1.5" />
            التقييم العام
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-4">
          <QuizzesTab
            quizzes={quizzes}
            questions={questions}
            onUpdateQuizzes={setQuizzes}
            onUpdateQuestions={setQuestions}
            onNavigateToMarks={handleNavigateToMarks}
          />
        </TabsContent>

        <TabsContent value="marks" className="mt-4">
          <MarksTab
            marks={marks}
            quizzes={quizzes}
            onUpdateMarks={setMarks}
            initialQuizId={navigateToMarksQuizId}
          />
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <GradesTab grades={grades} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
