import { fromBinary, type Message } from '@bufbuild/protobuf'
import { useMemo } from 'react'
import { ProtoTree } from '@/windows/MessageWindow/protoTree.tsx'
import type { GenMessage } from '@bufbuild/protobuf/codegenv2'

export default function SoItem<T extends Message>({
  desc,
  value,
  label,
}: {
  desc: GenMessage<T>
  value: Uint8Array
  label: string
}) {
  const data = useMemo(() => {
    console.log('rerendering memo???')
    return fromBinary(desc, value, { readUnknownFields: true })
  }, [desc, value])
  return (
    <li>
      <ProtoTree data={data} schema={desc} label={label} />
    </li>
  )
}
