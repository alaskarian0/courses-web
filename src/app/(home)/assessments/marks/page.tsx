import { Suspense } from "react"
import MarksPage from "@/components/features/assessments/marks-page"

export default function Page() {
  return (
    <Suspense>
      <MarksPage />
    </Suspense>
  )
}
