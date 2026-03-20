import type { Quiz, QuizQuestion, StudentQuizMark, ProgramGrade, QuizStatus, MarkStatus, GradeLevel, QuestionType } from "./assessments-types"

// ─── Programs & Instructors (references from scheduling) ────────────────────

export const PROGRAM_LIST = [
  { id: 1, title: "تطوير تطبيقات الويب", instructor: "أحمد الكاظمي" },
  { id: 2, title: "إدارة المشاريع الاحترافية PMP", instructor: "سارة العلي" },
  { id: 3, title: "التفكير الإبداعي وحل المشكلات", instructor: "نور الهاشمي" },
  { id: 4, title: "المحاسبة المالية المتقدمة", instructor: "محمد الحسيني" },
  { id: 5, title: "أمن المعلومات للموظفين", instructor: "علي الموسوي" },
  { id: 6, title: "الذكاء الاصطناعي والتعلم الآلي", instructor: "فاطمة الموسوي" },
  { id: 7, title: "مهارات التواصل الفعّال", instructor: "زينب العامري" },
  { id: 8, title: "القانون التجاري والعقود", instructor: "حسن الربيعي" },
]

// ─── Students per program (from scheduling assignments) ─────────────────────

export const PROGRAM_STUDENTS: Record<number, { id: number; name: string; department: string }[]> = {
  1: [
    { id: 1, name: "يوسف الخزاعي", department: "تقنية المعلومات" },
    { id: 2, name: "باسم العمارة", department: "تقنية المعلومات" },
    { id: 3, name: "طارق البصري", department: "خدمة العملاء" },
    { id: 17, name: "فهد القحطاني", department: "تقنية المعلومات" },
  ],
  2: [
    { id: 4, name: "سارة العلي", department: "الموارد البشرية" },
    { id: 5, name: "مريم الطائي", department: "الموارد البشرية" },
    { id: 18, name: "رنا الحربي", department: "الموارد البشرية" },
  ],
  3: [
    { id: 6, name: "كريم البغدادي", department: "المالية" },
    { id: 13, name: "رائد السماوي", department: "العمليات" },
  ],
  4: [
    { id: 7, name: "جاسم الموصلي", department: "المالية" },
    { id: 8, name: "هدى النجفي", department: "التسويق" },
    { id: 20, name: "عادل الزهراني", department: "المالية" },
  ],
  5: [
    { id: 9, name: "علي الجبوري", department: "الشؤون القانونية" },
    { id: 10, name: "سامر الكربلائي", department: "الشؤون القانونية" },
  ],
  6: [
    { id: 11, name: "نور الهاشمي", department: "العمليات" },
    { id: 12, name: "لمياء الحلي", department: "العمليات" },
    { id: 13, name: "رائد السماوي", department: "العمليات" },
  ],
  7: [
    { id: 14, name: "حسن الربيعي", department: "خدمة العملاء" },
    { id: 25, name: "خالد المنصور", department: "إدارية" },
  ],
  8: [
    { id: 21, name: "وفاء المطيري", department: "الشؤون القانونية" },
    { id: 28, name: "هناء الدوسري", department: "الشؤون القانونية" },
  ],
}

// ─── Quizzes ────────────────────────────────────────────────────────────────

