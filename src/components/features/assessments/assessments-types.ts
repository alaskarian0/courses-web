// ─── Question & Quiz Types ──────────────────────────────────────────────────

export type QuestionType = "اختيار متعدد" | "صح وخطأ" | "إجابة قصيرة"
export type QuizStatus = "مسودة" | "منشور" | "مغلق"

export interface QuizOption {
  id: number
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: number
  quizId: number
  type: QuestionType
  text: string
  points: number
  options: QuizOption[]
  correctAnswer?: string
  order: number
}

export interface Quiz {
  id: number
  programId: number
  programTitle: string
  instructorName: string
  title: string
  description: string
  totalMarks: number
  passingMarks: number
  duration: number
  status: QuizStatus
  createdDate: string
  dueDate: string
  questionsCount: number
}

// ─── Student Marks ──────────────────────────────────────────────────────────

export type MarkStatus = "لم يقدم" | "قيد التصحيح" | "مصحح"

export interface StudentQuizMark {
  id: number
  quizId: number
  quizTitle: string
  studentId: number
  studentName: string
  studentDepartment: string
  programId: number
  programTitle: string
  obtainedMarks: number
  totalMarks: number
  percentage: number
  status: MarkStatus
  submittedDate: string | null
  gradedDate: string | null
}

// ─── Aggregated Program Grade ───────────────────────────────────────────────

export type GradeLevel = "ممتاز" | "جيد جداً" | "جيد" | "مقبول" | "راسب"

export interface ProgramGrade {
  id: number
  studentId: number
  studentName: string
  studentDepartment: string
  programId: number
  programTitle: string
  totalQuizzes: number
  completedQuizzes: number
  totalObtained: number
  totalPossible: number
  averagePercentage: number
  gradeLevel: GradeLevel
}

// ─── Filters ────────────────────────────────────────────────────────────────

export interface QuizFilters {
  program: string
  status: string
}

export interface MarksFilters {
  program: string
  quiz: string
  status: string
}

export interface GradesFilters {
  program: string
  gradeLevel: string
}
