/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table,
  type ColumnDef,
  type Row,
  type FilterFn,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { type CSSProperties, type MouseEventHandler, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { type ContextMenuSchema, showContextMenu } from '@/stores/useContextMenu.tsx'
import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
import { onGlobalFilterChange, onSortingChange, useTableData } from '@/stores/useTableData.tsx'
import clsx from 'clsx'
import style from './index.module.scss'
export interface TableItemProps<T = any> {
  contextMenu?: (row: T) => ContextMenuSchema | undefined
  onClick?: (row: T) => MouseEventHandler<HTMLTableRowElement>
}

export interface TablePropTypes<T = any> extends React.PropsWithChildren {
  id: string
  className?: string
  data: Array<T>
  columns: Array<ColumnDef<T>>
  virtualized?: boolean
  containerStyle?: CSSProperties
  itemProps?: TableItemProps<T>
}

function TableBody<T>({ table }: { table: Table<T> }) {
  return (
    <tbody style={{ display: 'block' }}>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
function VirtualTableBody<T>({
  table,
  tableContainerRef,
  itemProps,
}: {
  table: Table<T>
  tableContainerRef: React.RefObject<HTMLDivElement | null>
  itemProps?: TableItemProps<T>
}) {
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 22,
    getScrollElement: () => tableContainerRef.current!,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })
  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
        position: 'relative', //needed for absolute positioning of rows
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<T>
        return (
          <tr
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
            key={row.id}
            style={{
              display: 'flex',
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`,
              width: '100%',
            }}
            onContextMenu={(e) => {
              if (itemProps?.contextMenu) {
                const maybeSchema = itemProps?.contextMenu(row.original)
                if (maybeSchema) {
                  showContextMenu(maybeSchema, {
                    x: e.pageX,
                    y: e.pageY,
                  })
                }
              }
              e.preventDefault()
            }}
            onClick={itemProps?.onClick && row ? itemProps.onClick(row.original) : undefined}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  display: 'flex',
                  width: cell.column.getSize() === 420 ? '100%' : cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        )
        // return <TableBodyRow key={row.id} row={row} virtualRow={virtualRow} rowVirtualizer={rowVirtualizer} />
      })}
    </tbody>
  )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export default function Table<T>({
  id,
  /*id, className, children,*/ data,
  columns,
  virtualized = false,
  containerStyle,
  itemProps,
}: TablePropTypes<T>) {
  const tableData = useTableData(id)
  console.log('sorting', tableData?.sorting ?? [])
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'includesString',
    state: {
      globalFilter: tableData?.globalFilter ?? '',
      sorting: tableData?.sorting ?? [],
    },
    onGlobalFilterChange: onGlobalFilterChange(id),
    onSortingChange: onSortingChange(id),
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={tableContainerRef}
      className="has-scrollbar"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        ...(containerStyle ?? {}),
      }}
    >
      <table style={{ display: 'grid' /*width: table.getCenterTotalSize()*/ }}>
        <thead
          style={{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: 30,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={clsx({
                    [style.indicator]: !!header.column.getIsSorted(),
                    [style.up]: header.column.getIsSorted() === 'desc',
                  })}
                  style={{
                    display: 'flex',
                    height: 30,
                    alignItems: 'end',
                    width: header.getSize() === 420 ? '100%' : header.getSize(),
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {virtualized ? (
          <VirtualTableBody table={table} tableContainerRef={tableContainerRef} itemProps={itemProps} />
        ) : (
          <TableBody table={table} />
        )}
      </table>
    </div>
  )
}
