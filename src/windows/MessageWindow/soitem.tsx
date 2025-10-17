import { fromBinary, type Message } from '@bufbuild/protobuf'
import { useMemo } from 'react'
import { ProtoItem, ProtoTree } from '@/windows/MessageWindow/protoTree.tsx'
import type { GenMessage } from '@bufbuild/protobuf/codegenv2'
import '@/lib/cs2/items'
import type { CSOEconItem, CSOEconItemAttribute } from '@/proto/csgo/base_gcmessages_pb.ts'
import style from './index.module.scss'
import { attributesMap, items_game, rarityMap } from '@/lib/cs2/items.ts'
import { showContextMenu } from '@/stores/useContextMenu.tsx'
import { type EconItemAttributeDisplayAs, updateEconDisplayAs, useEconPrefs } from '@/stores/preferencesStore.ts'

const ItemQualities = {
    [0]: 'Normal',
    [1]: 'Genuine',
    [2]: 'Vintage',
    [3]: '★',
    [4]: 'Unique',
    [5]: 'Community',
    [6]: 'Valve',
    [7]: 'Prototype',
    [8]: 'Customized',
    [9]: 'StatTrak™',
    [10]: 'Completed',
    [11]: 'Haunted', // SKIN_STRANGE
    [12]: 'Souvenir',
  } as Record<number, string>,
  ItemOrigins = {
    [0]: 'Timed Drop',
    [1]: 'Achievement',
    [2]: 'Purchased',
    [3]: 'Traded',
    [4]: 'Crafted',
    [5]: 'Store Promotion',
    [6]: 'Gifted',
    [7]: 'Support Granted',
    [8]: 'Found in Crate',
    [9]: 'Earned',
    [10]: 'Third-Party Promotion',
    [11]: 'Wrapped Gift',
    [12]: 'Halloween Drop',
    [13]: 'Steam Purchase',
    [14]: 'Foreign Item',
    [15]: 'CD Key',
    [16]: 'Collection Reward',
    [17]: 'Preview Item',
    [18]: 'Steam Workshop Contribution',
    [19]: 'Periodic Score Reward',
    [20]: 'Recycling',
    [21]: 'Tournament Drop',
    [22]: 'Stock Item',
    [23]: 'Quest Reward',
    [24]: 'Level Up Reward',
  } as Record<number, string>

export function EconItem({
  data,
  schema,
  label,
  qualifiedTypeNames,
}: {
  data: CSOEconItem
  schema: GenMessage<CSOEconItem>
  label?: string
  qualifiedTypeNames: boolean
}) {
  return (
    <details open>
      <summary>{label ? label : `Proto ${qualifiedTypeNames ? schema.typeName : schema.name}`}</summary>
      <ul>
        {Object.values(schema.members).map((member) => {
          let value = data[member.localName as keyof CSOEconItem]
          const hasValue = Object.getOwnPropertyNames(data).includes(member.localName)

          if (member.name === 'def_index') {
            value = value as number
            value = items_game.items[value] ? `${items_game.items[value].name} (${value})` : value
          } else if (member.name === 'quality') {
            value = value as number
            value = ItemQualities[value] ? `${ItemQualities[value]} (${value})` : value
          } else if (member.name === 'origin') {
            value = value as number
            value = ItemOrigins[value] ? `${ItemOrigins[value]} (${value})` : value
          } else if (member.name === 'rarity') {
            value = value as number
            const foundRarity = rarityMap.get(value)
            if (foundRarity) {
              value = `${foundRarity.name} (${value})`
              return (
                <ProtoItem key={member.localName} member={member} value={value} hasValue={hasValue} odata={data}>
                  <div className={style.colorSquare} style={{ backgroundColor: foundRarity.hexColor }} />
                </ProtoItem>
              )
            }
          }

          return <ProtoItem key={member.localName} member={member} value={value} hasValue={hasValue} odata={data} />
        })}
      </ul>
    </details>
  )
}

