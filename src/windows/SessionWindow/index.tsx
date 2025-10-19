import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { createSingletonWindow, createWindow, HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import type { ColumnDef } from '@tanstack/react-table'
import { type NetHookMessage, type NetHookSession, useSessionStore } from '@/stores/sessionStore.ts'
import Table from '@/components/Table'
import { useShallow } from 'zustand/react/shallow'
import { ContextMenuSpecialItem } from '@/stores/useContextMenu.tsx'
import { MessageWindow } from '@/windows/MessageWindow'
import GroupBox from '@/components/GroupBox'
import { Checkbox, TextInput } from '@/components/Input'
import { usePreferencesStore } from '@/stores/preferencesStore.ts'
import { BlueFolderNetworkIcon } from '@/components/Icon/fugue.tsx'
import { getColumnFilter, onGlobalFilterChange, updateColumnFilter, useTableData } from '@/stores/useTableData.tsx'
import Button from '@/components/Button'
import FiltersWindow from '@/windows/Filters'
const messageColumns: ColumnDef<NetHookMessage>[] = [
  {
    header: 'Seq',
    accessorKey: 'seq',
    cell: (info) => info.getValue(),
    minSize: 35,
    size: 35,
    filterFn: 'equalsString',
    sortingFn: 'basic',
    enableSorting: true,
  },
  {
    header: 'Direction',
    accessorKey: 'direction',
    cell: (info) => <span className="gray">{info.getValue() as string}</span>,
    minSize: 70,
    size: 70,
    filterFn: 'equalsString',
  },
  {
    header: 'Message type',
    accessorKey: 'eMsgName',
    cell: (info) => <span className="gray">{info.getValue() as string}</span>,
    size: 400,
    filterFn: 'special',
    enableColumnFilter: true,
  },
  {
    header: 'Inner message',
    cell: (info) => <span className="gray">{info.getValue() as string}</span>,
    accessorKey: 'innerMsgName',
    size: 15000,
    filterFn: 'special',
    enableColumnFilter: true,
  },
]

// export type SortOrder = 'asc' | 'desc'
//
// const ascPredicate = (a: NetHookMessage, b: NetHookMessage) => (a.seq < b.seq ? 1 : -1),
//   descPredicate = (a: NetHookMessage, b: NetHookMessage) => (a.seq > b.seq ? 1 : -1)

function MessageTable({ session }: { session: NetHookSession }) {
  // const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  //
  // const sortedMessages = useMemo(() => {
  //   const values = Object.values(session.messages)
  //   return values.sort(sortOrder === 'asc' ? ascPredicate : descPredicate)
  // }, [session.messages, sortOrder])
  return (
    <Table<NetHookMessage>
      id="nethook-session-messages"
      containerStyle={{
        height: '100%',
      }}
      data={Object.values(session.messages)}
      columns={messageColumns}
      virtualized
      itemProps={{
        onMouseDown: (row) => (e) => {
          if (e.button === 0 /* left */) {
            createSingletonWindow(MessageWindow, {
              id: 'quick-message-window',
              props: {
                seq: row.seq,
              },
            })
          }
        },
        contextMenu: (row) => {
          return {
            items: [
              {
                label: 'Open',
                onClick: () => {
                  createSingletonWindow(MessageWindow, {
                    id: 'quick-message-window',
                    props: {
                      seq: row.seq,
                    },
                  })
                },
              },
              {
                label: 'Open in new window',
                onClick: () => {
                  createWindow(MessageWindow, {
                    props: {
                      seq: row.seq,
                    },
                  })
                },
              },
              ContextMenuSpecialItem.Separator,
              {
                label: 'Hide message type',
                onClick: () => {
                  const filter = getColumnFilter('nethook-session-messages', 'eMsgName')
                  const fvs = filter.split(',')
                  fvs.unshift(`-${row.eMsgName}`)
                  updateColumnFilter('nethook-session-messages', 'eMsgName', fvs.filter(Boolean).join(','))
                },
              },
              {
                label: 'Hide inner message',
                visible: typeof row.innerMsgName !== 'undefined',
                onClick: () => {
                  const filter = getColumnFilter('nethook-session-messages', 'innerMsgName')
                  const fvs = filter.split(',')
                  fvs.unshift(`-${row.innerMsgName}`)
                  updateColumnFilter('nethook-session-messages', 'innerMsgName', fvs.filter(Boolean).join(','))
                },
              },
            ],
          }
        },
      }}
    />
  )
}

export function Preferences() {
  const preferences = usePreferencesStore()
  const tableData = useTableData('nethook-session-messages')
  return (
    <GroupBox
      label="Preferences"
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: '4px 8px',
        alignItems: 'center',
      }}
    >
      <TextInput
        name="search"
        type="search"
        placeholder="Filter messages"
        value={tableData?.globalFilter ?? ''}
        onChange={onGlobalFilterChange('nethook-session-messages')}
      />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginLeft: 'auto', alignItems: 'center' }}>
        <Button
          onClick={() => {
            createSingletonWindow(FiltersWindow, {
              id: 'nethook-session-filters',
            })
          }}
        >
          Filter prefs
        </Button>
        <Checkbox
          name="hideDefaultFields"
          setChecked={(val) => {
            usePreferencesStore.setState({
              hideDefaultFields: val,
            })
          }}
          label="Hide default fields"
          checked={preferences.hideDefaultFields}
        />
        <Checkbox
          name="qualifiedTypeNames"
          setChecked={(val) => {
            usePreferencesStore.setState({
              qualifiedTypeNames: val,
            })
          }}
          label="Qualified type names"
          checked={preferences.qualifiedTypeNames}
        />
      </div>
    </GroupBox>
  )
}

export function SessionWindow({ id }: ChildWindowPropTypes) {
  const session = useSessionStore(useShallow((s) => s.session!))

  return (
    <Window
      id={id}
      caption="NetHook session"
      icon={BlueFolderNetworkIcon}
      vConstraint={VConstraint.TOP}
      hConstraint={HConstraint.LEFT}
      minHeight={600}
      minWidth={800}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Preferences />
        {session ? (
          <div
            style={{
              overflow: 'auto',
              padding: '8px',
              flexGrow: 1,
            }}
          >
            <MessageTable session={session} />
          </div>
        ) : (
          <>Missing session</>
        )}
      </div>
    </Window>
  )
}
