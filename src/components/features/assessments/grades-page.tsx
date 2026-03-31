"use client"

import { useState } from "react"
import type { ProgramGrade } from "./assessments-types"
import { DUMMY_GRADES } from "@/mock-data/assessments-data"
import GradesTab from "./grades-tab"

export default function GradesPage() {
  const [grades] = useState<ProgramGrade[]>(DUMMY_GRADES)

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">التقييم العام</h1>
      <GradesTab grades={grades} />
    </div>
  )
}
