import { create } from 'zustand/react'
// import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { toast } from 'react-hot-toast/headless'
import { useShallow } from 'zustand/react/shallow'
import { EMsg_Enum } from '@/lib/steam-types.ts'
import { Buffer } from '@/lib/Buffer.ts'
import { EMsg } from '@/proto/steam/enums_clientserver_pb.ts'
import { type CMsgProtoBufHeader, CMsgProtoBufHeaderSchema } from '@/proto/steam/steammessages_base_pb.ts'
import { type DescMessage, fromBinary } from '@bufbuild/protobuf'
import { getProtoFromEMsg } from '@/proto/steam.ts'
export type Direction = 'in' | 'out'

import { gcEMsgToName } from '@/proto/csgo.ts'
import { parseGcMessage } from '@/lib/gc.ts'

export interface ParsedMessageIsProtobuf {
  eMsg: number
  isProtobuf: true
  headerSize: number
  header: CMsgProtoBufHeader
}
export interface ParsedMessageIsntProtobuf {
  eMsg: number
  isProtobuf: false
  headerSize: number
  header: {
    headerVersion?: number
    targetJobId: bigint
    sourceJobId: bigint
    headerCanary?: number
    steamId?: bigint
    sessionId?: number
  }
}
type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}
type XOR<T, U> = T extends object ? (U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U) : T | U
export type ParsedMessage = XOR<ParsedMessageIsProtobuf, ParsedMessageIsntProtobuf>
export interface ParsedBody {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface NetHookGcMessage {
  eMsg: number
  eMsgName: string
  isProtobuf: boolean
  parsed: ParsedMessage
  body: ParsedBody | null
  payload?: Uint8Array
}

export interface NetHookMessage {
  seq: number
  direction: Direction
  eMsg: number
  eMsgName: string
  innerMsgName?: string
  file: FileSystemFileHandle
  data?: Uint8Array
  parsed: ParsedMessage
  body: ParsedBody | null
  gcMessage?: NetHookGcMessage
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
  // devtools(
  immer(
    // Comment so this is on its own line
    () => ({}),
  ),
  //   {
  //     serialize: {
  //       // @ts-expect-error shh
  //       replacer: (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
  //     },
  //   },
  // ),
)
export function createSession(dir: FileSystemDirectoryHandle) {
  useSessionStore.setState((s) => {
    s.session = {
      name: dir.name,
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

  parts.eMsgName = EMsg_Enum.keyToName[parts.eMsg] ?? parts.eMsgName ?? 'UNKNOWN'

  return parts
}

// const JOBID_NONE = '18446744073709551615'
const PROTO_MASK = 0x80000000

function parseMessageHeader(ab: ArrayBuffer): ParsedMessage {
  const buf = Buffer.from(ab, true, false)

  const maskedEMsg = buf.readUint32()
  const eMsg = maskedEMsg & ~PROTO_MASK
  const isProtobuf = !!(maskedEMsg & PROTO_MASK)

  if (eMsg == EMsg.k_EMsgChannelEncryptRequest || eMsg == EMsg.k_EMsgChannelEncryptResponse) {
    const targetJobId = buf.readUint64()
    const sourceJobId = buf.readUint64()
    return {
      eMsg,
      isProtobuf: false,
      headerSize: buf.bytesRead(),
      header: {
        targetJobId,
        sourceJobId,
      },
    }
  } else if (isProtobuf) {
    const headerSize = buf.readUint32()
    const header = fromBinary(CMsgProtoBufHeaderSchema, buf.readBytes(headerSize), {
      readUnknownFields: true,
    })
    // console.log('decoded header', header)
    return {
      eMsg,
      isProtobuf: true,
      headerSize: buf.bytesRead(),
      header,
    }
  } else {
    const headerSize = buf.readUint8() // = 36
    const headerVersion = buf.readUint16() // = 2
    const targetJobId = buf.readUint64()
    const sourceJobId = buf.readUint64()
    const headerCanary = buf.readUint8() // = 239
    const steamId = buf.readUint64()
    const sessionId = buf.readUint32()

    void headerSize

    return {
      eMsg,
      isProtobuf: false,
      headerSize: buf.bytesRead(),
      header: {
        headerVersion,
        targetJobId,
        sourceJobId,
        headerCanary,
        steamId,
        sessionId,
      },
    }
  }
}
export function parseMessageBody(desc: DescMessage | undefined, ab: Uint8Array): ParsedBody | null {
  if (!desc) return null
  try {
    const data = fromBinary(desc, ab, {
      readUnknownFields: true,
    })
    return { data }
  } catch (err) {
    console.warn('Error parsing', desc.typeName, ab, err)
    return null
  }
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

export async function parseFile(file: FileSystemFileHandle): Promise<NetHookMessage | undefined> {
  const name = file.name
  if (!name.endsWith('.bin')) return
  const parts = explodeName(name)
  const fo = await file.getFile()
  const ab = await fo.arrayBuffer()
  const parsed = parseMessageHeader(ab)
  const desc = getProtoFromEMsg(parts.eMsg, parts.eMsgName)
  const body = parseMessageBody(desc, new Uint8Array(ab.slice(parsed.headerSize)))

  const msg: NetHookMessage = { ...parts, file, parsed, body }
  // console.log('Parsed', parsed, body)

  if (body) {
    if (parsed.eMsg === 5452 || parsed.eMsg === 5453) {
      if (body?.data?.appid === 730) {
        const maskedEMsg = body.data.msgtype
        const eMsg = maskedEMsg & ~PROTO_MASK
        const isProtobuf = !!(maskedEMsg & PROTO_MASK)
        msg.innerMsgName = gcEMsgToName(eMsg)
        msg.gcMessage = parseGcMessage(eMsg, msg.innerMsgName, isProtobuf, msg)
        // gcEMsgToName()
      }
    }
  }
  return msg
}

export async function reloadSessionFiles() {
  const session = useSessionStore.getState().session
  if (!session) return

  const { dir } = session

  const newItems: Array<NetHookMessage> = []

  for await (const file of dir.values()) {
    if (file.kind !== 'file') continue
    const msg = await parseFile(file)
    if (msg) {
      if (session.messages[msg.seq]) return
      newItems.push(msg)
    }
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

export function useMessageBySeq(seq: number) {
  return useSessionStore(
    useShallow((s) => {
      if (seq === -1) return undefined
      return s.session?.messages[seq]
    }),
  )
}
