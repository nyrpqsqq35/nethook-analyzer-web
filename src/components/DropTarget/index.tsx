import clsx from 'clsx'
import style from './index.module.scss'
import { useState } from 'react'
import { createSession, reloadSessionFiles } from '@/stores/sessionStore.ts'

export default function DropTarget(
  props: Omit<
    React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>,
    'className' | 'onDragOver' | 'onDragLeave' | 'onDragEnd'
  >,
) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const onLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer !== null) {
      setIsDraggingOver(false)
    }
  }
  return (
    <div
      className={clsx(style.dropTarget, {
        [style.dragged]: isDraggingOver,
      })}
      onDragOver={(e) => {
        // prevent navigation
        e.preventDefault()
        if (e.dataTransfer !== null) {
          setIsDraggingOver(true)
        }
      }}
      onDragLeave={onLeave}
      onDragEnd={onLeave}
      onDrop={async (e) => {
        onLeave(e)

        if (e.dataTransfer) {
          const fileHandlesPromises = [...e.dataTransfer.items]
            .filter((item) => item.kind === 'file')
            .map((item) => item.getAsFileSystemHandle())

          for await (const handle of fileHandlesPromises) {
            if (!handle) continue

            if (handle.kind === 'directory') {
              // open session
              createSession(handle as FileSystemDirectoryHandle)
              await reloadSessionFiles()
            } else if (handle.kind === 'file') {
              // TODO: open .bin file into MessageWindow
            }
          }
        }
      }}
      {...props}
    ></div>
  )
}
