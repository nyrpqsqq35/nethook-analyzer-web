import { create } from 'zustand/react'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { toast } from 'react-hot-toast/headless'

export type Direction = 'in' | 'out'

export interface NetHookMessage {
  seq: number
  direction: Direction
  eMsg: number
  eMsgName: string
  file: FileSystemFileHandle
  data?: Uint8Array
}

export interface NetHookSession {
  name: string
  dir: FileSystemDirectoryHandle
  messages: Record<number /*seq*/, NetHookMessage>
  selectedSeq?: number
}

export interface SessionState {
  session?: NetHookSession
}

export const useSessionStore = create<SessionState>()(
  devtools(
    immer(
      // Comment so this is on its own line
      () => ({}),
    ),
  ),
)
function createSession(dir: FileSystemDirectoryHandle) {
  useSessionStore.setState((s) => {
    s.session = {
      name: 'idk',
      dir,
      messages: {},
    }
  })
}

type NameParts = Pick<NetHookMessage, 'seq' | 'direction' | 'eMsg' | 'eMsgName'>

function explodeName(fileName: string): NameParts {
  const parts: NameParts = {
    seq: parseInt(fileName, 10),
    direction: 'in',
    eMsg: 0,
    eMsgName: 'UNKNOWN',
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_seq, dir, msg, ...name] = fileName.split('_')
  parts.direction = dir as Direction
  parts.eMsg = parseInt(msg, 10)
  if (name.length) {
    parts.eMsgName = name.join('_').replace('.bin', '')
  }

  return parts
}

export async function openDirectoryPicker() {
  try {
    const dir = await showDirectoryPicker()
    createSession(dir)
    await reloadSessionFiles()
  } catch (err) {
    if (err instanceof DOMException) {
      switch (err.name) {
        case 'AbortError':
          toast.error('Directory selection aborted. Did you grant permission?')
          break
        case 'SecurityError':
          break
      }
    }
  }
}
export async function reloadSessionFiles() {
  const session = useSessionStore.getState().session
  if (!session) return

  const { dir } = session

  const newItems: Array<NetHookMessage> = []

  for await (const file of dir.values()) {
    if (file.kind !== 'file') continue
    const name = file.name
    if (!name.endsWith('.bin')) continue
    // yeah
    const parts = explodeName(name)
    if (session.messages[parts.seq]) continue
    newItems.push({ ...parts, file })
  }

  console.log('hola', newItems.length)

  if (newItems.length)
    useSessionStore.setState((s) => {
      for (const item of newItems) {
        s.session!.messages[item.seq] = item
      }
    })
}

export function setSelectedMessage(seq: number) {
  useSessionStore.setState((s) => {
    if (s.session) {
      s.session.selectedSeq = seq
    }
  })
}
