import type { NetHookMessage } from '@/stores/sessionStore.ts'
import { useMemo } from 'react'
import clsx from 'clsx'
import style from '@/windows/MessageWindow/index.module.scss'
import { ProtoTree } from '@/windows'
import { getProtoFromGCEMsg } from '@/proto/csgo.ts'

export default function GcTab({ msg }: { msg: NetHookMessage }) {
  const gcMsg = msg.gcMessage!
  const desc = useMemo(() => getProtoFromGCEMsg(gcMsg.eMsg, gcMsg.eMsgName), [gcMsg.eMsg, gcMsg.eMsgName])

  return (
    <>
      <ul
        className={clsx(style.treeView, 'tree-view has-collapse-button has-connector has-container has-scrollbar')}
        style={{
          overflow: 'auto',
        }}
      >
        <details open>
          <summary>Info</summary>
          <ul>
            <li>
              EMsg: {gcMsg.eMsgName} ({gcMsg.eMsg})
            </li>
            <li>Is Protobuf: {gcMsg.isProtobuf ? 'True' : 'False'}</li>
          </ul>
        </details>

        {/* @ts-expect-error yea */}
        {gcMsg.body !== null && desc ? <ProtoTree schema={desc} data={gcMsg.body.data} /> : <>payload...</>}
      </ul>
    </>
  )
}
