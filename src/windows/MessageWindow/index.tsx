import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { type NetHookMessage, type ParsedMessageIsntProtobuf, useMessageBySeq } from '@/stores/sessionStore.ts'
import { HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import { CMsgProtoBufHeaderSchema } from '@/proto/steam/steammessages_base_pb.ts'
import type { GenMessage } from '@bufbuild/protobuf/codegenv2'
import type { DescEnum, DescField, DescMessage, ScalarType, DescOneof, Message } from '@bufbuild/protobuf'
import { useMemo } from 'react'
import { getProtoFromEMsg } from '@/proto/steam.ts'
import { usePreferencesStore } from '@/stores/preferencesStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { TabContainer, TabPage } from '@/components/Tab'
import { DocumentBlockIcon } from '@/components/Icon/fugue.tsx'
// import type { DescMessage } from '@bufbuild/protobuf'
// import Button from '@/components/Button'
// import { openDirectoryPicker } from '@/stores/sessionStore.ts'

interface MessageWindowPropTypes extends ChildWindowPropTypes {
  seq: number
}

function RenderItem({
  desc,
  hasValue,
  value,
  label,
}: {
  desc: DescEnum | ScalarType | DescMessage
  hasValue: boolean
  label: string
  // eslint-disable-next-line
  value: any
}) {
  if (typeof desc === 'number') {
    // Scalar type
    return (
      <li className={hasValue ? '' : 'gray'}>
        {label}
        {value?.toString()}
      </li>
    )
  } else {
    switch (desc.kind) {
      case 'enum':
        return (
          <li className={hasValue ? '' : 'gray'}>
            {label}
            {desc.typeName}.{desc.values[value as number].name.substring(desc.sharedPrefix?.length ?? 0)} (
            {value as number})
          </li>
        )
      case 'message':
        return (
          <li>
            {/* @ts-expect-error yep */}
            {hasValue ? <ProtoTree data={value} schema={desc} label={label} /> : `${label}null`}
          </li>
        )
    }
  }
  return <li>idk</li>
}

// eslint-disable-next-line
function ProtoItem({ member, hasValue, value }: { member: DescField | DescOneof; hasValue: boolean; value: any }) {
  const hideDefaultFields = usePreferencesStore(useShallow((a) => a.hideDefaultFields))

  const key = member.name
  const label = `${member.name}: `
  if (member.kind === 'field') {
    switch (member.fieldKind) {
      case 'scalar': {
        const defaultValue = member.getDefaultValue()
        if (typeof value === 'undefined' || value === defaultValue) {
          hasValue = false
          value = defaultValue
        }
        if (hideDefaultFields && !hasValue) return <></>
        return <RenderItem desc={member.scalar} hasValue={hasValue} value={value} label={label} />
      }
      case 'enum':
        if (hideDefaultFields && !hasValue) return <></>
        return <RenderItem desc={member.enum} hasValue={hasValue} value={value} label={label} />
      case 'message':
        if (hideDefaultFields && !hasValue) return <></>
        return <RenderItem desc={member.message} hasValue={hasValue} value={value} label={label} />
      case 'list': {
        const length = Array.isArray(value) ? value.length : 0
        hasValue = length > 0
        let desc: DescEnum | ScalarType | DescMessage
        let listType = 'List<'
        switch (member.listKind) {
          case 'enum':
            desc = member.enum
            listType += member.enum.typeName
            break
          case 'scalar':
            desc = member.scalar
            listType += member.scalar
            break
          case 'message':
            desc = member.message
            listType += member.message.typeName
            break
        }
        listType += '>'
        if (hideDefaultFields && !hasValue) return <></>
        return (
          <li key={key} className={hasValue ? '' : 'gray'}>
            {label}
            {listType} (#{length}){' '}
            {Array.isArray(value) ? (
              <ul>
                {value.map((item, idx) => (
                  <RenderItem key={idx} desc={desc} hasValue={true} label={`[ ${idx} ] = `} value={item} />
                ))}
              </ul>
            ) : undefined}
          </li>
        )
      }

      case 'map':
        return (
          <li key={key} className={hasValue ? '' : 'gray'}>
            {label}map unimplemented, pm me if u see this
          </li>
        )

      default:
        return <li key={key}>{label}unknown member?</li>
    }
  } else if (member.kind === 'oneof') {
    return <></>
  } else {
    // shouldn't happen
    return <></>
  }
}

function ProtoTree<T extends Message>({ data, schema, label }: { data: T; schema: GenMessage<T>; label?: string }) {
  return (
    <details open>
      <summary>{label ? label + `${schema.typeName}` : `Proto ${schema.typeName}`}</summary>
      <ul>
        {Object.values(schema.members).map((member) => {
          const value = data[member.localName as keyof T]
          const hasValue = Object.getOwnPropertyNames(data).includes(member.localName)
          return <ProtoItem key={member.localName} member={member} value={value} hasValue={hasValue} />
        })}
      </ul>
    </details>
  )
}

function StandardHeader({ parsed }: { parsed: ParsedMessageIsntProtobuf }) {
  return (
    <details open>
      <summary>Hdr</summary>
      <ul>
        {typeof parsed.header.headerVersion === 'number' && <li>HeaderVersion: {parsed.header.headerVersion}</li>}
        <li>targetJobId: {parsed.header.targetJobId.toString()}</li>
        <li>sourceJobId: {parsed.header.sourceJobId.toString()}</li>
        {typeof parsed.header.headerCanary === 'number' && <li>Header canary: {parsed.header.headerCanary}</li>}
        {typeof parsed.header.steamId === 'bigint' && <li>SteamID: {parsed.header.steamId.toString()}</li>}
        {typeof parsed.header.sessionId === 'number' && <li>HeaderVersion: {parsed.header.headerVersion}</li>}
      </ul>
    </details>
  )
}

function Yeah({ msg }: { msg: NetHookMessage }) {
  const desc = useMemo(() => getProtoFromEMsg(msg.eMsg, msg.eMsgName), [msg.eMsg, msg.eMsgName])
  return (
    <>
      <ul
        className="tree-view has-collapse-button has-connector has-container has-scrollbar"
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

export function MessageWindow({ id, seq }: MessageWindowPropTypes) {
  const msg = useMessageBySeq(seq)

  console.log('rerender')

  return (
    <Window
      id={id}
      caption="message windowo"
      vConstraint={VConstraint.TOP}
      hConstraint={HConstraint.CENTER}
      minHeight={420}
      minWidth={420}
      icon={DocumentBlockIcon}
    >
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {msg ? (
          <TabContainer
            label="nya"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <TabPage
              id="message"
              label="message"
              className="has-scrollbar"
              style={{ width: '100%', height: '100%', padding: '0', flexGrow: '1' }}
            >
              <Yeah msg={msg} />
            </TabPage>
          </TabContainer>
        ) : (
          'missing message'
        )}
      </div>
    </Window>
  )
}
