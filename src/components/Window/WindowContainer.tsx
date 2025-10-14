import clsx from 'clsx'
import { useEffect } from 'react'
import { useWindows, closeWindow, createSingletonWindow } from '@/stores/useWindows'
import style from './windowContainer.module.scss'
import { useShallow } from 'zustand/react/shallow'
import { WelcomeWindow } from '@/windows/WelcomeWindow'
import { useSessionStore } from '@/stores/sessionStore.ts'
import { SessionWindow } from '@/windows'

export default function WindowContainer() {
  const { windows } = useWindows(useShallow((e) => ({ windows: e.windows })))
  const hasSession = useSessionStore(useShallow((s) => typeof s.session !== 'undefined'))

  useEffect(() => {
    const foundWelcomeWindow = windows.find((a) => a.element === WelcomeWindow),
      foundSessionWindow = windows.find((a) => a.element === SessionWindow)
    if (hasSession) {
      if (foundWelcomeWindow) {
        closeWindow(foundWelcomeWindow)
      }
      if (!foundSessionWindow) {
        createSingletonWindow(SessionWindow, {
          id: 'session',
        })
      }
    } else {
      if (!foundWelcomeWindow) {
        createSingletonWindow(WelcomeWindow, {
          id: 'welcome',
        })
      }
      if (foundSessionWindow) {
        closeWindow(foundSessionWindow)
      }
    }
  }, [windows, hasSession])

  return (
    <div className={clsx(style.root)}>
      {windows.map((win) => {
        const Element = win.element

        return <Element id={win.id} key={win.id} closeWindow={() => closeWindow(win)} {...win.props} />
      })}
    </div>
  )
}
