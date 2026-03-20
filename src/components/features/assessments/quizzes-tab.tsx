"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"
import DataPagination from "../data/data-pagination"
import QuizzesTable from "./quizzes-table"
import QuizModal from "./quiz-modal"
import QuizQuestionsModal from "./quiz-questions-modal"
import QuizzesFiltersModal from "./quizzes-filters-modal"
import type { Quiz, QuizQuestion, QuizFilters } from "./assessments-types"

interface QuizzesTabProps {
  quizzes: Quiz[]
  questions: QuizQuestion[]
  onUpdateQuizzes: (quizzes: Quiz[]) => void
  onUpdateQuestions: (questions: QuizQuestion[]) => void
  onNavigateToMarks: (quizId: number) => void
}

const defaultFilters: QuizFilters = { program: "all", status: "all" }

export default function QuizzesTab({
  quizzes,
  questions,
  onUpdateQuizzes,
  onUpdateQuestions,
  onNavigateToMarks,
}: QuizzesTabProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<QuizFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false)
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState<Quiz | null>(null)

  const filtered = useMemo(() => {
    let result = quizzes

    if (search.trim()) {
      const s = search.trim().toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.programTitle.toLowerCase().includes(s) ||
          q.instructorName.toLowerCase().includes(s)
      )
    }

    if (filters.program !== "all") {
      result = result.filter((q) => q.programTitle === filters.program)
    }

    if (filters.status !== "all") {
      result = result.filter((q) => q.status === filters.status)
    }

    return result
  }, [quizzes, search, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const nextId = quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : 1

  const handleSave = (quiz: Quiz) => {
    const exists = quizzes.find((q) => q.id === quiz.id)
    if (exists) {
      onUpdateQuizzes(quizzes.map((q) => (q.id === quiz.id ? quiz : q)))
      toast.success("تم تحديث الاختبار بنجاح")
    } else {
      onUpdateQuizzes([...quizzes, quiz])
      toast.success("تم إضافة الاختبار بنجاح")
    }
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setIsModalOpen(true)
  }

  const handleDelete = (quiz: Quiz) => {
    onUpdateQuizzes(quizzes.filter((q) => q.id !== quiz.id))
    onUpdateQuestions(questions.filter((q) => q.quizId !== quiz.id))
    toast.success("تم حذف الاختبار بنجاح")
  }

  const handleManageQuestions = (quiz: Quiz) => {
    setSelectedQuizForQuestions(quiz)
    setQuestionsModalOpen(true)
  }

  const handleQuestionsUpdate = (updatedQuestions: QuizQuestion[]) => {
    onUpdateQuestions(updatedQuestions)

    if (selectedQuizForQuestions) {
      const quizQuestions = updatedQuestions.filter(
        (q) => q.quizId === selectedQuizForQuestions.id
      )
      const newCount = quizQuestions.length
      const newTotal = quizQuestions.reduce((sum, q) => sum + q.points, 0)

      onUpdateQuizzes(
        quizzes.map((q) =>
          q.id === selectedQuizForQuestions.id
            ? { ...q, questionsCount: newCount, totalMarks: newTotal }
            : q
        )
      )
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالعنوان، البرنامج، أو المدرب..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pr-9"
          />
        </div>
        <QuizzesFiltersModal
          filters={filters}
          onApply={(f) => {
            setFilters(f)
            setCurrentPage(1)
          }}
          onReset={() => {
            setFilters(defaultFilters)
            setCurrentPage(1)
          }}
        />
        <Button
          onClick={() => {
            setEditingQuiz(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 ml-1" />
          إضافة اختبار
        </Button>
      </div>

      <QuizzesTable
        quizzes={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageQuestions={handleManageQuestions}
        onViewMarks={onNavigateToMarks}
      />

      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />

      <QuizModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingQuiz={editingQuiz}
        nextId={nextId}
      />

      <QuizQuestionsModal
        open={questionsModalOpen}
        onClose={() => setQuestionsModalOpen(false)}
        quiz={selectedQuizForQuestions}
        questions={questions}
        onUpdateQuestions={handleQuestionsUpdate}
      />
    </>
  )
}
