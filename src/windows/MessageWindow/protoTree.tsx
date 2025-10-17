/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type DescEnum,
  type DescField,
  type DescMessage,
  type DescOneof,
  type Message,
  ScalarType,
} from '@bufbuild/protobuf'
import type { GenMessage } from '@bufbuild/protobuf/codegenv2'
import {
  type DisplayAsBytes,
  type DisplayAsSteamID,
  type FieldPrefs,
  updateDisplayAs,
  useFieldPrefs,
  usePreferencesStore,
} from '@/stores/preferencesStore.ts'
import { useShallow } from 'zustand/react/shallow'
import { useMemo, useRef } from 'react'
import SteamID from 'steamid'
import { GlobalID } from '@/lib/globalid.ts'
import { type ContextMenuSchema, showContextMenu } from '@/stores/useContextMenu.tsx'
import { copyToClipboard } from '@/lib/clipboard.ts'
import clsx from 'clsx'
import style from '@/windows/MessageWindow/index.module.scss'
import {
  CSOEconEquipSlotSchema,
  CSOEconGameAccountClientSchema,
  type CSOEconItem,
  type CSOEconItemAttribute,
  CSOEconItemSchema,
  CSOEconRentalHistorySchema,
} from '@/proto/csgo/base_gcmessages_pb.ts'
import SoItem, { EconItem, EconItemAttribute } from '@/windows/MessageWindow/soitem.tsx'
import {
  CSOAccountItemPersonalStoreSchema,
  CSOAccountKeychainRemoveToolChargesSchema,
  CSOAccountRecurringMissionSchema,
  CSOAccountRecurringSubscriptionSchema,
  CSOAccountSeasonalOperationSchema,
  CSOAccountXpShopBidsSchema,
  CSOAccountXpShopSchema,
  CSOEconCouponSchema,
  CSOGameAccountSteamChinaSchema,
  CSOPersonaDataPublicSchema,
  CSOQuestProgressSchema,
  CSOVolatileItemClaimedRewardsSchema,
  CSOVolatileItemOfferSchema,
} from '@/proto/csgo/cstrike15_gcmessages_pb.ts'

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
  const inst = useMemo(() => {
    try {
      return new GlobalID(value)
    } catch (err) {
      // @ts-expect-error shh
      return err?.message ?? "Couldn't render globalid.."
    }
  }, [value])
  return typeof inst !== 'string' ? (
    <details open>
      <summary onContextMenu={onContextMenu}>{label}</summary>
      <ul>
        <li>Box: {inst.box_id()}</li>
        <li>Process ID: {inst.process_id()}</li>
        <li>Sequential Count: {inst.sequence_count()}</li>
        <li>Start Time: {inst.start_time().toString()}</li>
      </ul>
    </details>
  ) : (
    <li className={style.protoListItem} onContextMenu={onContextMenu}>
      {label}: {inst}
    </li>
  )
}

function RenderAsBytes({ value, displayAs, ref }: { value: Uint8Array; displayAs: DisplayAsBytes; ref: ValueRef }) {
  const rendered = useMemo(() => {
    if (displayAs === 'vdf') {
      // meow
    } else if (displayAs === 'vdf.lzma') {
      // meow
    } else if (displayAs === 'pb') {
      // meow
    } else if (displayAs === 'ascii') {
      let buf = ''
      for (let i = 0; i < value.length; ++i) {
        const ch = value[i]
        if (ch >= 32 && ch <= 126) {
          buf += String.fromCharCode(ch)
        } else {
          buf += `\\x${ch.toString(16).padStart(2, '0')}`
        }
      }
      return buf
    } else if (displayAs === 'utf8') {
      const textDecoder = new TextDecoder('utf-8')
      return textDecoder.decode(value)
    } else if (displayAs === 'hex') {
      return Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('')
    }
  }, [value, displayAs])
  return <span ref={ref}>{rendered}</span>
}

