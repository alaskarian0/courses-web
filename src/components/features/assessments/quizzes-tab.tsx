"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"
import { useConfirmModal } from "@/components/common/confirm-modal"
import DataPagination from "../data/data-pagination"
import QuizzesTable from "./quizzes-table"
import QuizModal from "./quiz-modal"
import QuizzesFiltersModal from "./quizzes-filters-modal"
import QuizForm from "./quiz-form"
import QuizQuestionsPage from "./quiz-questions-page"
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
  const { openConfirm, ConfirmModal } = useConfirmModal()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<QuizFilters>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuizFull, setEditingQuizFull] = useState<Quiz | null>(null)
  const [questionsPageQuiz, setQuestionsPageQuiz] = useState<Quiz | null>(null)

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

  const handleAddSave = (quiz: Quiz) => {
    onUpdateQuizzes([...quizzes, quiz])
    toast.success("تم إضافة الاختبار بنجاح")
  }

  const handleEditSave = (quiz: Quiz) => {
    onUpdateQuizzes(quizzes.map((q) => (q.id === quiz.id ? quiz : q)))
    toast.success("تم تحديث الاختبار بنجاح")
    setEditingQuizFull(null)
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuizFull(quiz)
  }

  const handleDelete = (quiz: Quiz) => {
    openConfirm({
      title: "حذف الاختبار",
      message: `هل أنت متأكد من حذف "${quiz.title}"؟ سيتم حذف جميع أسئلته. لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "destructive",
      onConfirm: () => {
        onUpdateQuizzes(quizzes.filter((q) => q.id !== quiz.id))
        onUpdateQuestions(questions.filter((q) => q.quizId !== quiz.id))
        toast.success("تم حذف الاختبار بنجاح")
      },
    })
  }

  const handleManageQuestions = (quiz: Quiz) => {
    setQuestionsPageQuiz(quiz)
  }

  const handleQuestionsBack = (updatedQuestions: QuizQuestion[]) => {
    onUpdateQuestions(updatedQuestions)

    if (questionsPageQuiz) {
      const quizQuestions = updatedQuestions.filter(
        (q) => q.quizId === questionsPageQuiz.id
      )
      const newCount = quizQuestions.length
      const newTotal = quizQuestions.reduce((sum, q) => sum + q.points, 0)

      onUpdateQuizzes(
        quizzes.map((q) =>
          q.id === questionsPageQuiz.id
            ? { ...q, questionsCount: newCount, totalMarks: newTotal }
            : q
        )
      )
    }

    setQuestionsPageQuiz(null)
  }

  if (editingQuizFull) {
    return (
      <QuizForm
        quiz={editingQuizFull}
        onSave={handleEditSave}
        onCancel={() => setEditingQuizFull(null)}
      />
    )
  }

  if (questionsPageQuiz) {
    return (
      <QuizQuestionsPage
        quiz={questionsPageQuiz}
        questions={questions}
        onBack={handleQuestionsBack}
      />
    )
  }

  return (
    <div className="space-y-4">
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
          onClick={() => setIsModalOpen(true)}
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
        onSave={handleAddSave}
        editingQuiz={null}
        nextId={nextId}
      />

      <ConfirmModal />
    </div>
  )
}
