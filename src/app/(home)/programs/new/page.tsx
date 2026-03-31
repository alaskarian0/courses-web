"use client"

import { useRouter } from "next/navigation"
import ProgramsForm from "@/components/features/programs/programs-form"
import { useProgramsStore } from "@/store/programs/programsStore"

export default function NewProgramPage() {
  const router = useRouter()
  const add = useProgramsStore((s) => s.add)

  return (
    <ProgramsForm
      onSubmit={(data) => {
        add(data)
        router.push("/programs")
      }}
    />
  )
}