export function RenderItem({
  desc,
  hasValue,
  value,
  label,
  fieldName,
  fieldPrefs,
  contextMenu,
  odata,
  children,
}: React.PropsWithChildren<{
  desc: DescEnum | ScalarType | DescMessage
  hasValue: boolean
  label: string
  value: any
  fieldName: string
  fieldKey: string
  fieldPrefs: FieldPrefs | undefined
  contextMenu: ContextMenuSchema
  odata?: any
}>) {
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
  const valueRef = useRef<HTMLSpanElement>(null)

  if (typeof desc === 'number') {
    // Scalar type
    if (fieldPrefs?.displayAs) {
      const da = fieldPrefs.displayAs
      if (typeof value === 'bigint' && (da === 'steamid.2' || da === 'steamid.3')) {
        return (
          <li className={className} onContextMenu={onContextMenu}>
            {label}
            <RenderAsSteamID steamId={value} displayAs={da} ref={valueRef} />
            {children}
          </li>
        )
      } else if (da === 'gid') {
        return <RenderAsGlobalID value={value} label={fieldName} onContextMenu={onContextMenu} />
      }

      if (desc === ScalarType.BYTES) {
        return (
          <li className={className} onContextMenu={onContextMenu}>
            {label}
            <RenderAsBytes value={value} displayAs={da as DisplayAsBytes} ref={valueRef} />
            {children}
          </li>
        )
      }
    }
    return (
      <li className={className} onContextMenu={onContextMenu}>
        {label}
        <span ref={valueRef}>{value?.toString()}</span>
        {children}
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
            {children}
          </li>
        )
      case 'message':
        return (
          <li>
            {/* @ts-expect-error yep */}
            {hasValue ? <ProtoTree data={value} schema={desc} label={label} parent={odata} /> : `${label}null`}
            {children}
          </li>
        )
    }
  }
  return <li>idk</li>
}

