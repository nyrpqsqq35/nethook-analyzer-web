import { csgoGcEnums, getProtoFromGCEMsg /*getProtoFromGCEMsg*/ } from '@/proto/csgo.ts'
import { type NetHookGcMessage, type NetHookMessage, type ParsedBody, parseMessageBody } from '@/stores/sessionStore.ts'
import { Buffer } from '@/lib/Buffer.ts'
import { fromBinary } from '@bufbuild/protobuf'
import { CMsgProtoBufHeaderSchema } from '@/proto/steam/steammessages_base_pb.ts'
import { EMsg } from '@/proto/steam/enums_clientserver_pb.ts'

console.log('pd', csgoGcEnums)
export function parseGcMessage(
  eMsg: number,
  eMsgName: string,
  isProtobuf: boolean,
  msg: NetHookMessage,
): NetHookGcMessage {
  console.log('parsing', msg.seq, 'emsg', eMsg, eMsgName)
  const buf = Buffer.from(msg.body?.data.payload, true, false)

  const maskedEMsg = buf.readUint32()
  void maskedEMsg

  if (isProtobuf) {
    const headerSize = buf.readUint32()
    console.log('Header size', headerSize)
    const header = fromBinary(CMsgProtoBufHeaderSchema, buf.readBytes(headerSize), {
      readUnknownFields: true,
    })
    const headerSize2 = buf.bytesRead()
    const payload = buf.readBytes(buf.bytesLeft())

    let body: ParsedBody | null = null

    const desc = getProtoFromGCEMsg(eMsg, eMsgName)
    if (desc) {
      body = parseMessageBody(desc, payload)
    }

    return {
      eMsg,
      eMsgName,
      isProtobuf,
      body,
      payload,
      parsed: {
        eMsg: eMsg,
        isProtobuf: true,
        headerSize: headerSize2,
        header,
      },
    }
  } else {
    const headerVersion = buf.readUint16()
    const targetJobId = buf.readUint64()
    const sourceJobId = buf.readUint64()
    const headerSize = buf.bytesRead()

    return {
      eMsg,
      eMsgName,
      isProtobuf,
      body: null,
      payload: buf.readBytes(buf.bytesLeft()),
      parsed: {
        eMsg: eMsg,
        isProtobuf: false,
        headerSize: headerSize,
        header: {
          headerVersion,
          targetJobId,
          sourceJobId,
        },
      },
    }
  }
}
