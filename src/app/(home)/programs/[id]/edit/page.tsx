"use client"

import { useRouter, useParams } from "next/navigation"
import { notFound } from "next/navigation"
import ProgramsForm from "@/components/features/programs/programs-form"
import { useProgramsStore } from "@/store/programs/programsStore"

export default function EditProgramPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const program = useProgramsStore((s) => s.getById(id))
  const update = useProgramsStore((s) => s.update)

  if (!program) return notFound()

  return (
    <ProgramsForm
      initialData={program}
      onSubmit={(data) => {
        update({ ...program, ...data })
        router.push("/programs")
      }}
    />
  )
}