export function ProtoItem({
  member,
  hasValue,
  value,
  odata,
  children,
}: React.PropsWithChildren<{
  member: DescField | DescOneof
  hasValue: boolean
  value: any
  odata: any
}>) {
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
          // console.log('st =', st, ' val=', typeof value)
          contextMenu.items.push({
            label: 'SteamID',
            items: [
              {
                label: 'Steam2',
                onClick: () => updateDisplayAs(fieldKey, 'steamid.2'),
                selected: fieldPrefs?.displayAs === 'steamid.2',
              },
              {
                label: 'Steam3',
                onClick: () => updateDisplayAs(fieldKey, 'steamid.3'),
                selected: fieldPrefs?.displayAs === 'steamid.3',
              },
            ],
          })
        }
        if (isInt64 || isInt32) {
          contextMenu.items.push(
            {
              label: 'GlobalID (GID)',
              onClick: () => updateDisplayAs(fieldKey, 'gid'),
              selected: fieldPrefs?.displayAs === 'gid',
            },
            {
              label: 'Date/Time',
              onClick: () => updateDisplayAs(fieldKey, 'datetime'),
              selected: fieldPrefs?.displayAs === 'datetime',
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
              selected: fieldPrefs?.displayAs === 'vdf',
            },
            {
              label: 'Protobuf',
              onClick: () => updateDisplayAs(fieldKey, 'pb'),
              selected: fieldPrefs?.displayAs === 'pb',
            },
            {
              label: 'ASCII',
              onClick: () => updateDisplayAs(fieldKey, 'ascii'),
              selected: fieldPrefs?.displayAs === 'ascii',
            },
            {
              label: 'UTF-8',
              onClick: () => updateDisplayAs(fieldKey, 'utf8'),
              selected: fieldPrefs?.displayAs === 'utf8',
            },
            {
              label: 'Hexadecimal',
              onClick: () => updateDisplayAs(fieldKey, 'hex'),
              selected: fieldPrefs?.displayAs === 'hex',
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
            children={children}
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
            children={children}
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
            children={children}
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

        if (member.parent.typeName === 'CMsgSOCacheSubscribed.SubscribedType' && member.name === 'object_data') {
          // console.log('Yoooo....', member, hasValue, value, odata)
          /// TODO: these are CSGO specific ......
          const typeIdsToSchemas = {
            1: CSOEconItemSchema,
            2: CSOPersonaDataPublicSchema,
            3: CSOEconEquipSlotSchema,
            4: CSOAccountItemPersonalStoreSchema,
            5: CSOEconRentalHistorySchema,
            6: CSOAccountXpShopSchema,
            7: CSOEconGameAccountClientSchema,
            15: CSOAccountKeychainRemoveToolChargesSchema,
            16: CSOAccountRecurringMissionSchema,
            18: CSOGameAccountSteamChinaSchema,
            19: CSOAccountXpShopBidsSchema,
            20: CSOVolatileItemOfferSchema,
            21: CSOVolatileItemClaimedRewardsSchema,
            39: CSOAccountRecurringSubscriptionSchema,
            40: CSOAccountSeasonalOperationSchema,
            41: CSOAccountSeasonalOperationSchema,
            45: CSOEconCouponSchema,
            46: CSOQuestProgressSchema,
          } as Record<number, DescMessage>
          const foundSchema = typeIdsToSchemas[odata.typeId]
          if (foundSchema) {
            listType = `List<${foundSchema.name}>`
            desc = foundSchema
            // value = value.map((a) => fromBinary(CSOEconItemSchema, a, { readUnknownFields: true }))
          }
        }

        return (
          <li key={key} className={clsx({ gray: !hasValue })}>
            {label}
            {listType} (#{length}){' '}
            {Array.isArray(value) ? (
              <ul>
                {value.map((item, idx) => {
                  // @ts-expect-error yep
                  if (item instanceof Uint8Array && desc?.kind === 'message') {
                    // @ts-expect-error yep
                    return <SoItem key={idx} desc={desc} value={item} label={`[ ${idx} ]: `} />
                  }
                  return (
                    <RenderItem
                      key={idx}
                      desc={desc}
                      hasValue={true}
                      label={`[ ${idx} ]: `}
                      value={item}
                      fieldName={key}
                      fieldKey={fieldKey}
                      fieldPrefs={fieldPrefs}
                      contextMenu={contextMenu}
                      odata={odata}
                    />
                  )
                })}
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

export function ProtoTree<T extends Message>({
  data,
  schema,
  label,
  parent,
}: {
  data: T
  schema: GenMessage<T>
  label?: string
  parent?: any
}) {
  const qualifiedTypeNames = usePreferencesStore(useShallow((e) => e.qualifiedTypeNames))

  if (schema.typeName === 'CSOEconItem') {
    return (
      <EconItem
        data={data as unknown as CSOEconItem}
        schema={schema as GenMessage<CSOEconItem>}
        label={label}
        qualifiedTypeNames={qualifiedTypeNames}
      />
    )
  } else if (schema.typeName === 'CSOEconItemAttribute') {
    return (
      <EconItemAttribute
        data={data as unknown as CSOEconItemAttribute}
        schema={schema as GenMessage<CSOEconItemAttribute>}
        label={label}
        qualifiedTypeNames={qualifiedTypeNames}
        parent={parent as unknown as CSOEconItem}
      />
    )
  }
  return (
    <details open>
      <summary>{label ? label : `Proto ${qualifiedTypeNames ? schema.typeName : schema.name}`}</summary>
      <ul>
        {Object.values(schema.members).map((member) => {
          const value = data[member.localName as keyof T]
          const hasValue = Object.getOwnPropertyNames(data).includes(member.localName)
          return <ProtoItem key={member.localName} member={member} value={value} hasValue={hasValue} odata={data} />
        })}
      </ul>
    </details>
  )
}
