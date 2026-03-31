"use client"

import { useState } from "react"
import type { TrainingHall } from "./scheduling-types"
import { DUMMY_HALLS } from "@/mock-data/scheduling-data"
import HallsTab from "./halls-tab"

export default function HallsPage() {
  const [halls, setHalls] = useState<TrainingHall[]>(DUMMY_HALLS)

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold">القاعات التدريبية</h1>
      <HallsTab halls={halls} onUpdate={setHalls} />
    </div>
  )
}
