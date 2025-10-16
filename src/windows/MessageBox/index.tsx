import Button from '@/components/Button'
import { Window, type ChildWindowPropTypes } from '@/components/Window'
import { HConstraint, setWindowDimensions, useWindows, VConstraint } from '@/stores/useWindows'
import style from './index.module.scss'
import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

export interface MessageBoxWindowPropTypes extends ChildWindowPropTypes {
  caption: string
  body: string
}

export function MessageBoxWindow({ id, caption, body, closeWindow }: MessageBoxWindowPropTypes) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (ref.current) {
      console.log(ref.current.clientWidth, ref.current.clientHeight)
      const wind = useWindows.getState().windows.find((i) => i.id === id)
      const nw = ref.current.clientWidth,
        nh = ref.current.clientHeight + 44
      if (wind?.dimensions) {
        if (wind?.dimensions.width !== nw && wind.dimensions.height !== nh)
          setWindowDimensions(id, { width: nw, height: nh })
      }
    }
  }, [id, ref])
  return (
    <Window
      id={id}
      caption={caption}
      hConstraint={HConstraint.CENTER}
      vConstraint={VConstraint.CENTER}
      forceConstraints
      draggable={false}
      resizable={false}
      minWidth={320}
      minHeight={5}
      hideMinimize
      hideMaximize
    >
      <div className={style.container} ref={ref}>
        <p>{body}</p>
        <div className={clsx('field-row', style.meow)}>
          <Button type="submit" label="Ok" onClick={closeWindow} />
          <Button label="Cancel" onClick={closeWindow} />
        </div>
      </div>
    </Window>
  )
}
