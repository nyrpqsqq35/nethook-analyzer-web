import clsx from 'clsx'

export interface ButtonPropTypes
  extends React.PropsWithChildren<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  > {
  className?: string
  label?: string
  disabled?: boolean
}

export default function Button({
  className,
  label,
  disabled = false,
  children,
  ...props
}: ButtonPropTypes) {
  return (
    <button className={clsx(className)} disabled={disabled} {...props}>
      {children || label}
    </button>
  )
}
