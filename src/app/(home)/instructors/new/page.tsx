"use client"

import { useRouter } from "next/navigation"
import InstructorsForm from "@/components/features/instructors/instructors-form"
import { useInstructorsStore } from "@/store/instructors/instructorsStore"

export default function NewInstructorPage() {
  const router = useRouter()
  const add = useInstructorsStore((s) => s.add)

  return (
    <InstructorsForm
      onSubmit={(data) => {
        add(data)
        router.push("/instructors")
      }}
    />
  )
}
