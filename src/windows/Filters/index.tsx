import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import { TabContainer, TabPage } from '@/components/Tab'
import { updateColumnFilter, useColumnFilter } from '@/stores/useTableData.tsx'
import { useMemo } from 'react'

function ColumnFilterEditor({ name }: { name: 'eMsgName' | 'innerMsgName' }) {
  const filter = useColumnFilter('nethook-session-messages', name)
  const items = useMemo(() => {
    return filter.split(',').filter((a) => a.startsWith('-'))
  }, [filter])
  return (
    <>
      <ul role="listbox">
        {items.map((item) => {
          return (
            <li
              key={item}
              role="option"
              /*aria-selected="true"*/ onClick={() => {
                const newVal = filter
                  .split(',')
                  .filter((a) => a !== item)
                  .join(',')
                updateColumnFilter('nethook-session-messages', name, newVal)
              }}
            >
              {item}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function FiltersWindow({ id }: ChildWindowPropTypes) {
  return (
    <Window
      id={id}
      caption="Filters"
      hConstraint={HConstraint.CENTER}
      vConstraint={VConstraint.CENTER}
      forceConstraints
      draggable={false}
      resizable={false}
      minWidth={320}
      minHeight={560}
      hideMinimize
      hideMaximize
    >
      <TabContainer
        style={{
          flexGrow: 1,
          height: '100%',
        }}
      >
        <TabPage id="eMsgName" label="Message name">
          <ColumnFilterEditor name="eMsgName" />
        </TabPage>
        <TabPage id="innerMsgName" label="Inner message">
          <ColumnFilterEditor name="innerMsgName" />
        </TabPage>
      </TabContainer>
    </Window>
  )
}
