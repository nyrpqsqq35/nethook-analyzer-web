import { type CSSProperties } from 'react'

export interface TabPagePropTypes extends React.PropsWithChildren {
  className?: string
  disabled?: boolean
  id: string
  label: string
  style: CSSProperties
}

export function TabPage({ id, className, style, children }: TabPagePropTypes) {
  const tabId = `tab-` + id
  return (
    <article className={className} role="tabpanel" id={tabId} style={style}>
      {children}
    </article>
  )
}
