import clsx from 'clsx'
import { useRef } from 'react'
import { useOutsideClick } from 'rooks'
import {
  useContextMenu,
  closeContextMenu,
  type ContextMenuItem,
  ContextMenuSpecialItem,
  removeContextMenu,
} from '@/stores/useContextMenu'

import { CSSTransition } from 'react-transition-group'
import style from './style.module.scss'
import { useShallow } from 'zustand/react/shallow'

export interface ContextMenuPropTypes {
  id: string
}

export function ContextMenu({ id }: ContextMenuPropTypes) {
  const { schema, dimensions, current } = useContextMenu(
    useShallow((e) => ({
      ...e.instances.find((i) => i.id === id)!,
      current: e.currentId === id,
    })),
  )

  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, closeContextMenu)

  const buildItemArray = (items: ContextMenuItem[]) =>
    items.map((item, index) => {
      if (typeof item === 'number') return
      let nextIndex = index + 1
      if (index + 1 === items.length) nextIndex = index
      const nextItem = items[nextIndex]
      const label = typeof item === 'string' ? item : item.label

      const subitems: ContextMenuItem[] = typeof item !== 'string' ? item.items || [] : []
      const hasSubItems = subitems.length > 0

      const tabIndex = 0

      const onClickHandler: CallableFunction | undefined = typeof item === 'object' ? item.onClick : undefined

      return (
        <li
          key={index}
          role="menuitem"
          className={clsx({
            'has-divider': nextItem === ContextMenuSpecialItem.Separator,
          })}
          tabIndex={tabIndex}
          aria-haspopup={hasSubItems}
          onClick={async () => {
            if (onClickHandler) {
              await onClickHandler()
              closeContextMenu()
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {!hasSubItems && (
            <>
              <a>{label}</a>
            </>
          )}
          {hasSubItems && (
            <>
              {label}
              <ul role="menu">{buildItemArray(subitems)}</ul>
            </>
          )}
        </li>
      )
    })

  return (
    <CSSTransition
      nodeRef={ref}
      in={current}
      timeout={150}
      classNames={{
        enterActive: 'animate__fadeIn',
        exitActive: 'animate__fadeOut',
      }}
      unmountOnExit
      onEnter={() => {}}
      onExited={() => removeContextMenu(id)}
    >
      <div
        className={clsx(style.contextMenu, {
          [style.current]: current,
        })}
        style={{
          width: '200px',
          top: dimensions.y,
          left: dimensions.x,
        }}
        ref={ref}
      >
        <ul id={id} role="menu" className={'can-hover'}>
          {buildItemArray(schema.items)}
        </ul>
      </div>
    </CSSTransition>
  )
}

export default function ContextMenuContainer() {
  const instances = useContextMenu(useShallow((e) => e.instances))
  return (
    <>
      {instances.map((i) => {
        return <ContextMenu key={i.id} id={i.id} />
      })}
    </>
  )
}
