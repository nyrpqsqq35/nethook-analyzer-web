import clsx from 'clsx'
import { type InputPropTypes } from '.'

export interface TextInputPropTypes extends InputPropTypes {
  type?: HTMLInputElement['type']
  placeholder?: string

  onChange?: (value: string) => void
  value?: string
}

export function TextInput({
  className,
  name,
  id = name,
  label,
  // disabled,
  stacked = false,

  type = 'text',
  placeholder,
  value,
  onChange,
  as: As = 'div',
}: TextInputPropTypes) {
  return (
    <As
      className={clsx(className, {
        'field-row': !stacked,
        'field-row-stacked': stacked,
      })}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </As>
  )
}