const DefaultDisplayAs = {
  _730_set_item_texture_prefab: 'float',
  _730_set_item_texture_seed: 'uint32',
  _730_set_item_texture_wear: 'float',
  _730_sticker_slot_id: 'uint32',
  _730_spray_tint_id: 'uint32',

  _730_tradable_after_date: 'uint32',
  _730_kill_eater: 'uint32',
  _730_kill_eater_score_type: 'uint32',
  _730_cannot_trade: 'uint32',
  _730_music_id: 'uint32',
} as Record<string, EconItemAttributeDisplayAs>

export function EconItemAttribute({
  data,
  schema,
  label,
  qualifiedTypeNames,
  parent,
}: {
  data: CSOEconItemAttribute
  schema: GenMessage<CSOEconItemAttribute>
  label?: string
  qualifiedTypeNames: boolean
  parent: CSOEconItem
}) {
  const attrScheme = attributesMap.get(data.defIndex)

  // TODO: prefixed with our app ID, hardcoded (for now)
  const econKey = '_730_' + (attrScheme?.attribute_class ?? attrScheme?.name ?? 'unknown')
  const econItemPrefs = useEconPrefs(econKey)
  const displayAs = econItemPrefs?.displayAs ?? DefaultDisplayAs[econKey] ?? 'hex'
  console.log('yo', parent)
  const rendered = useMemo(() => {
    try {
      // data.valueBytes is a subarray we can't use its .buffer to coerce to another typedarray
      const copy = new Uint8Array(data.valueBytes)
      switch (displayAs) {
        case 'string':
          return new TextDecoder().decode(copy)
        case 'float':
          return new Float32Array(copy.buffer)[0].toFixed(10)
        case 'uint32':
          return new Uint32Array(copy.buffer)[0].toString()
        case 'hex':
          return Array.from(copy, (byte) => byte.toString(16).padStart(2, '0')).join('')
      }
    } catch (err) {
      // @ts-expect-error shh
      return err?.message ?? `Couldn't render value as ${displayAs}..`
    }
  }, [displayAs, data])
  return (
    <details open>
      <summary>{label ? label : `Proto ${qualifiedTypeNames ? schema.typeName : schema.name}`}</summary>
      <ul>
        <li className={style.protoListItem}>
          def_index: {attrScheme?.name ?? 'Unknown'} ({data.defIndex})
        </li>
        <li className={style.protoListItem}>attribute_class: {attrScheme?.attribute_class ?? 'Unknown'}</li>
        <li
          className={style.protoListItem}
          onContextMenu={(e) => {
            e.preventDefault()
            showContextMenu(
              {
                items: [
                  { label: 'String', onClick: () => updateEconDisplayAs(econKey, 'string') },
                  { label: 'Float', onClick: () => updateEconDisplayAs(econKey, 'float') },
                  { label: 'Uint32', onClick: () => updateEconDisplayAs(econKey, 'uint32') },
                  { label: 'Hex', onClick: () => updateEconDisplayAs(econKey, 'hex') },
                ],
              },
              { x: e.pageX, y: e.pageY },
            )
          }}
        >
          value: {rendered}
        </li>
        {attrScheme?.attribute_class === 'set_item_texture_prefab' && (
          <li className={style.protoListItem}>
            paint kit: {items_game.paint_kits[new Float32Array(new Uint8Array(data.valueBytes).buffer)[0]]?.name}
          </li>
        )}
        {/*{Object.values(schema.members).map((member) => {*/}
        {/*  const value = data[member.localName as keyof CSOEconItemAttribute]*/}
        {/*  const hasValue = Object.getOwnPropertyNames(data).includes(member.localName)*/}
        {/*  return <ProtoItem key={member.localName} member={member} value={value} hasValue={hasValue} odata={data} />*/}
        {/*})}*/}
      </ul>
    </details>
  )
}

export default function SoItem<T extends Message>({
  desc,
  value,
  label,
}: {
  desc: GenMessage<T>
  value: Uint8Array
  label: string
}) {
  const data = useMemo(() => fromBinary(desc, value, { readUnknownFields: true }), [desc, value])
  return (
    <li>
      <ProtoTree data={data} schema={desc} label={label} />
    </li>
  )
}
