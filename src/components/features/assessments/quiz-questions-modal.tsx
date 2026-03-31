"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Trash2, Plus } from "lucide-react"
import type { Quiz, QuizQuestion, QuestionType, QuizOption } from "./assessments-types"
import { QUESTION_TYPES } from "@/mock-data/assessments-data"

interface QuizQuestionsModalProps {
  open: boolean
  onClose: () => void
  quiz: Quiz | null
  questions: QuizQuestion[]
  onUpdateQuestions: (questions: QuizQuestion[]) => void
}

const typeColor: Record<QuestionType, string> = {
  "اختيار متعدد": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700",
  "صح وخطأ": "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700",
  "إجابة قصيرة": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
}

interface QuestionForm {
  type: QuestionType
  text: string
  points: string
  options: string[]
  correctOptionIndex: number
  correctAnswer: string
}

const emptyForm: QuestionForm = {
  type: "اختيار متعدد",
  text: "",
  points: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  correctAnswer: "",
}

export default function QuizQuestionsModal({
  open,
  onClose,
  quiz,
  questions,
  onUpdateQuestions,
}: QuizQuestionsModalProps) {
  const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>([])
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<QuestionForm>(emptyForm)

  useEffect(() => {
    if (open && quiz) {
      setLocalQuestions(questions.filter((q) => q.quizId === quiz.id))
      setEditingQuestion(null)
      setIsAdding(false)
      setForm(emptyForm)
    }
  }, [open, quiz, questions])

  const handleClose = () => {
    onUpdateQuestions(
      questions
        .filter((q) => q.quizId !== quiz?.id)
        .concat(localQuestions)
    )
    onClose()
  }

  const totalPoints = localQuestions.reduce((sum, q) => sum + q.points, 0)

  const getNextId = () => {
    const allIds = questions.map((q) => q.id)
    const localIds = localQuestions.map((q) => q.id)
    return Math.max(0, ...allIds, ...localIds) + 1
  }

  const getNextOptionId = () => {
    const allOptionIds = questions.flatMap((q) => q.options.map((o) => o.id))
    const localOptionIds = localQuestions.flatMap((q) => q.options.map((o) => o.id))
    return Math.max(0, ...allOptionIds, ...localOptionIds) + 1
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingQuestion(null)
    setForm(emptyForm)
  }

  const startEdit = (question: QuizQuestion) => {
    setEditingQuestion(question)
    setIsAdding(false)

    const correctIdx = question.options.findIndex((o) => o.isCorrect)
    const optionTexts =
      question.type === "اختيار متعدد"
        ? question.options.length >= 4
          ? question.options.map((o) => o.text)
          : [...question.options.map((o) => o.text), ...Array(4 - question.options.length).fill("")]
        : ["", "", "", ""]

    setForm({
      type: question.type,
      text: question.text,
      points: String(question.points),
      options: optionTexts,
      correctOptionIndex: correctIdx >= 0 ? correctIdx : 0,
      correctAnswer: question.correctAnswer ?? "",
    })
  }

  const cancelForm = () => {
    setIsAdding(false)
    setEditingQuestion(null)
    setForm(emptyForm)
  }

  const saveQuestion = () => {
    if (!form.text.trim() || !form.points || Number(form.points) <= 0) return

    let options: QuizOption[] = []
    let correctAnswer: string | undefined

    if (form.type === "اختيار متعدد") {
      const baseId = getNextOptionId()
      options = form.options.map((text, i) => ({
        id: baseId + i,
        text,
        isCorrect: i === form.correctOptionIndex,
      }))
    } else if (form.type === "صح وخطأ") {
      const baseId = getNextOptionId()
      options = [
        { id: baseId, text: "صح", isCorrect: form.correctOptionIndex === 0 },
        { id: baseId + 1, text: "خطأ", isCorrect: form.correctOptionIndex === 1 },
      ]
    } else {
      correctAnswer = form.correctAnswer
    }

    if (editingQuestion) {
      setLocalQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? { ...q, type: form.type, text: form.text, points: Number(form.points), options, correctAnswer }
            : q
        )
      )
    } else {
      const newQuestion: QuizQuestion = {
        id: getNextId(),
        quizId: quiz!.id,
        type: form.type,
        text: form.text,
        points: Number(form.points),
        options,
        correctAnswer,
        order: localQuestions.length + 1,
      }
      setLocalQuestions((prev) => [...prev, newQuestion])
    }

    cancelForm()
  }

  const deleteQuestion = (id: number) => {
    setLocalQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, order: i + 1 }))
    )
  }

  const showForm = isAdding || editingQuestion !== null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إدارة أسئلة: {quiz?.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            عدد الأسئلة: {localQuestions.length} | إجمالي الدرجات: {totalPoints}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Add button */}
          {!showForm && (
            <Button size="sm" onClick={startAdd}>
              <Plus className="h-4 w-4 ml-1" />
              إضافة سؤال
            </Button>
          )}

          {/* Inline form */}
          {showForm && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <div className="space-y-2">
                <Label>نوع السؤال</Label>
                <Select
                  value={form.type}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, type: val as QuestionType, correctOptionIndex: 0 }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>نص السؤال</Label>
                <Textarea
                  value={form.text}
                  onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>الدرجة</Label>
                <Input
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm((prev) => ({ ...prev, points: e.target.value }))}
                  className="w-32"
                />
              </div>

              {/* Multiple choice options */}
              {form.type === "اختيار متعدد" && (
                <div className="space-y-2">
                  <Label>الخيارات</Label>
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={form.correctOptionIndex === i}
                        onChange={() => setForm((prev) => ({ ...prev, correctOptionIndex: i }))}
                        className="accent-primary"
                      />
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...form.options]
                          newOptions[i] = e.target.value
                          setForm((prev) => ({ ...prev, options: newOptions }))
                        }}
                        placeholder={`الخيار ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* True/False options */}
              {form.type === "صح وخطأ" && (
                <div className="space-y-2">
                  <Label>الإجابة الصحيحة</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tfOption"
                        checked={form.correctOptionIndex === 0}
                        onChange={() => setForm((prev) => ({ ...prev, correctOptionIndex: 0 }))}
                        className="accent-primary"
                      />
                      صح
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tfOption"
                        checked={form.correctOptionIndex === 1}
                        onChange={() => setForm((prev) => ({ ...prev, correctOptionIndex: 1 }))}
                        className="accent-primary"
                      />
                      خطأ
                    </label>
                  </div>
                </div>
              )}

              {/* Short answer */}
              {form.type === "إجابة قصيرة" && (
                <div className="space-y-2">
                  <Label>الإجابة الصحيحة</Label>
                  <Input
                    value={form.correctAnswer}
                    onChange={(e) => setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={saveQuestion}>
                  حفظ السؤال
                </Button>
                <Button size="sm" variant="outline" onClick={cancelForm}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-2">
            {localQuestions.map((question) => (
              <div
                key={question.id}
                className="flex items-center gap-3 border rounded-lg p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {question.order}
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${typeColor[question.type]}`}
                >
                  {question.type}
                </span>
                <span className="flex-1 text-sm truncate">{question.text}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {question.points} درجة
                </span>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(question)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
