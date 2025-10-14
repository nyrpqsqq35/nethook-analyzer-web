import clsx from 'clsx'
import { type InputPropTypes } from '.'

export interface CheckboxPropTypes extends InputPropTypes {
  type?: 'checkbox' | 'radio'

  defaultChecked?: boolean
  checked?: boolean
  setChecked?: (value?: boolean) => void

  as?: React.ElementType
}

export function Checkbox({
  className,
  name,
  id = name,
  label,
  as: As = 'div',

  type = 'checkbox',

  defaultChecked = false,
  checked,
  setChecked,

  disabled = false,
}: CheckboxPropTypes) {
  return (
    <As className={clsx('field-row', className)}>
      <input
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        type={type}
        name={name}
        id={id}
        onChange={(e) => setChecked && setChecked(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </As>
  )
}
