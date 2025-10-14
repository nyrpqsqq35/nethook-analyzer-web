import React from 'react'
import { AcknowledgementsWindow, MessageBoxWindow, MessageWindow, SessionWindow, WelcomeWindow } from '@/windows'
interface Registry {
  window: {
    [x: string]: React.ElementType
  }
}

export const Registry: Registry = {
  window: {
    [AcknowledgementsWindow.name]: AcknowledgementsWindow,
    [MessageBoxWindow.name]: MessageBoxWindow,
    [MessageWindow.name]: MessageWindow,
    [SessionWindow.name]: SessionWindow,
    [WelcomeWindow.name]: WelcomeWindow,
  },
}

export type RegistryType = keyof typeof Registry

export interface SerializedType {
  __r: RegistryType
  __n: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeType(fn: any): SerializedType | undefined {
  const name = fn.name

  for (const rt in Registry) {
    const reg = Registry[rt as RegistryType]
    for (const k in reg) {
      const v = reg[k]
      if (v === fn)
        return {
          __r: rt as RegistryType,
          __n: name,
        }
    }
  }
}

function _lookupType(registry: RegistryType, name: string): React.ElementType | undefined {
  return Registry[registry][name]
}

export function lookupType(type: SerializedType): React.ElementType | undefined {
  return _lookupType(type.__r, type.__n)
}
