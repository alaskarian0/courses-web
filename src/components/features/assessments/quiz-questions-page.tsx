"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Edit, Trash2 } from "lucide-react"
import { useConfirmModal } from "@/components/common/confirm-modal"
import type { Quiz, QuizQuestion, QuestionType, QuizOption } from "./assessments-types"
import { QUESTION_TYPES } from "@/mock-data/assessments-data"

interface QuizQuestionsPageProps {
  quiz: Quiz
  questions: QuizQuestion[]
  onBack: (updatedQuestions: QuizQuestion[]) => void
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

export default function QuizQuestionsPage({ quiz, questions, onBack }: QuizQuestionsPageProps) {
  const { openConfirm, ConfirmModal } = useConfirmModal()

  const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>(
    questions.filter((q) => q.quizId === quiz.id)
  )
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [form, setForm] = useState<QuestionForm>(emptyForm)

  const totalPoints = localQuestions.reduce((sum, q) => sum + q.points, 0)

  const getNextId = () => Math.max(0, ...questions.map((q) => q.id), ...localQuestions.map((q) => q.id)) + 1
  const getNextOptionId = () =>
    Math.max(
      0,
      ...questions.flatMap((q) => q.options.map((o) => o.id)),
      ...localQuestions.flatMap((q) => q.options.map((o) => o.id))
    ) + 1

  const handleBack = () => {
    const merged = questions.filter((q) => q.quizId !== quiz.id).concat(localQuestions)
    onBack(merged)
  }

  const startEdit = (question: QuizQuestion) => {
    setEditingQuestion(question)
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
      setLocalQuestions((prev) => [
        ...prev,
        {
          id: getNextId(),
          quizId: quiz.id,
          type: form.type,
          text: form.text,
          points: Number(form.points),
          options,
          correctAnswer,
          order: localQuestions.length + 1,
        },
      ])
    }

    cancelForm()
  }

  const deleteQuestion = (question: QuizQuestion) => {
    openConfirm({
      title: "حذف السؤال",
      message: `هل أنت متأكد من حذف السؤال؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف",
      variant: "destructive",
      onConfirm: () => {
        setLocalQuestions((prev) =>
          prev.filter((q) => q.id !== question.id).map((q, i) => ({ ...q, order: i + 1 }))
        )
      },
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <div>
          <h1 className="text-2xl font-bold">إدارة الأسئلة</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{quiz.title}</p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span>عدد الأسئلة: <span className="font-semibold text-foreground">{localQuestions.length}</span></span>
        <span>إجمالي الدرجات: <span className="font-semibold text-foreground">{totalPoints}</span></span>
        <span>الدرجة الكلية للاختبار: <span className="font-semibold text-foreground">{quiz.totalMarks}</span></span>
      </div>

      {/* ── Question form ── */}
      <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع السؤال</Label>
                <Select
                  value={form.type}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, type: val as QuestionType, correctOptionIndex: 0 }))
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الدرجة</Label>
                <Input
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm((prev) => ({ ...prev, points: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>نص السؤال</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            {/* اختيار متعدد */}
            {form.type === "اختيار متعدد" && (
              <div className="space-y-2">
                <Label>الخيارات <span className="text-xs text-muted-foreground">(اختر الإجابة الصحيحة بالدائرة)</span></Label>
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

            {/* صح وخطأ */}
            {form.type === "صح وخطأ" && (
              <div className="space-y-2">
                <Label>الإجابة الصحيحة</Label>
                <div className="flex items-center gap-6">
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

            {/* إجابة قصيرة */}
            {form.type === "إجابة قصيرة" && (
              <div className="space-y-2">
                <Label>الإجابة الصحيحة</Label>
                <Input
                  value={form.correctAnswer}
                  onChange={(e) => setForm((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={saveQuestion}>
                {editingQuestion ? "تحديث السؤال" : "إضافة السؤال"}
              </Button>
              {editingQuestion && (
              <Button size="sm" variant="outline" onClick={cancelForm}>إلغاء</Button>
            )}
            </div>
          </CardContent>
        </Card>

      {/* ── Questions list ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">قائمة الأسئلة</CardTitle>
        </CardHeader>
        <CardContent>
          {localQuestions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">لا توجد أسئلة. أضف سؤالاً للبدء.</p>
          ) : (
            <div className="space-y-2">
              {localQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center gap-3 border rounded-lg p-3 bg-muted/20"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {question.order}
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${typeColor[question.type]}`}>
                    {question.type}
                  </span>
                  <span className="flex-1 text-sm">{question.text}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{question.points} درجة</span>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal />
    </div>
  )
}
