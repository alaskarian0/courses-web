import { create } from "zustand"
import { DUMMY_INSTRUCTORS } from "@/mock-data/instructors-mock"
import type { InstructorRecord } from "@/components/features/instructors/instructors-types"

interface InstructorsState {
  records: InstructorRecord[]
  add: (instructor: Omit<InstructorRecord, "id" | "createdAt" | "coursesCount" | "workshopsCount" | "rating">) => void
  update: (instructor: InstructorRecord) => void
  remove: (id: number) => void
  getById: (id: number) => InstructorRecord | undefined
  nextId: () => number
}

export const useInstructorsStore = create<InstructorsState>((set, get) => ({
  records: DUMMY_INSTRUCTORS,

  add: (instructor) => {
    const id = get().nextId()
    set((state) => ({
      records: [
        { ...instructor, id, coursesCount: 0, workshopsCount: 0, rating: 0, createdAt: new Date().toISOString() },
        ...state.records,
      ],
    }))
  },

  update: (instructor) => {
    set((state) => ({
      records: state.records.map((r) => (r.id === instructor.id ? instructor : r)),
    }))
  },

  remove: (id) => {
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    }))
  },

  getById: (id) => get().records.find((r) => r.id === id),

  nextId: () => {
    const records = get().records
    return records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1
  },
}))
