"use client"

import { useState } from "react"
import type { TrainingHall, ClassSession, AssignedStudent } from "./scheduling-types"
import { DUMMY_HALLS, DUMMY_SESSIONS, DUMMY_STUDENTS } from "@/mock-data/scheduling-data"
import SessionsTab from "./sessions-tab"
import DistributionTab from "./distribution-tab"

type View = "tabs" | "distribution"

export default function SchedulingList() {
  const [halls] = useState<TrainingHall[]>(DUMMY_HALLS)
  const [sessions, setSessions] = useState<ClassSession[]>(DUMMY_SESSIONS)
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>(DUMMY_STUDENTS)

  const [view, setView] = useState<View>("tabs")
  const [distributionSessionId, setDistributionSessionId] = useState<number | null>(null)

  const openDistribution = (sessionId: number) => {
    setDistributionSessionId(sessionId)
    setView("distribution")
  }

  const backToTabs = () => {
    setView("tabs")
    setDistributionSessionId(null)
  }

  // ── Distribution view ──
  if (view === "distribution") {
    return (
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold">جدولة الدورات</h1>
        <DistributionTab
          sessions={sessions}
          halls={halls}
          assignedStudents={assignedStudents}
          onUpdateStudents={setAssignedStudents}
          onUpdateSessions={setSessions}
          initialSessionId={distributionSessionId!}
          onBack={backToTabs}
        />
      </div>
    )
  }

  // ── Sessions view ──
  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">جدولة الدورات</h1>
      <SessionsTab
        sessions={sessions}
        halls={halls}
        onUpdateSessions={setSessions}
        onNavigateToDistribution={openDistribution}
      />
    </div>
  )
}
