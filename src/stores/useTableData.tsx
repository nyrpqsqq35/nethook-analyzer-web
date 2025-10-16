/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand/react'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

interface TableData {
  globalFilter: string
}

interface TableDataStore {
  tables: Record<string, TableData>
}

export const useTableDataStore = create<TableDataStore>()(
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

export const useTableData = (tableName: string) => useTableDataStore(useShallow((e) => e.tables[tableName]))
export const updateTableData = (tableName: string, data: Partial<TableData>) =>
  useTableDataStore.setState((e) => {
    if (!e.tables[tableName]) {
      e.tables[tableName] = { globalFilter: '' } as TableData
    }
    return {
      tables: { ...e.tables, [tableName]: { ...e.tables[tableName], ...data } },
    }
  })
export const onGlobalFilterChange = (tableName: string) => (e: any) => {
  updateTableData(tableName, { globalFilter: e })
}
