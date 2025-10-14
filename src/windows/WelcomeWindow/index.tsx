import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { createSingletonWindow, HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import Button from '@/components/Button'
import { openDirectoryPicker } from '@/stores/sessionStore.ts'
import { AcknowledgementsWindow } from '@/windows/Acknowledgements'
import { DocumentBlockIcon, HeartIcon } from '@/components/Icon/fugue.tsx'

export function WelcomeWindow({ id }: ChildWindowPropTypes) {
  return (
    <Window
      id={id}
      caption="Welcome"
      vConstraint={VConstraint.CENTER}
      hConstraint={HConstraint.CENTER}
      minHeight={240}
      minWidth={240}
    >
      Welcome..!! open a session by dropping the folder anywhere on the page or using the button below.
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
      <DocumentBlockIcon />
      <HeartIcon />
    </Window>
  )
}
