import type { DescMessage } from '@bufbuild/protobuf'
import { EGCBaseMsgSchema, file_base_gcmessages } from './csgo/base_gcmessages_pb.ts'
import { ECsgoGCMsgSchema, file_cstrike15_gcmessages } from './csgo/cstrike15_gcmessages_pb.ts'
import { EGCItemMsgSchema, file_econ_gcmessages } from './csgo/econ_gcmessages_pb.ts'
import { file_engine_gcmessages } from './csgo/engine_gcmessages_pb.ts'
import { file_gcsdk_gcmessages } from './csgo/gcsdk_gcmessages_pb.ts'
import { EGCBaseClientMsgSchema, EGCSystemMsgSchema, ESOMsgSchema, file_gcsystemmsgs } from './csgo/gcsystemmsgs_pb.ts'
import { file_steammessages } from './csgo/steammessages_pb.ts'

export const csgoProtoDescs = [
  file_base_gcmessages,
  file_cstrike15_gcmessages,
  file_econ_gcmessages,
  file_engine_gcmessages,
  file_gcsdk_gcmessages,
  file_gcsystemmsgs,
  file_steammessages,
]

export const csgoGcEnums = [
  ECsgoGCMsgSchema,
  EGCBaseMsgSchema,
  ESOMsgSchema,
  EGCSystemMsgSchema,
  EGCItemMsgSchema,
  EGCBaseClientMsgSchema,
]

const eMsgToName = new Map<number, string>()
const eMsgToProto = new Map<number, DescMessage>()

export function sanitizeEnumName(name: string) {
  if (name.startsWith('k_EMsg')) {
    name = name.substring('k_EMsg'.length)
  } else if (name.startsWith('k_EGCMsg')) {
    name = name.substring('k_EGCMsg'.length)
  } else if (name.startsWith('k_ESOMsg')) {
    name = name.substring('k_ESOMsg'.length)
  }
  if (name.startsWith('_')) {
    name = name.substring(1)
  }
  if (name.startsWith('GC')) {
    name = name.substring(2)
  }
  return name
}

for (const en of csgoGcEnums) {
  for (const v of en.values) {
    const name = sanitizeEnumName(v.name),
      value = v.number

    // if (eMsgToName.has(value)) console.log('duplicate emsg', value)
    eMsgToName.set(value, name)
    const desc = getProtoFromGCEMsg(value, name)
    void desc
    // if (!desc) {
    //   console.log(value, name, 'missing descriptor')
    // }
  }
}

export function getProtoFromGCEMsg(eMsg: number, name?: string): DescMessage | undefined {
  const cached = eMsgToProto.get(eMsg)
  if (!cached) {
    if (!name) return undefined
    const lowerName = name.toLowerCase()
    let msgDesc: DescMessage | undefined = undefined
    for (const desc of csgoProtoDescs) {
      const locMsgDesc = desc.messages.find((a) => a.name.toLowerCase().endsWith(lowerName))
      if (locMsgDesc) {
        msgDesc = locMsgDesc
        break
      }
    }

    if (msgDesc) {
      eMsgToProto.set(eMsg, msgDesc)
    }
    return msgDesc
  }
  return cached
}

export function gcEMsgToName(eMsg: number): string {
  return eMsgToName.get(eMsg) ?? `unknown emsg (${eMsg})`
}
