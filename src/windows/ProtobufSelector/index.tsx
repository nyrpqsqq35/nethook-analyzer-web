import { type ChildWindowPropTypes, Window } from '@/components/Window'
import { HConstraint, VConstraint } from '@/stores/useWindows.tsx'
import clsx from 'clsx'
import Button from '@/components/Button'
import style from './index.module.scss'
import {
  ComboBox,
  Header,
  Input,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Collection,
  type Key,
} from 'react-aria-components'
// import { ArrowDownIcon } from '@/components/Icon/silk.tsx'
import { steamProtoDescs } from '@/proto/steam.ts'
import { type DescLocator, type FieldPrefsPb, updateDisplayAs } from '@/stores/preferencesStore.ts'
import { useMemo, useState } from 'react'

export default function ProtobufSelectorWindow({
  id,
  closeWindow,
  fieldKey,
}: ChildWindowPropTypes & { fieldKey: string }) {
  const protos = useMemo(() => {
    return [
      ...steamProtoDescs.map((file) => ({
        folder: 'steam',
        name: file.name,
        messages: file.messages.map((msg) => ({
          name: msg.typeName,
        })),
      })),
    ]
  }, [])

  const [selectedKey, setSelectedKey] = useState<Key | null>(null)
  const [desc, setDesc] = useState<DescLocator | null>(null)
  return (
    <Window
      id={id}
      caption="Select a protobuf"
      hConstraint={HConstraint.CENTER}
      vConstraint={VConstraint.CENTER}
      forceConstraints
      draggable={false}
      resizable={false}
      minWidth={320}
      minHeight={160}
      hideMinimize
      hideMaximize
    >
      <div className={style.container}>
        <p>Select a protobuf for {fieldKey}</p>
        <ComboBox
          defaultItems={protos}
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            console.log('set selected key', key)
            setSelectedKey(key)
            if (typeof key === 'string') {
              setDesc(key.split('$', 3) as DescLocator)
            }
          }}
        >
          <div>
            <Input />
            <Button>{/*<ArrowDownIcon />*/}</Button>
          </div>
          <Popover>
            <ListBox<(typeof protos)[0]>
              renderEmptyState={() => {
                return <div>Empty</div>
              }}
            >
              {(section) => (
                <ListBoxSection id={section.name}>
                  <Header>
                    {section.folder}/{section.name}.proto
                  </Header>
                  <Collection items={section.messages}>
                    {(item) => (
                      <ListBoxItem id={[section.folder, section.name, item.name].join('$')}>{item.name}</ListBoxItem>
                    )}
                  </Collection>
                </ListBoxSection>
              )}
            </ListBox>
          </Popover>
        </ComboBox>
        <div className={clsx('field-row', style.meow)}>
          <Button
            type="submit"
            label="Ok"
            onClick={() => {
              if (desc !== null) {
                updateDisplayAs<FieldPrefsPb>(fieldKey, 'pb', { desc })
                closeWindow()
              }
            }}
          />
          <Button label="Cancel" onClick={closeWindow} />
        </div>
      </div>
    </Window>
  )
}
