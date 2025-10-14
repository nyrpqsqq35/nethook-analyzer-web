/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { create } from 'zustand/react'
// import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { MessageBoxWindow } from '@/windows'
import { useShallow } from 'zustand/react/shallow'
// import { lookupType, serializeType } from '@/registry'
// import { MessageBoxWindow } from '@/windows'

export enum HConstraint {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

export enum VConstraint {
  TOP = 3,
  CENTER = 4,
  BOTTOM = 5,
}

export interface Dimensions {
  x: number
  y: number
  width: number
  height: number
}

export interface Window {
  id: string
  element: React.ElementType
  props: object

  isDialog: boolean

  dimensions: Dimensions
  hConstraint?: HConstraint
  vConstraint?: VConstraint
}

type WindowIdOrWindow = string | Pick<Window, 'id'>

interface CreateWindowOptions {
  dialog?: boolean
  props?: object
  id?: string
}

export interface WindowsStore {
  windows: Window[]
  focusTable: string[]
  foregroundWindow: string | null
}

const resolveWindow = (e: WindowsStore, window: WindowIdOrWindow) => {
  const windowId = typeof window === 'string' ? window : window.id
  const w = e.windows.find((i) => i.id === windowId)
  if (!w) throw new Error(`Window #"${windowId}" does not exist!`)

  return w
}

// const useWindows = create(
//   persist<WindowsStore>(
//     () => ({
//       windows: [],
//       focusTable: [],
//       foregroundWindow: null,
//     }),
//     {
//       name: 'windows',
//       storage: createJSONStorage(() => sessionStorage, {
//         replacer: (key, value) => {
//           if (key === 'element' && typeof value === 'function') {
//             return serializeType(value)
//           }
//           return value
//         },
//         reviver: (key, value) => {
//           // @ts-expect-error Yeah
//           if (key === 'element' && value.__r && value.__n) {
//             // @ts-expect-error Yeah
//             return lookupType(value)
//           }
//
//           return value
//         },
//       }),
//     },
//   ),
// )
export const useWindows = create<WindowsStore>(() => ({
  windows: [],
  focusTable: [],
  foregroundWindow: null,
}))

export const useWindowHeight = (id: WindowIdOrWindow) =>
  useWindows(useShallow((e) => e.windows.find((i) => i.id === id)?.dimensions.height ?? 0))

export const WINDOW_UNINITIALIZED_SIZE = -1111

function _createWindow(e: WindowsStore, element: React.ElementType, options: CreateWindowOptions = {}): WindowsStore {
  const window: Window = {
    id: options.id ?? nanoid(),
    element,
    props: {
      ...options.props,
    },

    isDialog: typeof options.dialog === 'boolean' ? options.dialog : false,

    dimensions: {
      x: WINDOW_UNINITIALIZED_SIZE,
      y: WINDOW_UNINITIALIZED_SIZE,
      width: WINDOW_UNINITIALIZED_SIZE,
      height: WINDOW_UNINITIALIZED_SIZE,
    },
  }

  return {
    windows: [...e.windows, window],
    foregroundWindow: window.id,
    focusTable: [window.id, ...e.focusTable],
  }
}
function _focusWindow(e: WindowsStore, window: WindowIdOrWindow): Partial<WindowsStore> {
  const w = resolveWindow(e, window)
  if (e.foregroundWindow === w.id) return {}
  e.focusTable = e.focusTable.filter((i) => i !== w.id)
  return {
    foregroundWindow: w.id,
    focusTable: [w.id, ...e.focusTable],
  }
}
export const createWindow = (element: React.ElementType, options: CreateWindowOptions = {}) =>
  useWindows.setState((e) => {
    return _createWindow(e, element, options)
  })

export const createSingletonWindow = (element: React.ElementType, options: CreateWindowOptions & { id: string }) =>
  useWindows.setState((e) => {
    // const foundWindow = e.windows.find((win) => win.element === element)
    const foundWindow = e.windows.find((win) => win.element === element && win.id === options.id)
    if (foundWindow) {
      return {
        ...e,
        ..._focusWindow(e, foundWindow),
        windows: e.windows.map((w) => {
          if (w.id === foundWindow.id) {
            w.props = { ...w.props, ...options.props }
          }
          return w
        }),
      }
    }
    return _createWindow(e, element, options)
  })

export const setWindowDimensions = (window: WindowIdOrWindow, dimensions: Partial<Dimensions>) =>
  useWindows.setState((e) => {
    const w = resolveWindow(e, window)
    w.dimensions = {
      ...w.dimensions,
      ...dimensions,
    }
    return {
      windows: [...e.windows],
    }
  })

export const focusWindow = (window: WindowIdOrWindow) =>
  useWindows.setState((e) => {
    return _focusWindow(e, window)
  })

// @ts-expect-error meow
export const minimizeWindow = (window: WindowIdOrWindow) => {}
// @ts-expect-error meow
export const maximizeWindow = (window: WindowIdOrWindow) => {}
// @ts-expect-error meow
export const restoreWindow = (window: WindowIdOrWindow) => {}
export const closeWindow = (window: WindowIdOrWindow) =>
  useWindows.setState((e) => {
    const w = resolveWindow(e, window)

    return {
      foregroundWindow: e.foregroundWindow === w.id ? e.focusTable[1] : e.foregroundWindow,
      windows: e.windows.filter((i) => i.id !== w.id),
      focusTable: e.focusTable.filter((i) => i !== w.id),
    }
  })

export const showMessageBox = (caption: string, body: string) => {
  createWindow(MessageBoxWindow, {
    dialog: true,
    props: {
      caption,
      body,
    },
  })
}
