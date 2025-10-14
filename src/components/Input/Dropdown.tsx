import clsx from 'clsx'
import { type InputPropTypes } from '.'

export interface DropdownOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  label: string
}

export interface DropdownPropTypes extends InputPropTypes {
  options?: DropdownOption[]
}

export function Dropdown({
  className,
  name,
  id = name,
  label,
  disabled,
  stacked = false,

  options = [],

  as: As = 'div',
}: DropdownPropTypes) {
  return (
    <As
      className={clsx(
        {
          'field-row': !stacked,
          'field-row-stacked': stacked,
        },
        className,
      )}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <select disabled={disabled}>
        {options.map((option) => {
          return <option key={option.value}>{option.label}</option>
        })}
      </select>
    </As>
  )
}
