import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { type NetHookMessage, type ParsedMessageIsntProtobuf, useMessageBySeq } from '@/stores/sessionStore.ts'
import { HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import { CMsgProtoBufHeaderSchema } from '@/proto/steam/steammessages_base_pb.ts'
import { useMemo } from 'react'
import { getProtoFromEMsg } from '@/proto/steam.ts'

import { TabContainer, TabPage } from '@/components/Tab'
import { DocumentBlockIcon } from '@/components/Icon/fugue.tsx'
import style from './index.module.scss'
import clsx from 'clsx'
import { ProtoTree } from '@/windows/MessageWindow/protoTree.tsx'
import GcTab from '@/windows/MessageWindow/gc.tsx'

interface MessageWindowPropTypes extends ChildWindowPropTypes {
  seq: number
  msg?: NetHookMessage
}

function StandardHeader({ parsed }: { parsed: ParsedMessageIsntProtobuf }) {
  return (
    <details open>
      <summary>Non proto header</summary>
      <ul>
        {typeof parsed.header.headerVersion === 'number' && <li>header_version: {parsed.header.headerVersion}</li>}
        <li>target_job_id: {parsed.header.targetJobId.toString()}</li>
        <li>source_job_id: {parsed.header.sourceJobId.toString()}</li>
        {typeof parsed.header.headerCanary === 'number' && <li>header_canary: {parsed.header.headerCanary}</li>}
        {typeof parsed.header.steamId === 'bigint' && <li>steamid: {parsed.header.steamId.toString()}</li>}
        {typeof parsed.header.sessionId === 'number' && <li>session_id: {parsed.header.sessionId}</li>}
      </ul>
    </details>
  )
}

function Yeah({ msg }: { msg: NetHookMessage }) {
  console.log('Yeah rerender')

  const desc = useMemo(() => getProtoFromEMsg(msg.eMsg, msg.eMsgName), [msg.eMsg, msg.eMsgName])
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
              EMsg: {msg.eMsgName} ({msg.eMsg})
            </li>
            <li>Is Protobuf: {msg.parsed.isProtobuf ? 'True' : 'False'}</li>
          </ul>
        </details>
        <details open>
          <summary>Header</summary>
          <ul>
            <li>
              Msg: {/* TODO */ msg.eMsgName} ({msg.parsed.eMsg})
            </li>
            <li>HeaderLength: {msg.parsed.headerSize}</li>
            <li>
              {msg.parsed.isProtobuf ? (
                <ProtoTree data={msg.parsed.header} schema={CMsgProtoBufHeaderSchema} />
              ) : (
                <StandardHeader parsed={msg.parsed} />
              )}
            </li>
          </ul>
        </details>
        {/* @ts-expect-error yea */}
        {msg.body !== null && desc && <ProtoTree schema={desc} data={msg.body.data} />}
      </ul>
    </>
  )
}

export function MessageWindow({ id, seq, msg: maybeMsg }: MessageWindowPropTypes) {
  const used = useMessageBySeq(maybeMsg ? -1 : seq)
  const msg = maybeMsg ?? used

  return (
    <Window
      id={id}
      caption={
        maybeMsg
          ? `Message ${maybeMsg.file.name}`
          : `Message ${msg?.seq ?? seq}${id === 'quick-message-window' ? '*' : ''}`
      }
      vConstraint={VConstraint.TOP}
      hConstraint={HConstraint.CENTER}
      minHeight={420}
      minWidth={420}
      icon={DocumentBlockIcon}
    >
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {msg ? (
          <TabContainer
            label="Message window"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <TabPage
              id="message"
              label="Message"
              className="has-scrollbar"
              style={{ width: '100%', height: '100%', padding: '0', flexGrow: '1' }}
            >
              <Yeah msg={msg} />
            </TabPage>
            {msg.gcMessage ? (
              <TabPage
                id="gc-message"
                label="GC message"
                className="has-scrollbar"
                style={{ width: '100%', height: '100%', padding: '0', flexGrow: '1' }}
              >
                <GcTab msg={msg} />
              </TabPage>
            ) : undefined}
          </TabContainer>
        ) : (
          'missing message'
        )}
      </div>
    </Window>
  )
}
