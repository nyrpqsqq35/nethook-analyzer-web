import clsx from 'clsx'

export interface SliderPropTypes {
  label?: string
  labelMin?: string
  labelMax?: string

  min?: number
  max?: number
  value?: number

  boxIndicator?: boolean
  vertical?: boolean
}

export default function Slider({
  label,
  labelMin,
  labelMax,

  min = 0,
  max = 10,
  value,

  boxIndicator = false,
  vertical = false,
}: SliderPropTypes) {
  const inputThing = (
    <input
      className={clsx({ 'has-box-indicator': boxIndicator })}
      type="range"
      min={min}
      max={max}
      value={value}
    />
  )
  return (
    <>
      {label && <label>{label}</label>}
      {labelMin && !vertical && <label>{labelMin}</label>}
      {vertical ? <div className="is-vertical">{inputThing}</div> : inputThing}
      {labelMax && !vertical && <label>{labelMax}</label>}
    </>
  )
}
