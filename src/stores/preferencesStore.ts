import { create } from 'zustand/react'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

export type DisplayAsBytes = 'vdf' | 'vdf.lzma' | 'pb' | 'ascii' | 'utf8' | 'hex'
export type DisplayAsSteamID = 'steamid.2' | 'steamid.3'
export type DisplayAsIP = 'ip.4' | 'ip.6'
export type DisplayAsString = 'str.raw' | 'str.jwt'
export type DisplayAsNumeric = 'gid' | 'datetime'
export type DisplayAs = DisplayAsBytes | DisplayAsSteamID | DisplayAsIP | DisplayAsString | DisplayAsNumeric

type FieldKey = string
export interface FieldPrefs {
  displayAs?: DisplayAs
}

export interface PreferencesState {
  hideDefaultFields: boolean
  qualifiedTypeNames: boolean
  fields: Record<FieldKey, FieldPrefs>
}

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      // @ts-expect-error types need the set function for some reason
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      immer((set) => {
        return { hideDefaultFields: false, qualifiedTypeNames: false, fields: {} }
      }),
      {
        name: 'PreferencesStore',
        storage: createJSONStorage(() => localStorage),
        migrate: (persistedState, curVer) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ps = persistedState as any
          if (ps) {
            if (curVer < 2) {
              ps.fields = {}
            }
            if (curVer < 3) {
              ps.qualifiedTypeNames = false
            }
          }
          return ps
        },
        version: 3,
      },
    ),
  ),
)

export function useFieldPrefs(fieldKey?: FieldKey): FieldPrefs | undefined {
  return usePreferencesStore(useShallow((e) => (fieldKey ? e.fields[fieldKey] : undefined)))
}

export function removeFieldPrefs(fieldKey: FieldKey) {
  return usePreferencesStore.setState((e) => {
    delete e.fields[fieldKey]
  })
}
export function updateDisplayAs(fieldKey: FieldKey, displayAs: DisplayAs) {
  return usePreferencesStore.setState((e) => {
    if (e.fields[fieldKey]) {
      if (e.fields[fieldKey].displayAs === displayAs) {
        // TODO: later should change this to just erase the displayAs member?
        delete e.fields[fieldKey]
      } else {
        e.fields[fieldKey].displayAs = displayAs
      }
    } else {
      e.fields[fieldKey] = { displayAs }
    }
  })
}
