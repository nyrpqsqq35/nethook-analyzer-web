/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand/react'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { ColumnFiltersState, SortingState, Updater } from '@tanstack/react-table'

interface TableData {
  globalFilter: string
  columnFilters: ColumnFiltersState
  sorting: SortingState
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
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, curVer) => {
        const ps = persistedState as any
        if (ps) {
          if (curVer < 3) {
            for (const key in ps.tables) {
              ps.tables[key].columnFilters = []
            }
          }
        }
        return ps
      },
      version: 3,
    },
  ),
)

export const useTableData = (tableName: string) => useTableDataStore(useShallow((e) => e.tables[tableName]))
export const updateTableData = (tableName: string, data: Partial<TableData>) =>
  useTableDataStore.setState((e) => {
    if (!e.tables[tableName]) {
      e.tables[tableName] = { globalFilter: '', columnFilters: [], sorting: [] } as TableData
    }
    return {
      tables: { ...e.tables, [tableName]: { ...e.tables[tableName], ...data } },
    }
  })
export const onGlobalFilterChange = (tableName: string) => (e: any) => {
  updateTableData(tableName, { globalFilter: e })
}

export const useColumnFilter = (tableName: string, columnId: string) =>
  useTableDataStore((e) => getColumnFilter(tableName, columnId, e))

export const getColumnFilter = (tableName: string, columnId: string, e = useTableDataStore.getState()) => {
  // const e = useTableDataStore.getState()
  if (!e.tables[tableName]) {
    return ''
  }
  for (const filter of e.tables[tableName].columnFilters) {
    if (filter.id === columnId) {
      return filter.value as string
    }
  }
  return ''
}
export const updateColumnFilter = (tableName: string, columnId: string, value: any) => {
  useTableDataStore.setState((e) => {
    if (!e.tables[tableName]) {
      e.tables[tableName] = { globalFilter: '', columnFilters: [], sorting: [] } as TableData
    }
    const columnFilters = e.tables[tableName].columnFilters
    const index = columnFilters.findIndex((f) => f.id === columnId)
    if (index === -1) {
      columnFilters.push({ id: columnId, value })
    } else {
      columnFilters[index].value = value
    }

    return {
      tables: {
        ...e.tables,
        [tableName]: {
          ...e.tables[tableName],
          columnFilters: [...columnFilters],
        },
      },
    }
  })
}

export const onColumnFiltersChange = (tableName: string) => (updater: Updater<ColumnFiltersState>) => {
  if (typeof updater === 'function') {
    useTableDataStore.setState((e) => {
      if (!e.tables[tableName]) {
        e.tables[tableName] = { globalFilter: '', columnFilters: [], sorting: [] } as TableData
      }
      return {
        tables: {
          ...e.tables,
          [tableName]: {
            ...e.tables[tableName],
            columnFilters: updater(e.tables[tableName].columnFilters),
          },
        },
      }
    })
  } else {
    updateTableData(tableName, { columnFilters: updater })
  }
}

export const onSortingChange = (tableName: string) => (updater: Updater<SortingState>) => {
  if (typeof updater === 'function') {
    useTableDataStore.setState((e) => {
      if (!e.tables[tableName]) {
        e.tables[tableName] = { globalFilter: '', columnFilters: [], sorting: [] } as TableData
      }
      return {
        tables: {
          ...e.tables,
          [tableName]: {
            ...e.tables[tableName],
            sorting: updater(e.tables[tableName].sorting),
          },
        },
      }
    })
  } else {
    updateTableData(tableName, { sorting: updater })
  }
}
