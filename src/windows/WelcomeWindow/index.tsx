import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { createSingletonWindow, HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import Button from '@/components/Button'
import { openDirectoryPicker } from '@/stores/sessionStore.ts'
import { AcknowledgementsWindow } from '@/windows/Acknowledgements'
import { DocumentBlockIcon, HeartIcon } from '@/components/Icon/fugue.tsx'
import { useMemo } from 'react'
import style from './index.module.scss'

function BrowserSupportWarning() {
  return (
    <p>
      Your browser likely does not support nethook-analyzer-web. It requires Chromium 134+ for the File System
      Access/FileSystemObserver APIs.
    </p>
  )
}

export function WelcomeWindow({ id }: ChildWindowPropTypes) {
  const supported = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uad = (navigator as any)?.userAgentData as {
      brands: Array<{ brand: string; version: string }>
    } /* NavigatorUAData */
    if (!uad) return false
    for (const brand of uad.brands) {
      if (brand.brand === 'Chromium' && parseInt(brand.version) >= 134) return true
    }
    return false
  }, [])
  return (
    <Window
      id={id}
      caption="Welcome"
      vConstraint={VConstraint.CENTER}
      hConstraint={HConstraint.CENTER}
      minHeight={260}
      minWidth={240}
      bodyClassName={style.body}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
        }}
      >
        Welcome..!! open a session by dropping the folder anywhere on the page or using the button below.
        {!supported && <BrowserSupportWarning />}
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            label="Open session"
            onClick={() => {
              void openDirectoryPicker()
            }}
          />
          <Button
            label="Acknowledgments"
            onClick={() => {
              createSingletonWindow(AcknowledgementsWindow, { id: 'acknowledgments', dialog: true })
            }}
          />
        </div>
        {/* shit icon code needs to preload the icons at the earliest possible so it doesn't hang the ui */}
        <div
          style={{
            position: 'absolute',
            top: -11111,
            left: -11111,
          }}
        >
          <DocumentBlockIcon />
          <HeartIcon />
        </div>
      </div>
    </Window>
  )
}
