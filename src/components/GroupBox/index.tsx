import clsx from 'clsx'

export interface GroupBoxPropTypes extends React.PropsWithChildren {
  className?: string
  label?: string
}

export default function GroupBox({
  className,
  label,

  children,
}: GroupBoxPropTypes) {
  return (
    <fieldset className={clsx(className)}>
      {label && <legend>{label}</legend>}
      {children}
    </fieldset>
  )
}
