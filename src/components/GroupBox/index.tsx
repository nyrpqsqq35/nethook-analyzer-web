import clsx from 'clsx'
import type { CSSProperties } from 'react'

export interface GroupBoxPropTypes extends React.PropsWithChildren {
  className?: string
  label?: string
  style?: CSSProperties
}

export default function GroupBox({
  className,
  label,

  children,
  style,
}: GroupBoxPropTypes) {
  return (
    <fieldset className={clsx(className)} style={style}>
      {label && <legend>{label}</legend>}
      {children}
    </fieldset>
  )
}
