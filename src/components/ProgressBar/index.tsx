import clsx from 'clsx'

export type ProgressBarState = 'none' | 'paused' | 'error'

export interface ProgressBarPropTypes {
  className?: string
  min?: number
  max?: number
  value?: number
  marquee?: boolean
  state?: ProgressBarState
}

export default function ProgressBar({
  className,
  min = 0,
  max = 100,
  value = 0,
  marquee = false,
  state = 'none',
}: ProgressBarPropTypes) {
  return (
    <div
      role="progressbar"
      className={clsx('animate', className, {
        paused: state === 'paused',
        error: state === 'error',
        marquee: marquee,
      })}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      {!marquee && (
        <div style={{ width: ((value / max) * 100).toFixed(2) + '%' }} />
      )}
    </div>
  )
}
