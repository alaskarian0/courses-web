"use client"

import { useRouter, useParams } from "next/navigation"
import { notFound } from "next/navigation"
import InstructorsForm from "@/components/features/instructors/instructors-form"
import { useInstructorsStore } from "@/store/instructors/instructorsStore"

export default function EditInstructorPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const instructor = useInstructorsStore((s) => s.getById(id))
  const update = useInstructorsStore((s) => s.update)

  if (!instructor) return notFound()

  return (
    <InstructorsForm
      initialData={instructor}
      onSubmit={(data) => {
        update({ ...instructor, ...data })
        router.push("/instructors")
      }}
    />
  )
}
