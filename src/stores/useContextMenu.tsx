import { create } from 'zustand/react'
import { devtools } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export enum ContextMenuSpecialItem {
  Separator,
}

export interface ContextMenuItemObject {
  label: string
  items?: ContextMenuItem[]
  selected?: boolean
  onClick?: (e: MouseEvent) => void
}
export type ContextMenuItem = ContextMenuSpecialItem | string | ContextMenuItemObject

export interface ContextMenuSchema {
  items: ContextMenuItem[]
}
interface ContextMenuDimensions {
  x: number
  y: number
}

export interface ContextMenuInstance {
  id: string
  schema: ContextMenuSchema
  dimensions: ContextMenuDimensions
}

export interface ContextMenuStore {
  currentId: string | null
  instances: ContextMenuInstance[]
}

export const useContextMenu = create<ContextMenuStore>()(
  devtools(
    () => {
      return {
        currentId: null,
        instances: [],
      }
    },
    {
      name: 'ContextMenuStore',
    },
  ),
)

export const closeContextMenu = () => useContextMenu.setState(() => ({ currentId: null }))

export const removeContextMenu = (id: string) =>
  useContextMenu.setState((e) => ({
    instances: e.instances.filter((i) => i.id !== id),
  }))

export const showContextMenu = (schema: ContextMenuSchema, dimensions: ContextMenuDimensions) => {
  useContextMenu.setState((e) => {
    const instance: ContextMenuInstance = {
      id: 'context-menu__' + nanoid(),
      schema,
      dimensions,
    }
    return {
      currentId: instance.id,
      instances: [instance, ...e.instances],
    }
  })
}
