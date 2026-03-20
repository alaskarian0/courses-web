"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  CalendarDays,
  Building2,
  Users,
} from "lucide-react"
import type { TrainingHall, ClassSession, AssignedStudent } from "./scheduling-types"
import { DUMMY_HALLS, DUMMY_SESSIONS, DUMMY_STUDENTS } from "./scheduling-data"
import HallsTab from "./halls-tab"
import SessionsTab from "./sessions-tab"
import DistributionTab from "./distribution-tab"

export default function SchedulingList() {
  const [halls, setHalls] = useState<TrainingHall[]>(DUMMY_HALLS)
  const [sessions, setSessions] = useState<ClassSession[]>(DUMMY_SESSIONS)
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>(DUMMY_STUDENTS)
  const [activeTab, setActiveTab] = useState("sessions")
  const [distributionSessionId, setDistributionSessionId] = useState<number | null>(null)

  const handleNavigateToDistribution = (sessionId: number) => {
    setDistributionSessionId(sessionId)
    setActiveTab("distribution")
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <h1 className="text-2xl font-bold">جدولة الدورات</h1>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v !== "distribution") setDistributionSessionId(null) }}>
        <TabsList>
          <TabsTrigger value="sessions">
            <CalendarDays className="h-3.5 w-3.5 ml-1.5" />
            الجلسات التدريبية
          </TabsTrigger>
          <TabsTrigger value="halls">
            <Building2 className="h-3.5 w-3.5 ml-1.5" />
            القاعات التدريبية
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <Users className="h-3.5 w-3.5 ml-1.5" />
            توزيع المتدربين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4">
          <SessionsTab
            sessions={sessions}
            halls={halls}
            onUpdateSessions={setSessions}
            onNavigateToDistribution={handleNavigateToDistribution}
          />
        </TabsContent>

        <TabsContent value="halls" className="mt-4">
          <HallsTab
            halls={halls}
            onUpdate={setHalls}
          />
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <DistributionTab
            sessions={sessions}
            halls={halls}
            assignedStudents={assignedStudents}
            onUpdateStudents={setAssignedStudents}
            onUpdateSessions={setSessions}
            initialSessionId={distributionSessionId}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
