import { create } from 'zustand/react'
import { persist } from 'zustand/middleware'

interface TableDataStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tables: Record<string, any>
}

export const useTableData = create<TableDataStore>()(
  persist(
    () => {
      return {
        tables: {},
      }
    },
    {
      name: 'TableDataStore',
    },
  ),
)