export const DUMMY_QUIZZES: Quiz[] = [
  { id: 1, programId: 1, programTitle: "تطوير تطبيقات الويب", instructorName: "أحمد الكاظمي", title: "اختبار HTML و CSS", description: "اختبار أساسيات HTML و CSS", totalMarks: 20, passingMarks: 12, duration: 30, status: "منشور", createdDate: "2025-04-01", dueDate: "2025-04-20", questionsCount: 10 },
  { id: 2, programId: 1, programTitle: "تطوير تطبيقات الويب", instructorName: "أحمد الكاظمي", title: "اختبار JavaScript", description: "اختبار أساسيات JavaScript والبرمجة", totalMarks: 30, passingMarks: 18, duration: 45, status: "منشور", createdDate: "2025-04-10", dueDate: "2025-05-01", questionsCount: 15 },
  { id: 3, programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", instructorName: "سارة العلي", title: "اختبار منتصف الدورة", description: "اختبار شامل لمواضيع النصف الأول", totalMarks: 40, passingMarks: 24, duration: 60, status: "منشور", createdDate: "2025-04-15", dueDate: "2025-04-30", questionsCount: 20 },
  { id: 4, programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", instructorName: "سارة العلي", title: "الاختبار النهائي", description: "الاختبار النهائي الشامل", totalMarks: 50, passingMarks: 30, duration: 90, status: "مسودة", createdDate: "2025-05-01", dueDate: "2025-05-20", questionsCount: 25 },
  { id: 5, programId: 4, programTitle: "المحاسبة المالية المتقدمة", instructorName: "محمد الحسيني", title: "اختبار المعايير الدولية", description: "اختبار معايير IFRS", totalMarks: 25, passingMarks: 15, duration: 40, status: "منشور", createdDate: "2025-05-05", dueDate: "2025-05-25", questionsCount: 12 },
  { id: 6, programId: 6, programTitle: "الذكاء الاصطناعي والتعلم الآلي", instructorName: "فاطمة الموسوي", title: "اختبار أساسيات الذكاء الاصطناعي", description: "اختبار المفاهيم الأساسية في AI و ML", totalMarks: 30, passingMarks: 18, duration: 45, status: "منشور", createdDate: "2025-05-12", dueDate: "2025-06-01", questionsCount: 15 },
  { id: 7, programId: 3, programTitle: "التفكير الإبداعي وحل المشكلات", instructorName: "نور الهاشمي", title: "تقييم مهارات التفكير", description: "تقييم مهارات التفكير الإبداعي", totalMarks: 20, passingMarks: 12, duration: 30, status: "مغلق", createdDate: "2025-04-05", dueDate: "2025-04-18", questionsCount: 10 },
  { id: 8, programId: 8, programTitle: "القانون التجاري والعقود", instructorName: "حسن الربيعي", title: "اختبار صياغة العقود", description: "اختبار عملي في صياغة العقود", totalMarks: 30, passingMarks: 18, duration: 60, status: "منشور", createdDate: "2025-05-20", dueDate: "2025-06-10", questionsCount: 10 },
]

// ─── Quiz Questions ─────────────────────────────────────────────────────────

export const DUMMY_QUESTIONS: QuizQuestion[] = [
  // Quiz 1 questions (HTML & CSS)
  { id: 1, quizId: 1, type: "اختيار متعدد", text: "ما هو العنصر المستخدم لإنشاء رابط في HTML؟", points: 2, options: [{ id: 1, text: "<a>", isCorrect: true }, { id: 2, text: "<link>", isCorrect: false }, { id: 3, text: "<href>", isCorrect: false }, { id: 4, text: "<url>", isCorrect: false }], order: 1 },
  { id: 2, quizId: 1, type: "صح وخطأ", text: "CSS يرمز إلى Cascading Style Sheets", points: 2, options: [{ id: 5, text: "صح", isCorrect: true }, { id: 6, text: "خطأ", isCorrect: false }], order: 2 },
  { id: 3, quizId: 1, type: "إجابة قصيرة", text: "ما هي خاصية CSS المستخدمة لتغيير لون الخلفية؟", points: 2, options: [], correctAnswer: "background-color", order: 3 },
  { id: 4, quizId: 1, type: "اختيار متعدد", text: "أي من التالي يُستخدم لإنشاء قائمة مرتبة؟", points: 2, options: [{ id: 7, text: "<ul>", isCorrect: false }, { id: 8, text: "<ol>", isCorrect: true }, { id: 9, text: "<li>", isCorrect: false }, { id: 10, text: "<dl>", isCorrect: false }], order: 4 },
  { id: 5, quizId: 1, type: "صح وخطأ", text: "يمكن استخدام display: flex لمحاذاة العناصر", points: 2, options: [{ id: 11, text: "صح", isCorrect: true }, { id: 12, text: "خطأ", isCorrect: false }], order: 5 },
  // Quiz 3 questions (PMP mid-term)
  { id: 6, quizId: 3, type: "اختيار متعدد", text: "ما هي المرحلة الأولى في دورة حياة المشروع؟", points: 2, options: [{ id: 13, text: "التخطيط", isCorrect: false }, { id: 14, text: "البدء", isCorrect: true }, { id: 15, text: "التنفيذ", isCorrect: false }, { id: 16, text: "الإغلاق", isCorrect: false }], order: 1 },
  { id: 7, quizId: 3, type: "إجابة قصيرة", text: "ما هو الاختصار الكامل لـ WBS؟", points: 2, options: [], correctAnswer: "Work Breakdown Structure", order: 2 },
  { id: 8, quizId: 3, type: "صح وخطأ", text: "المسار الحرج هو أطول مسار في جدول المشروع", points: 2, options: [{ id: 17, text: "صح", isCorrect: true }, { id: 18, text: "خطأ", isCorrect: false }], order: 3 },
  // Quiz 7 questions (Creative Thinking - closed)
  { id: 9, quizId: 7, type: "اختيار متعدد", text: "أي من التالي يُعد أسلوباً للعصف الذهني؟", points: 2, options: [{ id: 19, text: "خرائط ذهنية", isCorrect: true }, { id: 20, text: "تحليل SWOT", isCorrect: false }, { id: 21, text: "مخطط جانت", isCorrect: false }, { id: 22, text: "تحليل المسار الحرج", isCorrect: false }], order: 1 },
  { id: 10, quizId: 7, type: "صح وخطأ", text: "التفكير الإبداعي مهارة لا يمكن تعلمها", points: 2, options: [{ id: 23, text: "صح", isCorrect: false }, { id: 24, text: "خطأ", isCorrect: true }], order: 2 },
]

// ─── Student Quiz Marks ─────────────────────────────────────────────────────

export const DUMMY_MARKS: StudentQuizMark[] = [
  // Quiz 1 marks (HTML & CSS - program 1)
  { id: 1, quizId: 1, quizTitle: "اختبار HTML و CSS", studentId: 1, studentName: "يوسف الخزاعي", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 18, totalMarks: 20, percentage: 90, status: "مصحح", submittedDate: "2025-04-18", gradedDate: "2025-04-19" },
  { id: 2, quizId: 1, quizTitle: "اختبار HTML و CSS", studentId: 2, studentName: "باسم العمارة", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 16, totalMarks: 20, percentage: 80, status: "مصحح", submittedDate: "2025-04-18", gradedDate: "2025-04-19" },
  { id: 3, quizId: 1, quizTitle: "اختبار HTML و CSS", studentId: 3, studentName: "طارق البصري", studentDepartment: "خدمة العملاء", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 12, totalMarks: 20, percentage: 60, status: "مصحح", submittedDate: "2025-04-19", gradedDate: "2025-04-20" },
  { id: 4, quizId: 1, quizTitle: "اختبار HTML و CSS", studentId: 17, studentName: "فهد القحطاني", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 14, totalMarks: 20, percentage: 70, status: "مصحح", submittedDate: "2025-04-19", gradedDate: "2025-04-20" },
  // Quiz 2 marks (JavaScript - program 1)
  { id: 5, quizId: 2, quizTitle: "اختبار JavaScript", studentId: 1, studentName: "يوسف الخزاعي", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 27, totalMarks: 30, percentage: 90, status: "مصحح", submittedDate: "2025-04-28", gradedDate: "2025-04-29" },
  { id: 6, quizId: 2, quizTitle: "اختبار JavaScript", studentId: 2, studentName: "باسم العمارة", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 22, totalMarks: 30, percentage: 73, status: "مصحح", submittedDate: "2025-04-28", gradedDate: "2025-04-29" },
  { id: 7, quizId: 2, quizTitle: "اختبار JavaScript", studentId: 3, studentName: "طارق البصري", studentDepartment: "خدمة العملاء", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 15, totalMarks: 30, percentage: 50, status: "مصحح", submittedDate: "2025-04-29", gradedDate: "2025-04-30" },
  { id: 8, quizId: 2, quizTitle: "اختبار JavaScript", studentId: 17, studentName: "فهد القحطاني", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", obtainedMarks: 0, totalMarks: 30, percentage: 0, status: "لم يقدم", submittedDate: null, gradedDate: null },
  // Quiz 3 marks (PMP mid-term - program 2)
  { id: 9, quizId: 3, quizTitle: "اختبار منتصف الدورة", studentId: 4, studentName: "سارة العلي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", obtainedMarks: 36, totalMarks: 40, percentage: 90, status: "مصحح", submittedDate: "2025-04-28", gradedDate: "2025-04-29" },
  { id: 10, quizId: 3, quizTitle: "اختبار منتصف الدورة", studentId: 5, studentName: "مريم الطائي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", obtainedMarks: 28, totalMarks: 40, percentage: 70, status: "مصحح", submittedDate: "2025-04-28", gradedDate: "2025-04-29" },
  { id: 11, quizId: 3, quizTitle: "اختبار منتصف الدورة", studentId: 18, studentName: "رنا الحربي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", obtainedMarks: 32, totalMarks: 40, percentage: 80, status: "مصحح", submittedDate: "2025-04-29", gradedDate: "2025-04-30" },
  // Quiz 5 marks (Accounting - program 4)
  { id: 12, quizId: 5, quizTitle: "اختبار المعايير الدولية", studentId: 7, studentName: "جاسم الموصلي", studentDepartment: "المالية", programId: 4, programTitle: "المحاسبة المالية المتقدمة", obtainedMarks: 22, totalMarks: 25, percentage: 88, status: "مصحح", submittedDate: "2025-05-22", gradedDate: "2025-05-23" },
  { id: 13, quizId: 5, quizTitle: "اختبار المعايير الدولية", studentId: 8, studentName: "هدى النجفي", studentDepartment: "التسويق", programId: 4, programTitle: "المحاسبة المالية المتقدمة", obtainedMarks: 18, totalMarks: 25, percentage: 72, status: "مصحح", submittedDate: "2025-05-22", gradedDate: "2025-05-23" },
  { id: 14, quizId: 5, quizTitle: "اختبار المعايير الدولية", studentId: 20, studentName: "عادل الزهراني", studentDepartment: "المالية", programId: 4, programTitle: "المحاسبة المالية المتقدمة", obtainedMarks: 0, totalMarks: 25, percentage: 0, status: "قيد التصحيح", submittedDate: "2025-05-23", gradedDate: null },
  // Quiz 6 marks (AI - program 6)
  { id: 15, quizId: 6, quizTitle: "اختبار أساسيات الذكاء الاصطناعي", studentId: 11, studentName: "نور الهاشمي", studentDepartment: "العمليات", programId: 6, programTitle: "الذكاء الاصطناعي والتعلم الآلي", obtainedMarks: 28, totalMarks: 30, percentage: 93, status: "مصحح", submittedDate: "2025-05-28", gradedDate: "2025-05-29" },
  { id: 16, quizId: 6, quizTitle: "اختبار أساسيات الذكاء الاصطناعي", studentId: 12, studentName: "لمياء الحلي", studentDepartment: "العمليات", programId: 6, programTitle: "الذكاء الاصطناعي والتعلم الآلي", obtainedMarks: 20, totalMarks: 30, percentage: 67, status: "مصحح", submittedDate: "2025-05-28", gradedDate: "2025-05-29" },
  // Quiz 7 marks (Creative Thinking - program 3 - closed)
  { id: 17, quizId: 7, quizTitle: "تقييم مهارات التفكير", studentId: 6, studentName: "كريم البغدادي", studentDepartment: "المالية", programId: 3, programTitle: "التفكير الإبداعي وحل المشكلات", obtainedMarks: 17, totalMarks: 20, percentage: 85, status: "مصحح", submittedDate: "2025-04-16", gradedDate: "2025-04-17" },
  { id: 18, quizId: 7, quizTitle: "تقييم مهارات التفكير", studentId: 13, studentName: "رائد السماوي", studentDepartment: "العمليات", programId: 3, programTitle: "التفكير الإبداعي وحل المشكلات", obtainedMarks: 14, totalMarks: 20, percentage: 70, status: "مصحح", submittedDate: "2025-04-16", gradedDate: "2025-04-17" },
  // Quiz 8 marks (Law - program 8)
  { id: 19, quizId: 8, quizTitle: "اختبار صياغة العقود", studentId: 21, studentName: "وفاء المطيري", studentDepartment: "الشؤون القانونية", programId: 8, programTitle: "القانون التجاري والعقود", obtainedMarks: 0, totalMarks: 30, percentage: 0, status: "لم يقدم", submittedDate: null, gradedDate: null },
  { id: 20, quizId: 8, quizTitle: "اختبار صياغة العقود", studentId: 28, studentName: "هناء الدوسري", studentDepartment: "الشؤون القانونية", programId: 8, programTitle: "القانون التجاري والعقود", obtainedMarks: 0, totalMarks: 30, percentage: 0, status: "لم يقدم", submittedDate: null, gradedDate: null },
]

// ─── Aggregated Program Grades ──────────────────────────────────────────────

function getGradeLevel(pct: number): GradeLevel {
  if (pct >= 90) return "ممتاز"
  if (pct >= 80) return "جيد جداً"
  if (pct >= 70) return "جيد"
  if (pct >= 60) return "مقبول"
  return "راسب"
}

export const DUMMY_GRADES: ProgramGrade[] = [
  // Program 1 students (2 quizzes: quiz 1 + quiz 2)
  { id: 1, studentId: 1, studentName: "يوسف الخزاعي", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", totalQuizzes: 2, completedQuizzes: 2, totalObtained: 45, totalPossible: 50, averagePercentage: 90, gradeLevel: getGradeLevel(90) },
  { id: 2, studentId: 2, studentName: "باسم العمارة", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", totalQuizzes: 2, completedQuizzes: 2, totalObtained: 38, totalPossible: 50, averagePercentage: 76, gradeLevel: getGradeLevel(76) },
  { id: 3, studentId: 3, studentName: "طارق البصري", studentDepartment: "خدمة العملاء", programId: 1, programTitle: "تطوير تطبيقات الويب", totalQuizzes: 2, completedQuizzes: 2, totalObtained: 27, totalPossible: 50, averagePercentage: 54, gradeLevel: getGradeLevel(54) },
  { id: 4, studentId: 17, studentName: "فهد القحطاني", studentDepartment: "تقنية المعلومات", programId: 1, programTitle: "تطوير تطبيقات الويب", totalQuizzes: 2, completedQuizzes: 1, totalObtained: 14, totalPossible: 50, averagePercentage: 28, gradeLevel: getGradeLevel(28) },
  // Program 2 students (1 quiz completed: quiz 3)
  { id: 5, studentId: 4, studentName: "سارة العلي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", totalQuizzes: 2, completedQuizzes: 1, totalObtained: 36, totalPossible: 40, averagePercentage: 90, gradeLevel: getGradeLevel(90) },
  { id: 6, studentId: 5, studentName: "مريم الطائي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", totalQuizzes: 2, completedQuizzes: 1, totalObtained: 28, totalPossible: 40, averagePercentage: 70, gradeLevel: getGradeLevel(70) },
  { id: 7, studentId: 18, studentName: "رنا الحربي", studentDepartment: "الموارد البشرية", programId: 2, programTitle: "إدارة المشاريع الاحترافية PMP", totalQuizzes: 2, completedQuizzes: 1, totalObtained: 32, totalPossible: 40, averagePercentage: 80, gradeLevel: getGradeLevel(80) },
  // Program 3 students (1 quiz: quiz 7 - closed)
  { id: 8, studentId: 6, studentName: "كريم البغدادي", studentDepartment: "المالية", programId: 3, programTitle: "التفكير الإبداعي وحل المشكلات", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 17, totalPossible: 20, averagePercentage: 85, gradeLevel: getGradeLevel(85) },
  { id: 9, studentId: 13, studentName: "رائد السماوي", studentDepartment: "العمليات", programId: 3, programTitle: "التفكير الإبداعي وحل المشكلات", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 14, totalPossible: 20, averagePercentage: 70, gradeLevel: getGradeLevel(70) },
  // Program 4 students (1 quiz: quiz 5)
  { id: 10, studentId: 7, studentName: "جاسم الموصلي", studentDepartment: "المالية", programId: 4, programTitle: "المحاسبة المالية المتقدمة", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 22, totalPossible: 25, averagePercentage: 88, gradeLevel: getGradeLevel(88) },
  { id: 11, studentId: 8, studentName: "هدى النجفي", studentDepartment: "التسويق", programId: 4, programTitle: "المحاسبة المالية المتقدمة", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 18, totalPossible: 25, averagePercentage: 72, gradeLevel: getGradeLevel(72) },
  // Program 6 students (1 quiz: quiz 6)
  { id: 12, studentId: 11, studentName: "نور الهاشمي", studentDepartment: "العمليات", programId: 6, programTitle: "الذكاء الاصطناعي والتعلم الآلي", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 28, totalPossible: 30, averagePercentage: 93, gradeLevel: getGradeLevel(93) },
  { id: 13, studentId: 12, studentName: "لمياء الحلي", studentDepartment: "العمليات", programId: 6, programTitle: "الذكاء الاصطناعي والتعلم الآلي", totalQuizzes: 1, completedQuizzes: 1, totalObtained: 20, totalPossible: 30, averagePercentage: 67, gradeLevel: getGradeLevel(67) },
]

// ─── Reference Data ─────────────────────────────────────────────────────────

export const QUIZ_STATUSES: QuizStatus[] = ["مسودة", "منشور", "مغلق"]
export const MARK_STATUSES: MarkStatus[] = ["لم يقدم", "قيد التصحيح", "مصحح"]
export const GRADE_LEVELS: GradeLevel[] = ["ممتاز", "جيد جداً", "جيد", "مقبول", "راسب"]
export const QUESTION_TYPES: QuestionType[] = ["اختيار متعدد", "صح وخطأ", "إجابة قصيرة"]
