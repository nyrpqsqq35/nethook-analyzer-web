import type { DescLocator } from '@/stores/preferencesStore.ts'
import { steamProtoDescs } from '@/proto/steam.ts'
import { csgoProtoDescs } from '@/proto/csgo.ts'
import type { DescMessage } from '@bufbuild/protobuf'

export function findMessageWithLocator(loc: DescLocator): DescMessage | null {
  const [folder, fileName, msgTypeName] = loc
  const items = folder === 'steam' ? steamProtoDescs : folder === 'csgo' ? csgoProtoDescs : steamProtoDescs

  for (const item of items) {
    if (item.name !== fileName) continue
    for (const msg of item.messages) {
      if (msg.name !== msgTypeName) continue
      return msg
    }
  }
  return null
}
