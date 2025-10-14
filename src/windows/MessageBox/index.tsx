import Button from '@/components/Button'
import { Window, type ChildWindowPropTypes } from '@/components/Window'
import { HConstraint, VConstraint } from '@/stores/useWindows'

export interface MessageBoxWindowPropTypes extends ChildWindowPropTypes {
  caption: string
  body: string
}

export function MessageBoxWindow({ id, caption, body, closeWindow }: MessageBoxWindowPropTypes) {
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
      minHeight={200}
      hideMinimize
      hideMaximize
    >
      <p>{body}</p>
      <div className="field-row" style={{ float: 'right' }}>
        <Button type="submit" label="Ok" onClick={closeWindow} />
        <Button label="Cancel" onClick={closeWindow} />
      </div>
    </Window>
  )
}
