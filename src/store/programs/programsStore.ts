import { create } from "zustand"
import { DUMMY_PROGRAMS } from "@/mock-data/programs-mock"
import type { ProgramRecord } from "@/components/features/programs/programs-types"

interface ProgramsState {
  records: ProgramRecord[]
  add: (program: Omit<ProgramRecord, "id" | "createdAt" | "registered">) => void
  update: (program: ProgramRecord) => void
  remove: (id: number) => void
  getById: (id: number) => ProgramRecord | undefined
  nextId: () => number
}

export const useProgramsStore = create<ProgramsState>((set, get) => ({
  records: DUMMY_PROGRAMS,

  add: (program) => {
    const id = get().nextId()
    set((state) => ({
      records: [
        { ...program, id, registered: 0, createdAt: new Date().toISOString() },
        ...state.records,
      ],
    }))
  },

  update: (program) => {
    set((state) => ({
      records: state.records.map((r) => (r.id === program.id ? program : r)),
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
