import { parse } from '@node-steam/vdf'
const res = await fetch(
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/master/game/csgo/pak01_dir/resource/csgo_english.txt',
  {
    method: 'GET',
    cache: 'force-cache',
  },
)
const plainTextVdf = await res.text()

const parsed = parse(plainTextVdf) as {
  lang: {
    Language: 'English'
    Tokens: Record<string, string>
  }
}

for (const key in parsed.lang.Tokens) {
  const v = parsed.lang.Tokens[key]
  if (typeof v !== 'string') {
    parsed.lang.Tokens[key] = (v as number).toString()
  }
  parsed.lang.Tokens[key.toLowerCase()] = parsed.lang.Tokens[key]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).parsedLoc = parsed.lang.Tokens
export function getLoc(key: string) {
  if (key.startsWith('#')) {
    key = key.substring(1)
  }

  let foundValue = parsed.lang.Tokens[key.toLowerCase()]
  if (!foundValue) foundValue = parsed.lang.Tokens['csgo_' + key.toLowerCase()]
  return foundValue ?? key
}
