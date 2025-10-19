import { Children, type CSSProperties, isValidElement, useState } from 'react'
import clsx from 'clsx'
import { type TabPagePropTypes } from './TabPage'

export interface TabContainerPropTypes extends React.PropsWithChildren {
  className?: string
  label?: string
  style?: CSSProperties
}

export function TabContainer({ className, label, children, style }: TabContainerPropTypes) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = Children.map(children, (child) => {
    if (!isValidElement(child)) return
    const props = child.props as TabPagePropTypes
    return {
      label: props.label,
      id: 'tab-' + props.id,
      disabled: !!props.disabled,
    }
  })
  return (
    <section
      className={clsx('tabs', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...(style ?? {}),
      }}
    >
      <menu role="tablist" aria-label={label}>
        {tabs &&
          tabs.map((tab, i) => {
            return (
              <button
                key={tab.id}
                role="tab"
                aria-controls={tab.id}
                disabled={tab.disabled}
                aria-selected={activeTab === i}
                onMouseDown={(e) => {
                  if (e.button === 0 /* left */) {
                    setActiveTab(i)
                  }
                }}
              >
                {tab.label}
              </button>
            )
          })}
      </menu>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return
        if (i !== activeTab) return
        return child
      })}
    </section>
  )
}
