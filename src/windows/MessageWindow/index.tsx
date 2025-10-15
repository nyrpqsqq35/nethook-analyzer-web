/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { type NetHookMessage, type ParsedMessageIsntProtobuf, useMessageBySeq } from '@/stores/sessionStore.ts'
import { HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import { CMsgProtoBufHeaderSchema } from '@/proto/steam/steammessages_base_pb.ts'
import type { GenMessage } from '@bufbuild/protobuf/codegenv2'
import type { DescEnum, DescField, DescMessage, DescOneof, Message } from '@bufbuild/protobuf'
import { ScalarType } from '@bufbuild/protobuf'
import { createRef, forwardRef, useMemo } from 'react'
import { getProtoFromEMsg } from '@/proto/steam.ts'
import {
  type DisplayAsSteamID,
  type FieldPrefs,
  updateDisplayAs,
  useFieldPrefs,
  usePreferencesStore,
} from '@/stores/preferencesStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { TabContainer, TabPage } from '@/components/Tab'
import { DocumentBlockIcon } from '@/components/Icon/fugue.tsx'
import { type ContextMenuSchema, showContextMenu } from '@/stores/useContextMenu.tsx'
// import type { DescMessage } from '@bufbuild/protobuf'
// import Button from '@/components/Button'
// import { openDirectoryPicker } from '@/stores/sessionStore.ts'
import style from './index.module.scss'
import clsx from 'clsx'
import SteamID from 'steamid'
import { copyToClipboard } from '@/lib/clipboard.ts'
import { GlobalID } from '@/lib/globalid.ts'

interface MessageWindowPropTypes extends ChildWindowPropTypes {
  seq: number
}

type ValueRef = React.RefObject<HTMLSpanElement | null>

function RenderAsSteamID({ steamId, displayAs, ref }: { steamId: bigint; displayAs: DisplayAsSteamID; ref: ValueRef }) {
  const rendered = useMemo(() => {
    try {
      const inst = new SteamID(steamId)
      return displayAs === 'steamid.2' ? inst.getSteam2RenderedID() : inst.getSteam3RenderedID()
    } catch (err) {
      // @ts-expect-error shh
      return err?.message ?? "Couldn't render steamid.."
    }
  }, [steamId, displayAs])
  return <span ref={ref}>{rendered}</span>
}
function RenderAsGlobalID({
  label,
  value,
  onContextMenu,
}: {
  label: string
  value: any
  onContextMenu: React.MouseEventHandler<HTMLElement>
}) {
  const inst = useMemo(() => new GlobalID(value), [value])
  return (
    <details open>
      <summary onContextMenu={onContextMenu}>{label}</summary>
      <ul>
        <li>Box: {inst.box_id()}</li>
        <li>Process ID: {inst.process_id()}</li>
        <li>Sequential Count: {inst.sequence_count()}</li>
        <li>Start Time: {inst.start_time().toString()}</li>
      </ul>
    </details>
  )
}
function RenderItem({
  desc,
  hasValue,
  value,
  label,
  fieldName,
  fieldPrefs,
  contextMenu,
}: {
  desc: DescEnum | ScalarType | DescMessage
  hasValue: boolean
  label: string
  value: any
  fieldName: string
  fieldKey: string
  fieldPrefs: FieldPrefs | undefined
  contextMenu: ContextMenuSchema
}) {
  const onContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault()
    showContextMenu(
      {
        items: [
          {
            label: 'Copy',
            items: [
              {
                label: 'Copy name',
                onClick: () => {
                  void copyToClipboard(fieldName)
                },
              },
              {
                label: 'Copy name/value',
                onClick: () => {
                  const dv = (fieldPrefs?.displayAs ? valueRef.current?.innerText : value) ?? value
                  void copyToClipboard(`${fieldName}: ${typeof dv != 'undefined' ? dv.toString() : ''}`)
                },
              },
              {
                label: 'Copy value',
                onClick: () => {
                  const dv = (fieldPrefs?.displayAs ? valueRef.current?.innerText : value) ?? value
                  void copyToClipboard(typeof dv != 'undefined' ? dv.toString() : '')
                },
              },
              {
                label: 'Copy type',
                onClick: () => {
                  // yea
                },
              },
            ],
          },
          ...contextMenu.items,
        ],
      },
      {
        x: e.pageX,
        y: e.pageY,
      },
    )
  }

  const className = clsx(style.protoListItem, { gray: !hasValue })
  // for copying..
  const valueRef = createRef<HTMLSpanElement>()

  if (typeof desc === 'number') {
    // Scalar type
    if (fieldPrefs?.displayAs) {
      const da = fieldPrefs.displayAs
      if (typeof value === 'bigint' && (da === 'steamid.2' || da === 'steamid.3')) {
        return (
          <li className={className} onContextMenu={onContextMenu}>
            {label}
            <RenderAsSteamID steamId={value} displayAs={da} ref={valueRef} />
          </li>
        )
      } else if (da === 'gid') {
        return <RenderAsGlobalID value={value} label={fieldName} onContextMenu={onContextMenu} ref={valueRef} />
      }
    }
    return (
      <li className={className} onContextMenu={onContextMenu}>
        {label}
        <span ref={valueRef}>{value?.toString()}</span>
      </li>
    )
  } else {
    switch (desc.kind) {
      case 'enum':
        return (
          <li className={className} onContextMenu={onContextMenu}>
            {label}
            <span ref={valueRef}>
              {desc.typeName}.{desc.values[value as number].name.substring(desc.sharedPrefix?.length ?? 0)} (
              {value as number})
            </span>
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

function ProtoItem({ member, hasValue, value }: { member: DescField | DescOneof; hasValue: boolean; value: any }) {
  const { hideDefaultFields, qualifiedTypeNames } = usePreferencesStore(
    useShallow((a) => ({
      hideDefaultFields: a.hideDefaultFields,
      qualifiedTypeNames: a.qualifiedTypeNames,
    })),
  )

  const key = member.name
  const label = `${member.name}: `
  const fieldKey = `${member.parent.typeName}.${member.name}`
  const fieldPrefs = useFieldPrefs(fieldKey)
  if (member.kind === 'field') {
    const contextMenu: ContextMenuSchema = {
      items: [],
    }

    switch (member.fieldKind) {
      case 'scalar': {
        const defaultValue = member.getDefaultValue()
        if (typeof value === 'undefined' || value === defaultValue) {
          hasValue = false
          value = defaultValue
        }
        if (hideDefaultFields && !hasValue) return <></>
        const st = member.scalar
        const isInt64 =
            st == ScalarType.INT64 ||
            st == ScalarType.SINT64 ||
            st == ScalarType.UINT64 ||
            st == ScalarType.FIXED64 ||
            st == ScalarType.SFIXED64,
          isInt32 =
            st == ScalarType.INT32 ||
            st == ScalarType.SINT32 ||
            st == ScalarType.UINT32 ||
            st == ScalarType.FIXED32 ||
            st == ScalarType.SFIXED32
        if (isInt64) {
          console.log('st =', st, ' val=', typeof value)
          contextMenu.items.push({
            label: 'SteamID',
            items: [
              { label: 'Steam2', onClick: () => updateDisplayAs(fieldKey, 'steamid.2') },
              { label: 'Steam3', onClick: () => updateDisplayAs(fieldKey, 'steamid.3') },
            ],
          })
        }
        if (isInt64 || isInt32) {
          contextMenu.items.push(
            {
              label: 'GlobalID (GID)',
              onClick: () => updateDisplayAs(fieldKey, 'gid'),
            },
            {
              label: 'Date/Time',
              onClick: () => updateDisplayAs(fieldKey, 'datetime'),
            },
          )
        }
        if (st == ScalarType.BYTES) {
          contextMenu.items.push(
            {
              label: 'Save to file',
            },
            {
              label: 'Binary KeyValues (VDF)',
              onClick: () => updateDisplayAs(fieldKey, 'vdf'),
            },
            {
              label: 'Protobuf',
              onClick: () => updateDisplayAs(fieldKey, 'pb'),
            },
            {
              label: 'ASCII',
              onClick: () => updateDisplayAs(fieldKey, 'ascii'),
            },
            {
              label: 'UTF-8',
              onClick: () => updateDisplayAs(fieldKey, 'utf8'),
            },
            {
              label: 'Hexadecimal',
              onClick: () => updateDisplayAs(fieldKey, 'hex'),
            },
          )
        }
        return (
          <RenderItem
            desc={st}
            hasValue={hasValue}
            value={value}
            label={label}
            fieldName={key}
            fieldKey={fieldKey}
            fieldPrefs={fieldPrefs}
            contextMenu={contextMenu}
          />
        )
      }
      case 'enum':
        if (hideDefaultFields && !hasValue) return <></>
        return (
          <RenderItem
            desc={member.enum}
            hasValue={hasValue}
            value={value}
            label={label}
            fieldName={key}
            fieldKey={fieldKey}
            fieldPrefs={fieldPrefs}
            contextMenu={contextMenu}
          />
        )
      case 'message':
        if (hideDefaultFields && !hasValue) return <></>
        return (
          <RenderItem
            desc={member.message}
            hasValue={hasValue}
            value={value}
            label={label}
            fieldName={key}
            fieldKey={fieldKey}
            fieldPrefs={fieldPrefs}
            contextMenu={contextMenu}
          />
        )
      case 'list': {
        const length = Array.isArray(value) ? value.length : 0
        hasValue = length > 0
        let desc: DescEnum | ScalarType | DescMessage
        let listType = 'List<'
        switch (member.listKind) {
          case 'enum':
            desc = member.enum
            listType += qualifiedTypeNames ? member.enum.typeName : member.enum.name
            break
          case 'scalar':
            desc = member.scalar
            listType += member.scalar
            break
          case 'message':
            desc = member.message
            listType += qualifiedTypeNames ? member.message.typeName : member.message.name
            break
        }
        listType += '>'
        if (hideDefaultFields && !hasValue) return <></>
        return (
          <li key={key} className={clsx({ gray: !hasValue })}>
            {label}
            {listType} (#{length}){' '}
            {Array.isArray(value) ? (
              <ul>
                {value.map((item, idx) => (
                  <RenderItem
                    key={idx}
                    desc={desc}
                    hasValue={true}
                    label={`[ ${idx} ]`}
                    value={item}
                    fieldName={key}
                    fieldKey={fieldKey}
                    fieldPrefs={fieldPrefs}
                    contextMenu={contextMenu}
                  />
                ))}
              </ul>
            ) : undefined}
          </li>
        )
      }

      case 'map':
        return (
          <li key={key} className={clsx({ gray: !hasValue })}>
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
  const qualifiedTypeNames = usePreferencesStore(useShallow((e) => e.qualifiedTypeNames))
  return (
    <details open>
      <summary>{label ? label : `Proto ${qualifiedTypeNames ? schema.typeName : schema.name}`}</summary>
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

export function MessageWindow({ id, seq }: MessageWindowPropTypes) {
  const msg = useMessageBySeq(seq)

  console.log('rerender')

  return (
    <Window
      id={id}
      caption={`Message ${seq}${id === 'quick-message-window' ? ' (*)' : ''}`}
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
          </TabContainer>
        ) : (
          'missing message'
        )}
      </div>
    </Window>
  )
}
