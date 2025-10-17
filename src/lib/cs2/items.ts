interface GameItemAttribute {
  name: string
  attribute_class: string
  stored_as_integer: 0 | 1 | 'float_floor_to_integer'
  // attribute_cber
}
interface GameItemItem {
  name: string
  item_quality: string
  baseitem: number
}
interface GameItemRarity {
  value: number
  loc_key: string
  loc_key_weapon: string
  loc_key_character: string
  color: string
  drop_sound: string
  weight?: number
  next_rarity?: string
}
interface GameItemPaintKit {
  name: string
  description_string: string
  description_tag: string
}
interface GameItemStickerKit {
  name: string
  item_name: string
  description_string: string
}
interface GameItems {
  rarities: Record<string, GameItemRarity>
  items: Record<string, GameItemItem>
  attributes: Record<string, GameItemAttribute>
  sticker_kits: Record<number, GameItemStickerKit>
  paint_kits: Record<number, GameItemPaintKit>
  paint_kits_rarity: Record<string, string>
  colors: Record<
    string,
    {
      color_name: string
      hex_color: string
    }
  >
}

const res = await fetch(
  'https://raw.githubusercontent.com/ByMykel/counter-strike-file-tracker/refs/heads/main/static/items_game.json',
  {
    method: 'GET',
    cache: 'force-cache',
  },
)
const items_game_ctr = (await res.json()) as {
  items_game: GameItems
}
export const items_game = items_game_ctr.items_game

export const attributesMap = new Map<number, GameItemAttribute>(
  Object.entries(items_game.attributes).map(([str_def, attr]) => [parseInt(str_def), attr]),
)
interface Rarity {
  name: string
  locKey: string
  hexColor: string
}
export const rarityMap = new Map<number, Rarity>(
  Object.entries(items_game.rarities).map(([name, obj]) => [
    obj.value,
    { name, locKey: obj.loc_key, hexColor: items_game.colors[obj.color].hex_color },
  ]),
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).items_game = items_game

// console.log(items_game.items_game.attributes['1'])
